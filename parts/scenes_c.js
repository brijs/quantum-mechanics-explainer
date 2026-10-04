/* ===== Act III: Lectures 6-7 ===== */
function wrapPi(x){x=(x+Math.PI)%(TAU);if(x<0)x+=TAU;return x-Math.PI}
const SINGLET=[ZERO,c(R2),c(-R2),ZERO];
/* joint probabilities for two spins measured along axes (aTh,0) and (bTh,0) */
function joint(S,aTh,bTh){const A=axisKets(aTh,0),B=axisKets(bTh,0);const out={};[['+',0],['-',1]].forEach(([sa,ia])=>[['+',0],['-',1]].forEach(([sb,ib])=>{out[sa+sb]=cabs2(inner(kron(A[ia],B[ib]),S))}));return out}
const Eq=(S,a,b)=>{const p=joint(S,a,b);return p['++']+p['--']-p['+-']-p['-+']};
function ptraceB(psi){return [[0,1].map(a2=>[0,1].map(a1=>[0,1].reduce((s,b)=>cadd(s,cmul(psi[a1*2+b],cconj(psi[a2*2+b]))),ZERO)))][0]}
function rhoA(psi){const r=[[ZERO,ZERO],[ZERO,ZERO]];for(let a=0;a<2;a++)for(let a2=0;a2<2;a2++)for(let b=0;b<2;b++)r[a][a2]=cadd(r[a][a2],cmul(psi[a*2+b],cconj(psi[a2*2+b])));return r}

SCENES.push({id:'s13',belt:2,title:'Combining systems',sub:'Lecture 6 · Tensor products: product versus entangled',
html:`<div class="grid2"><div class="panel col"><div class="tip">Real amplitudes for the basis |uu⟩ |ud⟩ |du⟩ |dd⟩ (auto-normalised):</div><div id="s13s"></div><div id="s13p"></div></div>
<div class="panel"><div class="eq" id="s13e"></div><div class="chalk big" id="s13v"></div></div></div>`,
init(root){const v=[0.7,0.2,-0.3,0.6];const sl=[];
  ['uu','ud','du','dd'].forEach((n,k)=>sl.push(slider($('#s13s',root),`amplitude |${n}⟩`,-1,1,0.01,v[k],x=>{v[k]=x;upd()},x=>x.toFixed(2))));
  chips($('#s13p',root),[['uu','|uu⟩'],['ur','|u⟩|r⟩'],['sing','singlet'],['t0','triplet₀'],['phi','Φ⁺ (uu+dd)']],null,k=>{const P={uu:[1,0,0,0],ur:[R2,R2,0,0],sing:[0,R2,-R2,0],t0:[0,R2,R2,0],phi:[R2,0,0,R2]}[k];P.forEach((x,i)=>{v[i]=x;sl[i].set(x)});upd()});
  function upd(){const n=Math.hypot(...v)||1;const w=v.map(x=>x/n);const psi=w.map(x=>c(x));const det=w[0]*w[3]-w[1]*w[2];const conc=2*Math.abs(det);let fac='';
    if(Math.abs(det)<0.005){const rows=[[w[0],w[1]],[w[2],w[3]]];const i=Math.hypot(...rows[0])>=Math.hypot(...rows[1])?0:1;const bn=Math.hypot(...rows[i]);const b=rows[i].map(x=>x/bn);const a=rows.map(r=>r[0]*b[0]+r[1]*b[1]);
      fac=`<br>= (${a[0].toFixed(2)}|u⟩ + ${a[1].toFixed(2)}|d⟩) ⊗ (${b[0].toFixed(2)}|u⟩ + ${b[1].toFixed(2)}|d⟩)`}
    $('#s13e',root).innerHTML=`${ketHTML(psi)}  normalised<br>ad − bc = ${w[0].toFixed(2)}·${w[3].toFixed(2)} − ${w[1].toFixed(2)}·${w[2].toFixed(2)} = <b>${det.toFixed(3)}</b><br>concurrence 2|ad−bc| = ${conc.toFixed(3)}${fac}`;
    $('#s13v',root).innerHTML=Math.abs(det)<0.005?'<span class="ok">Product state: the parts have their own states</span>':`<span class="warn">Entangled (${(conc*100).toFixed(0)}% of maximum)</span>`}
  upd()}});

