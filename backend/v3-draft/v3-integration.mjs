import {randomBytes,createHash} from 'node:crypto';
import {validateGift} from './v3-validation.mjs';
import {canTransition,canView} from './v3-lifecycle.mjs';
import {safePublicGift} from './v3-authorization.mjs';
// In-memory integration harness ONLY: not a deployed service, no persistence or payment.
const digest=x=>createHash('sha256').update(x).digest('hex');
const fresh=()=>randomBytes(32).toString('hex');
export class GiftSimulation{
 #rows=new Map();
 create(gift,now=Date.now()){
  if(!validateGift(gift))throw Error('invalid_gift');
  const accessToken=fresh(),ownerSecret=fresh(),id=fresh();
  this.#rows.set(id,{id,status:'draft',access_token_hash:digest(accessToken),owner_secret_hash:digest(ownerSecret),recipient_name:gift.recipientName.trim(),memory_text:gift.memory.trim(),detail_text:(gift.detail||'').trim(),dedication_text:gift.dedication.trim(),feeling:gift.feeling,expires_at:new Date(now+30*86400000).toISOString(),revoked_at:null});
  return {id,accessToken,ownerSecret};
 }
 #findByToken(token,field){return [...this.#rows.values()].find(row=>row[field]===digest(token))}
 activate(id,{paymentVerified=false}={}){const row=this.#rows.get(id);if(!row||!canTransition(row.status,'ready',{paymentVerified}))return false;row.status='ready';return true}
 open(accessToken,now=Date.now()){const row=this.#findByToken(accessToken,'access_token_hash');return canView(row,now)?safePublicGift(row):null}
 revoke(ownerSecret,now=Date.now()){const row=this.#findByToken(ownerSecret,'owner_secret_hash');if(!row||!canTransition(row.status,'revoked',{ownerAuthorized:true}))return false;row.status='revoked';row.revoked_at=new Date(now).toISOString();return true}
}
