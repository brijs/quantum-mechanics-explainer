/* ===== Act II: Lectures 4-5 ===== */
const HAD=msc([[ONE,ONE],[ONE,c(-1)]],R2), SQUASH=msc([[ONE,ONE],[ZERO,ZERO]],R2);
const Rz=a=>[[cexp(-a/2),ZERO],[ZERO,cexp(a/2)]];
function ident(M){const n=M.length;const D=mid(n);return M.every((r,i)=>r.every((x,j)=>Math.hypot(x[0]-D[i][j][0],x[1]-D[i][j][1])<1e-9))}
function ncross(th,ph){return [Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)]}
function Umat(t,n){const N=madd(madd(msc(SX,n[0]),msc(SY,n[1])),msc(SZ,n[2]));return madd(msc(ID2,Math.cos(t/2)),msc(N,c(0,-Math.sin(t/2))))}

SCENES.push({id:'s08',belt:1,title:'Conservation of distinctions',sub:'Lecture 4 · Time evolution must be unitary',
html:`<div class="grid2"><div class="panel col"><div class="chalk">Pick an evolution operator U</div><div id="s8c"></div><div id="s8s"></div><div class="eq" id="s8m"></div></div>
<div class="panel"><div class="eq" id="s8r"></div><div id="s8v" class="chalk big"></div></div></div>
<p class="tip">Test: send the two perfectly distinguishable states |u⟩ and |d⟩ through U. Do they stay distinguishable (orthogonal) and keep unit length?</p>`,
init(root){let kind='rot',a=ang(70);const s=slider($('#s8s',root),'Rotation angle α',0,360,1,70,v=>{a=ang(v);upd()},v=>v+'°');
  chips($('#s8c',root),[['rot','Rotation about z'],['had','Hadamard-like'],['sq','Squash']],'rot',k=>{kind=k;s.el.style.display=k==='rot'?'':'none';upd()});
  function upd(){const U=kind==='rot'?Rz(a):kind==='had'?HAD:SQUASH;const uu=mv(U,KU),ud=mv(U,KD);const ip=inner(uu,ud),UU=mm(mdag(U),U);const ok=ident(UU);
    $('#s8m',root).innerHTML=`U = ${matHTML(U)}`;
    $('#s8r',root).innerHTML=`U†U = ${matHTML(UU)}<br>U${ket('u')} = ${ketHTML(uu)}  U${ket('d')} = ${ketHTML(ud)}<br>⟨Uu|Ud⟩ = <b>${fcx(ip)}</b> · norms² = ${norm2(uu).toFixed(3)}, ${norm2(ud).toFixed(3)}`;
    $('#s8v',root).innerHTML=ok?'<span class="ok">Unitary: distinctions conserved ✓</span>':'<span class="bad">Not unitary: distinctions lost, probabilities don’t add to 1 ✗</span>'}
  upd()}});

SCENES.push({id:'s09',belt:1,title:'The Hamiltonian drives the spin',sub:'Lecture 4 · iħ d|ψ⟩/dt = H|ψ⟩ with H = (ħω/2)σz',
html:`<div class="grid2"><div class="panel" id="s9v"></div><div class="panel col"><div class="row"><button class="btn pri" id="s9p">⏸ Pause</button><button class="btn" id="s9r">Restart</button></div><div id="s9s"></div>
<div class="eq" id="s9e"></div></div></div>
<p class="tip">Energy eigenstates |u⟩ and |d⟩ only pick up phases e<sup>∓iωt/2</sup>. Set θ = 0 and nothing moves; any superposition precesses.</p>`,
init(root){let om=1.5,th=ang(70),t=0,run=true,last=performance.now(),raf=0;const B=new Bloch($('#s9v',root));
  slider($('#s9s',root),'ω (angular frequency)',0,4,0.05,1.5,v=>{om=v},v=>v.toFixed(2));
  slider($('#s9s',root),'initial θ',0,180,1,70,v=>{th=ang(v);t=0;B.trail=[]},v=>v+'°');
  $('#s9p',root).onclick=e=>{run=!run;e.target.textContent=run?'⏸ Pause':'▶ Play'};$('#s9r',root).onclick=()=>{t=0;B.trail=[]};
  function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;if(run)t+=dt;
    const psi=[csc(cexp(-om*t/2),Math.cos(th/2)),csc(cexp(om*t/2),Math.sin(th/2))];const v=blochVec(psi);
    B.vec=v;B.trail.push(v);if(B.trail.length>160)B.trail.shift();B.vecs=[];B.draw();
    $('#s9e',root).innerHTML=`t = ${t.toFixed(2)}, ωt/2 = ${(om*t/2).toFixed(2)}<br>${ket('ψ(t)')} = ${ketHTML(psi,z=>fcx(z,2))}<br>⟨σx⟩ = ${v[0].toFixed(2)}, ⟨σy⟩ = ${v[1].toFixed(2)}, ⟨σz⟩ = ${v[2].toFixed(2)} (constant)`;raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(raf);B.ro.disconnect()}}});

