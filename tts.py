import json,re,os,hashlib,subprocess,soundfile as sf
from kokoro_onnx import Kokoro
K=os.environ.get('KOKORO_DIR',os.path.expanduser('~/.cache/kokoro'))
def say(t):
    t=t.replace('h bar','h-bar')
    return t
N=json.load(open('narration.json')); os.makedirs('audio',exist_ok=True)
k=Kokoro(f'{K}/kokoro-v1.0.onnx',f'{K}/voices-v1.0.bin')
for sid,txt in N.items():
    s=say(txt); h=hashlib.md5((s+'af_heart').encode()).hexdigest()[:8]; out=f'audio/{sid}.{h}.mp3'
    if os.path.exists(out): continue
    [os.remove('audio/'+f) for f in os.listdir('audio') if f.startswith(sid+'.')]
    a,sr=k.create(s,voice='af_heart',speed=1.0,lang='en-us'); sf.write('tmp.wav',a,sr)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','tmp.wav','-ac','1','-b:a','40k',out],check=True)
    print('done',sid,flush=True)
print('ALLDONE')
