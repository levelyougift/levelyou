// Pure validation helpers for the LEVEL YOU V3 draft. No network or secrets.
export const TOKEN_RE=/^[a-f0-9]{64}$/;
export function isToken(value){return typeof value==='string'&&TOKEN_RE.test(value)}
export function canOpen(row,now=Date.now()){
 if(!row||row.status!=='ready'||row.revoked_at)return false;
 const expiry=Date.parse(row.expires_at);
 return Number.isFinite(expiry)&&expiry>now;
}
export function validateGift(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return false;
 const within=(value,min,max)=>typeof value==='string'&&value.trim().length>=min&&value.length<=max;
 return within(input.recipientName,1,40)&&within(input.memory,1,300)&&
 within(input.detail??'',0,130)&&within(input.dedication,1,400)&&
 ['gracias','aventura','amor'].includes(input.feeling);
}
