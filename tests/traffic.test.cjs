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
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../bookings.js'),'utf8')+';globalThis.bookings=SharedBookings;',context);
test('booking deadlines use Iceland and Poland local time; no made-up ticket charge',()=>{
 const {hotel,museum,expenses}=context.bookings;
 assert.equal(clock.timestamp(hotel.checkin,hotel.zone),Date.parse('2026-12-21T15:00Z'));
 assert.equal(clock.timestamp(hotel.checkout,hotel.zone),Date.parse('2026-12-25T11:00Z'));
 assert.equal(clock.timestamp(museum.entry,museum.zone),Date.parse('2026-12-26T12:30Z'));
 assert.equal(expenses[0].amount,460.64);assert.equal(expenses[0].currency,'EUR');
 assert.equal(expenses[1].amount,0);assert.equal(expenses[1].currency,'PLN');
 assert.equal(new Set(expenses.map(e=>e.id)).size,3);
});
test('December 26 active route goes through Krakow without invented times',()=>{
 const legs=clock.activeBase.filter(t=>t.day===6);
 assert.equal(legs[0].id,'flight-6');
 assert.equal(legs.find(t=>t.id==='wmi-krakow').to,'克拉科夫');
 assert.equal(legs.find(t=>t.id==='krakow-museum').from,'克拉科夫');
 for(const t of legs.filter(t=>t.id!=='flight-6')){assert.equal(t.departure,'');assert.equal(t.arrival,'');assert.equal(t.number,'')}
 assert.ok(!legs.some(t=>['train-6','museum-transfer'].includes(t.id)));
 assert.ok(clock.base.some(t=>t.id==='train-6')); // Retained for legacy saved overrides.
});


test('Gdansk apartment deadlines and expense exclude reference price and deposit',()=>{const {gdansk,expenses}=context.bookings;assert.equal(clock.timestamp(gdansk.checkin,gdansk.zone),Date.parse('2026-12-28T14:00Z'));assert.equal(clock.timestamp(gdansk.checkout,gdansk.zone),Date.parse('2026-12-30T10:00Z'));const entries=expenses.filter(e=>e.id==='booking-stay-motlawa-2026');assert.equal(entries.length,1);assert.equal(entries[0].amount,768);assert.equal(entries[0].currency,'PLN');assert.equal(entries[0].category,'住宿');assert.equal(entries[0].paymentStatus,'待确认');assert.equal(gdansk.deposit,300);});
