'use strict';
/* ===== tiny helpers ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
const TAU=Math.PI*2, R2=Math.SQRT1_2;
/* ===== complex + linear algebra ===== */
const c=(a,b=0)=>[a,b], cadd=(a,b)=>[a[0]+b[0],a[1]+b[1]], csub=(a,b)=>[a[0]-b[0],a[1]-b[1]],
  cmul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]], cconj=a=>[a[0],-a[1]], cabs2=a=>a[0]*a[0]+a[1]*a[1],
  csc=(a,s)=>[a[0]*s,a[1]*s], cexp=t=>[Math.cos(t),Math.sin(t)];
const ZERO=c(0), ONE=c(1), I_=c(0,1);
const vadd=(u,v)=>u.map((x,i)=>cadd(x,v[i])), vsc=(u,s)=>u.map(x=>cmul(x,typeof s==='number'?[s,0]:s));
const inner=(a,b)=>a.reduce((s,x,i)=>cadd(s,cmul(cconj(x),b[i])),ZERO);
const norm2=v=>v.reduce((s,x)=>s+cabs2(x),0);
const mv=(A,v)=>A.map(r=>r.reduce((s,x,j)=>cadd(s,cmul(x,v[j])),ZERO));
const mm=(A,B)=>A.map((r,i)=>B[0].map((_,j)=>r.reduce((s,x,k)=>cadd(s,cmul(x,B[k][j])),ZERO)));
const mdag=A=>A[0].map((_,j)=>A.map(r=>cconj(r[j])));
const madd=(A,B)=>A.map((r,i)=>r.map((x,j)=>cadd(x,B[i][j])));
const msub=(A,B)=>A.map((r,i)=>r.map((x,j)=>csub(x,B[i][j])));
const msc=(A,s)=>A.map(r=>r.map(x=>cmul(x,typeof s==='number'?[s,0]:s)));
const comm=(A,B)=>msub(mm(A,B),mm(B,A));
const kron=(u,v)=>u.flatMap(a=>v.map(b=>cmul(a,b)));
const mid=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?ONE:ZERO));
const SX=[[ZERO,ONE],[ONE,ZERO]], SY=[[ZERO,c(0,-1)],[I_,ZERO]], SZ=[[ONE,ZERO],[ZERO,c(-1)]], ID2=mid(2);
const KU=[ONE,ZERO], KD=[ZERO,ONE], KR=[c(R2),c(R2)], KL=[c(R2),c(-R2)], KI=[c(R2),c(0,R2)], KO=[c(R2),c(0,-R2)];
const KETS={u:KU,d:KD,r:KR,l:KL,i:KI,o:KO};
const KNAME={u:'u',d:'d',r:'r',l:'l',i:'i',o:'o'};
const ketAng=(th,ph)=>[c(Math.cos(th/2)),csc(cexp(ph),Math.sin(th/2))];
const axisKets=(th,ph)=>[ketAng(th,ph),ketAng(Math.PI-th,ph+Math.PI)];
const expect=(A,v)=>inner(v,mv(A,v))[0];
const blochVec=v=>[expect(SX,v),expect(SY,v),expect(SZ,v)];
const sigmaN=(th,ph)=>{const n=[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)];return madd(madd(msc(SX,n[0]),msc(SY,n[1])),msc(SZ,n[2]))};
const isSame=(a,b,t=1e-9)=>a.every((x,i)=>Math.hypot(x[0]-b[i][0],x[1]-b[i][1])<t);
/* formatting */
function fnum(x,d=3){if(Math.abs(x)<1e-9)return'0';const r=Math.abs(x)*Math.SQRT2;if(Math.abs(r-1)<1e-9)return(x<0?'−':'')+'1/√2';if(Math.abs(Math.abs(x)-0.5)<1e-9)return(x<0?'−':'')+'1/2';return(x<0?'−':'')+Math.abs(x).toFixed(d).replace(/0+$/,'').replace(/\.$/,'')}
function fcx(z,d=3){const a=Math.abs(z[0])<1e-9?0:z[0],b=Math.abs(z[1])<1e-9?0:z[1];
  if(b===0)return fnum(a,d);
  const im=(Math.abs(Math.abs(b)-1)<1e-9?'':fnum(Math.abs(b),d))+'i';
  if(a===0)return(b<0?'−':'')+im;
  return fnum(a,d)+(b<0?' − ':' + ')+im}
