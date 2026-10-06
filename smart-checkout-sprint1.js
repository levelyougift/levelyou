(() => {
  const CHECKOUT_SPRINT1_URL = 'https://ezqfwynowrgcvsfykvkm.supabase.co/functions/v1/checkout-sprint1';
  const btn = document.querySelector('#interestBtn');
  if (!btn) return;
  btn.onclick = async () => {
    const originalText = btn.textContent;
    if (mode !== 'full' || memories.length !== 5 || game.length !== 5) {
      alert(lang === 'ca' ? 'Completa primer els 5 records.' : lang === 'en' ? 'Complete the 5 memories first.' : 'Completa primero los 5 recuerdos.');
      return;
    }
    const identity = validIdentity();
    if (!identity) return;
    btn.disabled = true;
    btn.textContent = lang === 'ca' ? 'Preparant el teu LevelYou…' : lang === 'en' ? 'Preparing your LevelYou…' : 'Preparando tu LevelYou…';
    try {
      const blobs = await Promise.all(memories.map(m => dataUrlToBlob(m.image)));
      const contentTypes = blobs.map(b => b.type === 'image/jpg' ? 'image/jpeg' : (b.type || 'image/jpeg'));
      const gameData = {
        memories: memories.map(m => ({context: clean(m.context)})),
        questions: game.map(item => ({question:item.q, answers:item.a, correct:item.correct})),
        dedication: clean(document.querySelector('#dedication')?.value || ''),
        smart_creator_version: 'sprint1-v1.2',
        question_tone: typeof tone === 'function' ? tone() : 'fun'
      };
      const orderResponse = await fetch(CREATE_ORDER_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({personName:identity.name,age:identity.age ? Number(identity.age) : null,language:lang,gameData,contentTypes})
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.orderId || !Array.isArray(orderData.uploads) || orderData.uploads.length !== 5) throw new Error(orderData.error || 'Could not create order');
      await uploadPhotosReliably(orderData.uploads, blobs);
      btn.textContent = lang === 'ca' ? 'Obrint pagament…' : lang === 'en' ? 'Opening payment…' : 'Abriendo pago…';
      const checkoutResponse = await fetch(CHECKOUT_SPRINT1_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:orderData.orderId})});
      const checkoutData = await checkoutResponse.json();
      if (!checkoutResponse.ok || !checkoutData.url) throw new Error(checkoutData.error || 'Checkout error');
      location.href = checkoutData.url;
    } catch (error) {
      console.error('Sprint1 checkout', error);
      alert(lang === 'ca' ? 'No hem pogut preparar el teu LevelYou. Torna-ho a provar.' : lang === 'en' ? 'We could not prepare your LevelYou. Please try again.' : 'No hemos podido preparar tu LevelYou. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  };
})();