> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @av/comfyui-speech

Speech from the Qwen3-TTS nodes of a ComfyUI server
([ComfyUI-Qwen-TTS](https://github.com/flybirdxx/ComfyUI-Qwen-TTS), node
classes `FB_Qwen3TTS*`), one sentence per graph. A small ComfyUI client and
five operations, each using a JSON template under `workflows/`:

| Operation | Workflow | What it does |
|---|---|---|
| `speakWithSpeaker` | `speaker.json` | a CustomVoice preset speaker, with an optional style instruction |
| `speakWithClonedVoice` | `clone.json` | the voice of a reference recording; with its transcript the model continues it, without one only the timbre is taken |
| `speakWithSavedVoice` | `saved-voice.json` | a voice the server saved earlier under a name |
| `cleanVoice` | `clean.json` | cut an optional range and separate its voice, without cloning |
| `cleanAndClone` | `clean-clone.json` | cut the reference, separate its voice from music and noise (`AudioSeparation`, from [audio-separation-nodes-comfyui](https://github.com/christian-byrne/audio-separation-nodes-comfyui)), learn it, optionally save it under a name, and speak with it |

```ts
import { createComfyUiClient, speakWithSpeaker, cleanAndClone, probeSpeech } from "@av/comfyui-speech";

const client = createComfyUiClient({ baseUrl: "http://127.0.0.1:8188" }); // the caller's address; none is built in
console.log(await probeSpeech(client)); // version, speakers, saved voices, which workflows the server has the nodes for

const { audio, durationSeconds, seed } = await speakWithSpeaker({
  client, text: "Buongiorno a tutti.", speaker: "serena", language: "italian",
});
// audio: the FLAC SaveAudio wrote

const cloned = await cleanAndClone({
  client, text: "Una frase nuova.", language: "italian",
  reference: { bytes, filename: "recording.wav" },   // or { inputName } for a file already in the server's input folder
  referenceText: "Exactly what the kept part says.",
  referenceStart: 0, referenceDuration: 12.6,
  saveVoiceAs: "Narrator",                            // optional
});
// cloned.cleanedReference: the separated voice, to listen to
```

## The client

`queuePrompt` (`POST /prompt`), `waitForPrompt` (polls `GET /history/<id>`),
`uploadInput` (`POST /upload/image`, which takes audio too), `download`
(`GET /view`), `nodeInfo`, `systemStats`. A graph given up on (timeout, abort)
is taken out of the queue if it has not started; a running one is left to
finish, because interrupting stops whatever the server is running.

An uploaded reference is named by its content's hash, so no local file name
reaches the server and the same recording is one file there.

## Templates

API-format graphs with named placeholders: a string value that is exactly
`"{{name}}"` is replaced by the value of that name, keeping its type. A
missing value and a value no placeholder asks for are both errors.
`optionalNodes` names nodes left out when their value is absent.

## Configuration

`readComfyUiConfig(file)` reads a JSON file, every field optional; the
package reads no environment and has no default address.

```json
{
  "url": "http://127.0.0.1:8188",
  "model": "1.7B",
  "device": "auto",
  "precision": "bf16",
  "attention": "auto",
  "unloadModelAfterGenerate": true,
  "outputPrefix": "studio-speech",
  "inputSubfolder": "studio-speech",
  "timeoutSeconds": 600
}
```

The model is unloaded after each sentence by default: ComfyUI does not know
this model and will not free its VRAM before loading another.

A server that listens only on its own loopback is reached through a tunnel
the caller opens (`ssh -N -L <local port>:127.0.0.1:8188 <host>`); the URL is
then the local end.

## Limits

- Output is FLAC as the server wrote it; converting is the caller's.
- No word timings: Qwen3-TTS returns none.
- VoiceDesign, dialogue and fine-tuning nodes are not used.
- Clone only a voice whose owner consented; authorization policy belongs to
  the caller. The studio adapter requires an operator-created `voiceConsentPath`
  before executing a reference or saved-voice clone.
- A node accepts requested runtime settings, but this API does not attest
  resolved dependency versions or checkpoint hashes. The studio records that
  limitation rather than treating requested settings as verified provenance.
