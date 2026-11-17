/* GSAP-driven diagram engine: layout, node shape, connection style and packet type are all swappable. */
(function(){
const NS='http://www.w3.org/2000/svg', gs=window.gsap;
const $=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a||{})e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
const ICO=n=>(typeof ICONS!=='undefined'&&ICONS[n])||'';
const wrap=(s,max)=>{const w=s.split(' '),o=[];let l='';w.forEach(x=>{if((l+' '+x).trim().length>max&&l){o.push(l);l=x}else l=(l+' '+x).trim()});if(l)o.push(l);return o;};
const T=(g,str,x,y,cls,anchor,rot)=>{const t=$('text',{x,y,class:cls,'text-anchor':anchor||'start'},g);t.textContent=str;if(rot)t.setAttribute('transform',`rotate(${rot} ${x} ${y})`);return t;};
const ICON=(g,name,x,y,s,cls)=>{const k=s/24,e=$('g',{class:cls||'ico',transform:`translate(${x-12*k},${y-12*k}) scale(${k})`},g);e.innerHTML=ICO(name);return e;};
const BR={a:[0],b:[0,1],c:[0,3],d:[0,3,4],e:[0,4],f:[0,1,3],g:[0,1,3,4],h:[0,1,4],i:[1,3],j:[1,3,4]};

/* ---------- node shapes: draw around (0,0); return {w,h,kind} ---------- */
const SH={
 card(g,n,c,z){const [w,h]=z,r=c.r??12;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:r},g);const t=h-22;$('rect',{class:'ac',x:-w/2+11,y:-t/2,width:t,height:t,rx:Math.max(r-4,3)},g);ICON(g,n.i,-w/2+11+t/2,0,t*.56);
   const L=wrap(n.l,Math.floor((w-t-34)/(c.fs*.52)));const y0=-(L.length-1)*c.fs*.6-(c.sub===false?0:4);L.forEach((s,k)=>T(g,s,-w/2+t+26,y0+k*c.fs*1.2,'lb'));if(c.sub!==false)T(g,n.s,-w/2+t+26,y0+L.length*c.fs*1.2-2,'sb');return{w,h,kind:'rect'};},
 label(g,n,c,z){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h},g);$('line',{class:'ul',x1:-w/2,x2:w/2,y1:h/2,y2:h/2},g);ICON(g,n.i,-w/2+20,-2,34);T(g,n.l,-w/2+56,-2,'lb');T(g,n.s,-w/2+56,h/2-10,'sb');return{w,h,kind:'rect'};},
 circle(g,n,c,z){const r=z[0]/2;$('circle',{class:'bx',r},g);ICON(g,n.i,0,0,r*.9);const L=wrap(n.l,16);L.forEach((s,k)=>T(g,s,0,r+c.fs*1.15+k*c.fs*1.15,'lb','middle'));return{w:r*2,h:r*2,kind:'ellipse'};},
 bcell(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:14},g);const pat=BR['abcdefghij'[i%10]]||[0];[0,1,2,3,4,5].forEach(d=>{const col=d<3?0:1,row=d%3;$('circle',{class:pat.includes(d)?'dt on':'dt',cx:(col-.5)*w*.36,cy:(row-1)*h*.27,r:w*.095},g);});
   wrap(n.l,18).forEach((s,k)=>T(g,s,0,h/2+c.fs*1.2+k*c.fs*1.15,'lb','middle'));return{w,h,kind:'rect'};},
 rough(g,n,c,z){const [w,h]=z;$('rect',{class:'bx rf',x:-w/2,y:-h/2,width:w,height:h,rx:6},g);ICON(g,n.i,-w/2+30,0,34);wrap(n.l,Math.floor((w-70)/(c.fs*.5))).forEach((s,k,A)=>T(g,s,-w/2+56,(k-(A.length-1)/2)*c.fs*1.1+6,'lb'));return{w,h,kind:'rect'};},
 clip(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:5},g);for(let k=0;k<30;k++){const a=4+Math.abs(Math.sin(k*1.7+i*2.1))*(h*.2);$('rect',{class:'ac',x:-w/2+10+k*((w-20)/30),y:h/2-8-a,width:3,height:a},g);}wrap(n.l,22).forEach((s,k)=>T(g,s,-w/2+12,-h/2+22+k*(c.fs*1.05),'lb'));return{w,h,kind:'rect'};},
 row(g,n,c,z){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:h/2},g);$('path',{class:'ac',d:`M${-w/2+18} ${-6}l10 6l-10 6z`},g);T(g,n.l,-w/2+42,6,'lb');const rr=T(g,n.r,w/2-16,5,'sb','end');return{w,h,kind:'rect'};},
 texture(g,n,c,z,i){const [w,h]=z,pat=c.pats[i%c.pats.length];const sh=i%3;if(sh===0)$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:8,fill:`url(#${pat})`},g);else if(sh===1)$('ellipse',{class:'bx',rx:w/2,ry:h/2,fill:`url(#${pat})`},g);else $('path',{class:'bx',d:`M${-w/2+20} ${-h/2}H${w/2-20}L${w/2} 0L${w/2-20} ${h/2}H${-w/2+20}L${-w/2} 0Z`,fill:`url(#${pat})`},g);
   const L=wrap(n.l,18);const bw=Math.max(...L.map(s=>s.length))*c.fs*.5+20;$('rect',{class:'plate',x:-bw/2,y:h/2+8,width:bw,height:L.length*c.fs*1.15+10,rx:3},g);L.forEach((s,k)=>T(g,s,0,h/2+8+c.fs*1.05+k*c.fs*1.15,'lb','middle'));return{w,h,kind:'rect'};},
 station(g,n,c,z){$('circle',{class:'bx',r:z[0]/2},g);const L=wrap(n.l,22),lh=c.fs*1.1,d=(c.dir&&c.dir[n.id])||'e',o=z[0]/2+14,m={e:[o,6,'start'],w:[-o,6,'end'],n:[0,-o-(L.length-1)*lh,'middle'],s:[0,o+c.fs*.8,'middle']}[d];L.forEach((s,k)=>T(g,s,m[0],m[1]+k*lh,'lb',m[2]));return{w:z[0],h:z[0],kind:'ellipse'};},
 panel(g,n,c,z){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:4},g);[[-w/2+8,-h/2+8],[w/2-8,-h/2+8],[-w/2+8,h/2-8],[w/2-8,h/2-8]].forEach(p=>$('circle',{class:'ac',cx:p[0],cy:p[1],r:3},g));$('circle',{class:'jack',cx:-w/2+34,cy:4,r:13},g);$('circle',{class:'jack',cx:w/2-34,cy:4,r:13},g);T(g,n.l.toUpperCase(),0,-h/2+30,'lb','middle');T(g,n.s,0,h/2-14,'sb','middle');return{w,h,kind:'rect'};},
 note(g,n,c,z){const w=z[0],h=z[1];$('ellipse',{class:'bx',rx:15,ry:10,transform:'rotate(-20)'},g);$('line',{class:'stem',x1:14,y1:-4,x2:14,y2:-52},g);const up=c.up&&c.up[n.id];wrap(n.l,22).forEach((s,k)=>T(g,s,0,(up?-66:44)+k*c.fs*1.1,'lb','middle'));return{w:30,h:22,kind:'ellipse'};},
 tick(g,n,c,z){$('circle',{class:'bx',r:5},g);const a=(c.ang&&c.ang[n.id])||0;const rr=c.tickR||40;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;$('line',{class:'ul',x1:0,y1:0,x2:x,y2:y},g);const right=Math.cos(a)>=0.05;const left=Math.cos(a)<=-0.05;wrap(n.l,20).forEach((s,k)=>T(g,s,x+(right?10:left?-10:0),y+(y<0?-8-k*0:6)+k*c.fs*1.1+(Math.abs(Math.cos(a))<.05&&y<0?-(wrap(n.l,20).length-1)*c.fs*1.1:0),'lb',right?'start':left?'end':'middle'));return{w:10,h:10,kind:'ellipse'};},
 dotlabel(g,n,c,z,i){$('circle',{class:'bx',r:z[0]/2},g);T(g,String(c.num?c.num[n.id]:i+1),0,6,'num','middle');const L=wrap(n.l,20),lh=c.fs*1.1,d=(c.dir&&c.dir[n.id])||'e',o=z[0]/2+14,m={e:[o,6,'start'],w:[-o,6,'end'],n:[0,-o-(L.length-1)*lh,'middle'],s:[0,o+c.fs,'middle']}[d];L.forEach((s,k)=>T(g,s,m[0],m[1]+k*lh,'lb',m[2]));return{w:z[0],h:z[0],kind:'ellipse'};},
 pixbar(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:2},g);for(let a=0;a<4;a++)for(let b=0;b<4;b++){if(((a*3+b*5+i)%3)!==0)$('rect',{class:'px',x:-w/2+10+b*10,y:-h/2+(h-40)/2+a*10,width:8,height:8},g);}for(let k=0;k<5;k++){const bh=8+((k*7+i*5)%5)*7;$('rect',{class:'ac',x:w/2-14-(4-k)*8,y:h/2-8-bh,width:5,height:bh},g);}wrap(n.l,Math.floor((w-100)/(c.fs*.5))).forEach((s,k,A)=>T(g,s,-w/2+58,(k-(A.length-1)/2)*c.fs*1.1+6,'lb'));return{w,h,kind:'rect'};},
 callout(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:2},g);$('circle',{class:'ac',cx:-w/2,cy:-h/2,r:15},g);T(g,String(i+1),-w/2,-h/2+6,'num','middle');wrap(n.l,Math.floor((w-24)/(c.fs*.5))).forEach((s,k,A)=>T(g,s,0,(k-(A.length-1)/2)*c.fs*1.15+6,'lb','middle'));return{w,h,kind:'rect'};},
 circled(g,n,c,z){const [w,h]=z;$('ellipse',{class:'bx rf',rx:w/2,ry:h/2},g);wrap(n.l,18).forEach((s,k,A)=>T(g,s,0,(k-(A.length-1)/2)*c.fs*1.1+6,'lb','middle'));return{w,h,kind:'ellipse'};},
 element(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:4},g);T(g,String(i+1),-w/2+10,-h/2+20,'sb');T(g,(c.sym&&c.sym[n.id])||n.l.slice(0,2),0,10,'sym','middle');const L=wrap(n.l,15);L.forEach((s,k)=>T(g,s,0,h/2-12-(L.length-1-k)*c.fs*1.0,'lb','middle'));return{w,h,kind:'rect'};},
 chip(g,n,c,z){const [w,h]=z;for(let k=0;k<5;k++){$('rect',{class:'ac',x:-w/2-10,y:-h/2+10+k*((h-20)/4)-3,width:10,height:6},g);$('rect',{class:'ac',x:w/2,y:-h/2+10+k*((h-20)/4)-3,width:10,height:6},g);}$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:3},g);$('circle',{class:'ac',cx:-w/2+14,cy:-h/2+14,r:4},g);wrap(n.l,Math.floor((w-24)/(c.fs*.52))).forEach((s,k,A)=>T(g,s,0,(k-(A.length-1)/2)*c.fs*1.15+4,'lb','middle'));T(g,'U'+(c.num?c.num[n.id]:''),w/2-10,h/2-10,'sb','end');return{w,h,kind:'rect'};},
 electron(g,n,c,z){const r=z[0]/2;$('circle',{class:'bx',r},g);ICON(g,n.i,0,0,r*1.05);const L=wrap(n.l,18),lh=c.fs*1.1,d=(c.dir&&c.dir[n.id])||'s',o=r+14,m={e:[o,6,'start'],w:[-o,6,'end'],n:[0,-o-(L.length-1)*lh,'middle'],s:[0,o+c.fs*.7,'middle']}[d];L.forEach((s,k)=>T(g,s,m[0],m[1]+k*lh,'lb',m[2]));return{w:r*2,h:r*2,kind:'ellipse'};},
 head(g,n,c,z){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:8},g);$('rect',{class:'ac',x:-w/2+12,y:-h/2+12,width:14,height:h-24,rx:2},g);wrap(n.l,Math.floor((w-60)/(c.fs*.5))).forEach((s,k,A)=>T(g,s,-w/2+40,(k-(A.length-1)/2)*c.fs*1.1+5,'lb'));return{w,h,kind:'rect'};},
 sign(g,n,c,z,i){const [w,h]=z;$('rect',{class:'bx',x:-w/2,y:-h/2,width:w,height:h,rx:8},g);const d=(c.dir&&c.dir[n.id])||'r';const ax=d==='l'?-w/2+h/2:w/2-h/2;const s=h*.26,k=d==='l'?-1:1;$('path',{class:'ac',d:`M${ax-k*s*.6} ${-s}l${k*s*1.2} ${s}l${-k*s*1.2} ${s}`,fill:'none'},g);T(g,String(i+1),d==='l'?w/2-34:-w/2+34,10,'num','middle');wrap(n.l,Math.floor((w-h-60)/(c.fs*.52))).forEach((s,kk,A)=>T(g,s,d==='l'?w/2-70:-w/2+66,(kk-(A.length-1)/2)*c.fs*1.1+8,'lb',d==='l'?'end':'start'));return{w,h,kind:'rect'};}
};

