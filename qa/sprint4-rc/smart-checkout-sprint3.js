(() => {
  const CREATE_ORDER_SPRINT3_URL = 'https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/super-api-sprint3';
  const CHECKOUT_SPRINT3_URL = 'https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/checkout-sprint3-preview';
  const MAX_UPLOAD_EDGE = 1920;
  const JPEG_QUALITY = 0.88;
  const MAX_FALLBACK_BYTES = 12 * 1024 * 1024;
  let checkoutRequestId = null;

  function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 3) | 8;
      return v.toString(16);
    });
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('PHOTO_DECODE'));
      image.src = dataUrl;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PHOTO_ENCODE')), type, quality);
    });
  }

  async function prepareUploadBlob(dataUrl) {
    try {
      const image = await loadImage(dataUrl);
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      if (!width || !height) throw new Error('PHOTO_DECODE');

      const scale = Math.min(1, MAX_UPLOAD_EDGE / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('PHOTO_ENCODE');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      return await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
    } catch (error) {
      console.warn('Photo optimization fallback', error);
      const original = await dataUrlToBlob(dataUrl);
      if (original.size > MAX_FALLBACK_BYTES) throw new Error('PHOTO_TOO_LARGE');
      return original;
    }
  }

  async function postJson(url, body, timeoutMs = 25000, retries = 1) {
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(body),
          signal: controller.signal
        });
        const data = await response.json().catch(() => ({}));
        const retryable = response.status === 429 || response.status >= 500;
        if (response.ok || !retryable || attempt === retries) return { response, data };
        lastError = new Error(data.error || 'Temporary server error');
      } catch (error) {
        lastError = error;
        if (attempt === retries) throw error;
      } finally {
        clearTimeout(timer);
      }
      await new Promise(resolve => setTimeout(resolve, 700 * (attempt + 1)));
    }
    throw lastError || new Error('Request failed');
  }

  function setBusy(busy) {
    ['#interestBtn','#videoExtraContinue','#videoExtraSkip','#videoExtraBack'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.disabled = busy;
    });
  }

  function textFor(stage) {
    const copy = {
      optimize: {es:'Optimizando las fotos…',ca:'Optimitzant les fotos…',en:'Optimizing photos…'},
      prepare: {es:'Preparando tu LevelYou…',ca:'Preparant el teu LevelYou…',en:'Preparing your LevelYou…'},
      upload: {es:'Subiendo los recuerdos…',ca:'Pujant els records…',en:'Uploading memories…'},
      payment: {es:'Abriendo pago…',ca:'Obrint pagament…',en:'Opening payment…'}
    };
    return copy[stage]?.[lang] || copy[stage]?.es || '';
  }

  window.levelYouRunCheckout = async (triggerButton) => {
    const btn = triggerButton || document.querySelector('#interestBtn');
    const originalText = btn?.textContent || '';

    if (mode !== 'full' || memories.length !== 5 || game.length !== 5) {
      alert(lang === 'ca' ? 'Completa primer els 5 records.' : lang === 'en' ? 'Complete the 5 memories first.' : 'Completa primero los 5 recuerdos.');
      return;
    }

    const identity = validIdentity();
    if (!identity) return;

    const extra = typeof window.levelYouGetVideoMemories === 'function'
      ? window.levelYouGetVideoMemories()
      : [];

    if (!Array.isArray(extra) || extra.length > 10) {
      alert(lang === 'ca' ? 'Pots afegir com a màxim 10 fotos addicionals.' : lang === 'en' ? 'You can add a maximum of 10 extra photos.' : 'Puedes añadir como máximo 10 fotos adicionales.');
      return;
    }

    checkoutRequestId = checkoutRequestId || uuid();
    setBusy(true);

    try {
      if (btn) btn.textContent = textFor('optimize');

      const gameBlobs = [];
      for (const memory of memories) gameBlobs.push(await prepareUploadBlob(memory.image));

      const videoBlobs = [];
      for (const memory of extra) videoBlobs.push(await prepareUploadBlob(memory.image));

      const blobs = [...gameBlobs, ...videoBlobs];
      const contentTypes = blobs.map(blob => blob.type === 'image/jpg' ? 'image/jpeg' : (blob.type || 'image/jpeg'));

      const gameData = {
        memories: memories.map(m => ({
          context: clean(m.context),
          framing: {
            zoom:Number(m.framing?.zoom)||1,
            x:Number(m.framing?.x)||0,
            y:Number(m.framing?.y)||0
          }
        })),
        questions: game.map(item => ({question:item.q, answers:item.a, correct:item.correct})),
        video_memories: extra.map((m,index) => ({
          order:index,
          framing:{
            zoom:Number(m.framing?.zoom)||1,
            x:Number(m.framing?.x)||0,
            y:Number(m.framing?.y)||0
          }
        })),
        dedication: clean(document.querySelector('#dedication')?.value || ''),
        smart_creator_version: 'sprint3-video-memories-v3.0',
        question_tone: typeof window.levelYouQuestionTone === 'function' ? window.levelYouQuestionTone() : 'fun'
      };

      if (btn) btn.textContent = textFor('prepare');

      const orderResult = await postJson(CREATE_ORDER_SPRINT3_URL, {
        requestId: checkoutRequestId,
        personName: identity.name,
        age: identity.age ? Number(identity.age) : null,
        language: lang,
        gameData,
        contentTypes
      }, 30000, 1);

      const orderResponse = orderResult.response;
      const orderData = orderResult.data;
      if (!orderResponse.ok || !orderData.orderId || !Array.isArray(orderData.uploads) || orderData.uploads.length !== blobs.length) {
        throw new Error(orderData.error || 'Could not create order');
      }

      if (btn) btn.textContent = textFor('upload');
      await uploadPhotosReliably(orderData.uploads, blobs);

      if (btn) btn.textContent = textFor('payment');
      const checkoutResult = await postJson(CHECKOUT_SPRINT3_URL, {orderId:orderData.orderId}, 25000, 1);
      const checkoutResponse = checkoutResult.response;
      const checkoutData = checkoutResult.data;

      if (!checkoutResponse.ok || !checkoutData.url) throw new Error(checkoutData.error || 'Checkout error');
      location.href = checkoutData.url;
    } catch (error) {
      console.error('Sprint3 checkout', error);
      const photoTooLarge = error?.message === 'PHOTO_TOO_LARGE';
      alert(
        photoTooLarge
          ? (lang === 'ca' ? 'Una de les fotos és massa gran. Prova amb una altra foto.' : lang === 'en' ? 'One of the photos is too large. Please choose another photo.' : 'Una de las fotos es demasiado grande. Prueba con otra foto.')
          : (lang === 'ca' ? 'No hem pogut preparar el teu LevelYou. Torna-ho a provar.' : lang === 'en' ? 'We could not prepare your LevelYou. Please try again.' : 'No hemos podido preparar tu LevelYou. Inténtalo de nuevo.')
      );
      if (btn) btn.textContent = originalText;
      setBusy(false);
    }
  };
})();