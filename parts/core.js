/* ===== runtime: scenes, narration, character ===== */
const SCENES=[];
const RANKS=[
  {n:'Observer',col:'#9be0a8'},{n:'Experimenter',col:'#8fd0f0'},{n:'Entangler',col:'#f29fb4'},{n:'Wave Rider',col:'#f6b26b'},{n:'Master of the Ket',col:'#f2d67a'}];
const st={i:-1,silent:false,muted:false,auto:false,maxBelt:-1,passed:false,visited:new Set()};
const au=new Audio();au.preload='auto';
let actx=null,analyser=null,abuf=null,wired=false,curCleanup=null,mouthT=0,blinkT=0;
function pretty(t){return t.replace(/Shroh/g,'Schrö').replace(/Schroedinger/g,'Schrödinger').replace(/h bar/g,'ħ').replace(/e to the i phi/g,'e^iφ')}
function wire(){if(wired)return;wired=true;try{actx=new(window.AudioContext||window.webkitAudioContext)();const s=actx.createMediaElementSource(au);analyser=actx.createAnalyser();analyser.fftSize=512;abuf=new Uint8Array(analyser.fftSize);s.connect(analyser);analyser.connect(actx.destination)}catch(e){actx=null;analyser=null}}
/* character */
const cat={mood:'neutral'};
function setMood(m){cat.mood=m;const happy=m==='happy',think=m==='think',alert_=m==='alert';
  $('#hapL').setAttribute('display',happy?'':'none');$('#hapR').setAttribute('display',happy?'':'none');
  $('#pL').setAttribute('display',happy?'none':'');$('#pR').setAttribute('display',happy?'none':'');
  const px=think?3:0,py=think?-3:0,r=alert_?7.5:6;['pL','pR'].forEach((id,k)=>{const p=$('#'+id);p.setAttribute('cx',(k?120:80)+px);p.setAttribute('cy',84+py);p.setAttribute('r',r)});
  $('#browL').setAttribute('d',think?'M68 64 L92 58':alert_?'M68 60 L92 60':'M68 66 L92 66');
  $('#browR').setAttribute('d',alert_?'M108 60 L132 60':think?'M108 64 L132 66':'M108 66 L132 66')}
let reactTimer=0;
function react(text,mood){setMood(mood||'happy');$('#react').textContent=text;clearTimeout(reactTimer);reactTimer=setTimeout(()=>{$('#react').textContent='';setMood('neutral')},4500)}
window.react=react;
function bow(){const g=$('#catbob');g.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(10px) rotate(6deg)'},{transform:'translateY(0) rotate(0)'}],{duration:900,transformOrigin:'100px 160px'})}
function updRank(){const b=Math.max(0,st.maxBelt);const r=st.passed?RANKS[4]:RANKS[Math.min(b,3)];$('#rank').textContent='Rank: '+r.n;$('#bow').setAttribute('fill',r.col);$('#badgeT').textContent=st.passed?'Ψ':String((st.passed?5:Math.min(b,3)+1))}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600)}
/* animation loop: blink, bob, mouth */
function loop(ts){
  const t=ts/1000;$('#catbob').style.transform=`translateY(${Math.sin(t*2)*2}px)`;
  let open=0;const playing=!au.paused&&!au.ended&&au.currentTime>0;
  if(playing&&!st.muted){if(analyser){analyser.getByteTimeDomainData(abuf);let s=0;for(let i=0;i<abuf.length;i++){const v=(abuf[i]-128)/128;s+=v*v}open=clamp(Math.sqrt(s/abuf.length)*6,0,1)}else open=(Math.sin(t*14)+1)/2*.7}
  else if(playing&&st.muted){open=(Math.sin(t*14)+1)/2*.5}
  mouthT+=(open-mouthT)*0.5;const m=$('#mouth');m.setAttribute('ry',(1.5+mouthT*9).toFixed(2));m.setAttribute('rx',(8-mouthT*2).toFixed(2));
  if(ts>blinkT){blinkT=ts+2200+rnd()*3000;['lidL','lidR'].forEach(id=>{const l=$('#'+id);l.setAttribute('height',24);setTimeout(()=>l.setAttribute('height',0),130)})}
  if(st.capWords)lightCaption();
  requestAnimationFrame(loop)}
/* captions */
function buildCaption(text){const cap=$('#cap');cap.innerHTML='';const words=pretty(text).split(/\s+/);let tot=0;const ws=words.map(w=>{const s=el('span','w',w+' ');cap.append(s);tot+=w.length+1;return {s,end:tot}});
  ws.forEach(w=>w.f=w.end/tot);st.capWords=ws}
