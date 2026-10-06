import json,base64,zlib,urllib.request,sys
UA='Mozilla/5.0 Chrome/153'
def opendoc(tab, endrow=2000):
    url=(f"https://docs.qq.com/dop-api/opendoc?id=DWkpGWkJhSkVzcXh6&tab={tab}&outformat=1"
         f"&normal=1&wb=1&nowb=1&startrow=0&endrow={endrow}")
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Referer':'https://docs.qq.com/sheet/DWkpGWkJhSkVzcXh6'})
    return json.load(urllib.request.urlopen(req,timeout=90))

def rd_varint(b,i):
    v=0;sh=0
    while True:
        c=b[i];i+=1;v|=(c&0x7f)<<sh;sh+=7
        if not c&0x80: break
    return v,i

def fields(b):
    i=0;n=len(b);out=[]
    while i<n:
        tag,i=rd_varint(b,i); fn=tag>>3; wt=tag&7
        if wt==0: v,i=rd_varint(b,i); out.append((fn,wt,v))
        elif wt==2:
            ln,i=rd_varint(b,i); out.append((fn,wt,b[i:i+ln])); i+=ln
        elif wt==5: out.append((fn,wt,b[i:i+4])); i+=4
        elif wt==1: out.append((fn,wt,b[i:i+8])); i+=8
        else: raise ValueError(wt)
    return out

def get_sheet(tab):
    d=opendoc(tab)
    s=d['clientVars']['collab_client_vars']['initialAttributedText']['text'][0]['related_sheet']
    b=zlib.decompress(base64.b64decode(s))
    inner=fields(b)[0][2]
    for fn,wt,v in fields(inner):
        if wt==2 and fn==5 and len(v)>100000:
            for f2,w2,v2 in fields(v):
                if w2==2 and f2==19:
                    return b, fields(v2), d
    raise SystemExit('no data')

def build(tab):
    raw,D,d=get_sheet(tab)
    pool=[v for f,w,v in D if w==2 and f==5][0]
    rows_msg=[v for f,w,v in D if w==2 and f==4][0]
    # pool entries: each entry field1 -> text
    strings=[]
    for f,w,v in fields(pool):
        s=''
        if w==2:
            for a,b_,c in fields(v):
                if b_==2: s+=c.decode('utf-8','replace')
        strings.append(s)
    cells={}
    maxr=maxc=0
    for f,w,v in fields(rows_msg):
        if w!=2: continue
        r=cl=idx=None
        for a,b_,c in fields(v):
            if a==1 and b_==0: r=c
            if a==3 and b_==0: cl=c
            if a==9 and b_==2:
                idx=None
                for x,y,z in fields(c):
                    if y==0: idx=z
        if r is None or cl is None: continue
        txt = strings[idx-1] if idx and 0<idx<=len(strings) else ''
        cells[(r,cl)]=txt
        maxr=max(maxr,r); maxc=max(maxc,cl)
    return cells,maxr,maxc,strings,d

if __name__=='__main__':
    tab=sys.argv[1]
    cells,maxr,maxc,strings,d=build(tab)
    print(f'# tab={tab} rows={maxr} cols={maxc} pool={len(strings)}')
    for r in range(1,maxr+1):
        vals=[cells.get((r,c),'') for c in range(1,maxc+1)]
        if any(v.strip() for v in vals):
            out=[]
            for v in vals:
                v=v.replace('\n',' ⏎ ')
                out.append(v if len(v)<=90 else v[:87]+f'…[{len(v)}]')
            print(r,'|',' | '.join(out))
