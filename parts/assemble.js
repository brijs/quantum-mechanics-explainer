/* ===== checks, ordering, concept wrapping, glossary UI ===== */
const CHECKS={
c1:{lec:1,q:[
 {q:'A magnetic field that changes with height pushes tiny magnets up or down. If the atoms\' magnet tilts were random (the classical guess), where would they land?',o:['In two spots','In a continuous band','In one spot','Nowhere'],a:1,e:'Classically any tilt gives any push, so you would see a band. Nature shows just two spots.',rev:'n1b'},
 {q:'You prepare spin +1 along z and immediately measure z again with the same apparatus. What do you get?',o:['Always +1','Random ±1','Always −1','Zero'],a:0,e:'Once prepared, the same question gets the same answer.',rev:'n1c'},
 {q:'Spin up along z is measured along x, then along z again. Why is the last result random?',o:['The apparatus broke it','Measuring x leaves an x-state, which is 50/50 about z','The spin flips each time','The atoms heat up'],a:1,e:'|r⟩ and |l⟩ are equal mixtures of up and down.',rev:'s02'}]},
c2:{lec:2,q:[
 {q:'In ⟨A|B⟩ the bra ⟨A| is…',o:['A column of amplitudes','The conjugate-transposed row of |A⟩','A probability','Identical to |A⟩'],a:1,e:'Conjugate every amplitude and write them as a row.',rev:'s03'},
 {q:'A spin in |u⟩ is measured along x. The probability of |r⟩ is…',o:['0','1/2','1','1/√2'],a:1,e:'|⟨r|u⟩|² = (1/√2)² = 1/2.',rev:'s04'},
 {q:'Why are complex amplitudes needed for spin?',o:['Real combinations only reach a circle of directions; y needs i','Probabilities are complex','Convenience only','Spin rotates in time'],a:0,e:'|i⟩ = (|u⟩ + i|d⟩)/√2 has no real version.',rev:'n2d'}]},
c3:{lec:3,q:[
 {q:'An eigenvector of an observable is…',o:['A state with one definite measurement result','Any random state','Always |u⟩ or |d⟩','A state of zero energy'],a:0,e:'Measuring it gives its eigenvalue for sure.',rev:'n3a'},
 {q:'The possible results of measuring an observable are its…',o:['Matrix entries','Eigenvalues','Determinant','Trace'],a:1,e:'Principle 2.',rev:'s07'},
 {q:'A spin in |u⟩ is measured along x. P(+1) =',o:['0','1/2','1','Depends on the phase'],a:1,e:'|u⟩ is an equal mixture of the two σx eigenvectors.',rev:'s06'}]},
c4:{lec:4,q:[
 {q:'Time evolution must be unitary because…',o:['It keeps orthogonal states orthogonal and total probability 1','It is simpler','It conserves energy only','It makes states real'],a:0,e:'Conservation of distinctions.',rev:'s08'},
 {q:'In U ≈ 1 − iεH, the matrix H must be…',o:['Hermitian','Real','Diagonal','Zero'],a:0,e:'Otherwise first-order terms spoil unitarity.',rev:'n4b'},
 {q:'An energy eigenstate evolves by…',o:['An overall phase, so probabilities are constant','Rotating on the Bloch sphere','Collapsing to up','Growing in size'],a:0,e:'Stationary state.',rev:'n4c'}]},
c5:{lec:5,q:[
 {q:'[σx, σy] =',o:['0','2iσz','σz','2σx'],a:1,e:'Cyclic: [σx,σy] = 2iσz.',rev:'s10'},
 {q:'The bound ΔAΔB ≥ ½|⟨[A,B]⟩| is zero when…',o:['A and B commute','The state is up','ħ is large','Never'],a:0,e:'Commuting observables can be sharp together.',rev:'s11'},
 {q:'If [H, L] = 0, then ⟨L⟩…',o:['Is constant in time','Oscillates','Decays','Equals zero'],a:0,e:'d⟨L⟩/dt = (i/ħ)⟨[H,L]⟩ = 0.',rev:'s12'}]},
c6:{lec:6,q:[
 {q:'Two spins have how many basis states?',o:['2','4','3','8'],a:1,e:'2 × 2 = 4.',rev:'n6a'},
 {q:'Amplitudes (a, b, c, d) form a product state when…',o:['ad = bc','a = d','b = c','All are equal'],a:0,e:'Product amplitudes factorise.',rev:'s13'},
 {q:'In the singlet, Alice and Bob measure along the same axis. They get…',o:['Always opposite results','Always equal results','Independent results','Always up'],a:0,e:'Perfect anti-correlation, though each alone is random.',rev:'s14'}]},
c7:{lec:7,q:[
 {q:'Alice\'s reduced density matrix for the singlet is…',o:['I/2 (maximally mixed)','A pure ket','Zero','diag(1,0)'],a:0,e:'Her half alone is maximally uncertain.',rev:'s15'},
 {q:'Any local hidden-variable theory obeys |S| ≤',o:['1','2','2√2','4'],a:1,e:'Factorisation: S = ±2 for each pair.',rev:'n7a'},
 {q:'Quantum mechanics predicts a maximum |S| of',o:['2','2√2','4','∞'],a:1,e:'Tsirelson bound 2√2 ≈ 2.83.',rev:'s16'}]},
c8:{lec:8,q:[
 {q:'The wave function ψ(x) is…',o:['A complex amplitude for each position','A physical wave of matter','Always real and positive','A force'],a:0,e:'|ψ|² is the probability density.',rev:'n8a'},
 {q:'Narrowing a packet in position makes its momentum distribution…',o:['Broader','Narrower','Unchanged','Discrete'],a:0,e:'Fourier trade-off, Δx Δp ≥ ħ/2.',rev:'s17'},
 {q:'[X, P] =',o:['0','iħ','ħ','−1'],a:1,e:'The root of particle uncertainty.',rev:'s18'}]},
c9:{lec:9,q:[
 {q:'Kinetic energy −(ħ²/2m)ψ″ is large when ψ…',o:['Curves sharply (wiggles fast)','Is large','Is real','Is zero'],a:0,e:'It measures curvature.',rev:'n9a'},
 {q:'During Schrödinger evolution, ∫|ψ|² dx…',o:['Stays equal to 1','Decays','Grows','Oscillates'],a:0,e:'Unitary evolution preserves the norm.',rev:'s19'},
 {q:'A particle passing a barrier taller than its energy is called…',o:['Tunnelling','Reflection','Diffraction','Collapse'],a:0,e:'The wavefunction leaks through.',rev:'s19'}]},
c10:{lec:10,q:[
 {q:'Harmonic-oscillator energy levels are…',o:['ħω(n + ½)','ħω n²','Continuous','ħω/n'],a:0,e:'Evenly spaced with a zero-point offset.',rev:'s20'},
 {q:'a|0⟩ equals…',o:['0','|0⟩','|1⟩','a†'],a:0,e:'There is no state below the ground state.',rev:'s20'},
 {q:'At large n, the quantum density averages to…',o:['The classical density','A central peak','Uniform','Zero'],a:0,e:'Correspondence principle.',rev:'n10a'}]}
};
Object.entries(CHECKS).forEach(([id,c])=>{
  SCENES.push({id,title:`Check yourself: lecture ${c.lec}`,sub:'3 questions · not graded, just to find gaps',html:'<div class="panel" id="chq"></div>',
  init(root){const box=$('#chq',root);const qs=c.q.map(q=>({...q,lec:c.lec}));
    const done=(sc,n)=>{box.innerHTML=`<div class="chalk big">${sc} / ${n}</div><p>${sc===n?'<span class="ok">Solid. On to the next lecture.</span>':'<span class="warn">Use the review links to revisit what you missed, then retry.</span>'}</p>`;
      const rb=el('button','btn',sc===n?'Retake':'Retry');rb.onclick=()=>{box.innerHTML='';quiz(box,qs,done)};box.append(rb);react(sc===n?'Purr-fect.':'A few to revisit.',sc===n?'happy':'think')};
    quiz(box,qs,done)}})});
