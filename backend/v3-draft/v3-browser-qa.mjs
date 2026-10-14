import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
const source='file://'+resolve('test-v3/v3-candidate.html');
let failed=0;
async function run(label,options){
 const context=await browser.newContext({acceptDownloads:true,...options});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(source);
  await page.locator('#name').fill('Cris');
  await page.locator('#memory').fill('Una tarde junto al mar');
  await page.locator('#dedication').fill('Siempre contigo');
  if(options?.detail)await page.locator('#detail').fill('Nuestro secreto');
  await page.locator('#preview').click();
  assert.equal(await page.locator('#welcome').isVisible(),true);assert.equal(await page.locator('#previewNotice').isVisible(),true);
  await page.locator('#backToEdit').click();
  assert.equal(await page.locator('#builder').isVisible(),true);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#create').click()]);
  const html=await readFile(await download.path(),'utf8');
  assert.ok(html.includes('gift-data'));
  const dir=await mkdtemp(join(tmpdir(),'levelyou-'));
  const file=join(dir,'regalo.html');await writeFile(file,html);
  const receiver=await context.newPage();receiver.on('pageerror',e=>errors.push(e.message));
  await receiver.goto('file://'+file);
  assert.equal(await receiver.locator('#welcome').isVisible(),true);
  assert.equal(await receiver.locator('#backToEdit').count(),0);assert.equal(await receiver.locator('#previewNotice').isVisible(),false);
  await receiver.locator('#toMemory').click();
  await receiver.locator('#toDetail').click();
  if(options?.detail){assert.equal(await receiver.locator('#detailScene').isVisible(),true);await receiver.locator('#toFinal').click()}
  assert.equal(await receiver.locator('#finalScene').isVisible(),true);
  assert.match(await receiver.locator('#dedicationDisplay').innerText(),/Siempre contigo/);
  await receiver.locator('#replay').click();
  assert.equal(await receiver.locator('#welcome').isVisible(),true);
  assert.deepEqual(errors,[]);
  if(options?.isMobile)assert.equal(await receiver.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  console.log('PASS',label);
 }catch(e){failed++;console.error('FAIL',label,e)}finally{await context.close()}
}
await run('desktop with secret',{detail:true});
await run('mobile without secret',{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
async function extra(label,fn){try{await fn();console.log('PASS',label)}catch(e){failed++;console.error('FAIL',label,e)}}
await extra('photo survives export',async()=>{
 const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();
 await page.goto(source);await page.locator('#name').fill('Cris');await page.locator('#memory').fill('La playa');await page.locator('#dedication').fill('Gracias');
 const photo=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9lC98AAAAASUVORK5CYII=','base64');
 await page.locator('#photo').setInputFiles({name:'foto.png',mimeType:'image/png',buffer:photo});
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#create').click()]);
 const html=await readFile(await download.path(),'utf8');assert.match(html,/data:image\/png;base64,/);
 const dir=await mkdtemp(join(tmpdir(),'levelyou-photo-'));const path=join(dir,'gift.html');await writeFile(path,html);
 const receiver=await context.newPage();await receiver.goto('file://'+path);await receiver.locator('#toMemory').click();
 assert.equal(await receiver.locator('#photoDisplay').isVisible(),true);
 await context.close();
});
await extra('invalid fields block preview',async()=>{
 const context=await browser.newContext();const page=await context.newPage();await page.goto(source);
 await page.locator('#preview').click();
 assert.equal(await page.locator('#builder').isVisible(),true);
 assert.match(await page.locator('#error').innerText(),/Completa/);
 await context.close();
});
await extra('injection-like text remains inert',async()=>{
 const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(source);await page.locator('#name').fill('Cris');await page.locator('#memory').fill('</script><img src=x onerror=alert(1)>');await page.locator('#dedication').fill('Mensaje');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#create').click()]);
 const html=await readFile(await download.path(),'utf8');
 const dir=await mkdtemp(join(tmpdir(),'levelyou-escape-'));const path=join(dir,'gift.html');await writeFile(path,html);
 const receiver=await context.newPage();receiver.on('pageerror',e=>errors.push(e.message));await receiver.goto('file://'+path);await receiver.locator('#toMemory').click();
 assert.equal(await receiver.locator('#memoryDisplay').innerText(),'</script><img src=x onerror=alert(1)>');
 assert.deepEqual(errors,[]);await context.close();
});
await browser.close();
if(failed)process.exitCode=1;
