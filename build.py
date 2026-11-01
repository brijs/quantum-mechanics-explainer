import json,os,base64,glob,sys
d=os.path.dirname(os.path.abspath(__file__))
P=lambda f:open(os.path.join(d,'parts',f),encoding='utf-8').read()
narr=json.load(open(os.path.join(d,'narration.json'),encoding='utf-8'))
audio={}
for f in sorted(glob.glob(os.path.join(d,'audio','*.mp3'))):
    sid=os.path.basename(f).split('.')[0]
    audio[sid]='data:audio/mpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode()
js='\n'.join([P(x) for x in ['engine.js','core.js','scenes_a.js','scenes_b.js','scenes_c.js','scenes_d.js','scenes_new.js','scenes_new2.js','concepts.js','assemble.js']])
html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quantum Mechanics: The Theoretical Minimum, animated</title>
<meta name="description" content="Animated, narrated deep dive through all ten lectures of Susskind and Friedman's Quantum Mechanics: The Theoretical Minimum, with interactive math. By Brijesh Shetty (github.com/brijs).">
<meta name="explainer:topic" content="Science">
<meta name="explainer:tags" content="quantum mechanics, Susskind, physics, qubits, spin, entanglement">
<style>{P('head.css')}</style><script defer src="https://brijs.dev/t.js" data-site="quantum-mechanics-explainer"></script></head><body>
{P('shell.html')}
<script>const NARR={json.dumps(narr,ensure_ascii=False)};const AUDIO={json.dumps(audio)};</script>
<script>
{js}
assemble();glossUI();boot();
</script></body></html>'''
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(d,'index.html')
open(out,'w',encoding='utf-8').write(html)
print('wrote',out,round(len(html)/1e6,2),'MB; audio clips:',len(audio))
