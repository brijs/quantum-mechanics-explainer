/* ===== Act IV: Lectures 8-10, lab, quiz ===== */
const GN=1024,GL=160,GDX=GL/GN;
const gx=Array.from({length:GN},(_,i)=>-GL/2+i*GDX);
const gk=Array.from({length:GN},(_,j)=>TAU*(j<GN/2?j:j-GN)/GL);
function dft(re,im){const R=re.slice(),I=im.slice();fft(R,I,false);return [R,I]}
function momDist(re,im){const [R,I]=dft(re,im);const P=R.map((r,i)=>r*r+I[i]*I[i]);const s=P.reduce((a,b)=>a+b,0);return P.map(p=>p/s)}
function stats1(xs,P){let m=0,m2=0;xs.forEach((x,i)=>{m+=x*P[i];m2+=x*x*P[i]});return {m,sd:Math.sqrt(Math.max(0,m2-m*m))}}
function shiftArr(a){const n=a.length;return a.map((_,i)=>a[(i+n/2)%n])}

SCENES.push({id:'s17',belt:3,title:'Wave functions and Fourier',sub:'Lecture 8 · ψ(x), φ(p) and Δx·Δp ≥ ħ/2',
html:`<div class="grid2"><div class="panel col"><div id="s17c"></div><div id="s17s"></div><div class="eq" id="s17e"></div></div>
<div class="panel col"><div class="tip">|ψ(x)|² (position)</div><canvas id="s17a"></canvas><div class="tip">|φ(p)|² (momentum, ħ = 1)</div><canvas id="s17b"></canvas></div></div>`,
init(root){let shape='gauss',sg=1.2,k0=0;
  chips($('#s17c',root),[['gauss','Gaussian'],['double','Two bumps'],['sech','sech']],'gauss',v=>{shape=v;upd()});
  slider($('#s17s',root),'width σ',0.4,3,0.05,1.2,v=>{sg=v;upd()},v=>v.toFixed(2));slider($('#s17s',root),'mean momentum p₀',-3,3,0.1,0,v=>{k0=v;upd()},v=>v.toFixed(1));
  function upd(){const re=new Array(GN),im=new Array(GN);let tot=0;
    gx.forEach((x,i)=>{let a;if(shape==='gauss')a=Math.exp(-x*x/(4*sg*sg));else if(shape==='double')a=Math.exp(-((x-3*sg)**2)/(4*sg*sg*.5))+Math.exp(-((x+3*sg)**2)/(4*sg*sg*.5));else a=1/Math.cosh(x/(2*sg));
      re[i]=a*Math.cos(k0*x);im[i]=a*Math.sin(k0*x);tot+=a*a});
    const Px=re.map((r,i)=>(r*r+im[i]*im[i])/tot);const Pk=momDist(re,im);const sx=stats1(gx,Px),sk=stats1(gk.map((k,j)=>k),Pk);
    /* momentum stats must use wrapped k in order; gk already signed */
    $('#s17e',root).innerHTML=`Δx = ${sx.sd.toFixed(3)}<br>Δp = ${sk.sd.toFixed(3)}<br>Δx·Δp = <b>${(sx.sd*sk.sd).toFixed(3)}</b> ≥ ħ/2 = 0.5 <span class="${sx.sd*sk.sd>=0.4999?'ok':'bad'}">${sx.sd*sk.sd>=0.4999?'✓':'✗'}</span>${shape==='gauss'?'<br><span class="tip">Gaussian saturates the bound</span>':''}`;
    const dxs=shiftArr(gk),dP=shiftArr(Pk);const xsel=[],ysel=[];gx.forEach((x,i)=>{if(Math.abs(x)<=14){xsel.push(x);ysel.push(Px[i])}});
    plot($('#s17a',root),[{xs:xsel,ys:ysel,color:'#f2d67a',fill:'rgba(242,214,122,.25)'}],{xmin:-14,xmax:14,ymin:0,ratio:.38,minH:130});
    const ks=[],ps=[];dxs.forEach((k,i)=>{if(Math.abs(k)<=7){ks.push(k);ps.push(dP[i])}});
    plot($('#s17b',root),[{xs:ks,ys:ps,color:'#8fd0f0',fill:'rgba(143,208,240,.25)'}],{xmin:-7,xmax:7,ymin:0,ratio:.38,minH:130})}
  upd();const ro=new ResizeObserver(upd);ro.observe($('#s17a',root));return()=>ro.disconnect()}});