function matHTML(M,f=fcx){const n=M[0].length;return `<span class="mat" style="grid-template-columns:repeat(${n},auto)">${M.map(r=>r.map(x=>`<span>${f(x)}</span>`).join('')).join('')}</span>`}
function ketHTML(v,f=fcx){return matHTML(v.map(x=>[x]),f)}
function braHTML(v,f=fcx){return matHTML([v.map(cconj)],f)}
const fr=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const ket=s=>`<span class="math">|${s}⟩</span>`, bra=s=>`<span class="math">⟨${s}|</span>`;
const rnd=()=>Math.random();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
/* FFT (radix-2) */
function fft(re,im,inv){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]]}}
  for(let len=2;len<=n;len<<=1){const ang=TAU/len*(inv?1:-1),wr=Math.cos(ang),wi=Math.sin(ang);
    for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let k=0;k<len/2;k++){const a=i+k,b=a+len/2;const tr=re[b]*cr-im[b]*ci,ti=re[b]*ci+im[b]*cr;re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t}}}
  if(inv)for(let i=0;i<n;i++){re[i]/=n;im[i]/=n}}
/* ===== widgets ===== */
function slider(parent,label,min,max,step,val,onInput,fmt){
  const w=el('div','col');const l=el('div','lbl');const sp=el('span','',label);const o=el('output');l.append(sp,o);
  const i=el('input');i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;i.setAttribute('aria-label',label);
  const f=fmt||(v=>(+v).toFixed(2));
  const upd=()=>{o.textContent=f(+i.value)};
  i.addEventListener('input',()=>{upd();onInput(+i.value)});upd();
  w.append(l,i);parent.append(w);
  return {el:w,input:i,get:()=>+i.value,set:v=>{i.value=v;upd()}}}
function selectBox(parent,label,opts,val,onChange){
  const w=el('label','row',`<span class="tip">${label}</span>`);const s=el('select');
  opts.forEach(([v,t])=>{const o=el('option');o.value=v;o.textContent=t;s.append(o)});s.value=val;s.setAttribute('aria-label',label);
  s.addEventListener('change',()=>onChange(s.value));w.append(s);parent.append(w);return s}
function chips(parent,opts,val,onPick){
  const w=el('div','chips');const bs=opts.map(([v,t])=>{const b=el('button','chip'+(v===val?' on':''),t);b.type='button';
    b.onclick=()=>{bs.forEach(x=>x.classList.remove('on'));b.classList.add('on');onPick(v)};w.append(b);return b});
  parent.append(w);return {el:w,set(v){bs.forEach((b,i)=>b.classList.toggle('on',opts[i][0]===v))}}}
function histo(parent,labels,colors){
  const w=el('div','bars');const bars=labels.map((t,i)=>{const b=el('div','bar');const d=el('div');d.style.background=colors[i%colors.length];const s=el('small','',t);b.append(d,s);w.append(b);return {d,s,t}});
  parent.append(w);
  return {update(freqs,extra){bars.forEach((b,i)=>{b.d.style.height=(clamp(freqs[i],0,1)*100)+'%';b.s.innerHTML=b.t+(extra?'<br>'+extra[i]:'')})}}}
function fit(cv,hRatio=0.5,minH=180){const dpr=window.devicePixelRatio||1;const w=cv.clientWidth||300;const h=Math.max(minH,Math.round(w*hRatio));
  if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);cv.style.height=h+'px'}
  const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);return {g,w,h}}
