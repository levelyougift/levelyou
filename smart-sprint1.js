(() => {
const API='https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/smart-memory';
const IMAGE_TIMEOUT=40000;
const TEXT_TIMEOUT=20000;
const C={
es:{
 ded:'Mensaje final para la persona',help:'Aparecerá al terminar el juego y cerrará también el vídeo. Puedes editar la sugerencia.',ph:'Ej. Feliz cumpleaños. Que sigamos sumando recuerdos inolvidables.',
 hint:'Contexto / pista para LevelYou (opcional)',previewHint:'Contexto / pista para LevelYou (opcional)',desc:'LevelYou entiende cada foto y propone el recuerdo. Corrígelo solo si quieres darle una pista más personal.',
 analysing:'✨ Entendiendo tus recuerdos…',generating:'✨ Dándole personalidad a las preguntas…',suggested:'✨ Sugerencia de LevelYou',need:'Para hacerlo más personal, ayudaría saber: ',ready:'Puedes dejar esta sugerencia tal cual o editarla.',
 fallback:'No hemos podido usar la IA ahora mismo. Puedes continuar igualmente.',translating:'✨ Adaptando el juego al nuevo idioma…',timeout:'La IA ha tardado demasiado. Puedes volver a intentarlo.',imageUnsupported:'No hemos podido analizar una de las fotos. Prueba con otra imagen o con formato JPG/PNG.',
 toneLabel:'Tono del juego',toneHelp:'Elige el estilo de las preguntas. Divertido es el recomendado.',toneFun:'😊 Divertido',toneComplicit:'😏 Cómplice',toneEmotional:'❤️ Emotivo',toneElegant:'✨ Elegante'
},
ca:{
 ded:'Missatge final per a la persona',help:'Apareixerà en acabar el joc i també tancarà el vídeo. Pots editar el suggeriment.',ph:'Ex. Per molts anys. Que continuem sumant records inoblidables.',
 hint:'Context / pista per a LevelYou (opcional)',previewHint:'Context / pista per a LevelYou (opcional)',desc:'LevelYou entén cada foto i proposa el record. Corregeix-lo només si vols donar-li una pista més personal.',
 analysing:'✨ Entenent els teus records…',generating:'✨ Donant personalitat a les preguntes…',suggested:'✨ Suggeriment de LevelYou',need:'Per fer-ho més personal, ajudaria saber: ',ready:'Pots deixar aquest suggeriment tal com està o editar-lo.',
 fallback:'Ara mateix no hem pogut utilitzar la IA. Pots continuar igualment.',translating:'✨ Adaptant el joc al nou idioma…',timeout:'La IA ha trigat massa. Pots tornar-ho a provar.',imageUnsupported:'No hem pogut analitzar una de les fotos. Prova una altra imatge o un format JPG/PNG.',
 toneLabel:'To del joc',toneHelp:'Tria l’estil de les preguntes. Divertit és el recomanat.',toneFun:'😊 Divertit',toneComplicit:'😏 Còmplice',toneEmotional:'❤️ Emotiu',toneElegant:'✨ Elegant'
},
en:{
 ded:'Final message for them',help:'It appears after the game and also closes the video. You can edit the suggestion.',ph:'e.g. Happy birthday. Here is to many more unforgettable memories.',
 hint:'Context / hint for LevelYou (optional)',previewHint:'Context / hint for LevelYou (optional)',desc:'LevelYou understands each photo and suggests the memory. Edit it only if you want to add a more personal hint.',
 analysing:'✨ Understanding your memories…',generating:'✨ Giving the questions some personality…',suggested:'✨ LevelYou suggestion',need:'To make it more personal, it would help to know: ',ready:'Keep this suggestion as it is or edit it.',
 fallback:'AI is unavailable right now. You can still continue.',translating:'✨ Adapting the game to the new language…',timeout:'The AI took too long. Please try again.',imageUnsupported:'We could not analyze one of the photos. Try another image or a JPG/PNG file.',
 toneLabel:'Game tone',toneHelp:'Choose the style of the questions. Fun is recommended.',toneFun:'😊 Fun',toneComplicit:'😏 Cheeky',toneEmotional:'❤️ Emotional',toneElegant:'✨ Elegant'
}
};
const tx=k=>(C[lang]||C.es)[k]||k;
const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tone=()=>$('#questionTone')?.value||'fun';

function install(){
 const st=document.createElement('style');
 st.textContent='.smart-note{margin:12px 0;padding:12px 14px;border:1px solid rgba(105,225,207,.22);border-radius:14px;background:rgba(105,225,207,.07);font-size:13px;line-height:1.45;color:#dffaf5}.smart-mini{margin-top:7px;color:#a9b0c4;font-size:12px;line-height:1.4}.smart-ded,.smart-tone{margin:14px 0;padding:14px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.025)}.smart-tone select{width:100%;margin-top:7px}.smart-tag{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(105,225,207,.11);color:#a8f3e7;font-size:11px;font-weight:800;margin-bottom:8px}.smart-busy{opacity:.72;pointer-events:none}';
 document.head.appendChild(st);

 if(!$('#smartToneBlock')){
   const wrap=document.createElement('div');
   wrap.id='smartToneBlock';wrap.className='smart-tone';
   wrap.innerHTML='<label id="toneLabel"></label><select id="questionTone"><option value="fun"></option><option value="complicit"></option><option value="emotional"></option><option value="elegant"></option></select><div class="small" id="toneHelp"></div>';
   $('#age').insertAdjacentElement('afterend',wrap);
 }

 if(!$('#smartDedicationBlock')){
   const el=document.createElement('div');
   el.id='smartDedicationBlock';el.className='smart-ded';
   el.innerHTML='<label id="dedicationLabel"></label><textarea id="dedication" rows="3" maxlength="180"></textarea><div class="small" id="dedicationHelp"></div>';
   $('#builder .card').appendChild(el);
 }
 if(!$('#aiMemoryNote')) $('#editMemoryContext').insertAdjacentHTML('beforebegin','<div id="aiMemoryNote" class="smart-note"></div>');

 placeDedication();
 refresh();
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

 if($('#toneLabel'))$('#toneLabel').textContent=tx('toneLabel');
 if($('#toneHelp'))$('#toneHelp').textContent=tx('toneHelp');
 const sel=$('#questionTone');
 if(sel){
   const labels=[tx('toneFun'),tx('toneComplicit'),tx('toneEmotional'),tx('toneElegant')];
   [...sel.options].forEach((o,i)=>o.textContent=labels[i]);
 }
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
 const s=Math.min(1,768/Math.max(i.naturalWidth||i.width,i.naturalHeight||i.height));
 const c=document.createElement('canvas');
 c.width=Math.max(1,Math.round((i.naturalWidth||i.width)*s));
 c.height=Math.max(1,Math.round((i.naturalHeight||i.height)*s));
 const ctx=c.getContext('2d');if(!ctx)throw new Error('IMAGE_DECODE');
 ctx.drawImage(i,0,0,c.width,c.height);
 const out=c.toDataURL('image/jpeg',.8);
 if(!out.startsWith('data:image/jpeg'))throw new Error('IMAGE_DECODE');
 return out;
}

async function api(payload,timeoutMs){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!Array.isArray(d.memories))throw new Error(d.error||'AI');
  return d;
 }catch(e){
  if(e?.name==='AbortError')throw new Error('AI_TIMEOUT');
  throw e;
 }finally{clearTimeout(timer)}
}