/* order: [id, lecture (0 = intro, 11 = finale), belt override] */
const ORDER=[['s00',0,0],
 ['n1a',1],['n1b',1],['n1c',1],['n1d',1],['s01',1],['s02',1],['c1',1],
 ['n2a',2],['s03',2],['n2c',2],['s04',2],['n2d',2],['s05',2],['c2',2],
 ['n3a',3],['s06',3],['n3b',3],['s07',3],['c3',3],
 ['n4a',4],['s08',4],['n4b',4],['s09',4],['n4c',4],['c4',4],
 ['n5a',5],['s10',5],['s11',5],['s12',5],['c5',5],
 ['n6a',6],['s13',6],['s14',6],['c6',6],
 ['s15',7],['n7a',7],['s16',7],['c7',7],
 ['n8a',8],['s17',8],['s18',8],['c8',8],
 ['n9a',9],['s19',9],['c9',9],
 ['n10a',10],['s20',10],['c10',10],
 ['s21',11,3],['s22',11,4]];
const SUBS={n1a:'Lecture 1 · Why quantum mechanics exists',n1b:'Lecture 1 · What is spin?',n1c:'Lecture 1 · Apparatus, preparing, measuring',n1d:'Lecture 1 · Probability and averages',
 n2a:'Lecture 2 · What is a state?',n2c:'Lecture 2 · Inner products and phases',n2d:'Lecture 2 · Spin along other axes',n3a:'Lecture 3 · Refresher: matrices and eigenvectors',n3b:'Lecture 3 · Operators from eigenvectors',
 n4a:'Lecture 4 · The classical rule',n4b:'Lecture 4 · Tiny steps of time',n4c:'Lecture 4 · Stationary states',n5a:'Lecture 5 · Order matters',n6a:'Lecture 6 · Two systems, one state',n7a:'Lecture 7 · Einstein\'s hidden answers',
 n8a:'Lecture 8 · Wave functions and position',n9a:'Lecture 9 · Kinetic energy as curvature',n10a:'Lecture 10 · Classical versus quantum oscillator'};
