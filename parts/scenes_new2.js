/* ===== New concept scenes, part 2 (lectures 4-10) ===== */

/* ---- n4a: classical conservation of distinctions ---- */
SCENES.push({id:'n4a',title:'The classical rule: never merge states',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">Update rule (what happens in one tick):</div><div id="n4ac"></div><div class="tip">Start in state, run forward for k ticks, then try to rewind:</div><div id="n4ap"></div><div id="n4as"></div></div>
<div class="panel col"><div class="eq" id="n4at"></div><div class="eq" id="n4ae"></div><div class="chalk big" id="n4av"></div></div></div>`,
init(root){const S=['A','B','C','D'];const R={rot:{n:'Rotate',m:[1,2,3,0]},swap:{n:'Swap pairs',m:[1,0,3,2]},merge:{n:'Merge',m:[1,1,3,3]}};let rk='rot',st=0,k=2;
  chips($('#n4ac',root),Object.keys(R).map(x=>[x,R[x].n]),'rot',v=>{rk=v;upd()});chips($('#n4ap',root),S.map((s,i)=>[String(i),'start '+s]),'0',v=>{st=+v;upd()});slider($('#n4as',root),'ticks k',1,5,1,2,v=>{k=v;upd()},v=>v);
  function upd(){const m=R[rk].m;const imgs=new Set(m);const rev=imgs.size===4;let path=[st];for(let i=0;i<k;i++)path.push(m[path[path.length-1]]);
    let cand=new Set([path[path.length-1]]);for(let i=0;i<k;i++){const nx=new Set();m.forEach((t,s)=>{if(cand.has(t))nx.add(s)});cand=nx}
    $('#n4at',root).innerHTML=S.map((s,i)=>`${s} → ${S[m[i]]}`).join('&nbsp;&nbsp; ')+`<br>distinct results: ${imgs.size} of 4 (${Math.log2(imgs.size).toFixed(1)} bits of information kept, of 2.0)`;
    $('#n4ae',root).innerHTML=`forward: ${path.map(i=>S[i]).join(' → ')}<br>rewinding ${k} tick${k>1?'s':''} from ${S[path[path.length-1]]}: possible starting states = {${[...cand].map(i=>S[i]).join(', ')||'none'}}`;
    $('#n4av',root).innerHTML=rev?'<span class="ok">Reversible: distinctions conserved ✓</span>':'<span class="bad">Not reversible: information lost ✗</span>'}
  upd()}});

/* ---- n4b: from unitary to Hamiltonian ---- */
SCENES.push({id:'n4b',title:'Tiny steps of time',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">Choose the generator H in U(ε) = 1 − iεH:</div><div id="n4bc"></div><div class="tip">Number of tiny steps N (total time T = 3, ε = T/N):</div><div id="n4bn"></div><div class="tip">Start in |d⟩, ħ = 1.</div></div>
<div class="panel col"><div class="eq" id="n4be"></div><div class="chalk big" id="n4bv"></div></div></div>`,
init(root){let herm=true,N=20;const T=3;
  chips($('#n4bc',root),[['h','Hermitian: H = σx/2'],['n','Not Hermitian: H = [[0,1],[0,0]]/2']],'h',v=>{herm=v==='h';upd()});chips($('#n4bn',root),[[1,'1'],[2,'2'],[5,'5'],[20,'20'],[100,'100'],[1000,'1000']].map(([v,t])=>[String(v),t]),'20',v=>{N=+v;upd()});
  const Hm=h=>h?msc(SX,0.5):msc([[ZERO,ONE],[ZERO,ZERO]],0.5);
  const run=(H,n)=>{const eps=T/n;let psi=[ZERO,ONE];const step=madd(ID2,msc(H,c(0,-eps)));for(let i=0;i<n;i++)psi=mv(step,psi);return psi};
  function upd(){const H=Hm(herm),eps=T/N,psi=run(H,N),ex=run(H,20000),err=Math.sqrt(psi.reduce((s,z,i)=>s+cabs2(csub(z,ex[i])),0));
    const step=madd(ID2,msc(H,c(0,-eps))),UU=mm(mdag(step),step),dev=Math.max(...UU.flat().map((z,i)=>Math.hypot(z[0]-(i%3===0?1:0),z[1])));
    $('#n4be',root).innerHTML=`H = ${matHTML(H)}<br>U†U − 1 has size ${dev.toExponential(2)} (ε = ${eps.toFixed(4)})<br>after N = ${N} steps: |ψ⟩ = ${ketHTML(psi,z=>fcx(z,3))}<br>total probability = <b>${norm2(psi).toFixed(4)}</b> · distance from the N=20000 result = ${err.toExponential(2)}`;
    $('#n4bv',root).innerHTML=herm?`<span class="ok">Hermitian H: error in unitarity ∝ ε², the product tends to a unitary evolution ✓</span>`:`<span class="bad">Non-Hermitian H: error ∝ ε and probability does not stay 1 ✗</span>`}
  upd()}});

