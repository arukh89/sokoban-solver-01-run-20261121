import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const D=[[0,-1,'u','U'],[0,1,'d','D'],[-1,0,'l','L'],[1,0,'r','R']];
function P(t){
const r=t.split('\n').filter(x=>x.length),h=r.length,w=Math.max(...r.map(x=>x.length)),a=new Uint8Array(w*h).fill(1),g=[],b=[];
let p=0;
r.forEach((row,y)=>{for(let x=0;x<row.length;x++){const i=y*w+x,c=row[x];if(c==='#')continue;a[i]=0;if('.*+'.includes(c))g.push(i);if('$*'.includes(c))b.push(i);if('@+'.includes(c))p=i;}});
return{w,h,a,g,b:b.sort((x,y)=>x-y),p};
}
function V(l){
const v=new Uint8Array(l.a.length),q=[...l.g];
for(const g of l.g)v[g]=1;
for(let i=0;i<q.length;i++){const x=q[i];for(const[dx,dy]of D){const d=dy*l.w+dx,y=x-d;if(!l.a[y]&&!l.a[y-d]&&!v[y]){v[y]=1;q.push(y);}}}
return v;
}
function R(l,o,f,s,t,k){
let m=f,n=0;k[n++]=f;s[f]=t;
while(n>0){const p=k[--n];if(p<m)m=p;for(const[dx,dy]of D){const q=p+dy*l.w+dx;if(!l.a[q]&&!o[q]&&s[q]!==t){s[q]=t;k[n++]=q;}}}
return m;
}
function F(l,o,g,t){
for(const a of[t,t-1,t-l.w,t-l.w-1]){const b=a+1,c=a+l.w,d=c+1;
if((l.a[a]||o[a])&&(l.a[b]||o[b])&&(l.a[c]||o[c])&&(l.a[d]||o[d])&&((o[a]&&!g[a])||(o[b]&&!g[b])||(o[c]&&!g[c])||(o[d]&&!g[d])))return true;}
return false;
}
function S(l){
const{w,a,g}=l,n=a.length,go=new Uint8Array(n),v=V(l),o=new Uint8Array(n);
for(const x of g)go[x]=1;
if(l.b.some(b=>!v[b]))return null;
const e=new Int32Array(n),k2=new Int32Array(n),s2=new Int32Array(n);
let t=0;
const K=(b,z)=>{let q=z;for(const x of b)q=q*n+x;return q;};
const ok=b=>b.every(x=>go[x]);
const B=[l.b],Y=[l.p],A=[-1],X=new Map();
for(const b of l.b)o[b]=1;
X.set(K(l.b,R(l,o,l.p,e,++t,s2),n),0);
for(const b of l.b)o[b]=0;
let f=ok(l.b)?0:-1;
for(let h=0;f<0&&h<B.length;h++){
const bs=B[h];
for(const b of bs)o[b]=1;
R(l,o,Y[h],e,++t,s2);
const z=t;
for(let i=0;i<bs.length&&f<0;i++){const b=bs[i];
for(const[dx,dy]of D){const d=dy*w+dx,u=b+d;
if(e[b-d]!==z||a[u]||o[u]||!v[u])continue;
o[b]=0;o[u]=1;
const fr=F(l,o,go,u);
let c=-1,nx=null;
if(!fr){nx=bs.slice();nx[i]=u;nx.sort((x,y)=>x-y);c=K(nx,R(l,o,b,k2,++t,s2),n);}
o[u]=0;o[b]=1;
if(fr||X.has(c))continue;
if(B.length>=250000){for(const x of bs)o[x]=0;return null;}
X.set(c,B.length);B.push(nx);Y.push(b);A.push(h);
if(ok(nx)){f=B.length-1;break;}
}}
for(const x of bs)o[x]=0;
}
if(f<0)return null;
const q=[];for(let s=f;s>0;s=A[s])q.push(s);q.reverse();
let mv='',pl=l.p,bx=l.b;
for(const s of q){
const nb=B[s],from=bx.find(b=>!nb.includes(b)),to=nb.find(b=>!bx.includes(b)),d=to-from;
for(const b of bx)o[b]=1;
mv+=W(l,o,pl,from-d);
for(const b of bx)o[b]=0;
mv+=d===-w?'U':d===w?'D':d===-1?'L':'R';pl=from;bx=nb;
}
return mv;
}
function W(l,o,f,t){
if(f===t)return'';
const v=new Int32Array(l.a.length).fill(-1),h=new Array(l.a.length),q=[f];
v[f]=f;
for(let i=0;i<q.length;i++){const p=q[i];if(p===t)break;
for(const[dx,dy,le]of D){const n=p+dy*l.w+dx;
if(l.a[n]||o[n]||v[n]!==-1)continue;
v[n]=p;h[n]=le;q.push(n);}}
if(v[t]===-1)return'';
let s='';for(let p=t;p!==f;p=v[p])s=h[p]+s;
return s;
}
function G(l){
const v=V(l),r=Math.floor(l.p/l.w),c=new Uint8Array(l.a.length);
for(let i=r*l.w;i<(r+1)*l.w;i++)if(!l.a[i]&&!v[i])c[i]=1;
if(l.b.some(b=>c[b]))return null;
const z=new Int32Array(l.a.length).fill(-1),rs=[];
for(let s=0;s<l.a.length;s++){
if(l.a[s]||c[s]||z[s]>=0)continue;
const sq=[s];z[s]=rs.length;
for(let i=0;i<sq.length;i++)for(const[dx,dy]of D){const q=sq[i]+dy*l.w+dx;if(!l.a[q]&&!c[q]&&z[q]<0){z[q]=rs.length;sq.push(q);}}
rs.push({b:[],g:[],d:false});
}
for(const b of l.b)rs[z[b]].b.push(b);
for(const g of l.g)if(z[g]>=0)rs[z[g]].g.push(g);
if(l.g.some(g=>z[g]<0)||rs.some(r=>r.b.length!==r.g.length))return null;
return rs.filter(r=>r.b.length>0);
}
function E(w,f,m){let p=f;for(const c of m.toLowerCase())p+=c==='u'?-w:c==='d'?w:c==='l'?-1:1;return p;}
function T(l){
const rs=G(l);
if(rs===null)return S(l);
let pl=l.p,mv='';
for(const r of rs){
const a=l.a.slice();
for(const o of rs)if(o!==r)for(const b of o.d?o.g:o.b)a[b]=1;
const s=S({w:l.w,h:l.h,a,g:r.g,b:r.b,p:pl});
if(s===null)return null;
mv+=s;pl=E(l.w,pl,s);r.d=true;
}
return mv;
}
for(const id of readdirSync(I).sort()){
const s=T(P(readFileSync(I+'/'+id+'/level.txt','utf8')));
mkdirSync(O+'/'+id,{recursive:true});
writeFileSync(O+'/'+id+'/solution.txt',(s||'')+'\n');
}
