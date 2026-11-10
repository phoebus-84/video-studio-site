import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { showcase } from '../../showcase.mjs';

const publication = JSON.parse(readFileSync(new URL('../../../data/public-media.json', import.meta.url), 'utf8'));
const releaseUrl = `https://github.com/${publication.repository}/releases/download/${publication.release}/`;

export default {
  watch: ['../../public/showcase/*', '../../showcase.mjs', '../../../data/public-media.json'],
  load() {
    return showcase.map((item) => {
      const selection = publication.items[item.id];
      const available = selection?.preview === true && ['jpg', 'mp4', ...(item.hasAudio ? ['vtt'] : [])].every(ext =>
        existsSync(fileURLToPath(new URL(`../../public/showcase/${item.id}.${ext}`, import.meta.url))));
      const download = selection?.download?.sha256 ? {
        ...selection.download,
        url: releaseUrl + selection.download.asset,
        creditsUrl: releaseUrl + 'media-credits.txt',
      } : null;
      return { ...item, available, download, publicationNote: selection?.reason };
    });
  }
};