/* ---- n4c: stationary states ---- */
SCENES.push({id:'n4c',title:'Stationary states',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">H = (ħω/2)σz with ω = 1. Choose the starting state:</div><div id="n4cc"></div><div class="eq" id="n4ce"></div></div>
<div class="panel"><canvas id="n4ccv"></canvas><div class="tip">Probability of +1 along <span style="color:#9be0a8">z</span>, <span style="color:#8fd0f0">x</span>, <span style="color:#f6b26b">y</span> against time.</div></div></div>`,
init(root){let st='u';const cv=$('#n4ccv',root);const AX={z:[0,0],x:[Math.PI/2,0],y:[Math.PI/2,Math.PI/2]};
  chips($('#n4cc',root),[['u','|u⟩'],['d','|d⟩'],['r','|r⟩'],['i','|i⟩'],['t','tilted 60°']],'u',v=>{st=v;upd()});
  function upd(){const A=st==='t'?ketAng(ang(60),0):KETS[st];const eigen=st==='u'||st==='d';const T=4*Math.PI,xs=[],y={z:[],x:[],y:[]};
    for(let i=0;i<=200;i++){const t=T*i/200,p=[cmul(A[0],cexp(-t/2)),cmul(A[1],cexp(t/2))];xs.push(t);['z','x','y'].forEach(a=>y[a].push(cabs2(inner(axisKets(...AX[a])[0],p))))}
    plot(cv,[{xs,ys:y.z,color:'#9be0a8'},{xs,ys:y.x,color:'#8fd0f0'},{xs,ys:y.y,color:'#f6b26b'}],{xmin:0,xmax:T,ymin:0,ymax:1,ratio:.6,minH:220});
    $('#n4ce',root).innerHTML=eigen?'This is an <b>energy eigenstate</b> of H: the time evolution is only a global phase, so all probabilities are constant.':'A <b>superposition of two energies</b>: the relative phase turns at ω, so probabilities along x and y oscillate while z stays fixed (σz commutes with H).'}
  upd();const ro=new ResizeObserver(upd);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n5a: order matters ---- */
SCENES.push({id:'n5a',title:'Order matters',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">Start state:</div><div id="n5ap"></div><div class="row" id="n5as"></div></div>
<div class="panel col"><div class="eq" id="n5ae" style="overflow-x:auto"></div><div class="chalk big" id="n5av"></div></div></div>`,
init(root){let A='x',B='z',st='u';const ops={x:SX,y:SY,z:SZ};
  chips($('#n5ap',root),Object.keys(KETS).map(k=>[k,'|'+k+'⟩']),'u',v=>{st=v;upd()});selectBox($('#n5as',root),'A =',[['x','σx'],['y','σy'],['z','σz']],'x',v=>{A=v;upd()});selectBox($('#n5as',root),'B =',[['x','σx'],['y','σy'],['z','σz']],'z',v=>{B=v;upd()});
  function upd(){const psi=KETS[st],ab=mv(ops[A],mv(ops[B],psi)),ba=mv(ops[B],mv(ops[A],psi));const same=isSame(ab,ba,1e-9),neg=isSame(ab,ba.map(z=>[-z[0],-z[1]]),1e-9);
    $('#n5ae',root).innerHTML=`σ${A}(σ${B}|${st}⟩) = ${ketHTML(ab)} (apply σ${B} first)<br>σ${B}(σ${A}|${st}⟩) = ${ketHTML(ba)} (apply σ${A} first)`;
    $('#n5av',root).innerHTML=same?'<span class="ok">Same result: the order did not matter here</span>':neg?'<span class="warn">Opposite sign: order matters (AB = −BA)</span>':'<span class="warn">Different results: order matters</span>'}
  upd()}});