/* ---------- geometry ---------- */
function anchor(nd,to){const [x,y]=nd.p,dx=to[0]-x,dy=to[1]-y,d=Math.hypot(dx,dy)||1;
  if(nd.kind==='ellipse'){const a=nd.w/2,b=nd.h/2,t=1/Math.sqrt((dx/d/a)**2+(dy/d/b)**2);return[x+dx/d*t,y+dy/d*t];}
  const hw=nd.w/2,hh=nd.h/2,t=Math.min(hw/Math.abs(dx||1e-9),hh/Math.abs(dy||1e-9));return[x+dx*t,y+dy*t];}
function poly(p,r,ch){let d=`M${p[0][0]} ${p[0][1]}`;for(let i=1;i<p.length-1;i++){const a=p[i-1],b=p[i],c=p[i+1],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),rr=Math.min(r,l1/2,l2/2);if(rr<1){d+=` L${b[0]} ${b[1]}`;continue}
  const p1=[b[0]-(b[0]-a[0])/l1*rr,b[1]-(b[1]-a[1])/l1*rr],p2=[b[0]+(c[0]-b[0])/l2*rr,b[1]+(c[1]-b[1])/l2*rr];d+=ch?` L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]}`:` L${p1[0]} ${p1[1]} Q${b[0]} ${b[1]} ${p2[0]} ${p2[1]}`;}
  const l=p[p.length-1];return d+` L${l[0]} ${l[1]}`;}
