/* ===== Act I: Lectures 1-3 ===== */
function measure(psi,th,ph){const [p,m]=axisKets(th,ph);const P=cabs2(inner(p,psi));const plus=rnd()<P;return {res:plus?1:-1,post:plus?p:m,P}}
const ang=d=>d*Math.PI/180;
function opMat(k){return {x:SX,y:SY,z:SZ}[k]}
const opName={x:'σx',y:'σy',z:'σz'};

SCENES.push({id:'s00',belt:0,title:'Open the box',sub:'Welcome · the map of the book',
html:`<p class="chalk big" style="margin-top:0">No background needed. Ten lectures, one idea at a time.</p>
<div class="grid2" style="margin:8px 0"><div class="cl"><b>Every concept has four layers</b>1. <b style="display:inline;color:var(--chalk)">The idea</b>: a plain-language story.<br>2. <b style="display:inline;color:var(--chalk)">The picture</b>: something you can see and drag.<br>3. <b style="display:inline;color:var(--chalk)">The math</b>: the equation, kept short.<br>4. <b style="display:inline;color:var(--chalk)">Try it</b>: an experiment you run yourself.</div>
<div class="cl"><b>Help along the way</b>Tap any <span class="g" style="cursor:default">dotted word</span> for a definition, open the 📖 Glossary any time, read the <i>common misconception</i> card, and take the 3-question check after each lecture.</div></div>
<div class="lec" id="lecmap"></div>
<div class="note"><b>From your notes:</b> you already wrote down the heart of lectures 1–3: spin as a qubit, kets and bras, inner products as probability amplitudes. Those notes appear as blue boxes like this one.</div>
<p class="tip">Tip: use the dots at the top to jump around (a gap marks each new lecture), ←/→ keys to move, and the buttons under the cat to replay or mute.</p>`,
init(root){const L=[['1','Systems & experiments','n1a'],['2','Quantum states','n2a'],['3','Principles','n3a'],['4','Time & change','n4a'],['5','Uncertainty','n5a'],['6','Entanglement','n6a'],['7','More entanglement','s15'],['8','Particles & waves','n8a'],['9','Particle dynamics','n9a'],['10','Harmonic oscillator','n10a']];
  const m=$('#lecmap',root);L.forEach(([n,t,id])=>{const b=el('button','',`<b>Lecture ${n}</b>${t}`);b.type='button';b.style.cssText='text-align:left;cursor:pointer';b.onclick=()=>go(SCENES.findIndex(x=>x.id===id));m.append(b)})}});