/* ---- n6a: two systems ---- */
SCENES.push({id:'n6a',title:'Two systems, one state',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="chalk" style="color:var(--yel)">Spin A</div><div id="n6aA"></div><div class="chalk" style="color:var(--blu)">Spin B</div><div id="n6aB"></div></div>
<div class="panel col"><div id="n6ah"></div><div class="eq" id="n6ae"></div></div></div>`,
init(root){const S={tA:60,pA:0,tB:120,pB:90};const h=histo($('#n6ah',root),['uu','ud','du','dd'],['#9be0a8','#8fd0f0','#f6b26b','#f29fb4']);
  [['A','tA','pA'],['B','tB','pB']].forEach(([n,t,p])=>{slider($('#n6a'+n,root),'θ',0,180,1,S[t],v=>{S[t]=v;upd()},v=>v+'°');slider($('#n6a'+n,root),'φ',0,360,1,S[p],v=>{S[p]=v;upd()},v=>v+'°')});
  function upd(){const A=ketAng(ang(S.tA),ang(S.pA)),B=ketAng(ang(S.tB),ang(S.pB)),J=kron(A,B),P=J.map(cabs2);
    h.update(P,P.map(x=>x.toFixed(2)));$('#n6ae',root).innerHTML=`${ket('A')} ⊗ ${ket('B')} = ${ketHTML(J,z=>fcx(z,2))}<br>P(uu) = ${P[0].toFixed(3)} = P<sub>A</sub>(u)·P<sub>B</sub>(u) = ${cabs2(A[0]).toFixed(3)} × ${cabs2(B[0]).toFixed(3)} = ${(cabs2(A[0])*cabs2(B[0])).toFixed(3)} ✓<br>sum of 4 probabilities = ${P.reduce((a,b)=>a+b,0).toFixed(3)}`}
  upd()}});

/* ---- n7a: hidden-variable game ---- */
SCENES.push({id:'n7a',title:'Einstein\'s hidden answers',sub:'',
html:`<div class="grid2"><div class="panel col"><div class="tip">Each pair carries pre-written answers. Click to flip each one:</div><div class="row" id="n7at"></div><div class="eq" id="n7ae"></div><div class="row"><button class="btn pri" id="n7ar">Random pairs: average S over 10000</button></div><div class="tip" id="n7am"></div></div>
<div class="panel col"><div class="chalk">All 16 possible instruction sets</div><div style="max-height:260px;overflow:auto"><table class="tbl" id="n7atbl"></table></div></div></div>`,
init(root){const v={A:1,Ap:1,B:1,Bp:-1};const names={A:'A',Ap:'A′',B:'B',Bp:'B′'};
  const S=x=>x.A*x.B-x.A*x.Bp+x.Ap*x.B+x.Ap*x.Bp;
  Object.keys(v).forEach(k=>{const b=el('button','btn',names[k]);b.onclick=()=>{v[k]*=-1;upd()};b.dataset.k=k;$('#n7at',root).append(b)});
  let rows='<tr><th>A</th><th>A′</th><th>B</th><th>B′</th><th>S</th></tr>';for(let m=0;m<16;m++){const x={A:m&1?-1:1,Ap:m&2?-1:1,B:m&4?-1:1,Bp:m&8?-1:1};rows+=`<tr><td>${x.A>0?'+':'−'}</td><td>${x.Ap>0?'+':'−'}</td><td>${x.B>0?'+':'−'}</td><td>${x.Bp>0?'+':'−'}</td><td><b>${S(x)}</b></td></tr>`}$('#n7atbl',root).innerHTML=rows;
  function upd(){$$('#n7at button',root).forEach(b=>b.textContent=names[b.dataset.k]+' = '+(v[b.dataset.k]>0?'+1':'−1'));
    $('#n7ae',root).innerHTML=`S = AB − AB′ + A′B + A′B′<br>= (${v.A})(${v.B}) − (${v.A})(${v.Bp}) + (${v.Ap})(${v.B}) + (${v.Ap})(${v.Bp}) = <b>${S(v)}</b><br>factored: A(B − B′) + A′(B + B′): one bracket is 0, the other ±2`}
  $('#n7ar',root).onclick=()=>{let s=0;for(let i=0;i<10000;i++){const x={A:rnd()<.5?1:-1,Ap:rnd()<.5?1:-1,B:rnd()<.5?1:-1,Bp:rnd()<.5?1:-1};s+=S(x)}$('#n7am',root).textContent=`Average S over 10000 random instruction sets = ${(s/10000).toFixed(3)}. Never beyond ±2, whatever mix you choose.`};upd()}});

/* ---- n8a: wave function and Born rule for position ---- */
SCENES.push({id:'n8a',title:'Wave functions and position',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n8ac"></div><div id="n8as"></div><div class="row"><button class="btn pri" id="n8f1">Detect 1</button><button class="btn" id="n8f500">Detect 500</button><button class="btn" id="n8r">Reset</button></div><div class="eq" id="n8ae"></div></div>
<div class="panel col"><div class="tip">ψ(x): <span style="color:#8fd0f0">real</span> and <span style="color:#f6b26b">imaginary</span> parts</div><canvas id="n8cv1"></canvas><div class="tip">|ψ(x)|² (shaded) and detected positions (histogram)</div><canvas id="n8cv2"></canvas></div></div>`,
init(root){let shape='gauss',a=-1,b=2,N=0;const nb=50,X0=-10,X1=10,counts=new Array(nb).fill(0);let re=[],im=[],P=[],cdf=[];const c1=$('#n8cv1',root),c2=$('#n8cv2',root);
  chips($('#n8ac',root),[['gauss','One bump'],['double','Two bumps'],['moving','Moving bump (phase)']],'gauss',v=>{shape=v;build();reset()});
  const sa=slider($('#n8as',root),'interval start a',-10,10,0.1,-1,v=>{a=v;upd()},v=>v.toFixed(1)),sb=slider($('#n8as',root),'interval end b',-10,10,0.1,2,v=>{b=v;upd()},v=>v.toFixed(1));
  function build(){re=new Array(GN);im=new Array(GN);let t=0;gx.forEach((x,i)=>{let am,k=0;if(shape==='double')am=Math.exp(-((x-3)**2)/2)+Math.exp(-((x+3)**2)/2);else am=Math.exp(-x*x/4);if(shape==='moving')k=3;re[i]=am*Math.cos(k*x);im[i]=am*Math.sin(k*x);t+=am*am});const s=1/Math.sqrt(t*GDX);for(let i=0;i<GN;i++){re[i]*=s;im[i]*=s}
    P=re.map((r,i)=>r*r+im[i]*im[i]);let c=0;cdf=P.map(p=>c+=p*GDX)}
  function sample(){const u=rnd()*cdf[GN-1];let lo=0,hi=GN-1;while(lo<hi){const m=(lo+hi)>>1;cdf[m]<u?lo=m+1:hi=m}return gx[lo]}
  function fire(k){for(let i=0;i<k;i++){const x=sample();N++;if(x>=X0&&x<X1)counts[Math.floor((x-X0)/(X1-X0)*nb)]++}upd()}
  function reset(){counts.fill(0);N=0;upd()}
  function upd(){const lo=Math.min(a,b),hi=Math.max(a,b);let area=0;gx.forEach((x,i)=>{if(x>=lo&&x<hi)area+=P[i]*GDX});let inside=0;counts.forEach((c,i)=>{const x=X0+(i+.5)*(X1-X0)/nb;if(x>=lo&&x<hi)inside+=c});
    const xs=[],r=[],m=[],dn=[];gx.forEach((x,i)=>{if(x>=X0&&x<=X1){xs.push(x);r.push(re[i]);m.push(im[i]);dn.push(P[i])}});
    plot(c1,[{xs,ys:r,color:'#8fd0f0'},{xs,ys:m,color:'#f6b26b'}],{xmin:X0,xmax:X1,ymin:-0.75,ymax:0.75,ratio:.4,minH:130});
    const hx=[],hy=[],bw=(X1-X0)/nb;counts.forEach((c,i)=>{const y=N?c/(N*bw):0;hx.push(X0+i*bw,X0+(i+1)*bw);hy.push(y,y)});const mx=Math.max(...dn,...hy)*1.15;
    const {X,Y}=plot(c2,[{xs,ys:dn,color:'#f2d67a',fill:'rgba(242,214,122,.22)'},{xs:hx,ys:hy,color:'#9be0a8',lw:1.5}],{xmin:X0,xmax:X1,ymin:0,ymax:mx,ratio:.4,minH:130,vlines:[{x:Math.max(X0,lo),color:'#f29fb4'},{x:Math.min(X1,hi),color:'#f29fb4'}]});
    $('#n8ae',root).innerHTML=`∫|ψ|²dx over all x = ${(P.reduce((s,p)=>s+p*GDX,0)).toFixed(3)}<br>P(${lo.toFixed(1)} < x < ${hi.toFixed(1)}) = area = <b>${area.toFixed(3)}</b><br>detected inside: ${N?(inside/N).toFixed(3):'—'} (${inside} of ${N})`}
  $('#n8f1',root).onclick=()=>fire(1);$('#n8f500',root).onclick=()=>fire(500);$('#n8r',root).onclick=reset;build();upd();const ro=new ResizeObserver(upd);ro.observe(c1);return()=>ro.disconnect()}});

