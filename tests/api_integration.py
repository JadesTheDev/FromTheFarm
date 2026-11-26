"""Run against a disposable imported FromTheFarm database, never production."""
import json, urllib.request, urllib.error, http.cookiejar, os
url=os.environ.get('FTF_TEST_URL','http://127.0.0.1:8123/api.php')
def client():return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def request(c,body=None):
 r=urllib.request.Request(url,data=None if body is None else json.dumps(body).encode(),headers={} if body is None else {'Content-Type':'application/json'})
 try:
  with c.open(r) as x:return x.status,json.load(x)
 except urllib.error.HTTPError as x:return x.code,json.load(x)
a,b=client(),client()
status,state=request(a);assert status==200,state
assert len(state['products'])==5
csrf=state['csrfToken']
def post(action,productId=1,quantity=1,**extra):return request(a,dict(action=action,productId=productId,quantity=quantity,csrfToken=csrf,**extra))
assert post('add',quantity=2)[1]['quantities']['1']==2
assert post('add',productId=3)[1]['totals']=={'subtotal':1698,'tax':85,'shipping':170,'total':1953}
assert request(b)[1]['quantities']=={},'cart leaked between sessions'
assert request(a)[1]['quantities']['1']==2,'cart did not persist'
assert post('update',quantity=3)[1]['quantities']['1']==3
for value in [-1,1.5,'1 OR 1=1',1000,31]:assert post('update',quantity=value)[0]==400,value
assert post('add',productId=999)[0]==400
assert request(a,{'action':'checkout','csrfToken':'wrong'})[0]==403
assert post('remove',productId=3)[1]['quantities']=={'1':3}
assert post('update',quantity=0)[1]['quantities']=={}
assert post('add')[0]==200
assert post('checkout')[1]['totals']['total']==0
assert request(a)[1]['quantities']=={}
print('PASS: database catalog; create/read/update/delete; totals; persistence; session isolation; invalid quantities; CSRF; checkout')
