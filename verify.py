import asyncio,os,json
from playwright.async_api import async_playwright
F='file://'+os.path.abspath('quantum-mechanics-theoretical-minimum.html')
JS='''()=>{const o={};
 o.chsh=(()=>{const q=(a,b)=>Eq(SINGLET,ang(a),ang(b));return q(0,45)-q(0,135)+q(90,45)+q(90,135)})();
 o.E_same=Eq(SINGLET,0.3,0.3);o.E_ortho=Eq(SINGLET,0,Math.PI/2);o.E_60=Eq(SINGLET,0,Math.PI/3)+Math.cos(Math.PI/3);
 o.had_unitary=ident(mm(mdag(HAD),HAD));o.sq_unitary=ident(mm(mdag(SQUASH),SQUASH));
 const cm=comm(SX,SY);o.comm_xy=isSame(cm.flat(),msc(SZ,c(0,2)).flat());
 o.born_ru=cabs2(inner(KR,KU));o.born_ir=cabs2(inner(KI,KR));o.born_lr=cabs2(inner(KL,KR));o.born_ud=cabs2(inner(KU,KD));
 o.unit_orth=cabs2(inner(ketAng(1.1,0.7),ketAng(Math.PI-1.1,0.7+Math.PI)));
 o.bloch=blochVec(KI);
 o.avg=(()=>{let s=0;for(let i=0;i<40000;i++)s+=measure(KU,ang(60),0).res;return s/40000})();
 // uncertainty violations
 let viol=0;const ops=[SX,SY,SZ];for(let k=0;k<5000;k++){const t=Math.acos(1-2*Math.random()),p=Math.random()*TAU,psi=ketAng(t,p);const A=ops[k%3],B=ops[(k+1+(k%2))%3];
   const da=Math.sqrt(Math.max(0,1-expect(A,psi)**2)),db=Math.sqrt(Math.max(0,1-expect(B,psi)**2));const cc=inner(psi,mv(comm(A,B),psi));if(da*db<0.5*Math.hypot(...cc)-1e-9)viol++}
 o.uncert_viol=viol;
 // oscillator
 o.osc=(()=>{const xs=Array.from({length:1601},(_,i)=>-10+20*i/1600),dx=20/1600;const p0=xs.map(x=>Math.pow(Math.PI,-0.25)*Math.exp(-x*x/2));let a=p0,b=xs.map((x,i)=>Math.SQRT2*x*p0[i]);const res=[];const get=n=>{if(n===0)return p0;let a=p0,b=xs.map((x,i)=>Math.SQRT2*x*p0[i]);for(let m=1;m<n;m++){const c2=xs.map((x,i)=>Math.sqrt(2/(m+1))*x*b[i]-Math.sqrt(m/(m+1))*a[i]);a=b;b=c2}return b};
   let worst=0;for(let n=0;n<=12;n++){const p=get(n);const nr=p.reduce((s,v)=>s+v*v,0)*dx,x2=p.reduce((s,v,i)=>s+xs[i]*xs[i]*v*v,0)*dx;worst=Math.max(worst,Math.abs(nr-1),Math.abs(x2-(n+0.5)))}return worst})();
 // entropy singlet
 const r=rhoA([ZERO,c(R2),c(-R2),ZERO]);o.rho_singlet=[r[0][0][0],r[1][1][0],r[0][1][0]];
 // gaussian uncertainty
 o.gauss=(()=>{const re=new Array(GN),im=new Array(GN).fill(0);let t=0;gx.forEach((x,i)=>{re[i]=Math.exp(-x*x/(4*1.7*1.7));t+=re[i]*re[i]});const Px=re.map(r=>r*r/t);const Pk=momDist(re,im);return stats1(gx,Px).sd*stats1(gk,Pk).sd})();
 // split-step norm & Ehrenfest
 return o}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':800})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(F);await pg.click('#enterSound');await pg.wait_for_timeout(300)
        r=await pg.evaluate(JS);print(json.dumps(r,indent=1))
        # barrier / free simulation: run scene 19 and read the readouts
        await pg.evaluate('__go(19)')
        for pot,btn in [('free',0),('barrier',1),('well',2)]:
            await pg.evaluate(f"document.querySelectorAll('#s19c .chip')[{btn}].click()")
            await pg.evaluate("document.getElementById('s19r').click()")
            await pg.wait_for_timeout(5000 if pot!='well' else 8000)
            print(pot,await pg.evaluate("document.getElementById('s19e').innerText"))
            await pg.evaluate("document.getElementById('s19x').click()")
        # audio check
        await pg.evaluate('__go(1)');await pg.wait_for_timeout(2500)
        print('audio',await pg.evaluate('({t:au.currentTime,d:au.duration,paused:au.paused,err:au.error&&au.error.code})'))
        print('mouth ry',await pg.evaluate("document.getElementById('mouth').getAttribute('ry')"))
        print('caption lit',await pg.evaluate("document.querySelectorAll('#cap .w.lit').length+'/'+document.querySelectorAll('#cap .w').length"))
        durs=await pg.evaluate("""async()=>{const out={};for(const id of Object.keys(AUDIO)){const a=new Audio(AUDIO[id]);await new Promise(r=>{a.onloadedmetadata=r;a.onerror=r});out[id]=+a.duration.toFixed(1)}return out}""")
        print('durations',durs)
        await b.close();print('page errors',errs)
asyncio.run(main())
