(() => {
const API='https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/smart-memory';
const TIMEOUT=45000;
const C={
es:{ded:'Mensaje final para la persona',help:'Aparecerá al terminar el juego y cerrará también el vídeo. Puedes editar la sugerencia.',ph:'Ej. Feliz cumpleaños. Que sigamos sumando recuerdos inolvidables.',hint:'Contexto / pista para LevelYou (opcional)',previewHint:'Contexto / pista para LevelYou (opcional)',desc:'LevelYou analiza cada foto y propone un contexto. Corrígelo solo si quieres darle una pista más personal.',analysing:'✨ Entendiendo tus recuerdos…',generating:'✨ Creando preguntas con tus recuerdos…',suggested:'✨ Sugerencia de LevelYou',need:'Para hacer esta pregunta más personal, ayudaría saber: ',ready:'Puedes dejar esta sugerencia tal cual o editarla.',fallback:'No hemos podido usar la IA ahora mismo. Puedes continuar igualmente.',timeout:'La IA ha tardado demasiado. Puedes volver a intentarlo.',imageUnsupported:'No hemos podido analizar una de las fotos. Prueba con otra imagen o con formato JPG/PNG.'},
ca:{ded:'Missatge final per a la persona',help:'Apareixerà en acabar el joc i també tancarà el vídeo. Pots editar el suggeriment.',ph:'Ex. Per molts anys. Que continuem sumant records inoblidables.',hint:'Context / pista per a LevelYou (opcional)',previewHint:'Context / pista per a LevelYou (opcional)',desc:'LevelYou analitza cada foto i proposa un context. Corregeix-lo només si vols donar-li una pista més personal.',analysing:'✨ Entenent els teus records…',generating:'✨ Creant preguntes amb els teus records…',suggested:'✨ Suggeriment de LevelYou',need:'Per fer aquesta pregunta més personal, ajudaria saber: ',ready:'Pots deixar aquest suggeriment tal com està o editar-lo.',fallback:'Ara mateix no hem pogut utilitzar la IA. Pots continuar igualment.',timeout:'La IA ha trigat massa. Pots tornar-ho a provar.',imageUnsupported:'No hem pogut analitzar una de les fotos. Prova una altra imatge o un format JPG/PNG.'},
en:{ded:'Final message for them',help:'It appears after the game and also closes the video. You can edit the suggestion.',ph:'e.g. Happy birthday. Here is to many more unforgettable memories.',hint:'Context / hint for LevelYou (optional)',previewHint:'Context / hint for LevelYou (optional)',desc:'LevelYou analyzes each photo and suggests context. Edit it only if you want to add a more personal hint.',analysing:'✨ Understanding your memories…',generating:'✨ Creating questions from your memories…',suggested:'✨ LevelYou suggestion',need:'To make this question more personal, it would help to know: ',ready:'Keep this suggestion as it is or edit it.',fallback:'AI is unavailable right now. You can still continue.',timeout:'The AI took too long. Please try again.',imageUnsupported:'We could not analyze one of the photos. Try another image or a JPG/PNG file.'}
};
const tx=k=>(C[lang]||C.es)[k]||k;
const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function install(){
 const st=document.createElement('style');
 st.textContent='.smart-note{margin:12px 0;padding:12px 14px;border:1px solid rgba(105,225,207,.22);border-radius:14px;background:rgba(105,225,207,.07);font-size:13px;line-height:1.45;color:#dffaf5}.smart-mini{margin-top:7px;color:#a9b0c4;font-size:12px;line-height:1.4}.smart-ded{margin:14px 0;padding:14px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.025)}.smart-tag{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(105,225,207,.11);color:#a8f3e7;font-size:11px;font-weight:800;margin-bottom:8px}.smart-busy{opacity:.72;pointer-events:none}';
 document.head.appendChild(st);
 if(!$('#smartDedicationBlock')){
   const el=document.createElement('div');
   el.id='smartDedicationBlock';el.className='smart-ded';
   el.innerHTML='<label id="dedicationLabel"></label><textarea id="dedication" rows="3" maxlength="180"></textarea><div class="small" id="dedicationHelp"></div>';
   $('#builder .card').appendChild(el);
 }
 if(!$('#aiMemoryNote')) $('#editMemoryContext').insertAdjacentHTML('beforebegin','<div id="aiMemoryNote" class="smart-note"></div>');
 placeDedication();refresh();
}
function placeDedication(){
 const block=$('#smartDedicationBlock');if(!block)return;
 const anchor=mode==='full'?$('#generateFullBtn'):$('#generatePreviewBtn');
 if(anchor&&block.nextElementSibling!==anchor) anchor.insertAdjacentElement('beforebegin',block);
}
function refresh(){
 const ll=document.querySelector('.language-label');if(ll)ll.textContent=lang==='en'?'LANGUAGE':'IDIOMA';
 if($('#dedicationLabel'))$('#dedicationLabel').textContent=tx('ded');
 if($('#dedicationHelp'))$('#dedicationHelp').textContent=tx('help');
 if($('#dedication'))$('#dedication').placeholder=tx('ph');
 if($('#editContextLabel'))$('#editContextLabel').textContent=tx('hint');
 if($('#editMemoryDesc'))$('#editMemoryDesc').textContent=tx('desc');
 const pc=$('#previewContext');if(pc&&pc.previousElementSibling?.tagName==='LABEL')pc.previousElementSibling.textContent=tx('previewHint');
 note();
}
function note(){
 const n=$('#aiMemoryNote');if(!n||mode!=='full'||!memories[fullEditIndex])return;
 const a=memories[fullEditIndex].ai;
 if(!a){n.innerHTML='<span class="smart-tag">'+tx('suggested')+'</span><div>'+tx('ready')+'</div>';return}
 n.innerHTML='<span class="smart-tag">'+tx('suggested')+'</span><div>'+esc(a.suggested_context||'')+'</div>'+(a.needs_hint&&a.hint_prompt?'<div class="smart-mini">'+tx('need')+'<b>'+esc(a.hint_prompt)+'</b></div>':'<div class="smart-mini">'+tx('ready')+'</div>');
}
function img(u){return new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>j(new Error('IMAGE_DECODE'));i.src=u})}
async function compact(u){
 const i=await img(u);
 const s=Math.min(1,1024/Math.max(i.naturalWidth||i.width,i.naturalHeight||i.height));
 const c=document.createElement('canvas');c.width=Math.max(1,Math.round((i.naturalWidth||i.width)*s));c.height=Math.max(1,Math.round((i.naturalHeight||i.height)*s));
 const ctx=c.getContext('2d');if(!ctx)throw new Error('IMAGE_DECODE');ctx.drawImage(i,0,0,c.width,c.height);
 const out=c.toDataURL('image/jpeg',.8);if(!out.startsWith('data:image/jpeg'))throw new Error('IMAGE_DECODE');return out;
}
async function smart(images,hints,id){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),TIMEOUT);
 try{
  const payload={personName:id.name,age:id.age?Number(id.age):null,language:lang,images:await Promise.all(images.map(compact)),hints};
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!Array.isArray(d.memories))throw new Error(d.error||'AI');
  return d;
 }catch(e){if(e?.name==='AbortError')throw new Error('AI_TIMEOUT');throw e}finally{clearTimeout(timer)}
}
function aiMessage(e){return e?.message==='AI_TIMEOUT'?tx('timeout'):e?.message==='IMAGE_DECODE'?tx('imageUnsupported'):tx('fallback')}
function setDed(d){if($('#dedication')&&!clean($('#dedication').value)&&clean(d.suggested_dedication))$('#dedication').value=clean(d.suggested_dedication)}
function showGame(id,items){
 game=items.map((a,i)=>({q:a.question,a:a.answers,correct:Number(a.correct),image:memories[i].image,edited:true,selected:null,aiGenerated:true}));
 currentIndex=0;$('#levelBadge').dataset.name=id.name;$('#levelBadge').dataset.age=id.age;
 $('#previewHeading').textContent=tr(game.length===5?'previewHeading5':'previewHeading1');$('#previewDesc').textContent=tr(game.length===5?'previewDesc5':'previewDesc1');
 $('#questionNav').classList.toggle('hidden',game.length===1);renderGame();show('#previewSection');
}
const oldEditor=renderFullEditor;renderFullEditor=function(){oldEditor();placeDedication();refresh()};
const oldLang=changeLanguage;changeLanguage=function(v){oldLang(v);setTimeout(()=>{placeDedication();refresh()},0)};
const oldBuilder=startBuilder;startBuilder=function(m){oldBuilder(m);if($('#dedication'))$('#dedication').value='';placeDedication();refresh()};
$('#continueEditBtn').onclick=async()=>{
 const id=validIdentity();if(!id)return;if(fullPhotoData.length!==5){alert(tr('needFive'));return}
 const b=$('#continueEditBtn'),t=b.textContent;b.disabled=true;b.textContent=tx('analysing');$('#fullUploadFlow').classList.add('smart-busy');
 memories=Array.from({length:5},(_,i)=>({image:fullPhotoData[i],context:memories[i]?.context||''}));
 try{const d=await smart(fullPhotoData,['','','','',''],id);d.memories.forEach((a,i)=>{memories[i].context=clean(a.suggested_context);memories[i].ai=a});setDed(d)}
 catch(e){console.error('Smart Creator initial analysis',e);alert(aiMessage(e))}
 finally{b.disabled=false;b.textContent=t;$('#fullUploadFlow').classList.remove('smart-busy')}
 fullEditIndex=0;$('#fullUploadFlow').classList.add('hidden');$('#fullEditFlow').classList.remove('hidden');renderFullEditor();
};
$('#generateFullBtn').onclick=async()=>{
 saveCurrentMemoryContext();const id=validIdentity();if(!id)return;for(let i=0;i<5;i++)if(!memories[i]?.image){alert(tr('errPhoto',{n:i+1}));return}
 const b=$('#generateFullBtn'),t=b.textContent;b.disabled=true;b.textContent=tx('generating');
 try{const d=await smart(memories.map(m=>m.image),memories.map(m=>clean(m.context)),id);d.memories.forEach((a,i)=>{memories[i].ai=a;if(!clean(memories[i].context))memories[i].context=clean(a.suggested_context)});setDed(d);showGame(id,d.memories)}
 catch(e){console.error('Smart Creator question generation',e);alert(aiMessage(e));finalizeGame(id)}
 finally{b.disabled=false;b.textContent=t}
};
$('#generatePreviewBtn').onclick=async()=>{
 const id=validIdentity();if(!id)return;if(!previewMemory.image){alert(tr('errPhoto',{n:1}));return}
 previewMemory.context=clean($('#previewContext').value);const b=$('#generatePreviewBtn'),t=b.textContent;b.disabled=true;b.textContent=tx('analysing');
 try{const d=await smart([previewMemory.image],[previewMemory.context],id),a=d.memories[0];if(!previewMemory.context){previewMemory.context=clean(a.suggested_context);$('#previewContext').value=previewMemory.context}previewMemory.ai=a;memories=[{...previewMemory}];setDed(d);showGame(id,[a])}
 catch(e){console.error('Smart Creator preview',e);alert(aiMessage(e));memories=[{...previewMemory}];finalizeGame(id)}
 finally{b.disabled=false;b.textContent=t}
};
const replace=$('#replaceMemoryPhoto');
if(replace)replace.addEventListener('change',e=>{
 const f=e.target.files?.[0];if(!f)return;const idx=fullEditIndex;
 memories[idx].context='';memories[idx].ai=null;if(idx===fullEditIndex){$('#editMemoryContext').value='';note()}
 const r=new FileReader();
 r.onload=async()=>{const dataUrl=String(r.result||'');memories[idx].image=dataUrl;fullPhotoData[idx]=dataUrl;if(idx===fullEditIndex)$('#editMemoryImg').src=dataUrl;
  const id={name:clean($('#name').value),age:clean($('#age').value)};
  if(!id.name)return;
  try{const d=await smart([dataUrl],[''],id),a=d.memories[0];memories[idx].context=clean(a.suggested_context);memories[idx].ai=a;if(idx===fullEditIndex){$('#editMemoryContext').value=memories[idx].context;note()}}
  catch(err){console.error('Smart Creator replacement analysis',err);if(idx===fullEditIndex)alert(aiMessage(err))}
 };
 r.readAsDataURL(f);
},true);
install();
})();