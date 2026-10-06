import json,base64,zlib,sys
sys.path.insert(0,'/tmp')
from qqgrid import opendoc, fields

def dumpsheet(tab):
    d=opendoc(tab)
    s=d['clientVars']['collab_client_vars']['initialAttributedText']['text'][0]['related_sheet']
    b=zlib.decompress(base64.b64decode(s))
    data=None
    for fn,wt,v in fields(fields(b)[0][2]):
        if wt==2 and fn==5 and len(v)>100000:
            for f2,w2,v2 in fields(v):
                if w2==2 and f2==19: data=v2
    return fields(data)

def build(tab):
    D=dumpsheet(tab)
    pool=[v for f,w,v in D if w==2 and f==5][0]
    strings=[''.join(c.decode('utf-8','replace') for a,b_,c in fields(e) if b_==2) for f,w,e in fields(pool)]
    cellmsg=[v for f,w,v in D if w==2 and f==4][0]
    grid={}; maxr=maxc=0
    for fn,wt,payload in fields(cellmsg):
        if not (fn==1 and wt==2): continue
        r=c=idx=None
        for a,b_,v in fields(payload):
            if a==1 and b_==2:
                for x,y,z in fields(v):
                    if x==1 and y==0: r=z
                    if x==3 and y==0: c=z
            elif a==9 and b_==2:
                for x,y,z in fields(v):
                    if y==0: idx=z
        if r is None or c is None: continue
        grid[(r,c)]=strings[idx-1] if idx and 0<idx<=len(strings) else ''
        maxr=max(maxr,r); maxc=max(maxc,c)
    return grid,maxr,maxc,strings

if __name__=='__main__':
    grid,maxr,maxc,strings=build(sys.argv[1])
    print(f'# rows={maxr} cols={maxc} pool={len(strings)} cells={len(grid)}')
    for r in range(1,maxr+1):
        vals=[grid.get((r,c),'') for c in range(1,maxc+1)]
        if any(v.strip() for v in vals):
            out=[(v.replace('\n',' ⏎ ')[:100]+('…' if len(v)>100 else '')) for v in vals]
            print(f'{r} | '+' | '.join(out))
