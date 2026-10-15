'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../web/engine.js');
const copy=()=>structuredClone(E.initial);

test('CSRF mismatch blocks a mutating action',()=>{assert.equal(E.run(copy()).report.allowed,false);});
test('Matching CSRF is insufficient with a hostile origin',()=>{const x=copy();x.request.csrf=x.request.expectedCsrf;x.request.origin='https://lab.example.attacker.test';assert.equal(E.run(x).report.allowed,false);});
test('Session expiry rejects the equality boundary',()=>{const x=copy();x.scenario='expiry';x.now=x.session.expires;assert.equal(E.run(x).report.allowed,false);});
test('Revoked sessions fail even with matching CSRF',()=>{const x=copy();x.request.csrf=x.request.expectedCsrf;x.session.revoked=true;assert.equal(E.run(x).report.allowed,false);});
test('Sensitive actions require recent authentication',()=>{const x=copy();x.scenario='reauthentication';x.now=x.session.authenticated+121;assert.equal(E.run(x).report.allowed,false);});
test('Issuer and audience mismatch are rejected',()=>{const x=copy();x.scenario='issuer';x.request.issuer='evil';assert.equal(E.run(x).report.allowed,false);x.scenario='audience';x.request.audience='different-app';assert.equal(E.run(x).report.allowed,false);});