SCENES.push({id:'s10',belt:1,title:'Commutators',sub:'Lectures 4–5 · [A,B] = AB − BA',
html:`<div class="panel col"><div class="row" id="s10s"></div><div class="eq" id="s10e" style="overflow-x:auto"></div><div class="chalk big" id="s10r"></div></div>
<div class="note"><b>Classical → quantum:</b> the Poisson bracket {A,B} is replaced by (1/iħ)[A,B]. In lecture 8 you'll meet [X,P] = iħ.</div>`,
init(root){let A='x',B='y';const ops={x:SX,y:SY,z:SZ};
  selectBox($('#s10s',root),'A =',[['x','σx'],['y','σy'],['z','σz']],'x',v=>{A=v;upd()});selectBox($('#s10s',root),'B =',[['x','σx'],['y','σy'],['z','σz']],'y',v=>{B=v;upd()});
  function upd(){const a=ops[A],b=ops[B],ab=mm(a,b),ba=mm(b,a),cm=msub(ab,ba);let desc='0 (they commute)';
    for(const k of ['x','y','z']){const M=ops[k];const tr=mm(mdag(M),cm);const co=csc(cadd(tr[0][0],tr[1][1]),0.5);if(cabs2(co)>1e-9&&isSame(cm.flat(),msc(M,co).flat(),1e-9)){desc=`${fcx(co)}·σ${k}`.replace('1·','').replace(/^i·/,'i·');}}
    $('#s10e',root).innerHTML=`σ${A}σ${B} = ${matHTML(ab)}  σ${B}σ${A} = ${matHTML(ba)}<br>[σ${A},σ${B}] = ${matHTML(cm)}`;
    $('#s10r',root).innerHTML=`[σ${A}, σ${B}] = <span class="${desc.startsWith('0')?'ok':'warn'}">${desc}</span>`}
  upd()}});

SCENES.push({id:'s11',belt:1,title:'The uncertainty principle',sub:'Lecture 5 · ΔA·ΔB ≥ ½|⟨[A,B]⟩|',
html:`<div class="grid2"><div class="panel col"><div class="row" id="s11s"></div><div id="s11t"></div><button class="btn pri" id="s11b">Sample 1000 random states</button><div class="tip" id="s11r"></div></div>
<div class="panel"><div class="eq" id="s11e"></div><div id="s11h"></div></div></div>`,
init(root){let A='x',B='y',th=ang(90),ph=0;const ops={x:SX,y:SY,z:SZ};
  selectBox($('#s11s',root),'A =',[['x','σx'],['y','σy'],['z','σz']],'x',v=>{A=v;upd()});selectBox($('#s11s',root),'B =',[['x','σx'],['y','σy'],['z','σz']],'y',v=>{B=v;upd()});
  slider($('#s11t',root),'θ',0,180,1,90,v=>{th=ang(v);upd()},v=>v+'°');slider($('#s11t',root),'φ',0,360,1,0,v=>{ph=ang(v);upd()},v=>v+'°');
  const h=histo($('#s11h',root),['ΔA·ΔB','bound ½|⟨[A,B]⟩|'],['#f6b26b','#8fd0f0']);
  function stats(psi){const a=ops[A],b=ops[B];const da=Math.sqrt(Math.max(0,expect(mm(a,a),psi)-expect(a,psi)**2)),db=Math.sqrt(Math.max(0,expect(mm(b,b),psi)-expect(b,psi)**2));
    const cm=inner(psi,mv(comm(a,b),psi));return {da,db,prod:da*db,bound:0.5*Math.hypot(cm[0],cm[1])}}
  function upd(){const s=stats(ketAng(th,ph));$('#s11e',root).innerHTML=`Δσ${A} = ${s.da.toFixed(3)}, Δσ${B} = ${s.db.toFixed(3)}<br>product = <b>${s.prod.toFixed(3)}</b><br>½|⟨[σ${A},σ${B}]⟩| = <b>${s.bound.toFixed(3)}</b><br><span class="${s.prod>=s.bound-1e-9?'ok':'bad'}">${s.prod>=s.bound-1e-9?'product ≥ bound ✓':'violation?!'}</span>`;
    h.update([s.prod,s.bound],[s.prod.toFixed(3),s.bound.toFixed(3)])}
  $('#s11b',root).onclick=()=>{let v=0,minGap=9;for(let k=0;k<1000;k++){const t=Math.acos(1-2*rnd()),p=rnd()*TAU;const s=stats(ketAng(t,p));if(s.prod<s.bound-1e-9)v++;minGap=Math.min(minGap,s.prod-s.bound)}
    $('#s11r',root).textContent=`1000 random states: ${v} violations, smallest gap = ${minGap.toExponential(2)}`;react(v?'Call the Nobel committee!':'No violations. Nature keeps its books.',v?'alert':'happy')};
  upd()}});