SCENES.push({id:'s18',belt:3,title:'Position, momentum, and [X,P]',sub:'Lecture 8 · P = −iħ d/dx, plane waves, de Broglie',
html:`<div class="grid2"><div class="panel col"><div class="tip">Plane wave ψ = e<sup>ikx</sup>: an eigenstate of P with p = ħk</div><div id="s18s"></div><canvas id="s18p"></canvas><div class="eq" id="s18e"></div></div>
<div class="panel col"><div class="chalk">Numerical test of [X,P] = iħ</div><div id="s18c"></div><button class="btn pri" id="s18t">Test (XP − PX)f = iħ f</button><div class="eq" id="s18r">Pick f and press test.</div></div></div>`,
init(root){let k=2;slider($('#s18s',root),'k (wavenumber)',-4,4,0.1,2,v=>{k=v;upd()},v=>v.toFixed(1));let fk='g';
  chips($('#s18c',root),[['g','e^(−x²/2)'],['gx','x·e^(−x²/2)'],['sg','sin(2x)·e^(−x²/4)']],'g',v=>{fk=v});
  function upd(){const xs=[],re=[],im=[];for(let i=0;i<=300;i++){const x=-6+12*i/300;xs.push(x);re.push(Math.cos(k*x));im.push(Math.sin(k*x))}
    plot($('#s18p',root),[{xs,ys:re,color:'#9be0a8'},{xs,ys:im,color:'#f6b26b'}],{xmin:-6,xmax:6,ymin:-1.2,ymax:1.2,ratio:.4,minH:130});
    const lam=Math.abs(k)>1e-9?TAU/Math.abs(k):Infinity;$('#s18e',root).innerHTML=`<span class="tip"><span style="color:#9be0a8">Re</span> · <span style="color:#f6b26b">Im</span></span><br>P e<sup>ikx</sup> = −i d/dx e<sup>ikx</sup> = <b>${k.toFixed(1)}</b> e<sup>ikx</sup><br>p = ħk = ${k.toFixed(1)} · wavelength λ = 2π/k = ${isFinite(lam)?lam.toFixed(2):'∞'} (p = h/λ)`}
  upd();const ro=new ResizeObserver(upd);ro.observe($('#s18p',root));
  $('#s18t',root).onclick=()=>{const h=0.001;const f=x=>fk==='g'?[Math.exp(-x*x/2),0]:fk==='gx'?[x*Math.exp(-x*x/2),0]:[Math.sin(2*x)*Math.exp(-x*x/4),0];
    const P=g=>x=>{const a=g(x+h),b=g(x-h);return [(a[1]-b[1])/(2*h),-(a[0]-b[0])/(2*h)]}; /* −i d/dx on complex */
    const X=g=>x=>{const v=g(x);return [x*v[0],x*v[1]]};
    const XP=X(P(f)),PX=P(X(f));let err=0,mx=0;for(let x=-4;x<=4;x+=0.05){const d=[XP(x)[0]-PX(x)[0],XP(x)[1]-PX(x)[1]];const t=[-f(x)[1],f(x)[0]];err=Math.max(err,Math.hypot(d[0]-t[0],d[1]-t[1]));mx=Math.max(mx,Math.hypot(...f(x)))}
    $('#s18r',root).innerHTML=`max |(XP − PX)f − i f| over x∈[−4,4] = <b>${err.toExponential(2)}</b><br>(size of f ≈ ${mx.toFixed(2)})<br><span class="ok">${err<1e-4?'Commutator = iħ ✓ (ħ=1)':'check'}</span>`;react('x and p do not commute: [X,P] = iħ.','happy')};
  return()=>ro.disconnect()}});