/* ---- n9a: kinetic energy as curvature ---- */
SCENES.push({id:'n9a',title:'Kinetic energy is curvature',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n9as"></div><div class="eq" id="n9ae"></div></div><div class="panel"><canvas id="n9cv"></canvas><div class="tip">Real part of ψ(x) (ħ = m = 1)</div></div></div>`,
init(root){let sg=1.2,k=0;const cv=$('#n9cv',root);slider($('#n9as',root),'width σ',0.5,3,0.05,1.2,v=>{sg=v;upd()},v=>v.toFixed(2));slider($('#n9as',root),'wiggle (wave number k)',0,4,0.1,0,v=>{k=v;upd()},v=>v.toFixed(1));
  function upd(){const re=new Array(GN),im=new Array(GN);let t=0;gx.forEach((x,i)=>{const am=Math.exp(-x*x/(4*sg*sg));re[i]=am*Math.cos(k*x);im[i]=am*Math.sin(k*x);t+=am*am});const s=1/Math.sqrt(t*GDX);for(let i=0;i<GN;i++){re[i]*=s;im[i]*=s}
    let ke1=0;for(let i=1;i<GN-1;i++){const dr=(re[i+1]-re[i-1])/(2*GDX),di=(im[i+1]-im[i-1])/(2*GDX);ke1+=0.5*(dr*dr+di*di)*GDX}
    const Pk=momDist(re,im);let ke2=0;gk.forEach((q,j)=>ke2+=0.5*q*q*Pk[j]);const ke3=1/(8*sg*sg)+k*k/2;
    const xs=[],ys=[];gx.forEach((x,i)=>{if(Math.abs(x)<=10){xs.push(x);ys.push(re[i])}});plot(cv,[{xs,ys,color:'#8fd0f0'}],{xmin:-10,xmax:10,ymin:-0.8,ymax:0.8,ratio:.5,minH:200});
    $('#n9ae',root).innerHTML=`⟨KE⟩ from curvature ½∫|ψ′|²dx = <b>${ke1.toFixed(4)}</b><br>⟨KE⟩ from momentum ⟨p²⟩/2 (Fourier) = <b>${ke2.toFixed(4)}</b><br>formula 1/(8σ²) + k²/2 = <b>${ke3.toFixed(4)}</b><br><span class="tip">A narrower or wigglier wave has more kinetic energy.</span>`}
  upd();const ro=new ResizeObserver(upd);ro.observe(cv);return()=>ro.disconnect()}});