SCENES.push({id:'s12',belt:1,title:'Time dependence and conservation',sub:'Lecture 5 · d⟨L⟩/dt = (i/ħ)⟨[H,L]⟩',
html:`<div class="grid2"><div class="panel col"><div class="tip">H = (ħω/2) n̂·σ, with ω = 1. Aim the field n̂:</div><div id="s12s"></div><div id="s12c"></div></div>
<div class="panel"><canvas id="s12p"></canvas><div class="eq" id="s12e"></div></div></div>`,
init(root){let fth=ang(0),fph=0,sth=ang(80),sph=0,L='x';
  slider($('#s12s',root),'field polar angle',0,180,1,0,v=>{fth=ang(v);upd()},v=>v+'°');slider($('#s12s',root),'field azimuth',0,360,1,0,v=>{fph=ang(v);upd()},v=>v+'°');
  slider($('#s12s',root),'spin θ₀',0,180,1,80,v=>{sth=ang(v);upd()},v=>v+'°');slider($('#s12s',root),'spin φ₀',0,360,1,0,v=>{sph=ang(v);upd()},v=>v+'°');
  chips($('#s12c',root),[['x','L = σx'],['y','L = σy'],['z','L = σz']],'x',v=>{L=v;upd()});
  const ops={x:SX,y:SY,z:SZ};
  function upd(){const n=ncross(fth,fph),psi0=ketAng(sth,sph),H=msc(madd(madd(msc(SX,n[0]),msc(SY,n[1])),msc(SZ,n[2])),0.5);
    const T=4*Math.PI,N=200,xs=[],ys={x:[],y:[],z:[]};
    for(let k=0;k<=N;k++){const t=T*k/N,p=mv(Umat(t,n),psi0);xs.push(t);ys.x.push(expect(SX,p));ys.y.push(expect(SY,p));ys.z.push(expect(SZ,p))}
    plot($('#s12p',root),[{xs,ys:ys.x,color:'#8fd0f0',lw:L==='x'?3.5:1.2},{xs,ys:ys.y,color:'#f6b26b',lw:L==='y'?3.5:1.2},{xs,ys:ys.z,color:'#9be0a8',lw:L==='z'?3.5:1.2}],{xmin:0,xmax:T,ymin:-1,ymax:1,ratio:.55});
    const Lm=ops[L],cm=comm(H,Lm);const f=inner(psi0,mv(cm,psi0));const formula=-f[1]*1; /* (i)<[H,L]> real part, ħ=1 */
    const e=1e-5,pa=mv(Umat(e,n),psi0),pb=mv(Umat(-e,n),psi0);const fd=(expect(Lm,pa)-expect(Lm,pb))/(2*e);
    const nrm=['x','y','z'].map(k=>{const m=comm(H,ops[k]);return Math.sqrt(m.flat().reduce((s,z)=>s+cabs2(z),0))});
    const conserved=nrm.map((v,i)=>v<1e-9?' (conserved)':'');
    $('#s12e',root).innerHTML=`<span class="tip">curves: <span style="color:#8fd0f0">⟨σx⟩</span> <span style="color:#f6b26b">⟨σy⟩</span> <span style="color:#9be0a8">⟨σz⟩</span></span><br>i⟨[H,σ${L}]⟩ = ${formula.toFixed(5)}<br>finite-difference d⟨σ${L}⟩/dt = ${fd.toFixed(5)}<br>‖[H,σx]‖ = ${nrm[0].toFixed(2)}${conserved[0]}, ‖[H,σy]‖ = ${nrm[1].toFixed(2)}${conserved[1]}, ‖[H,σz]‖ = ${nrm[2].toFixed(2)}${conserved[2]}`}
  upd();const ro=new ResizeObserver(upd);ro.observe($('#s12p',root));return()=>ro.disconnect()}});