async function smartAnalyze(images,hints,id){
 const compressed=await Promise.all(images.map(compact));
 return api({
   mode:'analyze',
   personName:id.name,
   age:id.age?Number(id.age):null,
   language:lang,
   tone:tone(),
   images:compressed,
   hints
 },IMAGE_TIMEOUT);
}

async function smartQuestions(id){
 return api({
   mode:'questions',
   personName:id.name,
   age:id.age?Number(id.age):null,
   language:lang,
   tone:tone(),
   memoryInputs:memories.map(m=>({
     visual_summary:m.ai?.visual_summary||'',
     suggested_context:m.ai?.suggested_context||'',
     context:clean(m.context)
   }))
 },TEXT_TIMEOUT);
}

function aiMessage(e){return e?.message==='AI_TIMEOUT'?tx('timeout'):e?.message==='IMAGE_DECODE'?tx('imageUnsupported'):tx('fallback')}

function setDed(d){
 const f=$('#dedication'),next=clean(d.suggested_dedication);if(!f||!next)return;
 const previous=f.dataset.aiSuggestion||'';
 if(!clean(f.value)||clean(f.value)===previous){f.value=next;f.dataset.aiSuggestion=next}
}

function stampQuestionMeta(memory){
 memory.questionMeta={tone:tone(),lang,context:clean(memory.context)};
}