SCENES.push({id:'s19',belt:3,title:'The Schrödinger wave equation',sub:'Lecture 9 · iħ ∂ψ/∂t = −(ħ²/2m)∂²ψ/∂x² + Vψ (numerical illustration)',
html:`<div class="panel col"><div class="row" id="s19c"></div><canvas id="s19p"></canvas><div class="row"><button class="btn pri" id="s19r">▶ Release</button><button class="btn" id="s19x">Reset</button></div><div id="s19s" class="grid2"></div><div class="eq" id="s19e"></div></div>`,
init(root){let pot='free',k0=2,run=false,raf=0,t=0,re,im,prevX=null,prevT=0;const dt=0.02,ST=3;
  const V=x=>pot==='free'?0:pot==='barrier'?(Math.abs(x)<0.5?3:0):0.5*0.25*x*x;
  chips($('#s19c',root),[['free','Free'],['barrier','Barrier (height 3)'],['well','Harmonic well']],'free',v=>{pot=v;reset();s19k.el.style.opacity=v==='well'?.35:1});
  const s19k=slider($('#s19s',root),'initial momentum p₀ (free and barrier)',0.5,4,0.1,2,v=>{k0=v;reset()},v=>v.toFixed(1));
  function reset(){const x0=pot==='well'?-8:-10;re=new Array(GN);im=new Array(GN);let n=0;gx.forEach((x,i)=>{const a=Math.exp(-((x-x0)**2)/4);re[i]=a*Math.cos(k0*(pot==='well'?0:1)*x);im[i]=a*Math.sin(k0*(pot==='well'?0:1)*x);n+=a*a});const s=1/Math.sqrt(n);for(let i=0;i<GN;i++){re[i]*=s;im[i]*=s}t=0;prevX=null;prevT=0;run=false;$('#s19r',root).textContent='▶ Release';draw()}
  function step(){const Vs=gx.map(V);const half=(r,i)=>{for(let j=0;j<GN;j++){const a=-Vs[j]*dt/2,cr=Math.cos(a),ci=Math.sin(a);const rr=r[j]*cr-i[j]*ci,ii=r[j]*ci+i[j]*cr;r[j]=rr;i[j]=ii}};
    half(re,im);fft(re,im,false);for(let j=0;j<GN;j++){const a=-gk[j]*gk[j]*dt/2,cr=Math.cos(a),ci=Math.sin(a);const rr=re[j]*cr-im[j]*ci,ii=re[j]*ci+im[j]*cr;re[j]=rr;im[j]=ii}fft(re,im,true);half(re,im);t+=dt}
  const canv=$('#s19p',root);
  function draw(){const P=re.map((r,i)=>r*r+im[i]*im[i]);const norm=P.reduce((a,b)=>a+b,0);const mx=gx.reduce((s,x,i)=>s+x*P[i],0)/norm;
    const Pk=momDist(re,im);const mp=gk.reduce((s,k,j)=>s+k*Pk[j],0);
    const xs=[],ys=[],vs=[];gx.forEach((x,i)=>{if(Math.abs(x)<=24){xs.push(x);ys.push(P[i]/GDX*1);vs.push(V(x))}});
    const pk=Math.max(...ys,0.4);
    plot(canv,[{xs,ys,color:'#f2d67a',fill:'rgba(242,214,122,.28)'},{xs,ys:vs.map(v=>Math.min(v/(pot==='well'?20:3.5)*pk*0.8,pk*1.05)),color:'#8fd0f0',lw:1.5}],{xmin:-24,xmax:24,ymin:0,ymax:pk*1.1,ratio:.34,minH:150});
    let tr=0;gx.forEach((x,i)=>{if(x>1.5)tr+=P[i]});tr/=norm;const vel=(prevX==null||t-prevT<1e-9)?null:(mx-prevX)/(t-prevT);if(t-prevT>1e-9||prevX==null){prevX=mx;prevT=t}
    $('#s19e',root).innerHTML=`t = ${t.toFixed(1)} · total probability = <b>${norm.toFixed(5)}</b> (unitary)<br>⟨x⟩ = ${mx.toFixed(2)}, ⟨p⟩ = ${mp.toFixed(2)}, d⟨x⟩/dt ≈ ${vel==null?'—':vel.toFixed(2)} (Ehrenfest: ⟨p⟩/m)`+(pot==='barrier'?`<br>probability beyond the barrier = <b>${(tr*100).toFixed(1)}%</b>`:'')}
  function frame(){if(run){for(let s=0;s<ST;s++)step();draw()}raf=requestAnimationFrame(frame)}
  $('#s19r',root).onclick=e=>{run=!run;e.target.textContent=run?'⏸ Pause':'▶ Release'};$('#s19x',root).onclick=reset;
  reset();raf=requestAnimationFrame(frame);const ro=new ResizeObserver(draw);ro.observe(canv);return()=>{cancelAnimationFrame(raf);ro.disconnect()}}});

