import {chromium, expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import { showcase } from '../docs/showcase.mjs';
import { recipes, recipePhases } from '../docs/.vitepress/theme/recipes.mjs';
import { brand } from '../docs/.vitepress/theme/brand.mjs';
import publication from '../data/public-media.json' with { type: 'json' };
const releaseUrl = `https://github.com/${publication.repository}/releases/download/${publication.release}/`;
const featured = showcase.filter(p => p.featured);
const base=process.env.SITE_URL || 'http://127.0.0.1:4173/';
const folder=process.cwd()+'/.impeccable/review';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,permissions:['clipboard-read','clipboard-write']});
context.setDefaultTimeout(10000);
context.setDefaultNavigationTimeout(30000);
const page=await context.newPage();
const errors=[]; const bad=[]; const results=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('response',r=>{if(r.status()>=400)bad.push([r.status(),r.url()]);});
const go=async(path='')=>{if(process.env.SITE_TEST_DEBUG)console.log('Visit',path||'/');await page.goto(new URL(path,base).href,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);};
const overflow=async(label)=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' overflows');};
await writeFile(folder+'/browser-results.json',JSON.stringify({passed:false,completed:false,startedAt:new Date().toISOString()},null,2));
try {
 await go();
 await page.getByRole('heading',{name:/Make episode twenty.*as good as.*episode one/}).waitFor();
 assert.match(await page.title(), new RegExp('^'+brand.name+' — '));
 assert.equal(await page.locator('.screening video').count(),1,'Prepare showcase media with npm run media:prepare before the full browser smoke test.');
 await overflow('desktop home');
 await page.screenshot({path:folder+'/desktop.png',fullPage:true});
 await page.screenshot({path:folder+'/desktop-top.png'});
 const homeLinks=await page.locator('.site-page a[href]').evaluateAll(links=>links.map(l=>l.href));
 for(const href of [...new Set(homeLinks)])if(href.startsWith(base)&&!href.includes('#')){const res=await context.request.get(href);assert.equal(res.status(),200,href);}
 await page.locator('.programme button').nth(1).click();
 await expect(page.locator('.screening video')).toHaveAttribute('src', new RegExp(featured[1].id));
 await page.locator('.screening .play-button').click();
 await page.waitForFunction(()=>document.querySelector('.screening video').currentTime>0.5);
 await page.locator('.programme button').nth(2).click();
 await expect(page.locator('.screening video')).toHaveAttribute('src', new RegExp(featured[2].id));
 assert.equal(await page.locator('.screening video').evaluate(v=>v.paused),true);
 await page.getByRole('button',{name:'Copy Install the studio command'}).click();
 assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/git clone/);
 // The second take is shown as it was rendered: two of six seconds made again.
 await expect(page.locator('.correction .take-strip li')).toHaveCount(6);
 await expect(page.locator('.correction .take-strip li.redone')).toHaveCount(2);
 assert.ok(await page.locator('.correction .take-strip img').evaluateAll(async images=>{await Promise.all(images.map(i=>{i.loading='eager';return i.decode()}));return images.every(i=>i.naturalWidth===480);}),'the stills of the correction are published');
 // Three films, each with a receipt whose first row is its length.
 await expect(page.locator('.film-row')).toHaveCount(3);
 await expect(page.locator('.film-row .receipt')).toHaveCount(3);
 await expect(page.locator('.film-row .receipt dt').first()).toHaveText('Length');
 await expect(page.locator('.home-page .not-yet')).toHaveCount(2);
 // One picture and the model made from it (5 cells), then the rig made from a second picture in five poses (6 cells).
 await expect(page.locator('.cast .model-strip')).toHaveCount(2);
 await expect(page.locator('.cast .model-strip li')).toHaveCount(11);
 await expect(page.locator('.cast .model-strip.cells-6 li')).toHaveCount(6);
 assert.ok(await page.locator('.cast .model-strip img').evaluateAll(async images=>{await Promise.all(images.map(i=>{i.loading='eager';return i.decode()}));return images.every(i=>i.naturalWidth===480);}),'the stills of the generated model and of its rig are published');
 await expect(page.locator('.model-made .not-yet')).toContainText('A face, and touch');
 // The filmed walk: its poster and its file are published, and it is the size it says.
 await expect(page.locator('.cast .shot-film video')).toHaveCount(2);
 assert.ok(await page.locator('.cast .shot-film video').evaluateAll(async videos=>(await Promise.all(videos.map(async video=>{const [film,poster]=await Promise.all([fetch(video.src),fetch(video.poster)]);return film.ok&&film.headers.get('content-type').includes('video')&&poster.ok;}))).every(Boolean)),'the filmed shot and the staged scene are published');
 // Music: the piece's code, a player for it, and no overflow from the code.
 await expect(page.locator('.score .score-code')).toContainText('setcpm(120/4)');
 assert.ok(await page.locator('.score audio').evaluate(async audio=>{const response=await fetch(audio.src);return response.ok&&response.headers.get('content-type').includes('audio');}),'the rendered piece is published');
 // What changed lately, newest first, ending at the changelog.
 await expect(page.locator('.lately-list li')).toHaveCount(7);
 await expect(page.locator('.lately .text-link')).toHaveAttribute('href', /changelog/);
 results.push('Home: programme selectors, video playback/reset, the stills of the correction, three receipts, clipboard, internal links');
 await go('examples');
 await page.getByRole('button',{name:'Editable 3D',exact:true}).click();
 assert.equal(await page.locator('.project-feature').count(),1);
 await page.getByRole('button',{name:'All work',exact:true}).click();
 assert.equal(await page.locator('.project-feature').count(),showcase.length);
 await page.screenshot({path:folder+'/examples-desktop.png',fullPage:true});
 await page.locator('.project-feature').first().getByRole('button',{name:/Play/}).click();
 await page.waitForFunction(()=>document.querySelector('.project-feature video').currentTime>0.5);
 await page.locator('.project-feature').nth(1).getByRole('button',{name:/Play/}).click();
 await page.waitForFunction(()=>document.querySelectorAll('.project-feature video')[0].paused);
 await page.locator('#jaromail .play-button').click();
 await page.waitForFunction(()=>document.querySelector('#jaromail video').textTracks[0]?.cues?.length > 0);
 assert.equal(await page.locator('#jaromail video').evaluate(v=>v.muted),false);
 await page.getByRole('button',{name:'Visual essays',exact:true}).click();
 assert.equal(await page.locator('.project-feature').count(),1);
 await page.locator('#nothing-is-only-one-thing .play-button').click();
 await page.waitForFunction(()=>{const v=document.querySelector('#nothing-is-only-one-thing video');return v.currentTime>1 && v.textTracks[0]?.cues?.length===6;});
 assert.equal(await page.locator('#nothing-is-only-one-thing video').evaluate(v=>v.muted),false);
 await page.locator('#nothing-is-only-one-thing video').evaluate(v=>v.pause());
 await expect(page.locator('#nothing-is-only-one-thing .project-download .button')).toHaveAttribute('href', releaseUrl + publication.items['nothing-is-only-one-thing'].download.asset);
 await page.locator('#nothing-is-only-one-thing summary', {hasText:'Source & credits'}).click();
 await expect(page.locator('#nothing-is-only-one-thing details').last()).toContainText('CC BY-NC-SA; licence version not specified');
 await expect(page.locator('#nothing-is-only-one-thing .publication-note')).toHaveCount(0);
 await page.locator('#nothing-is-only-one-thing').screenshot({path:folder+'/nothing-desktop.png'});
 await page.getByRole('button',{name:'All work',exact:true}).click();
 await expect(page.locator('.project-download .button')).toHaveCount(6);
 for (const link of await page.locator('.project-download .button').all()) {
  const href = await link.getAttribute('href');
  assert.ok(Object.values(publication.items).some(item => item.download && releaseUrl + item.download.asset === href));
 }
 await expect(page.locator('#sonnet .project-download')).toContainText('original sound');
 await page.locator('#sonnet .play-button').click();
 await page.waitForFunction(()=>{const v=document.querySelector('#sonnet video');return v.currentTime>0.5 && v.textTracks[0]?.cues?.length>0;});
 assert.equal(await page.locator('#sonnet video').evaluate(v=>v.muted),false);
 await expect(page.locator('#sonnet video track')).toHaveAttribute('kind','captions');
 await page.locator('#sonnet video').evaluate(v=>v.pause());
 results.push('Gallery: filters, counts, playback, English captions, six full-film download links and confirmed soundtrack credits');
 await go('recipes/');
 await page.getByRole('searchbox',{name:'Find a recipe'}).fill('blender');
 assert.equal(await page.locator('.recipe-collection .recipe-row').count(),1);
 await page.getByRole('searchbox',{name:'Find a recipe'}).fill('doesnotexist');
 await expect(page.locator('.recipe-group')).toHaveCount(0);
 await page.getByRole('button',{name:'Show all recipes'}).click();
 await expect(page.getByRole('searchbox',{name:'Find a recipe'})).toBeFocused();
 await expect(page.locator('.recipe-collection .recipe-row')).toHaveCount(recipes.length);
 await expect(page.locator('.recipe-group')).toHaveCount(recipePhases.length);
 await page.getByRole('searchbox',{name:'Find a recipe'}).fill('  POEM  ');
 await expect(page.locator('.recipe-group')).toHaveCount(1);
 await page.locator('.recipe-collection .recipe-row').click();
 await page.waitForURL('**/recipes/poetry-lesson');
 await expect(page.locator('h1')).toHaveText('One poem. Two films.');
 await go('recipes/');
 await page.getByRole('searchbox',{name:'Find a recipe'}).fill('doesnotexist');
 await page.getByRole('navigation',{name:'Recipe paths'}).getByRole('link',{name:'Make a film'}).click();
 await page.waitForURL('**/recipes/#produce');
 await expect(page.locator('.recipe-collection .recipe-row')).toHaveCount(recipes.length);
 await expect.poll(()=>page.locator('#produce').evaluate(el=>Math.abs(el.getBoundingClientRect().top-100)),{message:'phase link resets filtering and scrolls to its restored group'}).toBeLessThan(5);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:folder+'/recipes-desktop.png',fullPage:true});
 await page.screenshot({path:folder+'/recipes-desktop-top.png'});
 results.push('Recipes: grouped paths, search, empty state, focus after reset, filtered route and phase navigation');
 await go('quick-start');
 await page.screenshot({path:folder+'/quick-start-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Copy Install '+brand.name+' command'}).click();
 assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/\nmise install\n/);
 results.push('Quick start: command line breaks and copy');
 for (const recipe of recipes) {
  await go('recipes/'+recipe.slug);
  await expect(page.locator('h1')).toHaveText(recipe.title);
  await overflow(recipe.slug);
  if (['build-a-channel','create-a-character','poetry-lesson','repeatable-series'].includes(recipe.slug)) {
   await page.screenshot({path:folder+'/'+recipe.slug+'-desktop.png',fullPage:true});
   await page.screenshot({path:folder+'/'+recipe.slug+'-desktop-top.png'});
  }
 }
 await go();
 await page.locator('.VPNavBarSearch button').click();
 await page.locator('#localsearch-input').fill('first local render');
 await expect(page.locator('.VPLocalSearchBox a[href*="/recipes/first-render"]').first()).toBeVisible();
 await page.locator('#localsearch-input').fill('character people recognise');
 const characterResult = page.locator('.VPLocalSearchBox a[href*="/recipes/create-a-character"]').first();
 await expect(characterResult).toBeVisible();
 await characterResult.click();
 await expect(page.locator('h1')).toHaveText('A character people recognise');
 results.push('Docs: all recipe routes, indexed first-render and character guide search results');
 await go('architecture');
 assert.match(await page.locator('main').innerText(),/Remotion renders/);
 await page.screenshot({path:folder+'/architecture-desktop.png',fullPage:true});
 await go('guide');
 assert.equal(await page.locator('main a[href$="packages/remotion-composer"]').count(),1);
 assert.equal(await page.locator('a[href*="harness-review"]').count(),0,'internal review is absent from the documentation index and navigation');
 for (const route of ['harness-review', 'harness-review.html']) {
  assert.equal((await context.request.get(new URL(route,base).href)).status(),404,route+' must not be published');
 }
 results.push('Publication scope: internal review absent from navigation and both public route variants');
 await go('quick-start');
 const gatewayHref=await page.getByRole('link',{name:'start the gateway',exact:true}).getAttribute('href');
 await go(gatewayHref);
 assert.ok(await page.evaluate(()=>Boolean(document.getElementById(decodeURIComponent(location.hash.slice(1))))),'gateway prerequisite link must target an actual heading');
 for (const [route, heading, text] of [
  ['limits', 'What does not work yet', /It is not unattended/],
  ['compare', brand.name+' and the others, honestly', /16 November 2026/],
  ['retake', 'Retake', /Nothing on this page is a result/],
  ['changelog', 'Changelog', /Needs action/],
  ['licence', 'Licence', /films, their stills and their music are not covered/],
  ['correction-shown', 'The correction, shown', /segmentsReused: 4, segmentsRendered: 2/],
 ]) {
  await go(route);
  await expect(page.locator('main h1')).toHaveText(heading);
  assert.match(await page.locator('main').innerText(), text, route);
  await overflow(route);
 }
 await expect(page.locator('main .take-strip li.redone')).toHaveCount(2);
 await go('recipes/create-a-character');
 // The model (5 cells), the rig's poses (6), the figure drawn two ways (2), the walk (6), the generated wave (4).
 await expect(page.locator('main .model-strip li')).toHaveCount(23);
 await expect(page.locator('main .model-strip.cells-4 li')).toHaveCount(4);
 await expect(page.locator('main .shot-film video')).toHaveCount(2);
 assert.ok(await page.locator('main .shot-film video').evaluateAll(async videos=>(await Promise.all(videos.map(async video=>{const film=await fetch(video.src);return film.ok&&film.headers.get('content-type').includes('video');}))).every(Boolean)),'the filmed shot and the staged scene are published in the recipe');
 assert.match(await page.locator('main').innerText(),/pva_rig_shot/);
 assert.match(await page.locator('main').innerText(),/pva_stage_shot/);
 await expect(page.locator('main .model-strip.cells-2 li')).toHaveCount(2);
 assert.ok(await page.locator('main .model-strip img').evaluateAll(async images=>{await Promise.all(images.map(i=>{i.loading='eager';return i.decode()}));return images.every(i=>i.naturalWidth===480);}),'every still of the model and its rig is published');
 await overflow('characters recipe');
 assert.match(await page.locator('main').innerText(),/pva_rig_sheet/);
 assert.match(await page.locator('main').innerText(),/pva_generate_model/);
 assert.match(await page.locator('main').innerText(),/No skeleton, no motion/);
 await go('recipes/music-in-code');
 assert.ok(await page.locator('main audio').first().evaluate(async audio=>{const response=await fetch(audio.src);return response.ok&&response.headers.get('content-type').includes('audio');}),'the piece of the music recipe is published where its player looks for it');
 await overflow('music recipe');
 results.push('Where it stands: limits, comparison, benchmark specification, changelog, licence and the correction shown');
 await go('examples');
 await expect(page.locator('.project-feature .receipt')).toHaveCount(showcase.length);
 await expect(page.locator('#nothing-is-only-one-thing .project-status')).toContainText('not an approved release');
 assert.doesNotMatch(await page.locator('#jaromail .project-story dl').first().innerText(), /\bv\d\b|pointer/i, 'no version bookkeeping in what a visitor reads');
 await go('collaboration');
 assert.match(await page.locator('main').innerText(),/S3-compatible/);
 await page.screenshot({path:folder+'/collaboration-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await go(); await overflow('mobile home');
 await page.screenshot({path:folder+'/mobile.png',fullPage:true});
 await page.screenshot({path:folder+'/mobile-top.png'});
 await page.getByRole('button',{name:'mobile navigation'}).click();
 await page.getByRole('link',{name:'Films',exact:true}).last().click();
 await page.waitForURL('**/examples');
 await page.waitForTimeout(350); // Let VitePress’s mobile-menu leave transition finish before the capture.
 await page.evaluate(()=>scrollTo(0,0));
 await overflow('mobile examples');
 await page.screenshot({path:folder+'/examples-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Visual essays',exact:true}).click();
 await page.locator('#nothing-is-only-one-thing').screenshot({path:folder+'/nothing-mobile.png'});
 await overflow('mobile visual essay');
 await go('recipes/');await overflow('mobile recipes');
 await page.screenshot({path:folder+'/recipes-mobile.png',fullPage:true});
 await page.screenshot({path:folder+'/recipes-mobile-top.png'});
 for(const slug of ['build-a-channel','create-a-character','poetry-lesson']) {
  await go('recipes/'+slug);await overflow('mobile '+slug);
  await page.screenshot({path:folder+'/'+slug+'-mobile.png',fullPage:true});
  await page.screenshot({path:folder+'/'+slug+'-mobile-top.png'});
 }
 await go('quick-start');await overflow('mobile quick start');
 await page.screenshot({path:folder+'/quick-start-mobile.png',fullPage:true});
 await page.setViewportSize({width:320,height:720});
 for(const path of ['','examples','recipes/','quick-start','collaboration','architecture','guide','limits','compare','retake','licence','correction-shown',...recipes.map(recipe=>'recipes/'+recipe.slug)]){await go(path);await overflow('320 '+path);}
 await page.emulateMedia({reducedMotion:'reduce'}); await go();
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 assert.ok(await page.locator('video').evaluateAll(videos=>videos.every(v=>!v.autoplay && v.paused)));
 results.push('Responsive: 390px and 320px, mobile navigation, reduced motion, no autoplay');
 for (const width of [960,1024]) { await page.setViewportSize({width,height:900}); await go(); await overflow(width+' home'); }
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
 const failurePage = await context.newPage();
 await failurePage.route('**/showcase/*.mp4',r=>r.abort());
 await failurePage.goto(base,{waitUntil:'networkidle'});
 await failurePage.locator('.screening .play-button').click();
 await failurePage.getByText('The preview could not load.',{exact:true}).waitFor();
 await failurePage.unroute('**/showcase/*.mp4');
 await failurePage.getByRole('button',{name:'Try preview again'}).click();
 await failurePage.locator('.screening .play-button').click();
 await failurePage.waitForFunction(()=>document.querySelector('.screening video').currentTime>0.5);
 await failurePage.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true}));
 await failurePage.getByRole('button',{name:'Copy Install the studio command'}).click();
 await failurePage.getByText('Copy unavailable. Select the command and copy it manually.').waitFor();
 await failurePage.close();
 results.push('Resilience: failed video request, successful retry, clipboard fallback');
 console.log(JSON.stringify({passed:true,results,errors,bad},null,2));
 await writeFile(folder+'/browser-results.json',JSON.stringify({passed:true,results,errors,bad},null,2));
} catch (error) {
 await writeFile(folder+'/browser-results.json',JSON.stringify({passed:false,results,errors,bad,failure:String(error)},null,2));
 throw error;
} finally { await browser.close(); }
