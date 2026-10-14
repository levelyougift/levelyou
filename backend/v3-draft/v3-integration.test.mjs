import test from 'node:test';import assert from 'node:assert/strict';import {GiftSimulation} from './v3-integration.mjs';
const now=Date.parse('2026-10-14T12:00:00Z');
const gift={recipientName:'Cris',memory:'Aquella tarde en la playa',detail:'La canción',dedication:'Gracias por compartirlo',feeling:'amor'};
test('full simulated lifecycle: create, activate, open, revoke',()=>{
 const sim=new GiftSimulation(),created=sim.create(gift,now);
 assert.equal(created.accessToken.length,64);assert.equal(created.ownerSecret.length,64);
 assert.notEqual(created.accessToken,created.ownerSecret);
 assert.equal(sim.open(created.accessToken,now),null);
 assert.equal(sim.activate(created.id),false);
 assert.equal(sim.activate(created.id,{paymentVerified:true}),true);
 const opened=sim.open(created.accessToken,now);
 assert.equal(opened.recipientName,'Cris');assert.equal(opened.memory,gift.memory);
 assert.equal('access_token_hash' in opened,false);
 assert.equal(sim.revoke(created.accessToken,now),false);
 assert.equal(sim.revoke(created.ownerSecret,now),true);
 assert.equal(sim.open(created.accessToken,now),null);
 assert.equal(sim.activate(created.id,{paymentVerified:true}),false);
});
test('expiry and unknown tokens prevent access',()=>{
 const sim=new GiftSimulation(),created=sim.create(gift,now);
 sim.activate(created.id,{paymentVerified:true});
 assert.equal(sim.open('0'.repeat(64),now),null);
 assert.equal(sim.open(created.accessToken,now+31*86400000),null);
});
test('invalid input cannot create gift',()=>{
 const sim=new GiftSimulation();
 assert.throws(()=>sim.create({...gift,memory:''}),/invalid_gift/);
});