SCENES.push({id:'s20',belt:3,title:'The harmonic oscillator ladder',sub:'Lecture 10 · a†|n⟩ = √(n+1)|n+1⟩, E = ħω(n + ½)',
html:`<div class="grid2"><div class="panel col"><div class="row"><button class="btn pri" id="s20u">a† (raise)</button><button class="btn" id="s20d">a (lower)</button><button class="btn" id="s20z">Reset to |0⟩</button></div><div class="eq" id="s20e"></div></div>
<div class="panel"><canvas id="s20p"></canvas><div class="tip">Parabola: V = ½x². Dashed: energy level E<sub>n</sub>. Curve: ψ<sub>n</sub>(x) drawn at that level.</div></div></div>`,
init(root){let n=0;const xs=Array.from({length:801},(_,i)=>-8+16*i/800),dx=16/800;
  function psi(n){const out=[];const p0=xs.map(x=>Math.pow(Math.PI,-0.25)*Math.exp(-x*x/2));if(n===0)return p0;let a=p0,b=xs.map((x,i)=>Math.SQRT2*x*p0[i]);for(let m=1;m<n;m++){const c2=xs.map((x,i)=>Math.sqrt(2/(m+1))*x*b[i]-Math.sqrt(m/(m+1))*a[i]);a=b;b=c2}return b}
  function upd(){const p=psi(n),E=n+0.5;const norm=p.reduce((s,v)=>s+v*v,0)*dx,x2=p.reduce((s,v,i)=>s+xs[i]*xs[i]*v*v,0)*dx;let nodes=0;for(let i=1;i<p.length;i++)if(p[i]*p[i-1]<0)nodes++;
    const q=n+1<=14?psi(n+1):p;let ov=q.reduce((s,v,i)=>s+v*p[i],0)*dx;
    const top=Math.max(E+1.5,3);plot($('#s20p',root),[{xs,ys:xs.map(x=>0.5*x*x),color:'#8fd0f0',lw:1.5},{xs,ys:p.map(v=>E+v*1.2),color:'#f2d67a',lw:2.2}],{xmin:-8,xmax:8,ymin:0,ymax:top,hlines:[{y:E,color:'#9be0a8',label:'E='+E}],ratio:.6,minH:230});
    $('#s20e',root).innerHTML=`state |${n}⟩ · E<sub>${n}</sub> = ħω(${n} + ½) = <b>${E}</b> ħω · nodes = ${nodes}<br>∫|ψ|² = ${norm.toFixed(4)}  ⟨x²⟩ = ${x2.toFixed(3)} = n + ½ ✓ (half the energy is potential)<br>⟨n|n+1⟩ = ${Math.abs(ov)<1e-9?'0':ov.toExponential(1)} (orthogonal)<br>a†|${n}⟩ = sqrt(${n+1})·|${n+1}⟩ ≈ ${Math.sqrt(n+1).toFixed(3)}·|${n+1}⟩`}
  $('#s20u',root).onclick=()=>{if(n<12){n++;upd()}else react('Plenty high for one cat.','think')};
  $('#s20d',root).onclick=()=>{if(n>0){n--;upd()}else react('a|0⟩ = 0. There is a floor: zero-point energy ½ħω.','alert')};
  $('#s20z',root).onclick=()=>{n=0;upd()};upd();const ro=new ResizeObserver(upd);ro.observe($('#s20p',root));return()=>ro.disconnect()}});

