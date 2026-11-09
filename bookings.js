'use strict';
// Public shared booking facts only. Never add tickets, booking codes or access codes here.
const SharedBookings={
 hotel:{id:'stay-einholt-2026',name:'Stay Apartments Einholt（埃因霍特公寓酒店）',address:'Einholt 2, 105 Reykjavík, Iceland',phone:'+354 517 4050',checkin:'2026-12-21T15:00',checkout:'2026-12-25T11:00',zone:'Atlantic/Reykjavik',total:460.64,platform:30.47,difference:430.17},
 museum:{id:'auschwitz-2026-12-26',name:'Auschwitz-Birkenau Memorial and Museum',entry:'2026-12-26T13:30',suggestedArrival:'2026-12-26T13:00',zone:'Europe/Warsaw',address:'Auschwitz I visitor entrance, 55 Więźniów Oświęcimia Street, Oświęcim'},
 gdansk:{id:'stay-motlawa-2026',name:'Apartamenty nad Motławą',city:'Gdańsk, Poland',address:'Pończoszników 1, 80-888 Gdańsk, Poland',phone:'+48 570 441 724',checkin:'2026-12-28T15:00',checkout:'2026-12-30T11:00',zone:'Europe/Warsaw',adults:2,room:'60平方米标准公寓',nights:2,total:768,currency:'PLN',referenceEUR:175,deposit:300,cancellation:'不可退款'},
 warsaw:{id:'stay-chmielna-2026',name:'Studio w Centrum Warszawy ulica Chmielna - 500m od dworca Centralnego - by Good Sleeping',city:'Warszawa, Poland',address:'Chmielna, Wola, 00-801 Warszawa, Poland',gps:'52.2277, 20.9970333',phone:'+48 727 933 037',checkin:'2026-12-30T15:00',checkout:'2026-12-31T11:00',zone:'Europe/Warsaw',adults:2,room:'37平方米一卧室公寓',nights:1,total:279.45,currency:'PLN',referenceEUR:64,cancellation:'不可退款'},
 expenses:[{id:'booking-stay-einholt-2026',title:'Stay Apartments Einholt · 4晚住宿（订单总价，付款待核实）',amount:460.64,currency:'EUR',day:1},{id:'booking-auschwitz-2026-12-26',title:'Auschwitz-Birkenau · 2人免费入场',amount:0,currency:'PLN',day:6},{id:'booking-stay-motlawa-2026',title:'Apartamenty nad Motławą · 2晚住宿',amount:768,currency:'PLN',day:8,category:'住宿',bookingStatus:'已预订',paymentStatus:'待确认'}]
};


SharedBookings.expenses.push({id:'booking-stay-chmielna-2026',title:SharedBookings.warsaw.name+' · 1晚住宿',amount:SharedBookings.warsaw.total,currency:SharedBookings.warsaw.currency,day:10,category:'住宿',bookingStatus:'已预订',paymentStatus:'待确认'});