function plot(cv,series,o={}){
  const {g,w,h}=fit(cv,o.ratio||0.45,o.minH||170);g.clearRect(0,0,w,h);
  const xs0=o.xmin,xs1=o.xmax;let y0=o.ymin,y1=o.ymax;
  if(y0==null||y1==null){let mn=1e9,mx=-1e9;series.forEach(s=>s.ys.forEach(y=>{mn=Math.min(mn,y);mx=Math.max(mx,y)}));if(y0==null)y0=Math.min(0,mn);if(y1==null)y1=mx*1.1||1}
  const L=34,Rr=8,T=8,B=22;const X=x=>L+(x-xs0)/(xs1-xs0)*(w-L-Rr),Y=y=>h-B-(y-y0)/(y1-y0)*(h-T-B);
  g.strokeStyle='rgba(243,241,230,.25)';g.lineWidth=1;g.fillStyle='#b9c4b8';g.font='11px system-ui';
  g.beginPath();if(y0<0&&y1>0){g.moveTo(L,Y(0));g.lineTo(w-Rr,Y(0))}g.moveTo(L,T);g.lineTo(L,h-B);g.lineTo(w-Rr,h-B);g.stroke();
  const nt=o.xticks||4;for(let i=0;i<=nt;i++){const x=xs0+(xs1-xs0)*i/nt;{const tx=(+x.toFixed(2))+'';g.textAlign='center';g.fillText(tx,clamp(X(x),L+6,w-Rr-8),h-8);g.textAlign='left'}}
  g.textAlign='right';[y0,y1].forEach(y=>g.fillText((+y.toFixed(2))+'',L-4,Y(y)+4));g.textAlign='left';
  (o.vlines||[]).forEach(v=>{g.strokeStyle=v.color||'#f2d67a';g.setLineDash([4,4]);g.beginPath();g.moveTo(X(v.x),T);g.lineTo(X(v.x),h-B);g.stroke();g.setLineDash([])});
  (o.hlines||[]).forEach(v=>{g.strokeStyle=v.color||'#f2d67a';g.setLineDash([4,4]);g.beginPath();g.moveTo(L,Y(v.y));g.lineTo(w-Rr,Y(v.y));g.stroke();g.setLineDash([]);if(v.label){g.fillStyle=v.color||'#f2d67a';g.fillText(v.label,w-Rr-70,Y(v.y)-4)}});
  series.forEach(s=>{const n=s.ys.length;g.beginPath();for(let i=0;i<n;i++){const x=s.xs?s.xs[i]:xs0+(xs1-xs0)*i/(n-1);const px=X(x),py=Y(clamp(s.ys[i],y0-1e3,y1+1e3));i?g.lineTo(px,py):g.moveTo(px,py)}
    if(s.fill){g.save();g.lineTo(X(s.xs?s.xs[n-1]:xs1),Y(Math.max(0,y0)));g.lineTo(X(s.xs?s.xs[0]:xs0),Y(Math.max(0,y0)));g.closePath();g.fillStyle=s.fill;g.fill();g.restore()}
    g.strokeStyle=s.color||'#f2d67a';g.lineWidth=s.lw||2;g.stroke()});
  (o.dots||[]).forEach(d=>{g.fillStyle=d.color||'#fff';g.beginPath();g.arc(X(d.x),Y(d.y),4,0,TAU);g.fill()});
  return {X,Y}}