/* ---- lab ---- */
SCENES.push({id:'s21',belt:3,title:'Quantum lab (free play)',sub:'Everything at once: state → operators → measurement',
html:`<div class="grid2"><div class="panel col"><div id="s21v"></div><div class="tip">State:</div><div id="s21p"></div><div id="s21s"></div></div>
<div class="panel col"><div class="tip">Apply a unitary (changes the state):</div><div class="row" id="s21o"></div><div class="tip">Measure:</div><div class="row" id="s21m"></div><div class="row"><button class="btn" id="s21a">Fire 1000 copies</button><button class="btn" id="s21b">Measure once (collapses)</button></div>
<div id="s21h"></div><div class="eq" id="s21e"></div></div></div>`,
init(root){let psi=ketAng(ang(60),ang(40)),ob='z';const B=new Bloch($('#s21v',root),{ratio:.7,minH:220});let sl1,sl2;
  const h=histo($('#s21h',root),['+1 measured','+1 Born','−1 measured','−1 Born'],['#9be0a8','#8fd0f0','#f29fb4','#8fd0f0']);let counts=null;
  function thph(v){const th=2*Math.atan2(Math.hypot(...v[1]),Math.hypot(...v[0]));const ph=(Math.atan2(v[1][1],v[1][0])-Math.atan2(v[0][1],v[0][0])+TAU)%TAU;return [th,ph]}
  function setPsi(v,fromSlider){psi=v;if(!fromSlider){const [th,ph]=thph(v);sl1.set(th*180/Math.PI);sl2.set(ph*180/Math.PI)}counts=null;upd()}
  sl1=slider($('#s21s',root),'θ',0,180,1,60,v=>setPsi(ketAng(ang(v),ang(sl2.get())),true),v=>v+'°');sl2=slider($('#s21s',root),'φ',0,360,1,40,v=>setPsi(ketAng(ang(sl1.get()),ang(v)),true),v=>v+'°');
  chips($('#s21p',root),[['u','|u⟩'],['d','|d⟩'],['r','|r⟩'],['l','|l⟩'],['i','|i⟩'],['o','|o⟩']],null,k=>setPsi(KETS[k]));
  [['σx',SX],['σy',SY],['σz',SZ],['Hadamard',HAD]].forEach(([n,M])=>{const b=el('button','btn sm',n);b.onclick=()=>setPsi(mv(M,psi));$('#s21o',root).append(b)});
  chips($('#s21m',root),[['x','σx'],['y','σy'],['z','σz']],'z',v=>{ob=v;counts=null;upd()});
  const axis=()=>({x:[Math.PI/2,0],y:[Math.PI/2,Math.PI/2],z:[0,0]}[ob]);
  $('#s21a',root).onclick=()=>{const [t,p]=axis();let pl=0;for(let i=0;i<1000;i++)if(measure(psi,t,p).res>0)pl++;counts=[pl/1000,1-pl/1000];upd()};
  $('#s21b',root).onclick=()=>{const [t,p]=axis();const m=measure(psi,t,p);setPsi(m.post);react('Collapsed to '+(m.res>0?'+1':'−1')+' along '+ob,'alert')};
  function upd(){const A=psi;B.vecs=[{v:blochVec(A),color:'#f2d67a'}];B.draw();const [t,p]=axis();const P=cabs2(inner(axisKets(t,p)[0],A));
    h.update(counts?[counts[0],P,counts[1],1-P]:[0,P,0,1-P],counts?[counts[0].toFixed(3),P.toFixed(3),counts[1].toFixed(3),(1-P).toFixed(3)]:['—',P.toFixed(3),'—',(1-P).toFixed(3)]);
    $('#s21e',root).innerHTML=`${ket('ψ')} = ${ketHTML(A,z=>fcx(z,3))}<br>⟨σx⟩ = ${expect(SX,A).toFixed(3)}, ⟨σy⟩ = ${expect(SY,A).toFixed(3)}, ⟨σz⟩ = ${expect(SZ,A).toFixed(3)}`}
  upd();return()=>B.ro.disconnect()}});

