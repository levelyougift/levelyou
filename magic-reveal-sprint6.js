(() => {
  'use strict';

  const COPY = {
    es: {
      tagline: '🎁 5 recuerdos. 5 sorpresas. 1 regalo.',
      hero: 'Convierte 5 fotos en una felicitación premium que se juega y cobra vida.',
      sub: 'Para cumpleaños, Navidad y momentos especiales: 5 preguntas, revelaciones visuales y un vídeo final para guardar y compartir. En minutos, sin instalar nada.',
      c1: '✓ 5 fotos + 5 preguntas personalizadas',
      c2: '✓ Cada recuerdo se revela con una sorpresa visual',
      c3: '✓ Vídeo final para guardar y compartir',
      c4: '✓ Enlace privado para enviar por WhatsApp',
      chip: 'MAGIC REVEAL'
    },
    ca: {
      tagline: '🎁 5 records. 5 sorpreses. 1 regal.',
      hero: 'Converteix 5 fotos en una felicitació premium que es juga i cobra vida.',
      sub: 'Per aniversaris, Nadal i moments especials: 5 preguntes, revelacions visuals i un vídeo final per guardar i compartir. En minuts, sense instal·lar res.',
      c1: '✓ 5 fotos + 5 preguntes personalitzades',
      c2: '✓ Cada record es revela amb una sorpresa visual',
      c3: '✓ Vídeo final per guardar i compartir',
      c4: '✓ Enllaç privat per enviar per WhatsApp',
      chip: 'MAGIC REVEAL'
    },
    en: {
      tagline: '🎁 5 memories. 5 surprises. 1 gift.',
      hero: 'Turn 5 photos into a premium greeting that you can play — and watch come alive.',
      sub: 'For birthdays, Christmas and special moments: 5 questions, visual reveals and a final video to keep and share. Ready in minutes. No app needed.',
      c1: '✓ 5 photos + 5 personalized questions',
      c2: '✓ Every memory unlocks with a visual surprise',
      c3: '✓ Final video to save and share',
      c4: '✓ Private link to send on WhatsApp',
      chip: 'MAGIC REVEAL'
    }
  };

  const EFFECTS = ['timewarp','focus','cinema','art','glow','finale'];
  const EFFECT_CLASSES = EFFECTS.map(x => 'magic-' + x);

  function currentLang() {
    try { return (typeof lang === 'string' && COPY[lang]) ? lang : 'es'; }
    catch (_) { return 'es'; }
  }

  function addStyles() {
    if (document.getElementById('sprint6MagicStyles')) return;
    const style = document.createElement('style');
    style.id = 'sprint6MagicStyles';
    style.textContent = `
      .magic-stage{position:relative;overflow:hidden;background:#070a12;isolation:isolate}
      .magic-stage #gameImg{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;will-change:transform,filter,opacity;transition:filter .9s cubic-bezier(.2,.7,.2,1),transform 1.15s cubic-bezier(.2,.7,.2,1),opacity .55s ease}
      .magic-stage .magic-chip{position:absolute;left:12px;top:12px;z-index:5;padding:6px 9px;border-radius:999px;background:rgba(6,9,16,.66);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:9px;font-weight:900;letter-spacing:.12em;color:#effffb;opacity:.9;pointer-events:none}
      .magic-stage .magic-sheen{position:absolute;inset:-20%;z-index:3;pointer-events:none;opacity:0;background:linear-gradient(115deg,transparent 37%,rgba(255,255,255,.20) 47%,rgba(125,228,211,.24) 52%,transparent 63%);transform:translateX(-68%) rotate(2deg)}
      .magic-stage .magic-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(circle at 50% 45%,transparent 42%,rgba(3,5,12,.30) 100%);opacity:.7;transition:opacity .9s ease}.magic-stage .magic-art-overlay{position:absolute;inset:0;z-index:1;width:100%;height:100%;object-fit:cover;opacity:0;pointer-events:none;transform:scale(1.04);transition:opacity .2s ease}.magic-stage.magic-armed:not(.magic-revealed).magic-art #gameImg{filter:saturate(.72) brightness(.82) contrast(.98);transform:scale(1.03)}.magic-stage.magic-revealed.magic-art #gameImg{filter:saturate(.94) brightness(.96) contrast(1.02);transform:scale(1.055)}.magic-stage.magic-revealed.magic-art .magic-art-overlay.ready{animation:magicArtReveal 1.55s cubic-bezier(.18,.8,.18,1) both}
      .magic-stage.magic-armed:not(.magic-revealed).magic-timewarp #gameImg{filter:grayscale(1) contrast(.92) brightness(.84);transform:scale(1.025)}
      .magic-stage.magic-revealed.magic-timewarp #gameImg{filter:grayscale(0) contrast(1.02) brightness(1.03) saturate(1.08);transform:scale(1.075)}
      .magic-stage.magic-armed:not(.magic-revealed).magic-focus #gameImg{filter:blur(8px) saturate(.72) brightness(.82);transform:scale(1.095)}
      .magic-stage.magic-revealed.magic-focus #gameImg{filter:blur(0) saturate(1.06) brightness(1.02);transform:scale(1.035)}
      .magic-stage.magic-armed:not(.magic-revealed).magic-cinema #gameImg{filter:saturate(.84) contrast(.98) brightness(.84);transform:scale(1.035) translateX(-1.2%)}
      .magic-stage.magic-revealed.magic-cinema #gameImg{filter:saturate(1.08) contrast(1.03) brightness(1.02);transform:scale(1.105) translateX(1.1%);transition-duration:2s}
      .magic-stage.magic-armed:not(.magic-revealed).magic-glow #gameImg{filter:saturate(.78) brightness(.80) contrast(.96);transform:scale(1.03)}
      .magic-stage.magic-revealed.magic-glow #gameImg{filter:saturate(1.14) brightness(1.04) contrast(1.02);transform:scale(1.07)}
      .magic-stage.magic-revealed.magic-glow .magic-sheen,.magic-stage.magic-revealed.magic-finale .magic-sheen{animation:magicSheen 1.05s ease-out both}
      .magic-stage.magic-armed:not(.magic-revealed).magic-finale #gameImg{filter:saturate(.72) brightness(.74) contrast(.94);transform:scale(1.02)}
      .magic-stage.magic-revealed.magic-finale #gameImg{animation:magicFinale 1.25s cubic-bezier(.18,.8,.18,1) both;filter:saturate(1.13) brightness(1.04) contrast(1.03)}
      .magic-stage.magic-revealed .magic-vignette{opacity:.28}
      .magic-burst{position:absolute;z-index:8;left:50%;top:50%;width:8px;height:14px;border-radius:3px;pointer-events:none;animation:magicBurst 1050ms cubic-bezier(.15,.8,.2,1) forwards}
      @keyframes magicSheen{0%{opacity:0;transform:translateX(-72%) rotate(2deg)}18%{opacity:1}100%{opacity:0;transform:translateX(72%) rotate(2deg)}}
      @keyframes magicFinale{0%{transform:scale(1.02);filter:saturate(.75) brightness(.76)}45%{transform:scale(1.115);filter:saturate(1.18) brightness(1.07)}100%{transform:scale(1.07);filter:saturate(1.10) brightness(1.02)}}@keyframes magicArtReveal{0%{opacity:0;transform:scale(1.085);filter:blur(5px)}48%{opacity:1;transform:scale(1.02);filter:blur(0)}100%{opacity:.94;transform:scale(1.045);filter:blur(0)}}
      @keyframes magicBurst{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) scale(.7)}12%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(calc(var(--r) + 220deg)) scale(1)}}
      @media(prefers-reduced-motion:reduce){
        .magic-stage #gameImg{transition-duration:.01ms!important;animation:none!important}
        .magic-stage .magic-sheen,.magic-burst{display:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureStage() {
    const img = document.getElementById('gameImg');
    if (!img) return null;
    if (img.parentElement && img.parentElement.classList.contains('magic-stage')) return img.parentElement;

    const stage = document.createElement('div');
    stage.className = 'magic-stage';
    img.parentNode.insertBefore(stage, img);
    stage.appendChild(img);

    const art = document.createElement('img');
    art.className = 'magic-art-overlay';
    art.alt = '';
    art.setAttribute('aria-hidden','true');
    stage.appendChild(art);

    const chip = document.createElement('div');
    chip.className = 'magic-chip';
    stage.appendChild(chip);

    const vignette = document.createElement('div');
    vignette.className = 'magic-vignette';
    stage.appendChild(vignette);

    const sheen = document.createElement('div');
    sheen.className = 'magic-sheen';
    stage.appendChild(sheen);

    return stage;
  }

  function effectFor(index) {
    let ctx = '';
    try { ctx = String(memories?.[index]?.context || '').toLowerCase(); } catch (_) {}

    if (index === 4) return 'finale';
    if (index === 2) return 'art';
    if (/niñ|infan|child|beb[eé]|baby|antigua|antic|old photo|blanco y negro|black and white/.test(ctx)) return 'timewarp';
    if (/viaj|trip|vacac|holiday|playa|platja|beach|cala|par[ií]s|roma|london|londres|mallorca|menorca|ibiza/.test(ctx)) return 'cinema';
    if (/fiesta|party|festival|concierto|concert|risa|funny|divertid|amics|amig|friends/.test(ctx)) return 'glow';
    return EFFECTS[Math.max(0, Math.min(4, Number(index) || 0))];
  }

  const artCache = new Map();
  const telemetry = { artBuildMs: [], artFailures: 0, reveals: 0 };

  function clamp255(v){ return Math.max(0, Math.min(255, v)); }

  function buildArtVariant(src) {
    if (!src) return Promise.reject(new Error('NO_IMAGE'));
    if (artCache.has(src)) return Promise.resolve(artCache.get(src));

    const started = performance.now();
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => {
        try {
          const maxEdge = 920;
          const w0 = im.naturalWidth || im.width || 1;
          const h0 = im.naturalHeight || im.height || 1;
          const scale = Math.min(1, maxEdge / Math.max(w0, h0));
          const w = Math.max(1, Math.round(w0 * scale));
          const h = Math.max(1, Math.round(h0 * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d', {alpha:false, willReadFrequently:true});
          if (!ctx) throw new Error('NO_CANVAS');
          ctx.drawImage(im, 0, 0, w, h);

          const data = ctx.getImageData(0, 0, w, h);
          const px = data.data;
          const step = 51; // 6 tonal bands: premium posterized illustration look.
          for (let i = 0; i < px.length; i += 4) {
            let r = px[i], g = px[i+1], b = px[i+2];
            const l = 0.2126*r + 0.7152*g + 0.0722*b;

            // Contrast + controlled saturation.
            r = (r - 128) * 1.18 + 128;
            g = (g - 128) * 1.18 + 128;
            b = (b - 128) * 1.18 + 128;
            const sat = 1.18;
            r = l + (r - l) * sat;
            g = l + (g - l) * sat;
            b = l + (b - l) * sat;

            // Posterize, then add a subtle warm/cool editorial split.
            r = Math.round(clamp255(r) / step) * step;
            g = Math.round(clamp255(g) / step) * step;
            b = Math.round(clamp255(b) / step) * step;
            if (l > 148) { r += 8; g += 3; }
            else { b += 9; g += 2; }

            px[i]   = clamp255(r);
            px[i+1] = clamp255(g);
            px[i+2] = clamp255(b);
          }
          ctx.putImageData(data, 0, 0);

          // Editorial line/detail pass using the original image.
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = .16;
          ctx.filter = 'grayscale(1) contrast(2.2)';
          ctx.drawImage(im, 0, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.filter = 'none';

          const out = canvas.toDataURL('image/jpeg', .84);
          artCache.set(src, out);
          telemetry.artBuildMs.push(Math.round(performance.now() - started));
          resolve(out);
        } catch (err) {
          telemetry.artFailures++;
          reject(err);
        }
      };
      im.onerror = () => { telemetry.artFailures++; reject(new Error('IMAGE_LOAD')); };
      im.src = src;
    });
  }

  async function prepareArt(stage) {
    const overlay = stage?.querySelector('.magic-art-overlay');
    const img = document.getElementById('gameImg');
    if (!overlay || !img || stage?.dataset.magicEffect !== 'art') {
      if (overlay) { overlay.classList.remove('ready'); overlay.removeAttribute('src'); }
      return;
    }
    const src = img.currentSrc || img.src;
    if (!src) return;
    const token = src + '|' + String(stage.dataset.magicIndex || '');
    stage.dataset.artToken = token;
    overlay.classList.remove('ready');
    try {
      const transformed = await buildArtVariant(src);
      if (stage.dataset.artToken !== token || stage.dataset.magicEffect !== 'art') return;
      overlay.src = transformed;
      overlay.classList.add('ready');
    } catch (_) {
      // Silent fallback: the reveal still works with the original image.
      overlay.classList.remove('ready');
    }
  }

  function setChip(stage) {
    const chip = stage?.querySelector('.magic-chip');
    if (chip) chip.textContent = COPY[currentLang()].chip;
  }

  function armCurrent() {
    const stage = ensureStage();
    if (!stage) return;
    setChip(stage);

    let idx = 0;
    let answered = false;
    try {
      idx = Number(currentIndex) || 0;
      answered = game?.[idx]?.selected !== null && game?.[idx]?.selected !== undefined;
    } catch (_) {}

    stage.classList.remove('magic-revealed', ...EFFECT_CLASSES);
    const effect = effectFor(idx);
    stage.classList.add('magic-armed', 'magic-' + effect);
    stage.dataset.magicEffect = effect;
    stage.dataset.magicIndex = String(idx);
    prepareArt(stage);

    if (answered) stage.classList.add('magic-revealed');
  }

  function burst(stage) {
    if (!stage || stage.dataset.magicBurst === '1') return;
    stage.dataset.magicBurst = '1';
    const hues = ['#7de4d3','#9eafff','#f3d7a1','#ffffff','#ff9fb1'];
    for (let i = 0; i < 24; i++) {
      const el = document.createElement('i');
      el.className = 'magic-burst';
      const angle = (Math.PI * 2 * i / 24) + (Math.random() * .16);
      const distance = 72 + Math.random() * 120;
      el.style.setProperty('--x', (Math.cos(angle) * distance).toFixed(1) + 'px');
      el.style.setProperty('--y', (Math.sin(angle) * distance).toFixed(1) + 'px');
      el.style.setProperty('--r', Math.round(Math.random() * 180) + 'deg');
      el.style.background = hues[i % hues.length];
      el.style.animationDelay = Math.round(Math.random() * 80) + 'ms';
      stage.appendChild(el);
      setTimeout(() => el.remove(), 1250);
    }
    setTimeout(() => { stage.dataset.magicBurst = '0'; }, 1300);
  }

  function revealCurrent() {
    const stage = ensureStage();
    if (!stage || stage.classList.contains('magic-revealed')) return;
    stage.classList.add('magic-revealed');
    telemetry.reveals++;
    if (stage.dataset.magicEffect === 'finale') burst(stage);
  }

  function applyMarketingCopy() {
    const c = COPY[currentLang()];
    const pairs = [
      ['tagline', c.tagline],
      ['hero', c.hero],
      ['sub', c.sub],
      ['c1', c.c1],
      ['c2', c.c2],
      ['c3', c.c3],
      ['c4', c.c4]
    ];
    pairs.forEach(([key,value]) => {
      const el = document.querySelector('[data-i18n="' + key + '"]');
      if (el) el.textContent = value;
    });
    setChip(ensureStage());
  }

  function install() {
    addStyles();
    ensureStage();
    applyMarketingCopy();
    armCurrent();

    ['a1','a2','a3'].forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => setTimeout(revealCurrent, 34));
    });

    ['prevQ','nextQ'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => setTimeout(armCurrent, 30));
    });

    const img = document.getElementById('gameImg');
    if (img) {
      const observer = new MutationObserver(() => setTimeout(armCurrent, 0));
      observer.observe(img, {attributes:true, attributeFilter:['src']});
    }

    const qcounter = document.getElementById('qcounter');
    if (qcounter) {
      const observer = new MutationObserver(() => setTimeout(armCurrent, 0));
      observer.observe(qcounter, {childList:true, subtree:true, characterData:true});
    }

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) languageSelect.addEventListener('change', () => setTimeout(applyMarketingCopy, 0));

    window.levelYouSprint6 = {
      version: '6.0-magic-reveal',
      zeroVariableCostEffects: true,
      runtimeNetworkCalls: 0,
      effects: [...EFFECTS],
      localArtTransformation: true,
      telemetry,
      rearm: armCurrent,
      reveal: revealCurrent
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();