/* glossary linking */
function autoGloss(root){const keys=Object.keys(GLOSS).sort((a,b)=>b.length-a.length);const re=new RegExp('\\b('+keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(s|es)?\\b','gi');const used=new Set();
  $$('.concept,.mis',root).forEach(box=>{const w=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>{if(n.parentElement.closest('.g,b'))return;const t=n.nodeValue;re.lastIndex=0;let m,last=0,any=false;const frag=document.createDocumentFragment();
      while((m=re.exec(t))){const k=m[1].toLowerCase();if(used.has(k))continue;used.add(k);any=true;frag.append(t.slice(last,m.index));const s=el('span','g',m[0]);s.dataset.g=k;s.tabIndex=0;s.setAttribute('role','button');frag.append(s);last=m.index+m[0].length}
      if(any){frag.append(t.slice(last));n.replaceWith(frag)}})})}
function showPop(k){const p=$('#pop');p.innerHTML=`<b>${k}</b> ${GLOSS[k]} <button class="btn sm" id="popX" style="margin-left:8px">✕</button>`;p.hidden=false;$('#popX').onclick=()=>{p.hidden=true}}
function assemble(){const map={};SCENES.forEach(s=>map[s.id]=s);SCENES.length=0;
  ORDER.forEach(([id,lec,belt])=>{const s=map[id];if(!s)throw new Error('missing scene '+id);s.lec=lec;s.belt=belt!=null?belt:lec<=3?0:lec<=5?1:lec<=7?2:3;
    if(SUBS[id])s.sub=SUBS[id];
    const cc=CONCEPT[id];if(cc){const base=s.html||'';const init=s.init;
      s.html=`<div class="concept"><div class="cl"><b>The idea</b>${cc.story}</div><div class="cl m"><b>The math</b>${cc.math}</div></div><div class="tryhdr">Picture it, try it</div>${base}`+(cc.mis?`<div class="mis"><b>Common misconception:</b> “${cc.mis[0]}” <br><b>Better:</b> ${cc.mis[1]}</div>`:'');
      s.init=function(root){const r=init?init(root):undefined;autoGloss(root);return r}}
    SCENES.push(s)})}
function glossUI(){const list=$('#glList');const render=f=>{list.innerHTML=Object.keys(GLOSS).sort().filter(k=>!f||k.includes(f.toLowerCase())||GLOSS[k].toLowerCase().includes(f.toLowerCase())).map(k=>`<div><b>${k}</b>: ${GLOSS[k]}</div>`).join('')||'<div class="tip">No match.</div>'};
  render('');$('#bGloss').onclick=()=>{$('#glossModal').hidden=false;$('#glFind').focus()};$('#glClose').onclick=()=>{$('#glossModal').hidden=true};
  $('#glFind').addEventListener('input',e=>render(e.target.value));$('#glossModal').addEventListener('click',e=>{if(e.target.id==='glossModal')e.target.hidden=true});
  document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('.g');if(g){showPop(g.dataset.g);return}if(!e.target.closest('#pop'))$('#pop').hidden=true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#pop').hidden=true;$('#glossModal').hidden=true}if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('g')){e.preventDefault();showPop(e.target.dataset.g)}})}
