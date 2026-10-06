(() => {
  const CHECKOUT_SPRINT1_URL = 'https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/checkout-sprint1';
  const MAX_UPLOAD_EDGE = 1920;
  const JPEG_QUALITY = 0.88;
  const MAX_FALLBACK_BYTES = 12 * 1024 * 1024;
  let checkoutRequestId = null;

  const btn = document.querySelector('#interestBtn');
  if (!btn) return;

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

  btn.onclick = async () => {
    const originalText = btn.textContent;

    if (mode !== 'full' || memories.length !== 5 || game.length !== 5) {
      alert(lang === 'ca' ? 'Completa primer els 5 records.' : lang === 'en' ? 'Complete the 5 memories first.' : 'Completa primero los 5 recuerdos.');
      return;
    }

    const identity = validIdentity();
    if (!identity) return;

    checkoutRequestId = checkoutRequestId || uuid();
    btn.disabled = true;

    try {
      btn.textContent = lang === 'ca' ? 'Optimitzant les fotos…' : lang === 'en' ? 'Optimizing photos…' : 'Optimizando las fotos…';

      // Sequential processing reduces peak memory usage on iPhone/iPad.
      const blobs = [];
      for (const memory of memories) blobs.push(await prepareUploadBlob(memory.image));

      const contentTypes = blobs.map(blob => {
        if (blob.type === 'image/jpg') return 'image/jpeg';
        return blob.type || 'image/jpeg';
      });

      const gameData = {
        memories: memories.map(m => ({context: clean(m.context)})),
        questions: game.map(item => ({question:item.q, answers:item.a, correct:item.correct})),
        dedication: clean(document.querySelector('#dedication')?.value || ''),
        smart_creator_version: 'sprint2-fast-v2.4',
        question_tone: typeof window.levelYouQuestionTone === 'function' ? window.levelYouQuestionTone() : 'fun'
      };

      btn.textContent = lang === 'ca' ? 'Preparant el teu LevelYou…' : lang === 'en' ? 'Preparing your LevelYou…' : 'Preparando tu LevelYou…';

      const orderResult = await postJson(CREATE_ORDER_URL, {
        requestId: checkoutRequestId,
        personName: identity.name,
        age: identity.age ? Number(identity.age) : null,
        language: lang,
        gameData,
        contentTypes
      }, 25000, 1);

      const orderResponse = orderResult.response;
      const orderData = orderResult.data;
      if (!orderResponse.ok || !orderData.orderId || !Array.isArray(orderData.uploads) || orderData.uploads.length !== 5) {
        throw new Error(orderData.error || 'Could not create order');
      }

      btn.textContent = lang === 'ca' ? 'Pujant els records…' : lang === 'en' ? 'Uploading memories…' : 'Subiendo los recuerdos…';
      await uploadPhotosReliably(orderData.uploads, blobs);

      btn.textContent = lang === 'ca' ? 'Obrint pagament…' : lang === 'en' ? 'Opening payment…' : 'Abriendo pago…';

      const checkoutResult = await postJson(CHECKOUT_SPRINT1_URL, {orderId:orderData.orderId}, 25000, 1);
      const checkoutResponse = checkoutResult.response;
      const checkoutData = checkoutResult.data;

      if (!checkoutResponse.ok || !checkoutData.url) throw new Error(checkoutData.error || 'Checkout error');

      location.href = checkoutData.url;
    } catch (error) {
      console.error('Sprint2 checkout', error);

      const photoTooLarge = error?.message === 'PHOTO_TOO_LARGE';
      alert(
        photoTooLarge
          ? (lang === 'ca' ? 'Una de les fotos és massa gran. Prova amb una altra foto.' : lang === 'en' ? 'One of the photos is too large. Please choose another photo.' : 'Una de las fotos es demasiado grande. Prueba con otra foto.')
          : (lang === 'ca' ? 'No hem pogut preparar el teu LevelYou. Torna-ho a provar.' : lang === 'en' ? 'We could not prepare your LevelYou. Please try again.' : 'No hemos podido preparar tu LevelYou. Inténtalo de nuevo.')
      );

      btn.disabled = false;
      btn.textContent = originalText;
    }
  };
})();