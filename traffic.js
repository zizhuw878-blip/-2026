'use strict';
// Convert explicit local wall times with IANA zones, never the visitor's time zone.
const TransportClock=(()=>{
 const zones=['Europe/Paris','Europe/Berlin','Europe/Rome','Europe/Warsaw','Atlantic/Reykjavik'];
 function parts(ms,zone){return Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ms)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]))}
 function timestamp(local,zone){if(!local)return null;if(!zones.includes(zone)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))throw Error('请填写完整日期、时间与时区');const [y,m,d,h,min]=local.match(/\d+/g).map(Number),wall=Date.UTC(y,m-1,d,h,min);let candidate=wall;for(let i=0;i<3;i++){const p=parts(candidate,zone);candidate+=wall-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)}const p=parts(candidate,zone);if(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`!==local)throw Error('日期或当地时间无效（可能处于夏令时跳时）');return candidate}
 function timing(t){const departure=timestamp(t.departure,t.departureZone),arrival=timestamp(t.arrival,t.arrivalZone);if(arrival!==null&&departure!==null&&arrival<=departure)throw Error('抵达时间必须晚于出发时间（按各地时区计算）');return {departure,arrival}}
 function status(t,now){const {departure,arrival}=timing(t);return departure===null?'待确认':now<departure?'尚未出发':arrival===null?'行程进行中 · 抵达时间待确认':now<arrival?'行程进行中':'已结束'}
 function remaining(ms){const seconds=Math.max(0,Math.ceil(ms/1000));return [Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60]}
 const base=[
 ['bus',0,'大巴','BlaBlaCar Bus 51511','斯特拉斯堡','法兰克福','2026-12-20T10:25','2026-12-20T14:10','Europe/Paris','Europe/Berlin'],
 ['flight-0',0,'飞机','easyJet EZY5428','法兰克福 FRA','米兰利纳特 LIN','2026-12-20T20:20','2026-12-20T21:30','Europe/Berlin','Europe/Rome'],
 ['flight-1',1,'飞机','Wizz Air Malta W46453','米兰马尔彭萨 MXP','冰岛凯夫拉维克 KEF','2026-12-21T06:10','2026-12-21T09:50','Europe/Rome','Atlantic/Reykjavik'],
 ['flight-6',6,'飞机','Wizz Air W61540','冰岛凯夫拉维克 KEF','华沙莫德林 WMI','2026-12-26T00:55','2026-12-26T05:55','Atlantic/Reykjavik','Europe/Warsaw'],
 ['flight-11',11,'飞机','Wizz Air W61385','华沙莫德林 WMI','巴塞尔 BSL','2026-12-31T14:05','2026-12-31T16:05','Europe/Warsaw','Europe/Paris'],
 ['fra-transfer',0,'机场换乘','','法兰克福市区','法兰克福机场','','','Europe/Berlin','Europe/Berlin'],
 ['milan-transfer',0,'机场换乘','','米兰利纳特机场','米兰马尔彭萨机场','','','Europe/Rome','Europe/Rome'],
 ['museum-transfer',6,'交通待确认 · 需确保13:00前到达','','华沙莫德林机场 WMI','奥斯威辛纪念馆','','','Europe/Warsaw','Europe/Warsaw'],
 ['train-6',6,'参观结束后 · 交通待确认','','奥斯威辛纪念馆','克拉科夫','','','Europe/Warsaw','Europe/Warsaw'],
 ['train-7',7,'火车 / 其他交通','','克拉科夫','弗罗茨瓦夫','','','Europe/Warsaw','Europe/Warsaw'],
 ['train-8',8,'火车 / 其他交通','','弗罗茨瓦夫','格但斯克','','','Europe/Warsaw','Europe/Warsaw'],
 ['train-10',10,'火车 / 其他交通','','格但斯克','华沙','','','Europe/Warsaw','Europe/Warsaw']
 ].map(([id,day,type,number,from,to,departure,arrival,departureZone,arrivalZone])=>({id,day,type,number,from,to,departure,arrival,departureZone,arrivalZone}));
 return {zones,timestamp,timing,status,remaining,base};
})();