function lightCaption(){const ws=st.capWords;if(!ws)return;let p;if(st.silent||!au.src||(au.error)){p=1}else if(au.ended){p=1}else p=au.duration?au.currentTime/au.duration:0;
  const lead=0.02;ws.forEach(w=>w.s.classList.toggle('lit',w.f<=p+lead||p>=0.995))}
/* scene navigation */
function go(i){
  if(i<0||i>=SCENES.length)return;
  if(curCleanup){try{curCleanup()}catch(e){}curCleanup=null}
  au.pause();clearTimeout(st.autoT);clearTimeout(reactTimer);$('#react').textContent='';$('#bNext').classList.remove('pulse');
  const sc=SCENES[i];st.i=i;st.visited.add(i);
  $('#sceneTitle').textContent=sc.title;$('#sceneSub').innerHTML=sc.sub||'';
  const body=$('#sceneBody');body.innerHTML=sc.html||'';
  try{const r=sc.init&&sc.init(body);if(typeof r==='function')curCleanup=r}catch(e){console.error('scene init',sc.id,e);body.append(el('div','bad','Scene error: '+e.message))}
  $$('.dot').forEach((d,k)=>{d.classList.toggle('cur',k===i);d.classList.toggle('done',k!==i&&st.visited.has(k))});
  $('#bBack').disabled=i===0;$('#bNext').disabled=i===SCENES.length-1;
  if(sc.belt>st.maxBelt){const first=st.maxBelt<0;st.maxBelt=sc.belt;updRank();if(!first&&sc.belt<=3){toast('Rank up: '+RANKS[sc.belt].n+'!');bow()}}
  buildCaption(NARR[sc.id]||'');
  if(!st.silent&&AUDIO[sc.id]){au.src=AUDIO[sc.id];au.muted=st.muted;if(actx&&actx.state==='suspended')actx.resume();au.play().catch(()=>{})}
  window.scrollTo({top:0,behavior:'smooth'});setMood('neutral')}
au.addEventListener('ended',()=>{if(st.i<SCENES.length-1){$('#bNext').classList.add('pulse');if(st.auto)st.autoT=setTimeout(()=>go(st.i+1),1400)}});
function next(){go(st.i+1)}function back(){go(st.i-1)}
document.addEventListener('keydown',e=>{if($('#intro'))return;if(e.target.matches('input[type=text],textarea'))return;const sc=SCENES[st.i];
  if(sc&&sc.onKey){const r=sc.onKey(e);if(r===true)return}
  if(!(sc&&sc.captureArrows)){if(e.key==='ArrowRight'&&!e.target.matches('input[type=range],select')){next()}else if(e.key==='ArrowLeft'&&!e.target.matches('input[type=range],select')){back()}}});
function boot(){
  const dots=$('#dots');SCENES.forEach((s,k)=>{const b=el('button','dot');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-label',`Scene ${k+1}: ${s.title}`);b.title=s.title;b.onclick=()=>go(k);if(k>0&&SCENES[k].lec!==SCENES[k-1].lec)b.style.marginLeft='10px';dots.append(b)});
  $('#bNext').onclick=next;$('#bBack').onclick=back;
  $('#bReplay').onclick=()=>{if(st.silent||!AUDIO[SCENES[st.i].id])return;au.currentTime=0;if(actx&&actx.state==='suspended')actx.resume();au.play().catch(()=>{})};
  $('#bStop').onclick=()=>{au.pause();st.capWords&&st.capWords.forEach(w=>w.s.classList.add('lit'))};
  $('#bMute').onclick=()=>{st.muted=!st.muted;au.muted=st.muted;$('#bMute').textContent=st.muted?'🔇':'🔊'};
  $('#bAuto').onclick=()=>{st.auto=!st.auto;$('#bAuto').classList.toggle('on',st.auto);$('#bAuto').setAttribute('aria-pressed',st.auto)};
  $('#bFx').onclick=()=>{const on=document.body.classList.toggle('fx');$('#bFx').classList.toggle('on',on);$('#bFx').setAttribute('aria-pressed',on)};
  document.body.classList.add('fx');
  const enter=silent=>{st.silent=silent;if(silent){$('#bReplay').disabled=true;$('#bStop').disabled=true;$('#bMute').disabled=true}else wire();$('#intro').remove();updRank();go(0);requestAnimationFrame(loop)};
  $('#enterSound').onclick=()=>enter(false);$('#enterSilent').onclick=()=>enter(true);
  window.__go=go;window.__st=st;
}
