import test from 'node:test';
import assert from 'node:assert/strict';
import {canTransition,canView,retentionDue} from './v3-lifecycle.mjs';
test('only verified payment can mark draft ready',()=>{
 assert.equal(canTransition('draft','ready'),false);
 assert.equal(canTransition('draft','ready',{paymentVerified:true}),true);
 assert.equal(canTransition('revoked','ready',{paymentVerified:true}),false);
 assert.equal(canTransition('ready','draft',{paymentVerified:true}),false);
});
test('owner authorization is required for revocation',()=>{
 assert.equal(canTransition('draft','revoked'),false);
 assert.equal(canTransition('ready','revoked'),false);
 assert.equal(canTransition('ready','revoked',{ownerAuthorized:true}),true);
 assert.equal(canTransition('draft','revoked',{ownerAuthorized:true}),true);
});
test('only ready, unexpired, nonrevoked gifts are viewable',()=>{
 const now=Date.parse('2026-10-14T12:00:00Z');
 const g={status:'ready',expires_at:'2026-10-15T12:00:00Z',revoked_at:null};
 assert.equal(canView(g,now),true);
 assert.equal(canView({...g,status:'draft'},now),false);
 assert.equal(canView({...g,status:'revoked'},now),false);
 assert.equal(canView({...g,revoked_at:'2026-10-14T11:00:00Z'},now),false);
 assert.equal(canView({...g,expires_at:'2026-10-14T12:00:00Z'},now),false);
 assert.equal(retentionDue(g,now),false);
 assert.equal(retentionDue({...g,expires_at:'2026-10-14T12:00:00Z'},now),true);
});