/* ---- quiz + cheat sheet ---- */
const CHEAT=`QUANTUM MECHANICS: THE THEORETICAL MINIMUM  (cheat sheet)
Based on Susskind & Friedman. Animated explainer by Brijesh Shetty, github.com/brijs

L1  Spin results are always +1 or -1. After preparing +z, measuring at angle t gives average cos t.
    Measurement is never gentle: measuring one axis disturbs another.
L2  States live in a complex vector space. |A> = au|u> + ad|d> (column), <A| = conjugate row.
    Normalised: <A|A> = 1.  P(a|b) = |<a|b>|^2.   |r>,|l> = (|u> +- |d>)/sqrt2,  |i>,|o> = (|u> +- i|d>)/sqrt2
    Bloch sphere: |n> = cos(t/2)|u> + e^{i phi} sin(t/2)|d>;  <sigma> = (sin t cos phi, sin t sin phi, cos t)
L3  Principles: (1) observables = linear operators  (2) results = eigenvalues
    (3) distinguishable states = orthogonal  (4) P(lambda_i) = <psi|lambda_i><lambda_i|psi>
    Pauli: sx=[[0,1],[1,0]]  sy=[[0,-i],[i,0]]  sz=[[1,0],[0,-1]]
L4  (5) Evolution is unitary: |psi(t+dt)> = U|psi(t)>, U†U = 1.   i hbar d|psi>/dt = H|psi>
    Spin in field: H = (hbar w/2) sz  ->  precession at angular frequency w.
L5  Commutator [A,B] = AB - BA.  [sx,sy] = 2i sz (cyclic).
    Uncertainty: dA dB >= (1/2)|<[A,B]>|.   d<L>/dt = (i/hbar)<[H,L]>;  [H,L]=0 -> L conserved.
L6  Two systems: tensor product. Product state: amplitudes factorise (ad - bc = 0). Otherwise entangled.
    Singlet (|ud> - |du>)/sqrt2: opposite results on the same axis; <sigma_a tau_b> = -cos(angle).
L7  Reduced density matrix of the singlet = I/2 (maximally mixed). CHSH: classical |S| <= 2, quantum up to 2 sqrt2.
L8  psi(x); P = -i hbar d/dx; plane wave e^{ikx} has p = hbar k.  [X,P] = i hbar.  dx dp >= hbar/2.
L9  H = P^2/2m + V;  i hbar dpsi/dt = -(hbar^2/2m) psi'' + V psi.  Total probability is conserved.
    Ehrenfest: d<x>/dt = <p>/m.
L10 H = P^2/2m + m w^2 X^2/2.  a†|n> = sqrt(n+1)|n+1>,  a|n> = sqrt(n)|n-1>,  a|0> = 0.
    E_n = hbar w (n + 1/2),  [a,a†] = 1.
`;
SCENES.push({id:'s22',belt:4,title:'Final exam and cheat sheet',sub:'Ten questions, one per lecture · pass at 8',
html:`<div class="panel" id="s22q"></div><div class="panel" style="margin-top:12px"><div class="chalk" style="color:var(--yel)">Take-home cheat sheet</div><textarea class="sheet" id="s22t" readonly aria-label="Cheat sheet text"></textarea><div class="row" style="margin-top:6px"><button class="btn pri" id="s22c">Copy cheat sheet</button><span class="tip" id="s22m"></span></div></div>`,
init(root){$('#s22t',root).value=CHEAT;
  $('#s22c',root).onclick=async()=>{const t=$('#s22t',root);try{await navigator.clipboard.writeText(CHEAT);$('#s22m',root).textContent='Copied.'}catch(e){t.focus();t.select();try{document.execCommand('copy');$('#s22m',root).textContent='Copied.'}catch(_){$('#s22m',root).textContent='Select the text and copy it.'}}};
  const Q=[
    {lec:1,q:'Spin is prepared up along z, then measured along x, repeatedly. What do you see?',o:['Every result is 0','Each result is +1 or −1, averaging 0','Each result is +½','Every result is +1'],a:1,e:'Single results are always ±1; only the average follows the geometry (here cos 90° = 0).'},
    {lec:2,q:'The bra ⟨A| of ket |A⟩ is…',o:['The same column','The conjugate-transposed row','The inverse matrix','The real part only'],a:1,e:'Complex-conjugate every component and write them as a row.'},
    {lec:3,q:'According to the principles, the possible results of measuring an observable are…',o:['Its matrix entries','Its eigenvalues','Its expectation values','Any real number'],a:1,e:'Principle 2: results are eigenvalues of the operator.'},
    {lec:4,q:'Time evolution of a quantum state must be…',o:['Dissipative','Unitary','Random','Real-valued'],a:1,e:'Unitary evolution preserves inner products, so distinct states stay distinct.'},
    {lec:5,q:'[σx, σy] equals…',o:['0','2iσz','σz','−iσx'],a:1,e:'The Pauli matrices obey [σx,σy] = 2iσz (and cyclic), which is why the uncertainty bound is non-zero.'},
    {lec:6,q:'A two-spin state with amplitudes (a, b, c, d) is entangled when…',o:['ad − bc ≠ 0','a = d','b = c = 0','all amplitudes are real'],a:0,e:'A product state has factorising amplitudes: ad = bc.'},
    {lec:7,q:'In the CHSH test, the maximum for any local hidden-variable theory is…',o:['1','2','2√2','4'],a:1,e:'Classical bound 2; quantum mechanics reaches 2√2.'},
    {lec:8,q:'If a wave packet is squeezed narrowly in position, its momentum distribution…',o:['Narrows too','Spreads out','Is unchanged','Becomes discrete'],a:1,e:'Δx·Δp ≥ ħ/2: narrow in x means broad in p (Fourier transform).'},
    {lec:9,q:'During Schrödinger evolution the total probability ∫|ψ|²dx…',o:['Decays','Stays equal to 1','Grows','Oscillates'],a:1,e:'The evolution is unitary, so the norm is conserved.'},
    {lec:10,q:'The harmonic-oscillator energy levels are…',o:['ħω·n²','ħω(n + ½), evenly spaced','Continuous','−ħω/n²'],a:1,e:'Ladder operators step by ħω; the ground state keeps ½ħω.'}];
  const box=$('#s22q',root);
  const done=(sc,n)=>{const pass=sc>=8;box.innerHTML=`<div class="chalk big">${sc} / ${n}</div><p>${pass?'<span class="ok">You are a Master of the Ket. Cat approved.</span>':'<span class="warn">Almost. Revisit the scenes (dots at the top) and try again.</span>'}</p>`;
    const rb=el('button','btn',pass?'Retake for fun':'Retry');rb.onclick=()=>{box.innerHTML='';quiz(box,Q,done)};box.append(rb);
    if(pass&&!st.passed){st.passed=true;updRank();toast('Rank up: Master of the Ket!');bow();react('Master of the Ket!','happy')}else if(!pass)react('Study a little more.','think')};
  quiz(box,Q,done)}});
