import json,re,os,io
D=os.path.dirname(os.path.abspath(__file__))
def R(p): return io.open(os.path.join(D,p),encoding='utf-8').read()

days=R('data/days.js')
# 개념도용 필드 제거 (실지도로 대체)
def strip_block(s,key):
    out=[];i=0
    while True:
        j=s.find(key,i)
        if j<0: out.append(s[i:]); break
        out.append(s[i:j])
        k=s.find('[',j); depth=0
        while k<len(s):
            if s[k]=='[':depth+=1
            elif s[k]==']':
                depth-=1
                if depth==0: break
            k+=1
        k+=1
        while k<len(s) and s[k] in ' ,\n': k+=1
        i=k
    return ''.join(out)
days=strip_block(days,'legs:[')
days=strip_block(days,'offmap:[')
days=re.sub(r'\n?\s*x:-?\d+(\.\d+)?,\s*y:-?\d+(\.\d+)?,\s*','\n     ',days)
days=re.sub(r'lab:"[^"]*",\s*','',days)

info=R('data/info.js')
coords=json.load(open(os.path.join(D,'data/coords.json'),encoding='utf-8'))
base=json.load(open(os.path.join(D,'data/basemap.json'),encoding='utf-8'))

data = ('/* ===== 데이터 ===== */\n'
  + days.rstrip()+'\n\n'
  + info.rstrip()+'\n\n'
  + 'const COORDS = '+json.dumps(coords,ensure_ascii=False,separators=(',',':'))+';\n\n'
  + 'const BASEMAP = '+json.dumps(base,ensure_ascii=False,separators=(',',':'))+';\n')

tpl=R('src/template.html')
html=(tpl.replace('/*__CSS__*/',R('src/style.css').rstrip())
         .replace('/*__DATA__*/',data)
         .replace('/*__ENGINE__*/',R('src/engine.js').rstrip())
         .replace('/*__APP__*/',R('src/app.js').rstrip())
         .replace('<!--ARTIFACT-HEAD-->',''))
io.open(os.path.join(D,'index.html'),'w',encoding='utf-8').write(html)

# ---- 아티팩트용: <html>/<head>/<body> 없이 본문만 ----
inner=html.split('<!--ARTIFACT-START-->')[1].split('<!--ARTIFACT-END-->')[0]
head_bits=[]
m=re.search(r'<title>.*?</title>',html,re.S); head_bits.append(m.group(0))
head_bits.append('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')
head_bits+=re.findall(r'<link [^>]*>',html)
m=re.search(r'<style>.*?</style>',html,re.S); head_bits.append(m.group(0))
art='\n'.join(head_bits)+'\n'+inner
io.open(os.path.join(D,'artifact.html'),'w',encoding='utf-8').write(art)
print('index.html %.1f KB / artifact.html %.1f KB'%(len(html.encode())/1024,len(art.encode())/1024))
