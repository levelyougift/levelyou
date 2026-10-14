// LEVEL YOU V3 — pure authorization decisions, not a payment or auth provider.
export function authorizeAction({action,ownerVerified=false,paymentVerified=false,recipientTokenValid=false,gift}={}){
 if(action==='edit'||action==='revoke')return ownerVerified===true&&gift?.status!=='revoked';
 if(action==='activate')return paymentVerified===true&&gift?.status==='draft';
 if(action==='view')return recipientTokenValid===true&&gift?.status==='ready'&&!gift?.revoked_at&&Number.isFinite(Date.parse(gift?.expires_at))&&Date.parse(gift.expires_at)>Date.now();
 return false;
}
export function safePublicGift(gift){
 if(!gift)return null;
 return {recipientName:gift.recipient_name??'',memory:gift.memory_text??'',detail:gift.detail_text??'',dedication:gift.dedication_text??'',feeling:gift.feeling??''};
}
