(() => {
const API='https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/smart-memory';
const AI_TIMEOUT=40000;

const F={
 es:{
  question:'Pregunta',a1:'Respuesta 1',a2:'Respuesta 2',a3:'Respuesta 3',correct:'Respuesta correcta',
  ai:'✨ Sugerirme una pregunta',modalTitle:'Ayúdame con esta pregunta ✨',hint:'Cuéntanos qué hace especial este recuerdo',hintHelp:'Cuéntanos qué hace especial este recuerdo. Sin pista, LevelYou se basará solo en lo que ve en la foto.',
  tone:'Tono de la sugerencia',fun:'😊 Divertido',complicit:'😏 Cómplice',emotional:'❤️ Emotivo',elegant:'✨ Elegante',
  cancel:'Cancelar',generate:'Generar sugerencia',thinking:'✨ Pensando una pregunta…',
  dedication:'Mensaje final (opcional)',dedicationHelp:'Aparecerá al terminar el juego y cerrará también el vídeo.',
  complete:'Completa las 5 preguntas y sus tres respuestas antes de revisar el juego.',
  aiFail:'No hemos podido generar una sugerencia. Puedes escribir la pregunta manualmente.',
  replace:'Cambiar foto',backPhotos:'← Cambiar las 5 fotos',prev:'← Anterior',next:'Siguiente →',
  editorTitle:'Escribe la pregunta',editorDesc:'Hazla personal, divertida o imposible de entender para quien no conozca la historia.',
  review:'Revisar mi LevelYou →',ready:'preguntas listas',frame:'🖼 Ajustar encuadre',frameTitle:'Ajusta cómo se verá esta foto',frameHelp:'Arrastra la foto y usa el zoom. Si no haces nada, se verá completa sin recortes.',frameZoom:'Zoom',frameReset:'Recentrar',frameSave:'Guardar encuadre'
 },
 ca:{
  question:'Pregunta',a1:'Resposta 1',a2:'Resposta 2',a3:'Resposta 3',correct:'Resposta correcta',
  ai:'✨ Sugerir-me una pregunta',modalTitle:'Ajuda’m amb aquesta pregunta ✨',hint:'Explica’ns què fa especial aquest record',hintHelp:'Explica què fa especial aquest record. Sense pista, LevelYou es basarà només en el que veu a la foto.',
  tone:'To del suggeriment',fun:'😊 Divertit',complicit:'😏 Còmplice',emotional:'❤️ Emotiu',elegant:'✨ Elegant',
  cancel:'Cancel·lar',generate:'Generar suggeriment',thinking:'✨ Pensant una pregunta…',
  dedication:'Missatge final (opcional)',dedicationHelp:'Apareixerà en acabar el joc i també tancarà el vídeo.',
  complete:'Completa les 5 preguntes i les tres respostes abans de revisar el joc.',
  aiFail:'No hem pogut generar un suggeriment. Pots escriure la pregunta manualment.',
  replace:'Canviar foto',backPhotos:'← Canviar les 5 fotos',prev:'← Anterior',next:'Següent →',
  editorTitle:'Escriu la pregunta',editorDesc:'Fes-la personal, divertida o impossible d’entendre per a qui no conegui la història.',
  review:'Revisar el meu LevelYou →',ready:'preguntes llestes',frame:'🖼 Ajustar enquadrament',frameTitle:'Ajusta com es veurà aquesta foto',frameHelp:'Arrossega la foto i utilitza el zoom. Si no fas res, es veurà completa sense retalls.',frameZoom:'Zoom',frameReset:'Recentrar',frameSave:'Guardar enquadrament'
 },
 en:{
  question:'Question',a1:'Answer 1',a2:'Answer 2',a3:'Answer 3',correct:'Correct answer',
  ai:'✨ Suggest a question',modalTitle:'Help me with this question ✨',hint:'Tell us what makes this memory special',hintHelp:'Tell us what makes this memory special. Without a hint, LevelYou will rely only on what it can see in the photo.',
  tone:'Suggestion tone',fun:'😊 Fun',complicit:'😏 Cheeky',emotional:'❤️ Emotional',elegant:'✨ Elegant',
  cancel:'Cancel',generate:'Generate suggestion',thinking:'✨ Thinking of a question…',
  dedication:'Final message (optional)',dedicationHelp:'It appears after the game and also closes the video.',
  complete:'Complete all 5 questions and their three answers before reviewing the game.',
  aiFail:'We could not generate a suggestion. You can still write the question manually.',
  replace:'Change photo',backPhotos:'← Change the 5 photos',prev:'← Previous',next:'Next →',
  editorTitle:'Write the question',editorDesc:'Make it personal, funny or impossible to understand unless you know the story.',
  review:'Review my LevelYou →',ready:'questions ready',frame:'🖼 Adjust framing',frameTitle:'Adjust how this photo will appear',frameHelp:'Drag the photo and use zoom. If you do nothing, the full photo stays visible without cropping.',frameZoom:'Zoom',frameReset:'Recenter',frameSave:'Save framing'
 }
};
const fx=k=>(F[lang]||F.es)[k]||k;

function ensureDraft(m){
 if(!m.draft)m.draft={q:'',a:['','',''],correct:0};
 if(!Array.isArray(m.draft.a))m.draft.a=['','',''];
 while(m.draft.a.length<3)m.draft.a.push('');
 m.draft.correct=Number.isInteger(Number(m.draft.correct))?Math.max(0,Math.min(2,Number(m.draft.correct))):0;
 return m.draft;
}
function ensureFraming(m){
 if(!m.framing||typeof m.framing!=='object')m.framing={zoom:1,x:0,y:0};
 m.framing.zoom=Math.max(1,Math.min(2.5,Number(m.framing.zoom)||1));
 m.framing.x=Math.max(-1,Math.min(1,Number(m.framing.x)||0));
 m.framing.y=Math.max(-1,Math.min(1,Number(m.framing.y)||0));
 return m.framing;
}
function framingCopy(f){return{zoom:Number(f?.zoom)||1,x:Number(f?.x)||0,y:Number(f?.y)||0}}
function applyFraming(el,f){
 if(!el)return;
 const framing=f||{zoom:1,x:0,y:0},travel=50*Math.max(0,framing.zoom-1)/Math.max(1,framing.zoom);
 el.style.objectFit='contain';
 el.style.transformOrigin='center center';
 el.style.transform='translate('+(framing.x*travel)+'%,'+(framing.y*travel)+'%) scale('+framing.zoom+')';
}
function isComplete(m){
 const d=ensureDraft(m);
 return Boolean(clean(d.q)&&d.a.every(x=>clean(x)));
}
function completeCount(){return memories.filter(isComplete).length}

function saveFastFields(){
 if(mode!=='full'||!memories[fullEditIndex])return;
 const m=memories[fullEditIndex],d=ensureDraft(m);
 d.q=clean($('#fastQuestion')?.value||'');
 d.a=[
  clean($('#fastA1')?.value||''),
  clean($('#fastA2')?.value||''),
  clean($('#fastA3')?.value||'')
 ];
 d.correct=Number($('#fastCorrect')?.value||0);
 m.context=clean($('#editMemoryContext')?.value||'');
 updateFastDots();
 updateReviewButton();
}

function syncGameToDrafts(){
 if(game.length!==5||memories.length!==5)return;
 game.forEach((item,i)=>{
   const d=ensureDraft(memories[i]);
   d.q=clean(item.q);d.a=[...item.a];d.correct=Number(item.correct);if(item.framing)memories[i].framing=framingCopy(item.framing);
 });
}

function renderFastTexts(){
 if($('#editMemoryTitle'))$('#editMemoryTitle').textContent=fx('editorTitle');
 if($('#editMemoryDesc'))$('#editMemoryDesc').textContent=fx('editorDesc');
 if($('#fastQuestionLabel'))$('#fastQuestionLabel').textContent=fx('question');
 if($('#fastA1Label'))$('#fastA1Label').textContent=fx('a1');
 if($('#fastA2Label'))$('#fastA2Label').textContent=fx('a2');
 if($('#fastA3Label'))$('#fastA3Label').textContent=fx('a3');
 if($('#fastCorrectLabel'))$('#fastCorrectLabel').textContent=fx('correct');
 if($('#aiAssistBtn'))$('#aiAssistBtn').textContent=fx('ai');
 if($('#aiModalTitle'))$('#aiModalTitle').textContent=fx('modalTitle');
 if($('#editContextLabel'))$('#editContextLabel').textContent=fx('hint');
 if($('#aiHintHelp'))$('#aiHintHelp').textContent=fx('hintHelp');
 if($('#fastToneLabel'))$('#fastToneLabel').textContent=fx('tone');
 if($('#aiCancelBtn'))$('#aiCancelBtn').textContent=fx('cancel');
 if($('#aiGenerateBtn'))$('#aiGenerateBtn').textContent=fx('generate');
 if($('#replacePhotoLabel'))$('#replacePhotoLabel').textContent=fx('replace');
 if($('#framePhotoBtn'))$('#framePhotoBtn').textContent=fx('frame');
 if($('#frameModalTitle'))$('#frameModalTitle').textContent=fx('frameTitle');
 if($('#frameHelp'))$('#frameHelp').textContent=fx('frameHelp');
 if($('#frameZoomLabel'))$('#frameZoomLabel').textContent=fx('frameZoom');
 if($('#frameResetBtn'))$('#frameResetBtn').textContent=fx('frameReset');
 if($('#frameCancelBtn'))$('#frameCancelBtn').textContent=fx('cancel');
 if($('#frameSaveBtn'))$('#frameSaveBtn').textContent=fx('frameSave');
 if($('#backToPhotosBtn'))$('#backToPhotosBtn').textContent=fx('backPhotos');
 if($('#prevMemoryBtn'))$('#prevMemoryBtn').textContent=fx('prev');
 if($('#nextMemoryBtn'))$('#nextMemoryBtn').textContent=fx('next');
 const tone=$('#questionTone');
 if(tone){
   const labels=[fx('fun'),fx('complicit'),fx('emotional'),fx('elegant')];
   [...tone.options].forEach((o,i)=>o.textContent=labels[i]);
 }
 const dl=$('#fastDedicationLabel');if(dl)dl.textContent=fx('dedication');
 const dh=$('#fastDedicationHelp');if(dh)dh.textContent=fx('dedicationHelp');
}

function installDedication(){
 if($('#fastDedicationBlock'))return;
 const style=document.createElement('style');
 style.id='fastSprint3ReviewStyle';
 style.textContent='.fast-dedication-block{margin:18px 0 4px;padding:16px;border-radius:20px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.08)}.fast-dedication-block label{margin-top:0}.fast-dedication-block textarea{min-height:96px;resize:vertical}.fast-question-card textarea#fastQuestion{min-height:76px;line-height:1.35;resize:vertical}.question,.answer{overflow-wrap:anywhere;white-space:normal}';
 document.head.appendChild(style);
 const block=document.createElement('div');
 block.id='fastDedicationBlock';
 block.className='fast-dedication-block hidden';
 block.innerHTML='<label id="fastDedicationLabel"></label><textarea id="dedication" rows="3" maxlength="180"></textarea><div class="small" id="fastDedicationHelp"></div>';
 const anchor=$('#interestBtn');
 if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(block,anchor);
}

let aiRequestSeq=0,aiBusy=false;
let frameDraft={zoom:1,x:0,y:0},frameStart=null,framePointer=null;
function renderFrameDraft(){
 const img=$('#frameImage');if(!img)return;
 applyFraming(img,frameDraft);
 if($('#frameZoom'))$('#frameZoom').value=String(frameDraft.zoom);
}
function openFrameModal(){
 saveFastFields();
 const m=memories[fullEditIndex];if(!m)return;
 frameDraft=framingCopy(ensureFraming(m));
 $('#frameImage').src=m.image;
 $('#frameModal').classList.remove('hidden');
 document.body.classList.add('frame-modal-open');
 renderFrameDraft();
}
function closeFrameModal(returnFocus=true){
 $('#frameModal')?.classList.add('hidden');
 document.body.classList.remove('frame-modal-open');
 framePointer=null;frameStart=null;
 if(returnFocus)$('#framePhotoBtn')?.focus();
}
function saveFrameModal(){
 const m=memories[fullEditIndex];if(!m)return closeFrameModal();
 m.framing=framingCopy(frameDraft);
 applyFraming($('#editMemoryImg'),m.framing);
 closeFrameModal();
}
function install(){
 installDedication();
 renderFastTexts();
 $('#framePhotoBtn').onclick=openFrameModal;
 $('#frameCancelBtn').onclick=()=>closeFrameModal();
 $('#frameSaveBtn').onclick=saveFrameModal;
 $('#frameResetBtn').onclick=()=>{frameDraft={zoom:1,x:0,y:0};renderFrameDraft()};
 $('#frameZoom').addEventListener('input',e=>{frameDraft.zoom=Math.max(1,Math.min(2.5,Number(e.target.value)||1));renderFrameDraft()});
 $('#frameStage').addEventListener('pointerdown',e=>{framePointer=e.pointerId;frameStart={clientX:e.clientX,clientY:e.clientY,x:frameDraft.x,y:frameDraft.y};$('#frameStage').setPointerCapture?.(e.pointerId);$('#frameStage').classList.add('dragging')});
 $('#frameStage').addEventListener('pointermove',e=>{if(framePointer!==e.pointerId||!frameStart)return;const r=$('#frameStage').getBoundingClientRect();frameDraft.x=Math.max(-1,Math.min(1,frameStart.x+(e.clientX-frameStart.clientX)/(r.width*.32)));frameDraft.y=Math.max(-1,Math.min(1,frameStart.y+(e.clientY-frameStart.clientY)/(r.height*.32)));renderFrameDraft()});
 const endFrameDrag=e=>{if(framePointer!==null&&(!e||e.pointerId===framePointer)){framePointer=null;frameStart=null;$('#frameStage').classList.remove('dragging')}};
 $('#frameStage').addEventListener('pointerup',endFrameDrag);$('#frameStage').addEventListener('pointercancel',endFrameDrag);
 $('#frameModal').addEventListener('click',e=>{if(e.target===$('#frameModal'))closeFrameModal()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#frameModal').classList.contains('hidden'))closeFrameModal()});
 ['#fastQuestion','#fastA1','#fastA2','#fastA3','#fastCorrect','#editMemoryContext'].forEach(sel=>{
   const el=$(sel);if(el)el.addEventListener(sel==='#fastCorrect'?'change':'input',saveFastFields);
 });
 $('#aiAssistBtn').onclick=()=>openAiModal();
 $('#aiCancelBtn').onclick=()=>closeAiModal();
 $('#aiGenerateBtn').onclick=generateSuggestion;
 $('#aiAssistPanel').addEventListener('click',e=>e.stopPropagation());
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#aiAssistPanel').classList.contains('hidden'))closeAiModal()});
 document.addEventListener('click',e=>{
   const panel=$('#aiAssistPanel'),trigger=$('#aiAssistBtn');
   if(panel.classList.contains('hidden'))return;
   if(panel.contains(e.target)||trigger.contains(e.target))return;
   closeAiModal();
 });
}

function openAiModal(){
 saveFastFields();
 const panel=$('#aiAssistPanel');
 panel.classList.remove('hidden');
 document.body.classList.add('fast-modal-open');
 setTimeout(()=>$('#editMemoryContext')?.focus(),40);
}
function closeAiModal(returnFocus=true,force=false){
 const panel=$('#aiAssistPanel');
 if(!panel||(!force&&aiBusy))return;
 panel.classList.add('hidden');
 document.body.classList.remove('fast-modal-open');
 if(returnFocus)$('#aiAssistBtn')?.focus();
}

function setAiBusy(busy){
 aiBusy=busy;
 ['#prevMemoryBtn','#nextMemoryBtn','#backToPhotosBtn','#framePhotoBtn','#replaceMemoryPhoto','#generateFullBtn','#aiAssistBtn','#fastQuestion','#fastA1','#fastA2','#fastA3','#fastCorrect'].forEach(sel=>{
   const el=$(sel);if(el)el.disabled=busy;
 });
 const cancel=$('#aiCancelBtn');if(cancel)cancel.disabled=busy;
 updateFastDots();
}

function updateFastDots(){
 const box=$('#fastDots');if(!box)return;
 box.innerHTML=memories.map((m,i)=>'<button type="button" class="fast-dot'+(i===fullEditIndex?' active':'')+(isComplete(m)?' complete':'')+'" data-fast-index="'+i+'"'+(aiBusy?' disabled':'')+'>'+(i+1)+'</button>').join('');
 box.querySelectorAll('[data-fast-index]').forEach(btn=>btn.onclick=()=>{
   if(aiBusy)return;
   saveFastFields();fullEditIndex=Number(btn.dataset.fastIndex);renderFullEditor();
 });
}

function updateReviewButton(){
 const b=$('#generateFullBtn');if(!b)return;
 const n=completeCount();
 b.disabled=n!==5;b.style.opacity=n===5?1:.5;
 b.textContent=n===5?fx('review'):fx('review')+' · '+n+'/5 '+fx('ready');
}

function renderEditor(){
 if(!memories.length||!memories[fullEditIndex])return;
 updateJourney('#builder');
 renderFastTexts();
 const m=memories[fullEditIndex],d=ensureDraft(m);
 $('#memoryCounter').textContent=(fullEditIndex+1)+' / 5';
 $('#editMemoryImg').src=m.image;
 applyFraming($('#editMemoryImg'),ensureFraming(m));
 $('#fastQuestion').value=d.q||'';
 $('#fastA1').value=d.a[0]||'';
 $('#fastA2').value=d.a[1]||'';
 $('#fastA3').value=d.a[2]||'';
 $('#fastCorrect').value=String(d.correct||0);
 $('#editMemoryContext').value=m.context||'';
 closeAiModal(false);closeFrameModal(false);
 $('#prevMemoryBtn').disabled=aiBusy||fullEditIndex===0;
 $('#nextMemoryBtn').disabled=aiBusy||fullEditIndex===4;
 $('#prevMemoryBtn').style.opacity=(aiBusy||fullEditIndex===0)?.45:1;
 $('#nextMemoryBtn').style.opacity=(aiBusy||fullEditIndex===4)?.45:1;
 $('#aiAssistBtn').disabled=aiBusy;
 $('#fastDedicationBlock').classList.add('hidden');
 updateFastDots();updateReviewButton();
}

function compact(imageUrl){
 return new Promise((resolve,reject)=>{
   const im=new Image();
   im.onload=()=>{
     try{
       const scale=Math.min(1,768/Math.max(im.naturalWidth||im.width,im.naturalHeight||im.height));
       const canvas=document.createElement('canvas');
       canvas.width=Math.max(1,Math.round((im.naturalWidth||im.width)*scale));
       canvas.height=Math.max(1,Math.round((im.naturalHeight||im.height)*scale));
       const ctx=canvas.getContext('2d');if(!ctx)throw new Error('IMAGE');
       ctx.drawImage(im,0,0,canvas.width,canvas.height);
       resolve(canvas.toDataURL('image/jpeg',.78));
     }catch(e){reject(e)}
   };
   im.onerror=reject;im.src=imageUrl;
 });
}

async function aiCall(payload){
 let lastError=null;
 for(let attempt=0;attempt<2;attempt++){
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),AI_TIMEOUT);
   try{
     const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
     const data=await response.json().catch(()=>({}));
     if(response.ok&&Array.isArray(data.memories)&&data.memories[0])return data;
     lastError=new Error(data.error||'AI');
     if(!(response.status===429||response.status>=500)||attempt===1)throw lastError;
   }catch(e){
     lastError=e;
     if(attempt===1)throw e;
   }finally{clearTimeout(timer)}
   await new Promise(r=>setTimeout(r,600));
 }
 throw lastError||new Error('AI');
}

async function generateSuggestion(){
 saveFastFields();
 const id=validIdentity();if(!id)return;
 const requestIndex=fullEditIndex;
 const m=memories[requestIndex];if(!m?.image)return;
 const requestId=++aiRequestSeq;
 const b=$('#aiGenerateBtn'),original=b.textContent;
 setAiBusy(true);
 b.disabled=true;b.textContent=fx('thinking');
 try{
   const image=await compact(m.image);
   const hint=clean(m.context||'');
   const requestLang=lang;
   const requestTone=$('#questionTone')?.value||'fun';
   const data=await aiCall({
     mode:'analyze',
     personName:id.name,
     age:id.age?Number(id.age):null,
     language:requestLang,
     tone:requestTone,
     images:[image],
     hints:[hint]
   });
   if(requestId!==aiRequestSeq||memories[requestIndex]!==m)return;
   const suggestion=data.memories[0];
   const d=ensureDraft(m);
   d.q=clean(suggestion.question).slice(0,160);
   d.a=Array.isArray(suggestion.answers)?suggestion.answers.slice(0,3).map(x=>clean(x).slice(0,90)):['','',''];
   while(d.a.length<3)d.a.push('');
   d.correct=Math.max(0,Math.min(2,Number(suggestion.correct)||0));
   m.context=hint;

   if(fullEditIndex===requestIndex){
     $('#fastQuestion').value=d.q;
     $('#fastA1').value=d.a[0]||'';
     $('#fastA2').value=d.a[1]||'';
     $('#fastA3').value=d.a[2]||'';
     $('#fastCorrect').value=String(d.correct);
     setAiBusy(false);
     closeAiModal(false,true);
     renderFullEditor();
     setTimeout(()=>$('#fastQuestion')?.focus(),40);
   }
   updateFastDots();updateReviewButton();
 }catch(error){
   if(requestId===aiRequestSeq){
     console.error('Fast Creator AI suggestion',error);
     alert(fx('aiFail'));
   }
 }finally{
   if(requestId===aiRequestSeq){
     if(aiBusy)setAiBusy(false);
     b.disabled=false;b.textContent=original;
     renderFullEditor();
   }
 }
}

function showDraftGame(){
 saveFastFields();
 const id=validIdentity();if(!id)return;
 const firstMissing=memories.findIndex(m=>!isComplete(m));
 if(firstMissing>=0){
   fullEditIndex=firstMissing;renderFullEditor();alert(fx('complete'));return;
 }
 game=memories.map(m=>{
   const d=ensureDraft(m);
   return{q:d.q,a:[...d.a],correct:Number(d.correct),image:m.image,framing:framingCopy(ensureFraming(m)),edited:true,userEdited:true,selected:null,generatedLang:lang};
 });
 currentIndex=0;
 $('#levelBadge').dataset.name=id.name;$('#levelBadge').dataset.age=id.age;
 $('#previewHeading').textContent=tr('previewHeading5');
 $('#previewDesc').textContent=tr('previewDesc5');
 $('#questionNav').classList.remove('hidden');
 renderGame();
 $('#fastDedicationBlock')?.classList.remove('hidden');
 show('#previewSection');
}

const baseRenderBuilderTexts=renderBuilderTexts;
renderBuilderTexts=function(){
 baseRenderBuilderTexts();
 if(mode==='full'){
   $('#builderTitle').textContent=tr('builderFullTitle');
   $('#builderDesc').textContent=tr('choose5Desc');
 }
 renderFastTexts();
};

const baseStartBuilder=startBuilder;
startBuilder=function(nextMode){
 aiRequestSeq++;aiBusy=false;closeAiModal(false,true);
 baseStartBuilder(nextMode);
 if(nextMode==='full'){
   memories=Array.from({length:5},(_,i)=>({image:fullPhotoData[i]||'',context:'',framing:{zoom:1,x:0,y:0},draft:{q:'',a:['','',''],correct:0}}));
   if($('#dedication'))$('#dedication').value='';
   $('#fastDedicationBlock')?.classList.add('hidden');
 }
 renderFastTexts();
};

$('#continueEditBtn').onclick=()=>{
 const id=validIdentity();if(!id)return;
 if(fullPhotoData.length!==5){alert(tr('needFive'));return}
 memories=Array.from({length:5},(_,i)=>{
   const old=memories[i]||{};
   return{image:fullPhotoData[i],context:old.context||'',framing:framingCopy(ensureFraming(old)),draft:old.draft||{q:'',a:['','',''],correct:0}};
 });
 fullEditIndex=0;
 $('#fullUploadFlow').classList.add('hidden');
 $('#fullEditFlow').classList.remove('hidden');
 renderFullEditor();
};

renderFullEditor=renderEditor;

$('#backToPhotosBtn').onclick=()=>{
 saveFastFields();$('#fullEditFlow').classList.add('hidden');$('#fullUploadFlow').classList.remove('hidden');renderFullUpload();
};
$('#prevMemoryBtn').onclick=()=>{if(aiBusy)return;saveFastFields();if(fullEditIndex>0){fullEditIndex--;renderFullEditor()}};
$('#nextMemoryBtn').onclick=()=>{if(aiBusy)return;saveFastFields();if(fullEditIndex<4){fullEditIndex++;renderFullEditor()}};
$('#generateFullBtn').onclick=showDraftGame;

$('#replaceMemoryPhoto').onchange=e=>{
 const file=e.target.files?.[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
   memories[fullEditIndex].image=String(reader.result||'');
   memories[fullEditIndex].framing={zoom:1,x:0,y:0};
   fullPhotoData[fullEditIndex]=String(reader.result||'');
   $('#editMemoryImg').src=String(reader.result||'');
 };
 reader.readAsDataURL(file);e.target.value='';
};

const basePreviewBack=$('#previewBackBtn').onclick;
$('#previewBackBtn').onclick=()=>{
 $('#fastDedicationBlock')?.classList.add('hidden');
 if(mode==='full'){
   syncGameToDrafts();show('#builder');$('#previewFlow').classList.add('hidden');$('#fullUploadFlow').classList.add('hidden');$('#fullEditFlow').classList.remove('hidden');fullEditIndex=Math.min(currentIndex,4);renderFullEditor();
 }else if(basePreviewBack)basePreviewBack();
};
$('#editMemoriesBtn').onclick=()=>{
 if(mode==='full'){
   syncGameToDrafts();show('#builder');$('#previewFlow').classList.add('hidden');$('#fullUploadFlow').classList.add('hidden');$('#fullEditFlow').classList.remove('hidden');fullEditIndex=Math.min(currentIndex,4);renderFullEditor();
 }else{
   show('#builder');$('#previewFlow').classList.remove('hidden');
 }
};

const baseSaveQuestion=$('#saveQuestionBtn').onclick;
$('#saveQuestionBtn').onclick=()=>{
 if(baseSaveQuestion)baseSaveQuestion();
 if(mode==='full'&&game[currentIndex]&&memories[currentIndex]){
   const d=ensureDraft(memories[currentIndex]);
   d.q=game[currentIndex].q;d.a=[...game[currentIndex].a];d.correct=Number(game[currentIndex].correct);
 }
};

const baseChangeLanguage=changeLanguage;
changeLanguage=function(value){
 saveFastFields();
 baseChangeLanguage(value);
 renderFastTexts();
 if(mode==='full'&&!$('#fullEditFlow').classList.contains('hidden'))renderFullEditor();
};

const baseRenderGameFast=renderGame;
renderGame=function(){
 baseRenderGameFast();
 if(mode==='full'&&game[currentIndex])applyFraming($('#gameImg'),game[currentIndex].framing||memories[currentIndex]?.framing);
};
window.levelYouQuestionTone=()=>$('#questionTone')?.value||'fun';
window.levelYouFastCreator={version:'2.5',completeCount:()=>completeCount(),framing:()=>memories.map(m=>framingCopy(ensureFraming(m)))};

install();
renderBuilderTexts();
})();