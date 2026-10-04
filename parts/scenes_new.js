/* ===== New concept scenes, part 1 (lectures 1-3) ===== */
const outer=(a,b)=>a.map(x=>b.map(y=>cmul(x,cconj(y))));
const ROWSEL=(root,sel)=>root.querySelector(sel);

/* ---- n1a: double slit ---- */
SCENES.push({id:'n1a',title:'Why quantum mechanics exists',sub:'',
html:`<div class="grid2"><div class="panel col">
<svg viewBox="0 0 240 110" width="100%" role="img" aria-label="Electron source, wall with two slits, screen">
<circle cx="20" cy="55" r="8" fill="#f6b26b"/><text x="8" y="80" fill="#b9c4b8" font-size="10">source</text>
<rect x="110" y="8" width="8" height="38" fill="#b9c4b8"/><rect x="110" y="64" width="8" height="38" fill="#b9c4b8"/><rect x="110" y="50" width="8" height="10" fill="#b9c4b8" opacity=".0"/>
<text x="92" y="108" fill="#b9c4b8" font-size="10">two slits</text>
<rect x="212" y="4" width="5" height="102" fill="#8fd0f0"/><text x="196" y="108" fill="#b9c4b8" font-size="10">screen</text>
<path d="M30 55 L112 36 L210 20 M30 55 L112 74 L210 90" stroke="#f2d67a" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
<g id="eyes" opacity="0"><text x="106" y="30" font-size="14">👁</text><text x="106" y="86" font-size="14">👁</text></g></svg>
<div id="n1ac"></div>
<div class="row"><button class="btn pri" id="n1f1">Fire 1</button><button class="btn" id="n1f100">Fire 100</button><button class="btn" id="n1f1k">Fire 1000</button><button class="btn" id="n1r">Reset</button></div>
<div class="tip" id="n1t">Electrons fired: 0</div></div>
<div class="panel"><canvas id="n1cv"></canvas><div class="tip">Top: where each electron landed. Bottom: the histogram. Dashed line: the predicted probability. (Idealised illustration.)</div></div></div>`,
init(root){let det=false,N=0;const Nb=61,counts=new Array(Nb).fill(0);let dots=[];const cv=$('#n1cv',root);
  const pdf=x=>{const env=Math.exp(-x*x/(2*0.4*0.4));return det?env:env*(1+Math.cos(TAU*6*x))/2};
  chips($('#n1ac',root),[['off','Detector at slits: OFF'],['on','Detector at slits: ON']],'off',v=>{det=v==='on';$('#eyes',root).setAttribute('opacity',det?1:0);reset()});
  function fire(k){for(let i=0;i<k;i++){let x;do{x=2*rnd()-1}while(rnd()>pdf(x));counts[Math.min(Nb-1,Math.floor((x+1)/2*Nb))]++;N++;if(dots.length<700)dots.push([x,rnd()])}
    $('#n1t',root).textContent='Electrons fired: '+N;draw();if(N>=1000&&!det)react('Stripes! A pattern of waves from particles.','happy');if(N>=1000&&det)react('Detector on: no stripes.','think')}
  function reset(){counts.fill(0);N=0;dots=[];$('#n1t',root).textContent='Electrons fired: 0';draw()}
  function draw(){const {g,w,h}=fit(cv,0.95,300);g.clearRect(0,0,w,h);const L=10,W=w-20,topH=h*0.46;
    g.strokeStyle='rgba(243,241,230,.3)';g.strokeRect(L,6,W,topH-6);g.fillStyle='#f2d67a';dots.forEach(d=>{g.beginPath();g.arc(L+(d[0]+1)/2*W,10+d[1]*(topH-18),1.7,0,TAU);g.fill()});
    const y0=h-14,bh=h-topH-30,mx=Math.max(1,...counts),bw=W/Nb;g.fillStyle='rgba(143,208,240,.7)';counts.forEach((c,i)=>{const hh=c/mx*bh;g.fillRect(L+i*bw+1,y0-hh,bw-2,hh)});
    if(N>0){let sp=0;for(let i=0;i<Nb;i++)sp+=pdf(-1+(i+.5)*2/Nb);g.strokeStyle='#f6b26b';g.setLineDash([4,3]);g.lineWidth=2;g.beginPath();for(let i=0;i<Nb;i++){const t=N*pdf(-1+(i+.5)*2/Nb)/sp,yy=y0-Math.min(t/mx,1.3)*bh;i?g.lineTo(L+(i+.5)*bw,yy):g.moveTo(L+(i+.5)*bw,yy)}g.stroke();g.setLineDash([])}
    g.strokeStyle='rgba(243,241,230,.4)';g.beginPath();g.moveTo(L,y0);g.lineTo(L+W,y0);g.stroke();g.fillStyle='#b9c4b8';g.font='11px system-ui';g.fillText('position on screen',L+W/2-45,h-1)}
  $('#n1f1',root).onclick=()=>fire(1);$('#n1f100',root).onclick=()=>fire(100);$('#n1f1k',root).onclick=()=>fire(1000);$('#n1r',root).onclick=reset;draw();const ro=new ResizeObserver(draw);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n1b: Stern-Gerlach ---- */
SCENES.push({id:'n1b',title:'What is spin?',sub:'',
html:`<div class="grid2"><div class="panel col">
<svg id="n1bs" viewBox="0 0 200 130" width="100%" role="img" aria-label="Magnet axis seen along the beam"></svg>
<div id="n1bc"></div><div id="n1bsl"></div>
<div class="row"><button class="btn pri" id="n1bf">Fire 1</button><button class="btn" id="n1bf2">Fire 300 atoms</button><button class="btn" id="n1br">Reset</button></div>
<div class="tip" id="n1bt"></div></div>
<div class="panel"><canvas id="n1bcv"></canvas><div class="tip">Landing position along the magnet axis. Each atom is a tiny magnet with a random tilt.</div></div></div>`,
init(root){let mode='classical',axis=ang(0),N=0;const Nb=41,counts=new Array(Nb).fill(0);const cv=$('#n1bcv',root);
  chips($('#n1bc',root),[['classical','Classical guess'],['nature','What nature does']],'classical',v=>{mode=v;reset()});
  slider($('#n1bsl',root),'Rotate the magnet axis',0,180,1,0,v=>{axis=ang(v);reset();drawS()},v=>v+'°');
  function drawS(){const ax=100+55*Math.sin(axis),ay=65-55*Math.cos(axis);$('#n1bs',root).innerHTML=`<circle cx="100" cy="65" r="58" fill="none" stroke="rgba(243,241,230,.25)"/><circle cx="100" cy="65" r="3" fill="#f6b26b"/><text x="108" y="82" fill="#b9c4b8" font-size="9">beam (toward you)</text>
   <line x1="${200-ax}" y1="${130-ay}" x2="${ax}" y2="${ay}" stroke="#f2d67a" stroke-width="3"/><text x="${ax+4}" y="${ay-2}" fill="#f29fb4" font-size="12">N</text><text x="${200-ax-14}" y="${130-ay+10}" fill="#8fd0f0" font-size="12">S</text><text x="6" y="12" fill="#b9c4b8" font-size="10">field axis (looking down the beam)</text>`}
  function fire(k){for(let i=0;i<k;i++){const c=mode==='classical'?2*rnd()-1:(rnd()<.5?1:-1);counts[Math.max(0,Math.min(Nb-1,Math.floor((c+1.3)/2.6*Nb)))]++;N++}draw();
    const spots=counts.filter(x=>x>0).length;$('#n1bt',root).textContent=`${N} atoms landed in ${spots} different positions.`;if(N>=300&&mode==='nature')react('Two spots. Not a band. That is spin.','alert')}
  function reset(){counts.fill(0);N=0;$('#n1bt',root).textContent='';draw()}
  function draw(){const {g,w,h}=fit(cv,0.8,260);g.clearRect(0,0,w,h);const L=14,W=w-28,y0=h-36,bh=h-60,mx=Math.max(1,...counts),bw=W/Nb;
    g.fillStyle=mode==='classical'?'rgba(246,178,107,.8)':'rgba(155,224,168,.85)';counts.forEach((c,i)=>{const hh=c/mx*bh;g.fillRect(L+i*bw+1,y0-hh,bw-2,hh)});
    g.strokeStyle='rgba(243,241,230,.4)';g.beginPath();g.moveTo(L,y0);g.lineTo(L+W,y0);g.stroke();g.fillStyle='#b9c4b8';g.font='12px system-ui';
    [-1,0,1].forEach(v=>{const x=L+(v+1.3)/2.6*W;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y0+5);g.stroke();g.fillText(v===0?'0':v>0?'+μ':'−μ',x-8,y0+20)});
    g.fillText(mode==='classical'?'Classical: any value between −μ and +μ':'Nature: only +μ or −μ',L,16)}
  $('#n1bf',root).onclick=()=>fire(1);$('#n1bf2',root).onclick=()=>fire(300);$('#n1br',root).onclick=reset;drawS();draw();const ro=new ResizeObserver(draw);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n1c: apparatus, preparing, measuring ---- */
SCENES.push({id:'n1c',title:'Apparatus, preparing, measuring',sub:'',
html:`<div class="grid2"><div class="panel col">
<svg id="n1cs" viewBox="0 0 260 110" width="100%" role="img" aria-label="Two apparatus arrows"></svg>
<div class="tip">Apparatus 1 (arrow up, along z) prepares: we keep only the +1 atoms. Apparatus 2 measures at the angle below.</div>
<div id="n1cc"></div><div id="n1csl"></div>
<div class="row"><button class="btn pri" id="n1cf">Fire 100 prepared atoms</button><button class="btn" id="n1cr">Reset</button></div></div>
<div class="panel col"><div id="n1ch"></div><div class="eq" id="n1ce"></div></div></div>`,
init(root){let a=ang(90),pl=0,mi=0;const h=histo($('#n1ch',root),['+1','−1'],['#9be0a8','#f29fb4']);let sl;
  chips($('#n1cc',root),[['0','Same direction'],['90','Perpendicular'],['180','Opposite']],'90',v=>{sl.set(+v);a=ang(+v);reset()});
  sl=slider($('#n1csl',root),'Angle of apparatus 2 from apparatus 1',0,180,1,90,v=>{a=ang(v);reset()},v=>v+'°');
  function drawS(){const x2=190+40*Math.sin(a),y2=60-40*Math.cos(a);$('#n1cs',root).innerHTML=`<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#f2d67a"/></marker></defs>
   <rect x="30" y="20" width="60" height="80" rx="6" fill="rgba(255,255,255,.08)" stroke="#9be0a8"/><text x="32" y="14" fill="#9be0a8" font-size="11">apparatus 1 (prepare)</text>
   <line x1="60" y1="80" x2="60" y2="32" stroke="#9be0a8" stroke-width="3" marker-end="url(#ah2)"/>
   <rect x="150" y="20" width="80" height="80" rx="6" fill="rgba(255,255,255,.08)" stroke="#f6b26b"/><text x="152" y="14" fill="#f6b26b" font-size="11">apparatus 2 (measure)</text>
   <line x1="190" y1="60" x2="${x2}" y2="${y2}" stroke="#f6b26b" stroke-width="3" marker-end="url(#ah2)"/>
   <path d="M92 60 L148 60" stroke="#f3f1e6" stroke-dasharray="3 3" marker-end="url(#ah2)"/><text x="98" y="54" fill="#b9c4b8" font-size="10">+1 atoms</text>`}
  function upd(){const n=pl+mi;const N=n||1;const P=Math.cos(a/2)**2;h.update([pl/N,mi/N],[pl+' shots',mi+' shots']);
    $('#n1ce',root).innerHTML=`Prepared: spin +1 along z<br>Apparatus 2 at ${(a*180/Math.PI).toFixed(0)}° from it<br>exact P(+1) = cos²(α/2) = <b>${P.toFixed(3)}</b><br>measured: ${n?(pl/n).toFixed(3):'—'} (N=${n})`}
  function reset(){pl=mi=0;drawS();upd()}
  $('#n1cf',root).onclick=()=>{for(let i=0;i<100;i++){measure(KU,a,0).res>0?pl++:mi++}upd()};$('#n1cr',root).onclick=reset;reset()}});

/* ---- n1d: probability and averages ---- */
SCENES.push({id:'n1d',title:'Probability and averages',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n1ds"></div>
<div class="row"><button class="btn pri" data-k="1">Fire 1</button><button class="btn" data-k="10">10</button><button class="btn" data-k="100">100</button><button class="btn" data-k="1000">1000</button><button class="btn" data-k="10000">10000</button><button class="btn" id="n1dr">Reset</button></div>
<div class="eq" id="n1de"></div></div>
<div class="panel"><canvas id="n1dcv"></canvas><div class="tip">Running average of the ±1 results (vertical) against the number of shots, on a log scale (horizontal, log₁₀ N). Dashed: true value. Band: ±1/√N.</div></div></div>`,
init(root){let p=0.5,sum=0,n=0,avgs=[];const cv=$('#n1dcv',root);slider($('#n1ds',root),'Probability p of +1',0,1,0.01,0.5,v=>{p=v;reset()},v=>v.toFixed(2));
  function fire(k){for(let i=0;i<k;i++){sum+=rnd()<p?1:-1;n++;avgs.push(sum/n)}draw()}
  function reset(){sum=0;n=0;avgs=[];draw()}
  function draw(){const mean=2*p-1;const xs=[],ys=[],hi=[],lo=[];const m=avgs.length;const step=Math.max(1,Math.floor(m/400));for(let i=0;i<m;i+=step){xs.push(Math.log10(i+1));ys.push(avgs[i])}
    const bx=[],bh=[],bl=[];const maxN=Math.max(10,n);for(let j=0;j<=60;j++){const nn=Math.pow(10,Math.log10(maxN)*j/60);bx.push(Math.log10(Math.max(1,nn)));const e=Math.min(1,1/Math.sqrt(Math.max(1,nn)));bh.push(Math.min(1,mean+e));bl.push(Math.max(-1,mean-e))}
    plot(cv,[{xs:bx,ys:bh,color:'rgba(143,208,240,.7)',lw:1},{xs:bx,ys:bl,color:'rgba(143,208,240,.7)',lw:1},{xs,ys,color:'#f2d67a'}],{xmin:0,xmax:Math.max(1,Math.log10(maxN)),ymin:-1.05,ymax:1.05,hlines:[{y:mean,color:'#9be0a8'}],ratio:.7,minH:240,xticks:Math.min(4,Math.max(1,Math.round(Math.log10(maxN))))});
    $('#n1de',root).innerHTML=`true average 2p − 1 = <b>${mean.toFixed(3)}</b><br>measured after N = ${n}: <b>${n?(sum/n).toFixed(3):'—'}</b><br>typical error ≈ 1/sqrt(N) = ${n?(1/Math.sqrt(n)).toFixed(3):'—'}`}
  root.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>fire(+b.dataset.k));$('#n1dr',root).onclick=reset;draw();const ro=new ResizeObserver(draw);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n2a: what is a state ---- */
SCENES.push({id:'n2a',title:'What is a state?',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n2ap"></div><div id="n2as"></div><div class="tip">The spin direction (the whole state) in angles:</div></div>
<div class="panel col" id="n2am"></div></div>`,
init(root){let th=ang(40),ph=ang(30);const sl=[];const meters=$('#n2am',root);const rows=['x','y','z'].map(a=>{const r=el('div','col');r.innerHTML=`<div class="lbl"><span>⟨σ${a}⟩ (average along ${a})</span><output></output></div><div style="position:relative;height:18px;background:rgba(255,255,255,.1);border-radius:6px"><div style="position:absolute;left:50%;top:0;bottom:0;border-left:2px solid var(--line)"></div><div class="fill" style="position:absolute;top:2px;bottom:2px;border-radius:4px"></div></div><div class="tip pr"></div>`;meters.append(r);return r});
  const tot=el('div','eq');meters.append(tot);
  function upd(){const v=blochVec(ketAng(th,ph));['x','y','z'].forEach((a,i)=>{const r=rows[i],x=v[i];r.querySelector('output').textContent=x.toFixed(2);const f=r.querySelector('.fill');f.style.left=(x<0?50+x*50:50)+'%';f.style.width=Math.abs(x)*50+'%';f.style.background=x>=0?'#9be0a8':'#f29fb4';r.querySelector('.pr').textContent=`P(+1) = ${((1+x)/2).toFixed(2)},  P(−1) = ${((1-x)/2).toFixed(2)}`});
    tot.innerHTML=`⟨σx⟩² + ⟨σy⟩² + ⟨σz⟩² = ${(v[0]**2+v[1]**2+v[2]**2).toFixed(3)} <span class="tip">(always 1: the certainty budget)</span>`}
  chips($('#n2ap',root),[['u','Up (z)'],['r','Right (x)'],['i','In (y)'],['t','Tilted']],null,k=>{const m={u:[0,0],r:[90,0],i:[90,90],t:[50,40]}[k];th=ang(m[0]);ph=ang(m[1]);sl[0].set(m[0]);sl[1].set(m[1]);upd()});
  sl.push(slider($('#n2as',root),'θ',0,180,1,40,v=>{th=ang(v);upd()},v=>v+'°'));sl.push(slider($('#n2as',root),'φ',0,360,1,30,v=>{ph=ang(v);upd()},v=>v+'°'));upd()}});

/* ---- n2c: inner product and phase ---- */
SCENES.push({id:'n2c',title:'Inner products and phases',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="chalk" style="color:var(--yel)">State A</div><div id="n2cA"></div><div class="chalk" style="color:var(--blu)">State B</div><div id="n2cB"></div></div>
<div class="panel col"><canvas id="n2ccv"></canvas><div class="eq" id="n2ce"></div></div></div>`,
init(root){const S={tA:60,pA:0,tB:100,pB:120};const cv=$('#n2ccv',root);
  [['A','tA','pA'],['B','tB','pB']].forEach(([n,t,p])=>{slider($('#n2c'+n,root),'θ',0,180,1,S[t],v=>{S[t]=v;upd()},v=>v+'°');slider($('#n2c'+n,root),'φ',0,360,1,S[p],v=>{S[p]=v;upd()},v=>v+'°')});
  function upd(){const A=ketAng(ang(S.tA),ang(S.pA)),B=ketAng(ang(S.tB),ang(S.pB));const ip=inner(A,B),P=cabs2(ip),nA=blochVec(A),nB=blochVec(B),dot=nA[0]*nB[0]+nA[1]*nB[1]+nA[2]*nB[2];
    const {g,w,h}=fit(cv,0.8,240);g.clearRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*0.4;g.strokeStyle='rgba(243,241,230,.35)';g.beginPath();g.arc(cx,cy,R,0,TAU);g.stroke();g.beginPath();g.moveTo(cx-R-8,cy);g.lineTo(cx+R+8,cy);g.moveTo(cx,cy-R-8);g.lineTo(cx,cy+R+8);g.stroke();
    g.fillStyle='#b9c4b8';g.font='11px system-ui';g.fillText('real',cx+R-8,cy+14);g.fillText('imag',cx+4,cy-R-2);
    g.strokeStyle='#f2d67a';g.fillStyle='#f2d67a';g.lineWidth=3;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+ip[0]*R,cy-ip[1]*R);g.stroke();g.beginPath();g.arc(cx+ip[0]*R,cy-ip[1]*R,5,0,TAU);g.fill();
    g.setLineDash([3,3]);g.strokeStyle='#9be0a8';g.beginPath();g.arc(cx,cy,Math.hypot(ip[0],ip[1])*R,0,TAU);g.stroke();g.setLineDash([]);
    $('#n2ce',root).innerHTML=`⟨A|B⟩ = ${fcx(ip)}<br>size = ${Math.hypot(...ip).toFixed(3)}, phase = ${(Math.atan2(ip[1],ip[0])*180/Math.PI).toFixed(0)}°<br>P = |⟨A|B⟩|² = <b>${P.toFixed(3)}</b><br>(1 + n<sub>A</sub>·n<sub>B</sub>)/2 = ${((1+dot)/2).toFixed(3)} ✓`}
  upd();const ro=new ResizeObserver(upd);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n2d: other axes ---- */
SCENES.push({id:'n2d',title:'Spin along other axes',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">Prepare a state:</div><div id="n2dp"></div><div class="eq" id="n2df"></div><div class="tip">Measure along:</div><div id="n2dm"></div><button class="btn pri" id="n2db">Fire 1000 shots</button></div>
<div class="panel col"><div id="n2dh"></div><div class="eq" id="n2de"></div></div></div>`,
init(root){let st='r',ax='z';const recipe={u:'|u⟩ (up along z)',d:'|d⟩ (down along z)',r:'|r⟩ = (|u⟩ + |d⟩)/√2',l:'|l⟩ = (|u⟩ − |d⟩)/√2',i:'|i⟩ = (|u⟩ + i|d⟩)/√2',o:'|o⟩ = (|u⟩ − i|d⟩)/√2'};
  const h=histo($('#n2dh',root),['+1 measured','+1 exact','−1 measured','−1 exact'],['#9be0a8','#8fd0f0','#f29fb4','#8fd0f0']);let cnt=null;
  chips($('#n2dp',root),Object.keys(recipe).map(k=>[k,'|'+k+'⟩']),'r',v=>{st=v;cnt=null;upd()});chips($('#n2dm',root),[['x','x axis'],['y','y axis'],['z','z axis']],'z',v=>{ax=v;cnt=null;upd()});
  const axv=()=>({x:[Math.PI/2,0],y:[Math.PI/2,Math.PI/2],z:[0,0]}[ax]);
  function upd(){const [t,p]=axv(),P=cabs2(inner(axisKets(t,p)[0],KETS[st]));$('#n2df',root).innerHTML=recipe[st]+'<br>'+ketHTML(KETS[st]);
    h.update(cnt?[cnt,P,1-cnt,1-P]:[0,P,0,1-P],cnt?[cnt.toFixed(3),P.toFixed(3),(1-cnt).toFixed(3),(1-P).toFixed(3)]:['—',P.toFixed(3),'—',(1-P).toFixed(3)]);
    $('#n2de',root).innerHTML=`State ${'|'+st+'⟩'}, measured along ${ax}: P(+1) = <b>${P.toFixed(3)}</b>`+(P>0.999?'<br><span class="ok">certain: it is an eigenstate of that axis</span>':P<0.001?'<br><span class="ok">certain: −1</span>':Math.abs(P-0.5)<0.001?'<br><span class="warn">completely uncertain: 50/50</span>':'')}
  $('#n2db',root).onclick=()=>{const [t,p]=axv();let c=0;for(let i=0;i<1000;i++)if(measure(KETS[st],t,p).res>0)c++;cnt=c/1000;upd()};upd()}});

/* ---- n3a: matrix refresher ---- */
SCENES.push({id:'n3a',title:'Refresher: matrices and eigenvectors',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n3ac"></div><div id="n3as"></div><div class="row" id="n3ab"></div><div class="eq" id="n3ae"></div></div>
<div class="panel"><canvas id="n3acv"></canvas><div class="tip"><span style="color:#8fd0f0">blue</span>: your vector v · <span style="color:#f2d67a">yellow</span>: M v · <span style="color:#9be0a8">green dashed</span>: eigen-directions</div></div></div>`,
init(root){const MS={stretch:{n:'Stretch',M:[[2,0],[0,0.5]]},shear:{n:'Shear',M:[[1,1],[0,1]]},sz:{n:'σz (mirror)',M:[[1,0],[0,-1]]},sx:{n:'σx (swap)',M:[[0,1],[1,0]]},rot:{n:'Rotate 40°',M:[[Math.cos(.698),-Math.sin(.698)],[Math.sin(.698),Math.cos(.698)]]}};
  let key='stretch',a=ang(20);const cv=$('#n3acv',root);let sl;
  chips($('#n3ac',root),Object.keys(MS).map(k=>[k,MS[k].n]),'stretch',v=>{key=v;upd()});sl=slider($('#n3as',root),'Direction of v',0,360,1,20,v=>{a=ang(v);upd()},v=>v+'°');
  const eig=M=>{const [[A,B],[C,D]]=M;const tr=A+D,det=A*D-B*C,disc=tr*tr-4*det;if(disc<-1e-9)return[];const s=Math.sqrt(Math.max(0,disc)),ls=disc<1e-9?[tr/2]:[(tr+s)/2,(tr-s)/2];
    return ls.map(l=>{let v;if(Math.abs(C)>1e-9)v=[l-D,C];else if(Math.abs(B)>1e-9)v=[B,l-A];else v=Math.abs(l-A)<1e-9?[1,0]:[0,1];const n=Math.hypot(...v);return {l,v:[v[0]/n,v[1]/n]}})};
  function upd(){const M=MS[key].M,v=[Math.cos(a),Math.sin(a)],Mv=[M[0][0]*v[0]+M[0][1]*v[1],M[1][0]*v[0]+M[1][1]*v[1]],es=eig(M);
    $('#n3ab',root).innerHTML='';es.forEach((e,i)=>{const b=el('button','btn sm','Snap to eigenvector '+(i+1));b.onclick=()=>{let d=Math.atan2(e.v[1],e.v[0])*180/Math.PI;if(d<0)d+=360;sl.set(d);a=ang(d);upd()};$('#n3ab',root).append(b)});
    const cross=(v[0]*Mv[1]-v[1]*Mv[0])/(Math.hypot(...Mv)||1),par=Math.abs(cross)<0.02;
    $('#n3ae',root).innerHTML=`M = ${matHTML(M.map(r=>r.map(x=>[x,0])))}<br>M v = (${Mv[0].toFixed(2)}, ${Mv[1].toFixed(2)})<br>`+(es.length?`eigenvalues: ${es.map(e=>e.l.toFixed(2)).join(', ')}`:'no real eigenvectors: every direction turns')+(par?`<br><span class="ok">M v lies along v: eigenvector, eigenvalue ≈ ${(Mv[0]*v[0]+Mv[1]*v[1]).toFixed(2)}</span>`:'');
    const {g,w,h}=fit(cv,0.9,280);g.clearRect(0,0,w,h);const cx=w/2,cy=h/2,sc=Math.min(w,h)/6;const P=p=>[cx+p[0]*sc,cy-p[1]*sc];
    g.strokeStyle='rgba(243,241,230,.12)';for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(cx+i*sc,0);g.lineTo(cx+i*sc,h);g.moveTo(0,cy+i*sc);g.lineTo(w,cy+i*sc);g.stroke()}
    g.strokeStyle='rgba(243,241,230,.3)';g.beginPath();g.arc(cx,cy,sc,0,TAU);g.stroke();
    g.setLineDash([5,4]);g.strokeStyle='#9be0a8';es.forEach(e=>{const p1=P([e.v[0]*3,e.v[1]*3]),p2=P([-e.v[0]*3,-e.v[1]*3]);g.beginPath();g.moveTo(p1[0],p1[1]);g.lineTo(p2[0],p2[1]);g.stroke()});g.setLineDash([]);
    const arrow=(p,col)=>{const q=P(p);g.strokeStyle=col;g.fillStyle=col;g.lineWidth=3;g.beginPath();g.moveTo(cx,cy);g.lineTo(q[0],q[1]);g.stroke();g.beginPath();g.arc(q[0],q[1],5,0,TAU);g.fill()};arrow(Mv,'#f2d67a');arrow(v,'#8fd0f0')}
  upd();const ro=new ResizeObserver(upd);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n3b: spectral decomposition ---- */
SCENES.push({id:'n3b',title:'Operators from eigenvectors',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n3bc"></div><div class="tip">A state to measure:</div><div id="n3bs"></div></div>
<div class="panel col"><div class="eq" id="n3be" style="overflow-x:auto"></div><div class="eq" id="n3bf"></div></div></div>`,
init(root){let o='x',th=ang(70),ph=ang(30);const AX={x:[Math.PI/2,0],y:[Math.PI/2,Math.PI/2],z:[0,0]};
  chips($('#n3bc',root),[['x','σx'],['y','σy'],['z','σz']],'x',v=>{o=v;upd()});slider($('#n3bs',root),'θ',0,180,1,70,v=>{th=ang(v);upd()},v=>v+'°');slider($('#n3bs',root),'φ',0,360,1,30,v=>{ph=ang(v);upd()},v=>v+'°');
  function upd(){const [pk,mk]=axisKets(...AX[o]),Pp=outer(pk,pk),Pm=outer(mk,mk),sum=madd(msc(Pp,1),msc(Pm,-1)),M=opMat(o),psi=ketAng(th,ph);
    const prob=inner(psi,mv(Pp,psi))[0],probm=inner(psi,mv(Pm,psi))[0],comp=mv(Pp,psi);
    $('#n3be',root).innerHTML=`P<sub>+</sub> = |+⟩⟨+| = ${matHTML(Pp)}  P<sub>−</sub> = |−⟩⟨−| = ${matHTML(Pm)}<br>(+1)P<sub>+</sub> + (−1)P<sub>−</sub> = ${matHTML(sum)} = σ${o} <span class="${isSame(sum.flat(),M.flat(),1e-9)?'ok':'bad'}">${isSame(sum.flat(),M.flat(),1e-9)?'✓ rebuilt exactly':'✗'}</span>`;
    $('#n3bf',root).innerHTML=`P<sub>+</sub>|ψ⟩ = ${ketHTML(comp)}  (the part of |ψ⟩ along |+⟩)<br>⟨ψ|P<sub>+</sub>|ψ⟩ = <b>${prob.toFixed(3)}</b> = probability of +1<br>⟨ψ|P<sub>−</sub>|ψ⟩ = ${probm.toFixed(3)} · sum = ${(prob+probm).toFixed(3)}`}
  upd()}});