SCENES.push({id:'s14',belt:2,title:'The singlet: Alice and Bob',sub:'Lecture 6 · |sing⟩ = (|ud⟩ − |du⟩)/√2',
html:`<div class="grid2"><div class="panel col"><div id="s14s"></div><div class="row"><button class="btn pri" id="s14f">Fire 1 pair</button><button class="btn" id="s14g">Fire 200</button><button class="btn" id="s14r">Reset</button></div><div class="tip" id="s14l">No pairs yet.</div></div>
<div class="panel"><div class="eq" id="s14e"></div><div id="s14h"></div></div></div>`,
init(root){let a=0,b=0,cnt={'++':0,'+-':0,'-+':0,'--':0},n=0;
  slider($('#s14s',root),"Alice's axis angle",-180,180,1,0,v=>{a=ang(v);reset()},v=>v+'°');slider($('#s14s',root),"Bob's axis angle",-180,180,1,0,v=>{b=ang(v);reset()},v=>v+'°');
  const h=histo($('#s14h',root),['Alice +, Bob +','+ , −','− , +','− , −'],['#9be0a8','#f29fb4','#f29fb4','#9be0a8']);
  function fire(k){for(let j=0;j<k;j++){const p=joint(SINGLET,a,b);const r=rnd();let acc=0,pick='--';for(const key of ['++','+-','-+','--']){acc+=p[key];if(r<acc){pick=key;break}}cnt[pick]++;n++}
    $('#s14l',root).textContent='Last pair: Alice '+(n?'measured':'—');upd()}
  function reset(){cnt={'++':0,'+-':0,'-+':0,'--':0};n=0;$('#s14l',root).textContent='No pairs yet.';upd()}
  function upd(){const p=joint(SINGLET,a,b),E=Eq(SINGLET,a,b);const N=n||1;h.update(['++','+-','-+','--'].map(k=>cnt[k]/N),['++','+-','-+','--'].map(k=>'exact '+p[k].toFixed(2)));
    const Es=n?((cnt['++']+cnt['--']-cnt['+-']-cnt['-+'])/n):null;
    $('#s14e',root).innerHTML=`exact correlation ⟨σ_a τ_b⟩ = ${E.toFixed(3)} = −cos(${((a-b)*180/Math.PI).toFixed(0)}°) = ${(-Math.cos(a-b)).toFixed(3)}<br>Alice alone: P(+) = ${(p['++']+p['+-']).toFixed(2)} · Bob alone: P(+) = ${(p['++']+p['-+']).toFixed(2)}<br>sampled correlation (N=${n}) = ${Es==null?'—':Es.toFixed(3)}`}
  $('#s14f',root).onclick=()=>fire(1);$('#s14g',root).onclick=()=>{fire(200);if(Math.abs(a-b)<1e-9)react('Same axis: always opposite. Yet each alone is a fair coin.','alert')};$('#s14r',root).onclick=reset;upd()}});

SCENES.push({id:'s15',belt:2,title:'Density matrix and entanglement',sub:'Lectures 6–7 · Pure whole, mixed part',
html:`<div class="grid2"><div class="panel col"><div class="tip">|Ψ⟩ = cos κ |ud⟩ − sin κ |du⟩ (κ = 0: product, κ = 45°: singlet)</div><div id="s15s"></div><div class="eq" id="s15e"></div></div>
<div class="panel"><canvas id="s15p"></canvas><div class="tip">Entropy of Alice's state in bits vs κ</div></div></div>`,
init(root){let k=0;slider($('#s15s',root),'κ',0,45,0.5,0,v=>{k=ang(v);upd()},v=>v+'°');const H=p=>p<=1e-12?0:-p*Math.log2(p);
  function upd(){const psi=[ZERO,c(Math.cos(k)),c(-Math.sin(k)),ZERO],r=rhoA(psi);const p1=r[0][0][0],p2=r[1][1][0];const S=H(p1)+H(p2);const pur=p1*p1+p2*p2+2*cabs2(r[0][1]);
    $('#s15e',root).innerHTML=`ρ<sub>A</sub> = Tr<sub>B</sub> |Ψ⟩⟨Ψ| = ${matHTML(r)}<br>purity Tr ρ² = ${pur.toFixed(3)} ${pur>0.999?'(pure)':'(mixed)'}<br>entropy S = ${S.toFixed(3)} bits`;
    const xs=[],ys=[];for(let i=0;i<=90;i++){const kk=ang(i/2);const q=Math.cos(kk)**2;xs.push(i/2);ys.push(H(q)+H(1-q))}
    plot($('#s15p',root),[{xs,ys,color:'#f29fb4'}],{xmin:0,xmax:45,ymin:0,ymax:1.05,dots:[{x:k*180/Math.PI,y:S,color:'#f2d67a'}],ratio:.6})}
  upd();const ro=new ResizeObserver(upd);ro.observe($('#s15p',root));return()=>ro.disconnect()}});