function mergeQuestions(items){
 items.forEach((q,i)=>{
   const m=memories[i];
   m.ai=m.ai||{};
   m.ai.question=q.question;
   m.ai.answers=q.answers;
   m.ai.correct=Number(q.correct);
   stampQuestionMeta(m);
 });
}

function canReuseQuestions(){
 return memories.length>0&&memories.every(m=>{
   const a=m.ai,meta=m.questionMeta;
   return a&&a.question&&Array.isArray(a.answers)&&a.answers.length===3&&meta&&meta.tone===tone()&&meta.lang===lang&&meta.context===clean(m.context);
 });
}

function cachedQuestions(){return memories.map(m=>m.ai)}

function showGame(id,items){
 game=items.map((a,i)=>({q:a.question,a:a.answers,correct:Number(a.correct),image:memories[i].image,edited:true,selected:null,aiGenerated:true,userEdited:false,generatedLang:lang,generatedTone:tone()}));
 currentIndex=0;$('#levelBadge').dataset.name=id.name;$('#levelBadge').dataset.age=id.age;
 $('#previewHeading').textContent=tr(game.length===5?'previewHeading5':'previewHeading1');
 $('#previewDesc').textContent=tr(game.length===5?'previewDesc5':'previewDesc1');
 $('#questionNav').classList.toggle('hidden',game.length===1);
 renderGame();show('#previewSection');
}

const oldEditor=renderFullEditor;
renderFullEditor=function(){oldEditor();placeDedication();refresh()};

async function refreshQuestionSet(){
 if(!game.length)return;
 const id={name:clean($('#name').value),age:clean($('#age').value)};if(!id.name)return;
 const desc=$('#previewDesc');
 if(desc)desc.textContent=tx('translating');
 try{
   const d=await smartQuestions(id);
   mergeQuestions(d.memories);
   setDed(d);
   game=game.map((oldItem,i)=>oldItem.userEdited?oldItem:{
     ...oldItem,
     q:d.memories[i].question,
     a:d.memories[i].answers,
     correct:Number(d.memories[i].correct),
     selected:null,
     generatedLang:lang,
     generatedTone:tone()
   });
   renderGame();
 }catch(e){console.error('Smart Creator text refresh',e)}
 finally{if(desc)desc.textContent=tr(game.length===5?'previewDesc5':'previewDesc1')}
}

const oldLang=changeLanguage;
changeLanguage=function(v){
 oldLang(v);
 setTimeout(()=>{placeDedication();refresh();if(game.length)refreshQuestionSet()},0);
};

const oldBuilder=startBuilder;
startBuilder=function(m){
 oldBuilder(m);
 if($('#dedication')){$('#dedication').value='';$('#dedication').dataset.aiSuggestion=''}
 if($('#questionTone'))$('#questionTone').value='fun';
 placeDedication();refresh();
};

['#editQuestion','#editA1','#editA2','#editA3','#editCorrect'].forEach(sel=>{
 const el=$(sel);
 if(el)el.addEventListener(sel==='#editCorrect'?'change':'input',()=>{if(game[currentIndex])game[currentIndex].userEdited=true});
});
if($('#dedication'))$('#dedication').addEventListener('input',()=>{$('#dedication').dataset.aiSuggestion=''});

