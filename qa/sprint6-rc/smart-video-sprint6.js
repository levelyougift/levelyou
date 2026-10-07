(() => {
  const MAX_EXTRA = 10;
  const MAX_PREVIEW_EDGE = 1440;
  const JPEG_QUALITY = 0.82;
  const state = window.levelYouVideoMemories = Array.isArray(window.levelYouVideoMemories) ? window.levelYouVideoMemories : [];

  const V = {
    es:{
      kicker:'Haz el final todavía más especial',
      title:'Añade más momentos al vídeo final',
      desc:'Puedes sumar hasta 10 fotos más. Es opcional: no tendrás que escribir nuevas preguntas ni usar IA.',
      add:'＋ Añadir fotos al vídeo',
      skip:'Continuar sin añadir',
      continue:'Continuar al pago',
      count:n=>n+' / '+MAX_EXTRA+' fotos extra',
      helper:'Las 5 fotos del juego aparecerán primero. Después se mostrarán estas fotos en el orden que elijas.',
      remove:'Eliminar', up:'↑', down:'↓', adjust:'Ajustar', full:'Foto completa',
      frameTitle:'Ajusta el encuadre del vídeo',
      frameHelp:'Arrastra la foto y usa el zoom. El encuadre llena automáticamente el marco sin bandas negras. Recolócala y amplíala si hace falta.',
      reset:'Recentrar', cancel:'Cancelar', save:'Guardar encuadre',
      tooMany:'Puedes añadir como máximo 10 fotos adicionales.',
      imageError:'No hemos podido preparar una de las fotos. Prueba con otra.',
      preparing:'Preparando fotos…'
    },
    ca:{
      kicker:'Fes el final encara més especial',
      title:'Afegeix més moments al vídeo final',
      desc:'Pots sumar fins a 10 fotos més. És opcional: no hauràs d’escriure noves preguntes ni utilitzar IA.',
      add:'＋ Afegir fotos al vídeo',
      skip:'Continuar sense afegir',
      continue:'Continuar al pagament',
      count:n=>n+' / '+MAX_EXTRA+' fotos extra',
      helper:'Les 5 fotos del joc apareixeran primer. Després es mostraran aquestes fotos en l’ordre que triïs.',
      remove:'Eliminar', up:'↑', down:'↓', adjust:'Ajustar', full:'Foto completa',
      frameTitle:'Ajusta l’enquadrament del vídeo',
      frameHelp:'Arrossega la foto i utilitza el zoom. L\'enquadrament omple automàticament el marc sense bandes negres. Recol·loca-la i amplia-la si cal.',
      reset:'Recentrar', cancel:'Cancel·lar', save:'Desar enquadrament',
      tooMany:'Pots afegir com a màxim 10 fotos addicionals.',
      imageError:'No hem pogut preparar una de les fotos. Prova’n una altra.',
      preparing:'Preparant fotos…'
    },
    en:{
      kicker:'Make the ending even more special',
      title:'Add more moments to the final video',
      desc:'You can add up to 10 more photos. It is optional: no extra questions or AI required.',
      add:'＋ Add photos to the video',
      skip:'Continue without adding',
      continue:'Continue to payment',
      count:n=>n+' / '+MAX_EXTRA+' extra photos',
      helper:'The 5 game photos will appear first. These extra photos will follow in the order you choose.',
      remove:'Remove', up:'↑', down:'↓', adjust:'Adjust', full:'Full photo',
      frameTitle:'Adjust the video framing',
      frameHelp:'Drag the photo and use zoom. Framing automatically fills the frame with no black bars. Reposition it and zoom further if needed.',
      reset:'Recenter', cancel:'Cancel', save:'Save framing',
      tooMany:'You can add a maximum of 10 extra photos.',
      imageError:'We could not prepare one of the photos. Please try another.',
      preparing:'Preparing photos…'
    }
  };
  const tx=()=>V[typeof lang==='string'&&V[lang]?lang:'es'];

  function css(){
    if(document.getElementById('sprint3VideoStyle')) return;
    const style=document.createElement('style');
    style.id='sprint3VideoStyle';
    style.textContent=`
      #videoMemoriesSection .video-extra-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}
      #videoMemoriesSection .video-extra-card{position:relative;border:1px solid var(--line);background:rgba(255,255,255,.025);border-radius:18px;overflow:hidden}
      #videoMemoriesSection .video-extra-photo{aspect-ratio:4/3;background:#080b14;overflow:hidden}
      #videoMemoriesSection .video-extra-photo img{width:100%;height:100%;object-fit:cover;transform-origin:center center;display:block}
      #videoMemoriesSection .video-extra-actions{display:grid;grid-template-columns:44px 44px 1fr;gap:6px;padding:8px}
      #videoMemoriesSection .video-extra-actions button{min-height:44px;border-radius:11px;border:1px solid var(--line);background:rgba(255,255,255,.055);color:#fff;font-weight:800}
      #videoMemoriesSection .video-extra-remove{grid-column:1/-1;color:#ffb9c2!important;background:rgba(255,142,157,.07)!important}
      #videoMemoriesSection .video-extra-upload{position:relative;display:flex;align-items:center;justify-content:center;min-height:92px;border:1px dashed rgba(125,228,211,.28);border-radius:18px;background:rgba(7,10,18,.56);cursor:pointer;text-align:center;padding:16px}
      #videoMemoriesSection .video-extra-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}
      #videoMemoriesSection .video-extra-meta{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:10px}
      .video-frame-modal{position:fixed;inset:0;z-index:1400;display:grid;place-items:center;padding:16px;background:rgba(3,5,12,.78);backdrop-filter:blur(9px)}
      .video-frame-modal.hidden{display:none!important}.video-frame-card{width:min(560px,100%);max-height:calc(100dvh - 28px);overflow:auto;padding:20px;border-radius:25px;background:linear-gradient(180deg,rgba(24,29,47,.995),rgba(13,17,30,.998));border:1px solid rgba(255,255,255,.14)}
      .video-frame-stage{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;border-radius:18px;background:#070a12;border:1px solid rgba(255,255,255,.10);touch-action:none;user-select:none}
      .video-frame-stage img{width:100%;height:100%;object-fit:cover;transform-origin:center center;display:block}
      .video-frame-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
      @media(max-width:430px){#videoMemoriesSection .video-extra-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function ensureSection(){
    if(document.getElementById('videoMemoriesSection')) return;
    css();
    const section=document.createElement('section');
    section.id='videoMemoriesSection';
    section.className='hidden';
    section.innerHTML=`
      <div class="card">
        <div class="review-kicker" id="videoExtraKicker"></div>
        <h2 id="videoExtraTitle" style="margin:8px 0 6px"></h2>
        <p class="small" id="videoExtraDesc" style="font-size:14px"></p>
        <div class="video-extra-meta"><span class="pill" id="videoExtraCount"></span><span class="small" id="videoExtraHelper"></span></div>
        <div class="video-extra-grid" id="videoExtraGrid"></div>
        <label class="video-extra-upload" id="videoExtraUploadLabel">
          <strong id="videoExtraAdd"></strong>
          <input id="videoExtraInput" type="file" accept="image/*" multiple>
        </label>
        <div style="height:12px"></div>
        <button type="button" class="btn primary" id="videoExtraContinue"></button>
        <button type="button" class="btn secondary" id="videoExtraSkip"></button>
        <button type="button" class="btn ghost" id="videoExtraBack"></button>
      </div>
      <div class="video-frame-modal hidden" id="videoFrameModal" role="dialog" aria-modal="true">
        <div class="video-frame-card">
          <div class="section-title" id="videoFrameTitle"></div>
          <div class="small" id="videoFrameHelp"></div>
          <div class="video-frame-stage" id="videoFrameStage" style="margin-top:14px"><img id="videoFrameImg" alt=""></div>
          <label for="videoFrameZoom">Zoom</label>
          <input id="videoFrameZoom" type="range" min="1" max="2.5" step="0.01" value="1">
          <button type="button" class="btn ghost" id="videoFrameReset"></button>
          <div class="video-frame-actions">
            <button type="button" class="btn ghost" id="videoFrameCancel"></button>
            <button type="button" class="btn primary" id="videoFrameSave"></button>
          </div>
        </div>
      </div>`;
    const resume=document.getElementById('paymentResume');
    resume?.parentNode?.insertBefore(section,resume);
    try{if(Array.isArray(sections)&&!sections.includes('#videoMemoriesSection'))sections.push('#videoMemoriesSection')}catch(e){}
    bind();
    render();
  }

  function safeFraming(f){
    return{zoom:Math.max(1,Math.min(2.5,Number(f?.zoom)||1)),x:Math.max(-1,Math.min(1,Number(f?.x)||0)),y:Math.max(-1,Math.min(1,Number(f?.y)||0))};
  }
  function framingStyle(f){
    const p=safeFraming(f);
    return 'scale('+p.zoom+')';
  }
  function framingPosition(f){
    const p=safeFraming(f);
    return (50-p.x*50)+'% '+(50-p.y*50)+'%';
  }
  function readAsDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=reject;r.readAsDataURL(file)})}
  function imageFromUrl(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url})}
  async function compactFile(file){
    const data=await readAsDataUrl(file);
    try{
      const img=await imageFromUrl(data);
      const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
      const scale=Math.min(1,MAX_PREVIEW_EDGE/Math.max(w,h));
      const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));
      const ctx=c.getContext('2d',{alpha:false});if(!ctx)throw new Error('canvas');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);
      return c.toDataURL('image/jpeg',JPEG_QUALITY);
    }catch(e){return data}
  }


  async function autoFramingFor(imageUrl){
    const fallback={zoom:1,x:0,y:0};
    try{
      const im=await imageFromUrl(imageUrl),iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
      const W=72,H=Math.min(108,Math.max(48,Math.round(72*ih/iw)));
      const c=document.createElement('canvas');c.width=W;c.height=H;
      const x=c.getContext('2d',{willReadFrequently:true});if(!x)return fallback;
      x.drawImage(im,0,0,W,H);const d=x.getImageData(0,0,W,H).data;
      const gray=(px,py)=>{const k=(py*W+px)*4;return .2126*d[k]+.7152*d[k+1]+.0722*d[k+2]};
      let sw=0,sx=0,sy=0;
      for(let py=1;py<H-1;py+=2)for(let px=1;px<W-1;px+=2){
        const k=(py*W+px)*4,r=d[k],g=d[k+1],b=d[k+2],sat=Math.max(r,g,b)-Math.min(r,g,b);
        const edge=Math.abs(gray(px+1,py)-gray(px-1,py))+Math.abs(gray(px,py+1)-gray(px,py-1));
        const skin=(r>80&&g>35&&b>20&&r>g&&r>b&&Math.abs(r-g)>10&&sat>15)?38:0;
        const nx=px/(W-1),ny=py/(H-1),center=.45+.55*Math.max(0,1-Math.hypot((nx-.5)*1.25,(ny-.46)*1.05));
        const w=(edge+skin+2)*center;sw+=w;sx+=w*nx;sy+=w*ny;
      }
      const fx=sw?sx/sw:.5,fy=sw?sy/sw:.5;
      return{zoom:1,x:Math.max(-.72,Math.min(.72,(.5-fx)*1.55)),y:Math.max(-.68,Math.min(.68,(.5-fy)*1.45))};
    }catch(_){return fallback}
  }

  let processing=false;
  async function addFiles(files){
    const list=[...files].filter(f=>f.type.startsWith('image/'));
    if(!list.length)return;
    if(state.length+list.length>MAX_EXTRA){alert(tx().tooMany);return}
    processing=true;render();
    try{
      for(const file of list){
        const image=await compactFile(file);
        const framing=await autoFramingFor(image);
        state.push({image,order:state.length,framing});
        render();
      }
    }catch(e){console.error('Sprint3 extra photo',e);alert(tx().imageError)}
    finally{processing=false;render()}
  }

  function move(i,delta){
    const j=i+delta;if(j<0||j>=state.length)return;
    const tmp=state[i];state[i]=state[j];state[j]=tmp;state.forEach((m,n)=>m.order=n);render();
  }
  function remove(i){state.splice(i,1);state.forEach((m,n)=>m.order=n);render()}

  let frameIndex=-1,frameDraft={zoom:1,x:0,y:0},pointer=null,start=null;
  function renderFrame(){
    const img=document.getElementById('videoFrameImg');if(!img)return;
    img.style.objectFit='cover';
    img.style.objectPosition=framingPosition(frameDraft);
    img.style.transform=framingStyle(frameDraft);
    document.getElementById('videoFrameZoom').value=String(frameDraft.zoom);
  }
  function openFrame(i){
    frameIndex=i;frameDraft=safeFraming(state[i]?.framing);
    document.getElementById('videoFrameImg').src=state[i]?.image||'';
    document.getElementById('videoFrameModal').classList.remove('hidden');
    renderFrame();
  }
  function closeFrame(){document.getElementById('videoFrameModal')?.classList.add('hidden');pointer=null;start=null}
  function saveFrame(){if(state[frameIndex])state[frameIndex].framing=safeFraming(frameDraft);closeFrame();render()}

  function render(){
    if(!document.getElementById('videoMemoriesSection'))return;
    const t=tx();
    document.getElementById('videoExtraKicker').textContent=t.kicker;
    document.getElementById('videoExtraTitle').textContent=t.title;
    document.getElementById('videoExtraDesc').textContent=t.desc;
    document.getElementById('videoExtraCount').textContent=t.count(state.length);
    document.getElementById('videoExtraHelper').textContent=t.helper;
    document.getElementById('videoExtraAdd').textContent=processing?t.preparing:t.add;
    document.getElementById('videoExtraInput').disabled=processing||state.length>=MAX_EXTRA;
    document.getElementById('videoExtraUploadLabel').classList.toggle('hidden',state.length>=MAX_EXTRA);
    document.getElementById('videoExtraContinue').textContent=t.continue;
    document.getElementById('videoExtraSkip').textContent=t.skip;
    document.getElementById('videoExtraBack').textContent=typeof tr==='function'?tr('back'):'← Volver';
    document.getElementById('videoExtraContinue').classList.toggle('hidden',state.length===0);
    document.getElementById('videoExtraSkip').classList.toggle('hidden',state.length>0);
    document.getElementById('videoFrameTitle').textContent=t.frameTitle;
    document.getElementById('videoFrameHelp').textContent=t.frameHelp;
    document.getElementById('videoFrameReset').textContent=t.reset;
    document.getElementById('videoFrameCancel').textContent=t.cancel;
    document.getElementById('videoFrameSave').textContent=t.save;
    const grid=document.getElementById('videoExtraGrid');
    grid.innerHTML=state.map((m,i)=>`
      <div class="video-extra-card">
        <div class="video-extra-photo"><img src="${m.image}" alt="" style="object-position:${framingPosition(m.framing)};transform:${framingStyle(m.framing)}"></div>
        <div class="video-extra-actions">
          <button type="button" data-move="-1" data-i="${i}" ${i===0?'disabled':''}>${t.up}</button>
          <button type="button" data-move="1" data-i="${i}" ${i===state.length-1?'disabled':''}>${t.down}</button>
          <button type="button" data-adjust data-i="${i}">${t.adjust}</button>
          <button type="button" class="video-extra-remove" data-remove data-i="${i}">${t.remove}</button>
        </div>
      </div>`).join('');
    grid.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>move(Number(b.dataset.i),Number(b.dataset.move)));
    grid.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>remove(Number(b.dataset.i)));
    grid.querySelectorAll('[data-adjust]').forEach(b=>b.onclick=()=>openFrame(Number(b.dataset.i)));
  }

  function openStep(){
    ensureSection();
    render();
    if(typeof show==='function')show('#videoMemoriesSection');
    else document.getElementById('videoMemoriesSection').classList.remove('hidden');
  }

  async function checkout(trigger){
    if(processing)return;
    if(typeof window.levelYouRunCheckout!=='function')return;
    await window.levelYouRunCheckout(trigger);
  }

  function bind(){
    document.getElementById('videoExtraInput').addEventListener('change',async e=>{await addFiles(e.target.files||[]);e.target.value=''});
    document.getElementById('videoExtraContinue').onclick=e=>checkout(e.currentTarget);
    document.getElementById('videoExtraSkip').onclick=e=>checkout(e.currentTarget);
    document.getElementById('videoExtraBack').onclick=()=>{if(typeof show==='function')show('#previewSection')};
    document.getElementById('videoFrameCancel').onclick=closeFrame;
    document.getElementById('videoFrameSave').onclick=saveFrame;
    document.getElementById('videoFrameReset').onclick=()=>{frameDraft={zoom:1,x:0,y:0};renderFrame()};
    document.getElementById('videoFrameZoom').addEventListener('input',e=>{frameDraft.zoom=Math.max(1,Math.min(2.5,Number(e.target.value)||1));renderFrame()});
    const stage=document.getElementById('videoFrameStage');
    stage.addEventListener('pointerdown',e=>{pointer=e.pointerId;start={x:e.clientX,y:e.clientY,fx:frameDraft.x,fy:frameDraft.y};stage.setPointerCapture?.(e.pointerId)});
    stage.addEventListener('pointermove',e=>{if(pointer!==e.pointerId||!start)return;const r=stage.getBoundingClientRect();frameDraft.x=Math.max(-1,Math.min(1,start.fx+(e.clientX-start.x)/(r.width*.32)));frameDraft.y=Math.max(-1,Math.min(1,start.fy+(e.clientY-start.y)/(r.height*.32)));renderFrame()});
    const end=e=>{if(pointer!==null&&(!e||e.pointerId===pointer)){pointer=null;start=null}};
    stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
    document.getElementById('videoFrameModal').addEventListener('click',e=>{if(e.target===document.getElementById('videoFrameModal'))closeFrame()});
  }

  ensureSection();
  const baseStartBuilderSprint3=typeof startBuilder==='function'?startBuilder:null;
  if(baseStartBuilderSprint3&&!window.__sprint3StartWrapped){
    window.__sprint3StartWrapped=true;
    startBuilder=function(nextMode){
      if(nextMode==='full'){
        state.splice(0,state.length);
        render();
      }
      return baseStartBuilderSprint3(nextMode);
    };
  }
  const pay=document.getElementById('interestBtn');
  if(pay)pay.onclick=()=>{if(typeof mode!=='undefined'&&mode==='full')openStep();else if(typeof startBuilder==='function')startBuilder('full')};
  const baseChange=typeof changeLanguage==='function'?changeLanguage:null;
  if(baseChange&&!window.__sprint3LangWrapped){
    window.__sprint3LangWrapped=true;
    changeLanguage=function(value){baseChange(value);render()};
  }
  window.levelYouOpenVideoMemories=openStep;
  window.levelYouGetVideoMemories=()=>state.map((m,i)=>({image:m.image,order:i,framing:safeFraming(m.framing)}));
})();