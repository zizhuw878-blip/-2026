const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const context=vm.createContext({Intl,Date});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../traffic.js'),'utf8')+';globalThis.clock=TransportClock;',context);
const clock=context.clock;
test('winter departures are absolute and independent of the host timezone',()=>{
 assert.equal(clock.timestamp('2026-12-20T10:25','Europe/Paris'),Date.parse('2026-12-20T09:25Z'));
 assert.equal(clock.timestamp('2026-12-21T06:10','Europe/Rome'),Date.parse('2026-12-21T05:10Z'));
 assert.equal(clock.timestamp('2026-12-21T09:50','Atlantic/Reykjavik'),Date.parse('2026-12-21T09:50Z'));
 assert.equal(clock.timestamp('2026-12-26T00:55','Atlantic/Reykjavik'),Date.parse('2026-12-26T00:55Z'));
 assert.equal(clock.timestamp('2026-12-26T05:55','Europe/Warsaw'),Date.parse('2026-12-26T04:55Z'));
});
test('exact departure and arrival boundaries use scheduled statuses',()=>{const t=clock.base[0],{departure,arrival}=clock.timing(t);assert.equal(clock.status(t,departure-1),'尚未出发');assert.equal(clock.status(t,departure),'行程进行中');assert.equal(clock.status(t,arrival-1),'行程进行中');assert.equal(clock.status(t,arrival),'已结束');assert.equal(clock.status(clock.base[5],Date.now()),'待确认')});
test('invalid and reversed local dates are rejected; overnight works',()=>{assert.throws(()=>clock.timestamp('2026-02-30T10:00','Europe/Paris'));assert.throws(()=>clock.timestamp('2026-03-29T02:30','Europe/Paris'));assert.throws(()=>clock.timing({...clock.base[0],arrival:'2026-12-20T09:00'}));assert.equal(clock.timing({...clock.base[0],departure:'2026-12-20T23:30',arrival:'2026-12-21T01:00'}).arrival-clock.timing({...clock.base[0],departure:'2026-12-20T23:30',arrival:'2026-12-21T01:00'}).departure,5400000)});
