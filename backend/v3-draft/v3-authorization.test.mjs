import test from 'node:test';import assert from 'node:assert/strict';import {authorizeAction,safePublicGift} from './v3-authorization.mjs';
const gift={status:'ready',revoked_at:null,expires_at:'2099-01-01T00:00:00Z',recipient_name:'Ana',memory_text:'Viaje',detail_text:'Sol',dedication_text:'Gracias',feeling:'gracias',owner_secret_hash:'secret',access_token_hash:'hash'};
test('owner and recipient roles cannot be confused',()=>{
 assert.equal(authorizeAction({action:'edit',recipientTokenValid:true,gift}),false);
 assert.equal(authorizeAction({action:'edit',ownerVerified:true,gift}),true);
 assert.equal(authorizeAction({action:'revoke',ownerVerified:true,gift}),true);
 assert.equal(authorizeAction({action:'view',ownerVerified:true,gift}),false);
 assert.equal(authorizeAction({action:'view',recipientTokenValid:true,gift}),true);
});
test('activation requires verified payment and draft state',()=>{
 assert.equal(authorizeAction({action:'activate',ownerVerified:true,gift}),false);
 assert.equal(authorizeAction({action:'activate',paymentVerified:true,gift:{status:'draft'}}),true);
 assert.equal(authorizeAction({action:'activate',paymentVerified:false,gift:{status:'draft'}}),false);
});
test('revoked or expired gifts cannot be viewed',()=>{
 assert.equal(authorizeAction({action:'view',recipientTokenValid:true,gift:{...gift,status:'revoked'}}),false);
 assert.equal(authorizeAction({action:'view',recipientTokenValid:true,gift:{...gift,expires_at:'2020-01-01T00:00:00Z'}}),false);
});
test('public response does not leak secrets',()=>{
 const x=safePublicGift(gift);
 assert.equal(x.recipientName,'Ana');assert.equal('owner_secret_hash' in x,false);assert.equal('access_token_hash' in x,false);
});
