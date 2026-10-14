import test from 'node:test';
import assert from 'node:assert/strict';
import {isToken,canOpen,validateGift} from './v3-validation.mjs';
const now=Date.parse('2026-10-14T12:00:00Z');
const row={status:'ready',revoked_at:null,expires_at:'2026-10-15T12:00:00Z'};
test('token format rejects short, invalid, uppercase and empty',()=>{
 assert.equal(isToken('a'.repeat(64)),true);
 for(const value of ['a'.repeat(63),'A'.repeat(64),'z'.repeat(64),'',null])assert.equal(isToken(value),false);
});
test('gift availability requires ready, not revoked, future expiry',()=>{
 assert.equal(canOpen(row,now),true);
 assert.equal(canOpen({...row,status:'draft'},now),false);
 assert.equal(canOpen({...row,status:'revoked'},now),false);
 assert.equal(canOpen({...row,revoked_at:'2026-10-14T11:00:00Z'},now),false);
 assert.equal(canOpen({...row,expires_at:'2026-10-14T12:00:00Z'},now),false);
 assert.equal(canOpen({...row,expires_at:'bad'},now),false);
 assert.equal(canOpen(null,now),false);
});
test('gift input validates required fields and length',()=>{
 const g={recipientName:'Cris',memory:'Una tarde inolvidable',detail:'',dedication:'Gracias por todo',feeling:'gracias'};
 assert.equal(validateGift(g),true);
 assert.equal(validateGift({...g,recipientName:''}),false);
 assert.equal(validateGift({...g,memory:'x'.repeat(301)}),false);
 assert.equal(validateGift({...g,dedication:''}),false);
 assert.equal(validateGift({...g,feeling:'other'}),false);
 assert.equal(validateGift({...g,detail:'x'.repeat(131)}),false);
 assert.equal(validateGift({}),false);
});