/* ---- Scene 1: spin & cos θ ---- */
SCENES.push({id:'s01',belt:0,title:'Spin is a coin that lies about its axis',sub:'Lecture 1 · Systems and experiments',
html:`<div class="grid2"><div class="panel col">
<svg id="s1svg" viewBox="0 0 200 160" width="100%" role="img" aria-label="Preparation axis z and apparatus axis tilted by theta"></svg>
<div id="s1sl"></div>
<div class="row"><button class="btn pri" id="f1">Fire 1</button><button class="btn" id="f100">Fire 100</button><button class="btn" id="fr">Reset</button></div></div>
<div class="panel col"><div class="chalk">Outcomes (spin prepared up along z)</div><div id="s1h"></div>
<div class="eq" id="s1eq"></div><div class="tip" id="s1last">No shots yet.</div></div></div>
<div class="note"><b>From your notes:</b> after preparing +1 along z, measuring along perpendicular x gives an average of 0, and at angle θ the average is cos θ. Every single shot is still ±1.</div>`,
init(root){let n=0,sum=0,pl=0,mi=0;let th=ang(60);
  const h=histo($('#s1h',root),['+1','−1'],['#9be0a8','#f29fb4']);
  const sl=slider($('#s1sl',root),'Apparatus angle θ from z (degrees)',0,180,1,60,v=>{th=ang(v);reset();draw()},v=>v+'°');
  function draw(){const s=$('#s1svg',root);const ax=100+60*Math.sin(th),ay=80-60*Math.cos(th);
    s.innerHTML=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#f2d67a"/></marker></defs>
    <line x1="100" y1="80" x2="100" y2="14" stroke="#9be0a8" stroke-width="3" marker-end="url(#ah)"/><text x="108" y="22" fill="#9be0a8" font-size="12">prepared: +z</text>
    <line x1="100" y1="80" x2="${ax}" y2="${ay}" stroke="#f6b26b" stroke-width="3" stroke-dasharray="5 3"/><text x="${ax+(ax>100?6:-70)}" y="${ay-4}" fill="#f6b26b" font-size="12">apparatus</text>
    <path d="M100 50 A30 30 0 0 ${th>0?1:0} ${100+30*Math.sin(th)} ${80-30*Math.cos(th)}" stroke="#f3f1e6" fill="none"/><text x="${100+14*Math.sin(th/2+0.2)+4}" y="${80-40*Math.cos(th/2)}" fill="#f3f1e6" font-size="12">θ</text>`}
  function upd(){const N=n||1;h.update([pl/N,mi/N]);const avg=n?sum/n:0;
    $('#s1eq',root).innerHTML=`⟨σ⟩ = ${n?avg.toFixed(3):'—'} <span class="tip">(N=${n})</span><br>cos θ = ${Math.cos(th).toFixed(3)}<br>P(+1) = cos²(θ/2) = ${(Math.cos(th/2)**2).toFixed(3)}`}
  function fire(k){let last;for(let j=0;j<k;j++){const r=measure(KU,th,0).res;n++;sum+=r;r>0?pl++:mi++;last=r}$('#s1last',root).textContent='Last result: '+(last>0?'+1':'−1');upd();
    if(n>=100&&Math.abs(sum/n-Math.cos(th))<0.15)react('The average tracks cos θ. Geometry hiding in statistics.','happy')}
  function reset(){n=sum=pl=mi=0;$('#s1last',root).textContent='No shots yet.';upd()}
  $('#f1',root).onclick=()=>fire(1);$('#f100',root).onclick=()=>fire(100);$('#fr',root).onclick=reset;draw();upd()}});

/* ---- Scene 2: never gentle ---- */
SCENES.push({id:'s02',belt:0,title:'Experiments are never gentle',sub:'Lecture 1 · Measuring σz, then σx, then σz again',
html:`<div class="grid2"><div class="panel col"><div class="chalk">Step through one experiment</div>
<div class="row"><button class="btn" id="a0">1 · Prepare ↑ along z</button><button class="btn" id="a1">2 · Measure σx</button><button class="btn" id="a2">3 · Measure σz</button></div>
<div id="s2log" class="tip" style="min-height:90px"></div></div>
<div class="panel col"><div class="chalk">Statistics over 200 runs</div>
<div class="row"><button class="btn pri" id="auto1">Prepare ↑ → measure z</button><button class="btn pri" id="auto2">Prepare ↑ → measure x → measure z</button></div>
<div id="s2h"></div><div class="tip" id="s2t">Fraction of runs where the final z measurement says ↑.</div></div></div>
<div class="note"><b>From your notes:</b> "Experiments are never gentle." A measurement strong enough to learn one component necessarily disrupts another. Position-and-momentum is just the famous special case.</div>`,
init(root){let psi=null;const log=$('#s2log',root);const add=t=>{log.innerHTML+=t+'<br>'};
  const h=histo($('#s2h',root),['z only','z → x → z'],['#9be0a8','#f6b26b']);const res={a:null,b:null};
  $('#a0',root).onclick=()=>{psi=KU;log.innerHTML='';add('Prepared |u⟩: z-spin is definitely +1.')};
  $('#a1',root).onclick=()=>{if(!psi){add('Prepare first.');return}const m=measure(psi,Math.PI/2,0);psi=m.post;add(`σx = ${m.res>0?'+1 (state |r⟩)':'−1 (state |l⟩)'}`)};
  $('#a2',root).onclick=()=>{if(!psi){add('Prepare first.');return}const m=measure(psi,0,0);psi=m.post;add(`σz = ${m.res>0?'+1 (↑)':'−1 (↓)'}`);if(m.res<0)react('It was definitely up before!','alert')};
  const run=(withX)=>{let up=0;for(let k=0;k<200;k++){let p=KU;if(withX)p=measure(p,Math.PI/2,0).post;if(measure(p,0,0).res>0)up++}return up/200};
  $('#auto1',root).onclick=()=>{res.a=run(false);upd()};$('#auto2',root).onclick=()=>{res.b=run(true);upd();react('Measuring x erased what we knew about z.','think')};
  function upd(){h.update([res.a||0,res.b||0],[res.a==null?'—':(res.a*100).toFixed(0)+'%',res.b==null?'—':(res.b*100).toFixed(0)+'%'])}upd()}});

/* ---- Scene 3: kets and bras ---- */
SCENES.push({id:'s03',belt:0,title:'States are vectors',sub:'Lecture 2 · Kets, bras, normalization',
html:`<div class="grid2"><div class="panel col"><div id="s3c"></div><div id="s3s"></div>
<div class="tip">Presets:</div><div id="s3p"></div></div>
<div class="panel"><div class="eq" id="s3k"></div><div class="eq" id="s3b"></div><div class="eq" id="s3n"></div></div></div>
<div class="note"><b>From your notes:</b> kets are <b style="color:var(--chalk)">columns</b> with complex components; the bra is the <b style="color:var(--chalk)">conjugate row</b> and lives in a different (dual) space. The space of states is a vector space, not a set. Normalised means ⟨A|A⟩ = 1.</div>`,
init(root){let a=R2,phi=0;
  const s1=slider($('#s3c',root),'|α_u|  (so |α_d| = √(1−|α_u|²))',0,1,0.001,R2,v=>{a=v;upd()},v=>v.toFixed(3));
  const s2=slider($('#s3s',root),'Phase of α_d (degrees)',0,360,1,0,v=>{phi=ang(v);upd()},v=>v+'°');
  chips($('#s3p',root),[['u','|u⟩'],['d','|d⟩'],['r','|r⟩'],['l','|l⟩'],['i','|i⟩'],['o','|o⟩']],null,k=>{const v=KETS[k];a=Math.hypot(v[0][0],v[0][1]);const d=v[1];let p=Math.atan2(d[1],d[0])-Math.atan2(v[0][1],v[0][0]);if(a>0.9999)p=0;if(a<1e-6)p=0;
    phi=(p+TAU)%TAU;s1.set(a);s2.set(phi*180/Math.PI);upd()});
  function upd(){const A=[c(a),csc(cexp(phi),Math.sqrt(Math.max(0,1-a*a)))];
    $('#s3k',root).innerHTML=`${ket('A')} = α<sub>u</sub>${ket('u')} + α<sub>d</sub>${ket('d')} = ${ketHTML(A)}`;
    $('#s3b',root).innerHTML=`${bra('A')} = ${braHTML(A)}  <span class="tip">(conjugated, written as a row)</span>`;
    const ip=inner(A,A);$('#s3n',root).innerHTML=`<span class="math">⟨A|A⟩</span> = α<sub>u</sub>*α<sub>u</sub> + α<sub>d</sub>*α<sub>d</sub> = ${(cabs2(A[0])).toFixed(3)} + ${(cabs2(A[1])).toFixed(3)} = <b class="ok">${ip[0].toFixed(3)}</b>`}
  upd()}});

/* ---- Scene 4: Born table ---- */
SCENES.push({id:'s04',belt:0,title:'Amplitude, then probability',sub:'Lecture 2 · P = |⟨a|b⟩|²',
html:`<div class="grid2"><div class="panel"><div class="tip">Rows: state you measure for ⟨a|. Columns: state prepared |b⟩. Click a cell.</div><div style="overflow-x:auto"><table class="tbl" id="s4t"></table></div></div>
<div class="panel"><div class="eq" id="s4d">Click a cell to see the amplitude.</div></div></div>
<div class="note"><b>From your notes:</b> the inner product is the probability <u>amplitude</u> (a complex number); multiply by its conjugate to get a real probability. Prepared up, P(measure left along x) = ⟨l|u⟩⟨u|l⟩ = 1/2. And |u⟩, |d⟩ are orthogonal in <i>state space</i> even though up/down are not orthogonal directions in ordinary space.</div>`,
init(root){const ks=['u','d','r','l','i','o'];const t=$('#s4t',root);let h='<tr><th></th>'+ks.map(k=>`<th>|${k}⟩</th>`).join('')+'</tr>';
  ks.forEach(a=>{h+=`<tr><th>⟨${a}|</th>`+ks.map(b=>{const p=cabs2(inner(KETS[a],KETS[b]));return `<td class="cell" data-a="${a}" data-b="${b}">${fnum(p)}</td>`}).join('')+'</tr>'});t.innerHTML=h;
  $$('.cell',t).forEach(td=>td.onclick=()=>{$$('.cell',t).forEach(x=>x.classList.remove('sel'));td.classList.add('sel');const a=td.dataset.a,b=td.dataset.b,A=KETS[a],B=KETS[b];const ip=inner(A,B);
    $('#s4d',root).innerHTML=`${braHTML(A)} ${ketHTML(B)}<br>⟨${a}|${b}⟩ = <b>${fcx(ip)}</b><br>|⟨${a}|${b}⟩|² = ⟨${a}|${b}⟩⟨${b}|${a}⟩ = <b class="ok">${fnum(cabs2(ip))}</b>`+(a==='u'&&b==='d'||a==='r'&&b==='l'||a==='i'&&b==='o'||a===b&&false?'<br><span class="warn">Orthogonal states: mutually exclusive outcomes.</span>':'');
    if(cabs2(ip)<1e-9)react('Orthogonal means certainly not that one.','happy')})}});

/* ---- Scene 5: Bloch sphere ---- */
SCENES.push({id:'s05',belt:0,title:'The Bloch sphere',sub:'Lecture 2 · Every spin state is a direction',
html:`<div class="grid2"><div class="panel" id="s5v"></div><div class="panel col"><div id="s5s"></div><div class="row"><button class="btn" id="s5o">Show orthogonal partner</button></div>
<div class="eq" id="s5e"></div></div></div>
<div class="note"><b>From your notes:</b> the Bloch sphere visualises a two-dimensional complex state. Antipodal points are orthogonal states (⟨A|B⟩ = 0).</div>`,
init(root){let th=ang(60),ph=ang(40),partner=false;const B=new Bloch($('#s5v',root));
  const s1=slider($('#s5s',root),'θ (polar angle from +z)',0,180,1,60,v=>{th=ang(v);upd()},v=>v+'°');
  const s2=slider($('#s5s',root),'φ (azimuth around z)',0,360,1,40,v=>{ph=ang(v);upd()},v=>v+'°');
  $('#s5o',root).onclick=e=>{partner=!partner;e.target.classList.toggle('on',partner);upd()};
  function upd(){const A=ketAng(th,ph);const bv=blochVec(A);B.vecs=[{v:bv,color:'#f2d67a'}];let ex='';
    if(partner){const Bk=ketAng(Math.PI-th,ph+Math.PI);B.vecs.push({v:blochVec(Bk),color:'#f29fb4'});ex=`<br>Partner ⟨A|B⟩ = <b>${fcx(inner(A,Bk))}</b> (orthogonal)`}
    B.draw();
    $('#s5e',root).innerHTML=`α<sub>u</sub> = cos(θ/2) = ${fcx(A[0])}<br>α<sub>d</sub> = e<sup>iφ</sup> sin(θ/2) = ${fcx(A[1])}<br>P(↑) = ${fnum(cabs2(A[0]))}, P(↓) = ${fnum(cabs2(A[1]))}<br>⟨σ⟩ = (${bv.map(x=>x.toFixed(2)).join(', ')})`+ex}
  upd();return()=>B.ro.disconnect()}});

/* ---- Scene 6: operators ---- */
SCENES.push({id:'s06',belt:0,title:'Observables are operators',sub:'Lecture 3 · Pauli matrices, eigenvectors, eigenvalues',
html:`<div class="grid2"><div class="panel"><div class="tip">Click a cell: apply operator (row) to ket (column).</div><div style="overflow-x:auto"><table class="tbl" id="s6t"></table></div>
<div class="tip" style="margin-top:6px">✓ λ means eigenvector with eigenvalue λ; — means the ket is rotated into something else.</div></div>
<div class="panel"><div class="eq" id="s6d">Pick a cell.</div></div></div>`,
init(root){const ks=['u','d','r','l','i','o'],ops=['x','y','z'];const t=$('#s6t',root);
  const eig=(A,v)=>{const w=mv(A,v);const lam=inner(v,w);const lv=vsc(v,lam);return isSame(w,lv,1e-9)?lam[0]:null};
  let h='<tr><th></th>'+ks.map(k=>`<th>|${k}⟩</th>`).join('')+'</tr>';
  ops.forEach(o=>{h+=`<tr><th>${opName[o]}</th>`+ks.map(k=>{const e=eig(opMat(o),KETS[k]);return `<td class="cell" data-o="${o}" data-k="${k}">${e==null?'—':'✓ '+(e>0?'+1':'−1')}</td>`}).join('')+'</tr>'});t.innerHTML=h;
  $$('.cell',t).forEach(td=>td.onclick=()=>{$$('.cell',t).forEach(x=>x.classList.remove('sel'));td.classList.add('sel');const o=td.dataset.o,k=td.dataset.k,A=opMat(o),v=KETS[k],w=mv(A,v),e=eig(A,v);
    $('#s6d',root).innerHTML=`${opName[o]} = ${matHTML(A)}<br>${opName[o]} ${ket(k)} = ${matHTML(A)}${ketHTML(v)} = ${ketHTML(w)}<br>`+(e!=null?`<span class="ok">= ${e>0?'+1':'−1'}·${ket(k)}: an eigenvector, eigenvalue ${e>0?'+1':'−1'}</span>`:`<span class="warn">Not proportional to ${ket(k)}: measuring ${opName[o]} will kick it into an eigenstate.</span>`)})}});

/* ---- Scene 7: principles ---- */
SCENES.push({id:'s07',belt:0,title:'The four principles',sub:'Lecture 3 · The rulebook (plus one waiting in lecture 4)',
html:`<div class="grid2" id="s7c"></div>
<div class="panel col" style="margin-top:12px"><div class="chalk">Principle 4 in action: P(λ) = ⟨ψ|λ⟩⟨λ|ψ⟩</div><div class="row" id="s7o"></div><div id="s7s" class="grid2"></div><div class="eq" id="s7e"></div></div>`,
init(root){const P=[['1','Observables are linear operators','The measurable quantities of quantum mechanics are represented by linear operators L.'],['2','Results are eigenvalues','The possible results of a measurement are the eigenvalues of the operator that represents the observable.'],['3','Distinguishable means orthogonal','Unambiguously distinguishable states are represented by orthogonal vectors.'],['4','Probabilities are squared overlaps','If |Ψ⟩ is the state and observable L is measured, the probability of λᵢ is P(λᵢ) = ⟨Ψ|λᵢ⟩⟨λᵢ|Ψ⟩.'],['5','Evolution is unitary (lecture 4)','The evolution of state vectors with time is unitary: |Ψ(t+Δt)⟩ = U(Δt)|Ψ(t)⟩.']];
  const box=$('#s7c',root);P.forEach(([n,t,s])=>{const b=el('button','panel',`<div class="chalk" style="color:var(--yel)">Principle ${n}</div><div>${t}</div><div class="tip">tap to flip</div>`);b.type='button';b.style.cssText='text-align:left;color:inherit;cursor:pointer;min-height:96px';let f=false;
    b.onclick=()=>{f=!f;b.innerHTML=f?`<div class="chalk" style="color:var(--grn)">Principle ${n}</div><div class="math">${s}</div>`:`<div class="chalk" style="color:var(--yel)">Principle ${n}</div><div>${t}</div><div class="tip">tap to flip</div>`};box.append(b)});
  let o='z',th=ang(70),ph=ang(30);
  chips($('#s7o',root),[['x','σx'],['y','σy'],['z','σz']],'z',v=>{o=v;upd()});
  slider($('#s7s',root),'θ',0,180,1,70,v=>{th=ang(v);upd()},v=>v+'°');slider($('#s7s',root),'φ',0,360,1,30,v=>{ph=ang(v);upd()},v=>v+'°');
  function upd(){const A=ketAng(th,ph);const ax={x:[Math.PI/2,0],y:[Math.PI/2,Math.PI/2],z:[0,0]}[o];const [pk,mk]=axisKets(ax[0],ax[1]);const pp=cabs2(inner(pk,A)),pm=cabs2(inner(mk,A));
    const ex=expect(opMat(o),A);$('#s7e',root).innerHTML=`P(+1) = ${pp.toFixed(3)}, P(−1) = ${pm.toFixed(3)}, sum = ${(pp+pm).toFixed(3)}<br>⟨${opName[o]}⟩ = (+1)(${pp.toFixed(3)}) + (−1)(${pm.toFixed(3)}) = ${(pp-pm).toFixed(3)} = ⟨ψ|${opName[o]}|ψ⟩ = ${ex.toFixed(3)}`}
  upd()}});
