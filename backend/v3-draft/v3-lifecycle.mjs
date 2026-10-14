// LEVEL YOU V3: pure gift lifecycle rules, no credentials, network or payment actions.
export const STATES=Object.freeze(['draft','ready','revoked']);
export function canTransition(from,to,{paymentVerified=false,ownerAuthorized=false}={}){
 if(from==='draft'&&to==='ready')return paymentVerified===true;
 if((from==='draft'||from==='ready')&&to==='revoked')return ownerAuthorized===true;
 return false;
}
export function canView(gift,now=Date.now()){
 if(!gift||gift.status!=='ready'||gift.revoked_at)return false;
 const expiry=Date.parse(gift.expires_at);
 return Number.isFinite(expiry)&&expiry>now;
}
export function retentionDue(gift,now=Date.now()){
 if(!gift)return false;
 const expiry=Date.parse(gift.expires_at);
 return Number.isFinite(expiry)&&expiry<=now;
}