$('#continueEditBtn').onclick=async()=>{
 const id=validIdentity();if(!id)return;
 if(fullPhotoData.length!==5){alert(tr('needFive'));return}
 const b=$('#continueEditBtn'),t=b.textContent;
 b.disabled=true;b.textContent=tx('analysing');$('#fullUploadFlow').classList.add('smart-busy');
 memories=Array.from({length:5},(_,i)=>({image:fullPhotoData[i],context:memories[i]?.context||''}));
 try{
   const d=await smartAnalyze(fullPhotoData,['','','','',''],id);
   d.memories.forEach((a,i)=>{
     memories[i].context=clean(a.suggested_context);
     memories[i].ai=a;
     stampQuestionMeta(memories[i]);
   });
   setDed(d);
 }catch(e){
   console.error('Smart Creator initial analysis',e);
   alert(aiMessage(e));
 }finally{
   b.disabled=false;b.textContent=t;$('#fullUploadFlow').classList.remove('smart-busy');
 }
 fullEditIndex=0;$('#fullUploadFlow').classList.add('hidden');$('#fullEditFlow').classList.remove('hidden');renderFullEditor();
};

$('#generateFullBtn').onclick=async()=>{
 saveCurrentMemoryContext();
 const id=validIdentity();if(!id)return;
 for(let i=0;i<5;i++)if(!memories[i]?.image){alert(tr('errPhoto',{n:i+1}));return}

 if(canReuseQuestions()){
   showGame(id,cachedQuestions());
   return;
 }

 const b=$('#generateFullBtn'),t=b.textContent;
 b.disabled=true;b.textContent=tx('generating');
 try{
   const d=await smartQuestions(id);
   mergeQuestions(d.memories);
   setDed(d);
   showGame(id,d.memories);
 }catch(e){
   console.error('Smart Creator text question generation',e);
   alert(aiMessage(e));
   if(memories.every(m=>m.ai?.question))showGame(id,cachedQuestions());
   else finalizeGame(id);
 }finally{b.disabled=false;b.textContent=t}
};

$('#generatePreviewBtn').onclick=async()=>{
 const id=validIdentity();if(!id)return;
 if(!previewMemory.image){alert(tr('errPhoto',{n:1}));return}
 previewMemory.context=clean($('#previewContext').value);
 const b=$('#generatePreviewBtn'),t=b.textContent;
 b.disabled=true;b.textContent=tx('analysing');
 try{
   const d=await smartAnalyze([previewMemory.image],[previewMemory.context],id),a=d.memories[0];
   if(!previewMemory.context){
     previewMemory.context=clean(a.suggested_context);
     $('#previewContext').value=previewMemory.context;
   }
   previewMemory.ai=a;
   previewMemory.questionMeta={tone:tone(),lang,context:clean(previewMemory.context)};
   memories=[{...previewMemory}];
   setDed(d);
   showGame(id,[a]);
 }catch(e){
   console.error('Smart Creator preview',e);
   memories=[{...previewMemory}];
   alert(aiMessage(e));
   finalizeGame(id);
 }finally{b.disabled=false;b.textContent=t}
};

const replace=$('#replaceMemoryPhoto');
if(replace)replace.addEventListener('change',e=>{
 const f=e.target.files?.[0];if(!f)return;
 const idx=fullEditIndex;
 memories[idx].context='';memories[idx].ai=null;memories[idx].questionMeta=null;
 if(idx===fullEditIndex){$('#editMemoryContext').value='';note()}
 const r=new FileReader();
 r.onload=async()=>{
   const dataUrl=String(r.result||'');
   memories[idx].image=dataUrl;fullPhotoData[idx]=dataUrl;
   if(idx===fullEditIndex)$('#editMemoryImg').src=dataUrl;
   const id={name:clean($('#name').value),age:clean($('#age').value)};
   if(!id.name)return;
   try{
     const d=await smartAnalyze([dataUrl],[''],id),a=d.memories[0];
     memories[idx].context=clean(a.suggested_context);
     memories[idx].ai=a;
     stampQuestionMeta(memories[idx]);
     if(idx===fullEditIndex){$('#editMemoryContext').value=memories[idx].context;note()}
   }catch(err){
     console.error('Smart Creator replacement analysis',err);
     if(idx===fullEditIndex)alert(aiMessage(err));
   }
 };
 r.readAsDataURL(f);
},true);

install();
})();