const EDGE={
 straight:(A,B)=>`M${A} L${B}`,
 dots:(A,B)=>`M${A} L${B}`, ribbon:(A,B)=>`M${A} L${B}`,
 curve:(A,B,c,s)=>{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,dx=B[0]-A[0],dy=B[1]-A[1],k=(c.curv??.25)*s;return `M${A} Q${mx-dy*k} ${my+dx*k} ${B}`;},
 arc:(A,B,c,s)=>{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);return `M${A} A${d*.75} ${d*.75} 0 0 ${s>0?1:0} ${B}`;},
 sag:(A,B,c,s)=>`M${A} C${A[0]} ${A[1]+(c.sag||90)*(s>0?1:.55)} ${B[0]} ${B[1]+(c.sag||90)*(s>0?1:.55)} ${B}`,
 elbow:(A,B,c,s)=>{const dx=B[0]-A[0],dy=B[1]-A[1];const pts=Math.abs(dx)>=Math.abs(dy)?[A,[(A[0]+B[0])/2+s*(c.bi||0),A[1]],[(A[0]+B[0])/2+s*(c.bi||0),B[1]],B]:[A,[A[0],(A[1]+B[1])/2+s*(c.bi||0)],[B[0],(A[1]+B[1])/2+s*(c.bi||0)],B];return poly(pts,c.rad??16,false);},
 chamfer:(A,B,c,s)=>{const dx=B[0]-A[0],dy=B[1]-A[1];const pts=Math.abs(dx)>=Math.abs(dy)?[A,[(A[0]+B[0])/2+s*(c.bi||0),A[1]],[(A[0]+B[0])/2+s*(c.bi||0),B[1]],B]:[A,[A[0],(A[1]+B[1])/2+s*(c.bi||0)],[B[0],(A[1]+B[1])/2+s*(c.bi||0)],B];return poly(pts,c.rad??18,true);},
 metro:(A,B)=>{const dx=B[0]-A[0],dy=B[1]-A[1],ax=Math.abs(dx),ay=Math.abs(dy),sx=Math.sign(dx),sy=Math.sign(dy);let pts;if(ax>=ay){const h=ax-ay;pts=[A,[A[0]+sx*h,A[1]],B];}else{const v=ay-ax;pts=[A,[A[0],A[1]+sy*v],B];}return poly(pts,14,false);}
};