/* Bloch sphere */
class Bloch{
  constructor(parent,opt={}){this.cv=el('canvas');this.cv.setAttribute('aria-label','Bloch sphere, drag to rotate');this.cv.style.cursor='grab';parent.append(this.cv);
    this.yaw=opt.yaw??-0.6;this.pitch=opt.pitch??0.35;this.vec=[0,0,1];this.vecs=[];this.trail=[];this.ratio=opt.ratio||0.78;this.minH=opt.minH||240;this.max=opt.max||420;this.dr=false;
    const cv=this.cv;cv.addEventListener('pointerdown',e=>{this.dr=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId)});
    cv.addEventListener('pointermove',e=>{if(!this.dr)return;this.yaw+=(e.clientX-this.dr[0])*0.01;this.pitch=clamp(this.pitch+(e.clientY-this.dr[1])*0.01,-1.4,1.4);this.dr=[e.clientX,e.clientY];this.draw()});
    cv.addEventListener('pointerup',()=>{this.dr=false});
    this.ro=new ResizeObserver(()=>this.draw());this.ro.observe(cv)}
  P(v){const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
    const x1=v[0]*cy-v[1]*sy,y1=v[0]*sy+v[1]*cy,z1=v[2];return [x1,y1*sp+z1*cp,y1*cp-z1*sp]}
  draw(){const {g,w,h}=fit(this.cv,this.ratio,this.minH);g.clearRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*0.36;
    const S=p=>[cx+p[0]*R,cy-p[1]*R];
    g.lineWidth=1.2;g.strokeStyle='rgba(243,241,230,.35)';g.beginPath();g.arc(cx,cy,R,0,TAU);g.stroke();
    const ring=(f)=>{for(let pass=0;pass<2;pass++){g.beginPath();let first=true;for(let k=0;k<=96;k++){const t=k/96*TAU,p=this.P(f(t));const back=p[2]>0;if(back!==(pass===0)){first=true;continue}const s=S(p);first?g.moveTo(s[0],s[1]):g.lineTo(s[0],s[1]);first=false}
      g.strokeStyle=pass===0?'rgba(243,241,230,.12)':'rgba(243,241,230,.4)';g.setLineDash(pass===0?[3,4]:[]);g.stroke();g.setLineDash([])}};
    ring(t=>[Math.cos(t),Math.sin(t),0]);ring(t=>[Math.cos(t),0,Math.sin(t)]);ring(t=>[0,Math.cos(t),Math.sin(t)]);
    const axes=[[[1,0,0],'r','#8fd0f0'],[[-1,0,0],'l','#8fd0f0'],[[0,1,0],'i','#f6b26b'],[[0,-1,0],'o','#f6b26b'],[[0,0,1],'u','#9be0a8'],[[0,0,-1],'d','#9be0a8']];
    g.font='15px Georgia,serif';g.textAlign='center';
    axes.forEach(([v,t,col])=>{const p=this.P(v),s=S(p),s0=S(this.P([0,0,0]));g.strokeStyle=col;g.globalAlpha=p[2]>0?.3:.85;g.lineWidth=1.3;g.beginPath();g.moveTo(s0[0],s0[1]);g.lineTo(s[0],s[1]);g.stroke();
      g.fillStyle=col;g.fillText('|'+t+'⟩',s[0]+(s[0]>cx?14:-14)*0.9,s[1]+(s[1]>cy?14:-6));g.globalAlpha=1});
    if(this.trail.length>1){g.strokeStyle='rgba(242,214,122,.5)';g.lineWidth=2;g.beginPath();this.trail.forEach((v,i)=>{const s=S(this.P(v));i?g.lineTo(s[0],s[1]):g.moveTo(s[0],s[1])});g.stroke()}
    const list=this.vecs.length?this.vecs:[{v:this.vec,color:'#f2d67a'}];
    list.forEach(o=>{const p=this.P(o.v),s=S(p),s0=S([0,0]);g.strokeStyle=o.color;g.fillStyle=o.color;g.lineWidth=3;g.beginPath();g.moveTo(s0[0],s0[1]);g.lineTo(s[0],s[1]);g.stroke();
      g.beginPath();g.arc(s[0],s[1],6,0,TAU);g.fill()})}
  setVec(v){this.vec=v;this.draw()}
}
/* quiz */
function quiz(root,qs,onDone){
  let i=0,score=0;const box=el('div');root.append(box);
  function show(){box.innerHTML='';if(i>=qs.length){onDone(score,qs.length);return}
    const q=qs[i];const d=el('div','q');d.innerHTML=`<div class="tip">Question ${i+1} of ${qs.length} · Lecture ${q.lec}</div><div class="chalk" style="font-size:1.2rem;margin:4px 0">${q.q}</div>`;
    let done=false;q.o.forEach((t,k)=>{const b=el('button','opt',t);b.type='button';b.onclick=()=>{if(done)return;done=true;const ok=k===q.a;if(ok)score++;b.classList.add(ok?'right':'wrong');if(!ok)d.children[2+q.a].classList.add('right');
      const ex=el('div','ans',(ok?'✓ ':'✗ ')+q.e);d.append(ex);window.react&&window.react(ok?'Purr-fect.':'Not quite. Read the note.',ok?'happy':'think');
      if(!ok&&q.rev){const rv=el('button','btn sm','Review: '+(SCENES.find(x=>x.id===q.rev)||{title:'scene'}).title);rv.style.marginTop='6px';rv.onclick=()=>go(SCENES.findIndex(x=>x.id===q.rev));d.append(rv)}
      const nx=el('button','btn sm pri',i+1<qs.length?'Next question ▸':'See result');nx.style.marginTop='8px';nx.onclick=()=>{i++;show()};d.append(nx)};d.append(b)});
    box.append(d)}
  show()}