SCENES.push({id:'s16',belt:2,title:'Bell and the CHSH test',sub:'Lecture 7 · Quantum breaks the classical ceiling of 2',
html:`<div class="grid2"><div class="panel col"><div id="s16s"></div><button class="btn pri" id="s16o">Set optimal angles</button></div>
<div class="panel col"><div class="eq" id="s16e"></div><div id="s16m"></div><div class="tip">Classical model: a hidden angle λ decides each outcome (Alice: sign cos(a−λ), Bob: −sign cos(b−λ)). A cartoon of local hidden variables, an illustration beyond the book's text.</div></div></div>`,
init(root){const A={a:0,a2:90,b:45,b2:135};const sl={};
  [['a','Alice axis a'],['a2','Alice axis a′'],['b','Bob axis b'],['b2','Bob axis b′']].forEach(([k,t])=>sl[k]=slider($('#s16s',root),t,-180,180,1,A[k],v=>{A[k]=v;upd()},v=>v+'°'));
  $('#s16o',root).onclick=()=>{Object.assign(A,{a:0,a2:90,b:45,b2:135});Object.keys(sl).forEach(k=>sl[k].set(A[k]));upd();react('Optimal angles: |S| = 2√2.','happy')};
  const Ec=(x,y)=>-(1-2*Math.abs(wrapPi(ang(x-y)))/Math.PI);
  const meters=$('#s16m',root);meters.innerHTML=`<div class="tip">|S| (scale 0 – 2√2). Dashed marker = classical limit 2</div>
  <div style="position:relative;margin:6px 0"><div style="height:18px;background:rgba(255,255,255,.1);border-radius:6px;position:relative"><div id="mc" style="height:100%;background:#f6b26b;border-radius:6px"></div><div style="position:absolute;left:70.71%;top:-3px;bottom:-3px;border-left:2px dashed #f2d67a"></div></div><div class="tip">classical model</div>
  <div style="height:18px;background:rgba(255,255,255,.1);border-radius:6px;margin-top:6px"><div id="mq" style="height:100%;background:#9be0a8;border-radius:6px"></div></div><div class="tip">quantum singlet</div></div>`;
  function upd(){const q=(a,b)=>Eq(SINGLET,ang(a),ang(b));
    const Sq=q(A.a,A.b)-q(A.a,A.b2)+q(A.a2,A.b)+q(A.a2,A.b2);const Sc=Ec(A.a,A.b)-Ec(A.a,A.b2)+Ec(A.a2,A.b)+Ec(A.a2,A.b2);
    $('#s16e',root).innerHTML=`S = E(a,b) − E(a,b′) + E(a′,b) + E(a′,b′)<br>quantum: S = <b>${Sq.toFixed(3)}</b> (E = −cos of angle between axes)<br>classical model: S = <b>${Sc.toFixed(3)}</b><br><span class="${Math.abs(Sq)>2.0001?'warn':'ok'}">${Math.abs(Sq)>2.0001?'|S| > 2: no local hidden-variable explanation':'|S| ≤ 2: classical could do this'}</span>`;
    $('#mc',root).style.width=(Math.abs(Sc)/(2*Math.SQRT2)*100)+'%';$('#mq',root).style.width=(Math.abs(Sq)/(2*Math.SQRT2)*100)+'%'}
  upd()}});
