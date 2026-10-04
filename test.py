import asyncio,sys,json,os
from playwright.async_api import async_playwright
F='file://'+os.path.abspath('quantum-mechanics-theoretical-minimum.html')
async def run(w,h,tag,shots):
    errs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':w,'height':h})
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' else None)
        await pg.goto(F)
        await pg.click('#enterSound')
        await pg.wait_for_timeout(500)
        n=await pg.evaluate('SCENES.length')
        print(tag,'scenes',n)
        for i in range(n):
            await pg.evaluate(f'__go({i})')
            await pg.wait_for_timeout(300)
            # exercise: click all buttons in scene body (non-nav), move sliders, change selects
            await pg.evaluate('''()=>{const body=document.getElementById('sceneBody');
              body.querySelectorAll('input[type=range]').forEach(s=>{const mid=+s.min+(+s.max-+s.min)*0.37;s.value=mid;s.dispatchEvent(new Event('input',{bubbles:true}))});
              body.querySelectorAll('select').forEach(s=>{s.selectedIndex=Math.min(1,s.options.length-1);s.dispatchEvent(new Event('change',{bubbles:true}))});
              body.querySelectorAll('button:not(.opt)').forEach(b=>{if(!b.disabled)b.click()});
              body.querySelectorAll('td.cell').forEach((t,k)=>{if(k%7==0)t.click()});}''')
            await pg.wait_for_timeout(250)
            sw=await pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
            if not sw: errs.append(f'HSCROLL at scene {i}')
            if i in shots: await pg.screenshot(path=f'shots/{tag}_{i:02d}.png')
        # silent-mode quick check not repeated
        await b.close()
    return errs
async def main():
    shots=set(range(0,60))
    e1=await run(1280,800,'d',shots)
    e2=await run(390,800,'m',{1,2,6,16,30,50})
    print('ERRORS desktop:',e1);print('ERRORS mobile:',e2)
asyncio.run(main())
