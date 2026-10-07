(() => {
  'use strict';

  // Sprint 6.4 feature gate. If the backend secret is missing, checkout continues normally
  // and the recipient falls back to the local reveal without blocking payment or playback.
  window.LEVELYOU_MAGIC_AI = true;
  const MAGIC_API='https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/magic-transform-sprint6';
  let backendReady=null;

  const params = new URLSearchParams(location.search);
  if (params.get('qa') !== 'creator') return;

  const style = document.createElement('style');
  style.textContent = `
    .s64qa{position:fixed;right:10px;bottom:10px;z-index:9999;width:min(340px,calc(100vw - 20px));padding:12px;border-radius:16px;background:rgba(7,9,17,.9);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 18px 44px rgba(0,0,0,.30);font:11px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#dce4f2}
    .s64qa strong{color:#fff}.s64qa .title{font-size:12px;font-weight:900;letter-spacing:.05em;margin-bottom:7px}.s64qa .row{display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-top:1px solid rgba(255,255,255,.06)}.s64qa .ok{color:#8ff0c6}.s64qa .warn{color:#ffd37d}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.className = 's64qa';
  panel.innerHTML = `
    <div class="title">LEVELYOU · S6.4 CREATOR QA</div>
    <div class="row"><span>Fotos</span><strong id="s64photos">—</strong></div>
    <div class="row"><span>Preguntas completas</span><strong id="s64questions">—</strong></div>
    <div class="row"><span>Encuadres</span><strong id="s64frames">—</strong></div>
    <div class="row"><span>Fotos extra vídeo</span><strong id="s64extras">—</strong></div>
    <div class="row"><span>AI transform</span><strong id="s64magic">armed</strong></div>
  `;
  document.body.appendChild(panel);

  const txt = (id, value, ok) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = String(value);
    el.className = ok ? 'ok' : 'warn';
  };

  function refresh(){
    try {
      const photos = Array.isArray(window.fullPhotoData) ? window.fullPhotoData.filter(Boolean).length :
        (Array.isArray(window.memories) ? window.memories.filter(m => m?.image).length : 0);
      const complete = typeof window.levelYouFastCreator?.completeCount === 'function'
        ? window.levelYouFastCreator.completeCount() : 0;
      const framings = typeof window.levelYouFastCreator?.framing === 'function'
        ? window.levelYouFastCreator.framing() : [];
      const validFrames = Array.isArray(framings)
        ? framings.filter(f => f && Number(f.zoom) >= 1 && Number.isFinite(Number(f.x)) && Number.isFinite(Number(f.y))).length : 0;
      const extras = typeof window.levelYouGetVideoMemories === 'function'
        ? (window.levelYouGetVideoMemories() || []).length : 0;

      txt('s64photos', photos + '/5', photos === 5);
      txt('s64questions', complete + '/5', complete === 5);
      txt('s64frames', validFrames + '/5', validFrames === 5);
      txt('s64extras', extras, true);
      const magicLabel=backendReady===true?'backend ready':backendReady===false?'secret pending':(window.LEVELYOU_MAGIC_AI===true?'checking…':'off');
      txt('s64magic', magicLabel, backendReady===true);
    } catch (_) {}
  }

  async function checkBackend(){
    try{
      const r=await fetch(MAGIC_API+'?orderId=',{method:'GET',cache:'no-store'});
      backendReady=r.status!==503;
    }catch(_){backendReady=false}
    refresh();
  }

  refresh();
  checkBackend();
  document.addEventListener('click', () => setTimeout(refresh, 60), true);
  document.addEventListener('input', () => setTimeout(refresh, 60), true);
  document.addEventListener('change', () => setTimeout(refresh, 60), true);
  setInterval(refresh, 1500);
})();