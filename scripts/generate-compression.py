"""Generate a small original test image and its actual SVD for the local demonstration."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
size=64
im=Image.new('L',(size,size),24)
d=ImageDraw.Draw(im)
# Original geometric library facade with sloping roof, windows, and diagonal detail.
d.polygon([(7,31),(32,6),(57,31)],fill=210)
d.rectangle((10,30,54,55),fill=170)
for x in (15,25,35,45):
 d.rectangle((x,34,x+4,48),fill=35)
d.ellipse((27,18,37,28),fill=50)
d.rectangle((28,43,36,55),fill=25)
d.line((4,58,60,58),fill=240,width=2)
d.line((7,61,57,61),fill=150,width=1)
a=np.asarray(im,dtype=float)/255
u,s,vt=np.linalg.svd(a,full_matrices=False)
assert np.linalg.norm((u*s)@vt-a)<1e-10
for k in (0,1,5,10,20,64):
 e=a-(u[:,:k]*s[:k])@vt[:k]
 assert abs(np.linalg.norm(e,'fro')-np.linalg.norm(s[k:]))<1e-10
out={'size':size,'pixels':a.tolist(),'singularValues':s.tolist(),'u':u.tolist(),'vt':vt.tolist()}
Path(__file__).resolve().parents[1].joinpath('content/compression-data.json').write_text(json.dumps(out,separators=(',',':')))
print('Generated and verified 64×64 image SVD, with tail errors checked at six ranks.')