/* ---- n10a: classical versus quantum oscillator ---- */
SCENES.push({id:'n10a',title:'Classical versus quantum oscillator',sub:'',
html:`<div class="grid2"><div class="panel col"><div id="n10s"></div><div class="eq" id="n10e"></div></div><div class="panel"><canvas id="n10cv"></canvas><div class="tip"><span style="color:#f2d67a">quantum |ψ<sub>n</sub>(x)|²</span> · <span style="color:#8fd0f0">classical probability density</span> (ħ = m = ω = 1)</div></div></div>`,
init(root){let n=0;const cv=$('#n10cv',root);const xs=Array.from({length:1201},(_,i)=>-10+20*i/1200),dx=20/1200;
  slider($('#n10s',root),'energy level n',0,30,1,0,v=>{n=v;upd()},v=>v);
  function psi(n){let a=xs.map(x=>Math.pow(Math.PI,-0.25)*Math.exp(-x*x/2));if(n===0)return a;let b=xs.map((x,i)=>Math.SQRT2*x*a[i]);for(let m=1;m<n;m++){const c2=xs.map((x,i)=>Math.sqrt(2/(m+1))*x*b[i]-Math.sqrt(m/(m+1))*a[i]);a=b;b=c2}return b}
  function upd(){const p=psi(n),q=p.map(v=>v*v),E=n+0.5,A=Math.sqrt(2*E);const mxq=Math.max(...q);const cl=xs.map(x=>Math.abs(x)<A-1e-6?Math.min(1/(Math.PI*Math.sqrt(A*A-x*x)),mxq*1.6):0);
    const ymax=Math.max(mxq,...cl)*1.1;const lim=Math.min(10,A+1.5);plot(cv,[{xs,ys:cl,color:'#8fd0f0',lw:1.6},{xs,ys:q,color:'#f2d67a',lw:2,fill:'rgba(242,214,122,.2)'}],{xmin:-lim,xmax:lim,ymin:0,ymax:ymax,ratio:.55,minH:230});
    let nodes=0;for(let i=1;i<p.length;i++)if(p[i]*p[i-1]<0)nodes++;const norm=q.reduce((s,v)=>s+v*dx,0);
    $('#n10e',root).innerHTML=`n = ${n}, E<sub>n</sub> = ${E} ħω<br>nodes = ${nodes}<br>∫|ψ<sub>n</sub>|² = ${norm.toFixed(4)}<br>classical turning points at ±${A.toFixed(2)}<br><span class="tip">${n<3?'Low n: nothing like the classical curve.':n<12?'Wiggles are appearing along the classical envelope.':'High n: quantum wiggles average to the classical density.'}</span>`}
  upd();const ro=new ResizeObserver(upd);ro.observe(cv);return()=>ro.disconnect()}});