/* ---------- packets ---------- */
function mkPacket(kind,g,c,E){const R=c.pk||6;let o;
 const K={
  dot:()=>{const e=$('circle',{class:'pk',r:R},g);return{set:(p,a)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]})`)}},
  square:()=>{const e=$('rect',{class:'pk',x:-R,y:-R,width:R*2,height:R*2},g);return{set:(p,a)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]}) rotate(${a})`)}},
  diamond:()=>{const e=$('rect',{class:'pk',x:-R,y:-R,width:R*2,height:R*2},g);return{set:(p)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]}) rotate(45)`)}},
  comet:()=>{const es=[0,1,2,3].map(k=>$('circle',{class:'pk',r:R*(1-k*.2),opacity:1-k*.24},g));return{set:(p,a,pp,path,len,t)=>es.forEach((e,k)=>{const q=path.getPointAtLength(Math.max(0,(t-k*.025))*len);e.setAttribute('transform',`translate(${q.x} ${q.y})`)})}},
  chip:()=>{const w=E.lab.length*6.2+16,r=$('g',{},g);$('rect',{class:'pk',x:-w/2,y:-10,width:w,height:20,rx:10},r);T(r,E.lab,0,4,'pkt','middle');return{set:(p)=>r.setAttribute('transform',`translate(${p[0]} ${p[1]})`)}},
  ring:()=>{const e=$('circle',{class:'pk rg',r:R},g);const d=$('circle',{class:'pk',r:R*.5},g);return{set:(p,a,pp,pa,l,t)=>{const tr=`translate(${p[0]} ${p[1]})`;e.setAttribute('transform',tr);d.setAttribute('transform',tr);e.setAttribute('r',R*(1+1.6*((t*3)%1)));e.setAttribute('opacity',1-((t*3)%1))}}},
  bar:()=>{const e=$('rect',{class:'pk',x:-2.5,y:-R*1.5,width:5,height:R*3},g);return{set:(p,a)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]}) rotate(${a})`)}},
  note:()=>{const r=$('g',{},g);$('ellipse',{class:'pk',rx:7,ry:5,transform:'rotate(-20)'},r);$('line',{class:'pks',x1:6,y1:-2,x2:6,y2:-24},r);return{set:(p)=>r.setAttribute('transform',`translate(${p[0]} ${p[1]})`)}},
  train:()=>{const e=$('rect',{class:'pk',x:-16,y:-7,width:32,height:14,rx:7},g);return{set:(p,a)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]}) rotate(${a})`)}},
  electron:()=>{const e=$('circle',{class:'pk',r:R*.8},g);const h=$('circle',{class:'pk rg2',r:R*1.7},g);return{set:(p)=>{const tr=`translate(${p[0]} ${p[1]})`;e.setAttribute('transform',tr);h.setAttribute('transform',tr)}}},
  knob:()=>{const e=$('circle',{class:'pk',r:R*1.5},g);const d=$('circle',{class:'pkc',r:R*.5},g);return{set:(p)=>{const tr=`translate(${p[0]} ${p[1]})`;e.setAttribute('transform',tr);d.setAttribute('transform',tr)}}},
  chevron:()=>{const e=$('path',{class:'pks',d:`M-${R} -${R}l${R*1.2} ${R}l-${R*1.2} ${R}`,fill:'none'},g);return{set:(p,a)=>e.setAttribute('transform',`translate(${p[0]} ${p[1]}) rotate(${a})`)}},
  pixbar:()=>{const e=$('rect',{class:'pk',x:-R,y:-R,width:R*2,height:R*2},g);return{set:(p,a,pp,pa,l,t)=>{const h=t<.5?R*2:R*2+Math.sin(t*20)*R*1.3;e.setAttribute('transform',`translate(${p[0]} ${p[1]})`);e.setAttribute('height',Math.abs(h));e.setAttribute('y',-Math.abs(h)/2);}}},
  playhead:()=>{const e=$('line',{class:'pks',y1:0,y2:c.H},g);const d=$('circle',{class:'pk',r:R},g);return{set:(p)=>{e.setAttribute('transform',`translate(${p[0]} 0)`);d.setAttribute('transform',`translate(${p[0]} ${p[1]})`)}}},
  needle:()=>{const e=$('line',{class:'pks',x1:c.pivot[0],y1:c.pivot[1]},g);const d=$('circle',{class:'pk',r:R},g);return{set:(p)=>{e.setAttribute('x2',p[0]);e.setAttribute('y2',p[1]);d.setAttribute('transform',`translate(${p[0]} ${p[1]})`)}}},
  pencil:()=>{const e=$('circle',{class:'pk',r:R*.8},g);const t=$('line',{class:'pks',x1:0,y1:0,x2:16,y2:-16},g);return{set:(p)=>{const tr=`translate(${p[0]} ${p[1]})`;e.setAttribute('transform',tr);t.setAttribute('transform',tr)}}}
 };
 return (K[kind]||K.dot)();}

/* ---------- engine ---------- */
window.LabEngine=function(svg,cfg,ui){
  const D=LAB; svg.setAttribute('viewBox',`0 0 ${cfg.W} ${cfg.H}`); svg.innerHTML='';
  const defs=$('defs',{},svg);
  const mk=(id,sh)=>{const m=$('marker',{id:id,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:cfg.ah||7,markerHeight:cfg.ah||7,orient:'auto'},defs);$('path',{d:sh,fill:'context-stroke'},m)};
  mk('a-tri','M0 0L10 5L0 10z');mk('a-open','M1 1L9 5L1 9');mk('a-dot','M5 5m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0');
  const f=$('filter',{id:'rough',x:'-5%',y:'-5%',width:'110%',height:'110%'},defs);$('feTurbulence',{type:'fractalNoise',baseFrequency:cfg.rough||'.035',numOctaves:'2',seed:'4',result:'n'},f);$('feDisplacementMap',{in:'SourceGraphic',in2:'n',scale:cfg.roughScale||5},f);
  if(cfg.defs) cfg.defs(defs,$);
  const gDeco=$('g',{class:'deco'},svg), gE=$('g',{class:'edges'},svg), gN=$('g',{class:'nodes'},svg), gP=$('g',{class:'packets'},svg), gTop=$('g',{class:'top'},svg);
  const nodes={}, size=id=>(cfg.size&&cfg.size[id])||cfg.sz||[240,92];
  D.order.forEach((id,i)=>{const n={...D.nodes[id],id},pos=cfg.pos[id];if(!pos)return;const col=(cfg.col[n.c]||cfg.col.frontend);
    const o=$('g',{class:'node',transform:`translate(${pos[0]} ${pos[1]})`,style:`--f:${col[0]};--k:${col[1]}`,'data-id':id},gN);const inner=$('g',{class:'n'},o);if(cfg.rotate&&cfg.rotate[id]) o.setAttribute('transform',`translate(${pos[0]} ${pos[1]}) rotate(${cfg.rotate[id]})`);
    const s=SH[cfg.shape](inner,n,cfg,size(id),i);nodes[id]={id,el:o,inner,p:pos,w:s.w,h:s.h,kind:s.kind,i};});
  if(cfg.deco) cfg.deco(gDeco,$,nodes,cfg);
  if(cfg.top) cfg.top(gTop,$,nodes,cfg);
  const edges={}; const has=(a,b)=>D.edges.find(e=>e[1]===b&&e[2]===a);
  D.edges.forEach((e,idx)=>{const [id,s,t,lab]=e,S=nodes[s],Tn=nodes[t];if(!S||!Tn)return;const rev=has(s,t);const sg=rev?(s<t?1:-1):1;
    let d,col=cfg.col[D.nodes[s].c]||cfg.col.frontend;
    if(cfg.route){const r=cfg.route(id,S,Tn,sg,nodes,anchor,poly);if(r)d=r;}
    if(!d){let A=anchor(S,Tn.p),B=anchor(Tn,S.p);if(rev&&cfg.edge!=='arc'&&cfg.edge!=='curve'&&cfg.edge!=='sag'){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1,o=(cfg.bi||9)*sg,nx=-dy/L*o,ny=dx/L*o;A=[A[0]+nx,A[1]+ny];B=[B[0]+nx,B[1]+ny];}
      d=EDGE[cfg.edge](A,B,cfg,sg);}
    const p=$('path',{d,class:'edge'+(cfg.edge==='dots'?' dots':'')+(cfg.edge==='ribbon'?' ribbon':''),style:`--k:${cfg.mono||col[1]}`,'data-id':id,'marker-end':cfg.arrow==='none'?'':`url(#a-${cfg.arrow||'tri'})`},gE);
    edges[id]={id,s,t,lab,path:p,len:p.getTotalLength(),idx};});
  /* runtime */
  const phases=D.phases;let cur=0,tl=null,tweens=[],pks=[],play=null,playing=false;
  const lit=id=>{const n=nodes[id];if(!n)return;n.el.classList.add('lit');gs.fromTo(n.inner,{scale:1},{scale:cfg.pop||1.06,duration:.22,yoyo:true,repeat:1,ease:'power2.out',transformOrigin:'50% 50%',transformBox:'fill-box'});};
  function reset(){tweens.forEach(t=>t.kill());tweens=[];if(tl)tl.kill();tl=null;pks.forEach(p=>p.remove());pks=[];gP.innerHTML='';
    Object.values(nodes).forEach(n=>{n.el.classList.remove('lit','seen');gs.set(n.inner,{scale:1,clearProps:'transform'})});
    Object.values(edges).forEach(e=>{e.path.classList.remove('on','done');e.path.style.strokeDasharray='';e.path.style.strokeDashoffset='';});}
  const speed=()=>cfg.speed||430;
  function fire(id){const e=edges[id];if(!e)return;e.path.classList.add('on');nodes[e.s].el.classList.add('lit');
    if(cfg.draw!==false&&cfg.edge!=='dots'){e.path.style.strokeDasharray=e.len;gs.fromTo(e.path,{strokeDashoffset:e.len},{strokeDashoffset:0,duration:Math.min(.7,e.len/900),ease:'power2.out',onComplete:()=>{e.path.style.strokeDasharray=''}});}
    const dur=Math.max(.9,e.len/speed()),n=Math.max(2,Math.round(e.len/190));
    for(let k=0;k<n;k++){const wr=$('g',{style:'visibility:hidden'},gP);const pk=mkPacket(cfg.packet,wr,cfg,{lab:e.lab});pk._k=k;pk.wr=wr;const px={p:0};
      const tw=gs.to(px,{p:1,duration:dur,ease:'none',repeat:-1,delay:k*dur/n,onUpdate:()=>{const L=px.p*e.len,q=e.path.getPointAtLength(L),q2=e.path.getPointAtLength(Math.min(e.len,L+2)),a=Math.atan2(q2.y-q.y,q2.x-q.x)*180/Math.PI;if(!pk.wr._v){pk.wr.style.visibility='visible';pk.wr._v=1}pk.set([q.x,q.y],a,null,e.path,e.len,px.p);}});tweens.push(tw);}
    tweens.push(gs.delayedCall(Math.min(dur,1.5),()=>lit(e.t)));}
  function goto(i){reset();cur=Math.max(0,Math.min(phases.length,i));for(let k=0;k<cur-1;k++)phases[k].steps.flat().forEach(id=>{const e=edges[id];if(!e)return;e.path.classList.add('done');nodes[e.s].el.classList.add('seen');nodes[e.t].el.classList.add('seen');});
    if(cur===0){ui.render(0,null,phases.length);return 0;}
    const ph=phases[cur-1];ui.render(cur,ph,phases.length);tl=gs.timeline();let t=0;
    ph.steps.forEach(g=>{const ml=Math.max(...g.map(id=>edges[id]?edges[id].len:0));g.forEach(id=>tl.call(fire,[id],t));t+=Math.min(Math.max(.9,ml/speed()),1.5)+.2;});return t;}
  const api={get cur(){return cur},total:phases.length,goto,next(){if(cur<phases.length){goto(cur+1);return true}return false},prev(){if(cur>0){goto(cur-1);return true}return false},
   play(){if(playing){playing=false;if(play)play.kill();ui.playing&&ui.playing(false);return}playing=true;ui.playing&&ui.playing(true);const go=()=>{if(!playing)return;const d=cur>=phases.length?goto(1):goto(cur+1);play=gs.delayedCall(Math.max(3,(d||3)+1.4),go);};go();},
   enter(){reset();const R=cfg.reveal||'rise',els=Object.values(nodes).map(n=>n.inner),Y={rise:{y:26,opacity:0},pop:{scale:.4,opacity:0,transformOrigin:'50% 50%'},fade:{opacity:0},drop:{y:-40,opacity:0},slide:{x:-50,opacity:0},spin:{rotate:-25,scale:.6,opacity:0,transformOrigin:'50% 50%'}}[R]||{opacity:0};
     gs.from(els,{...Y,duration:.7,stagger:.07,transformBox:'fill-box',ease:R==='pop'?'back.out(2)':'power3.out',clearProps:'all'});
     const es=Object.values(edges).map(e=>e.path);gs.from(es,{opacity:0,duration:.6,stagger:.03,delay:.3});goto(0);},
   leave(){reset();if(play)play.kill();playing=false;},nodes,edges};
  return api;
};
})();
