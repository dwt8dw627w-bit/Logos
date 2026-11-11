/* Logos: отмена записи — реальный элемент сминается в комок и летит в урну.
   Подключается ПОСЛЕ основного скрипта: window.__lgCrumple(r,circle,cv,html) вызывается из cancelAnim.
   Возвращает false, если WebGL недоступен (тогда сработает прежняя анимация). */
(function(){
'use strict';
var DPR=Math.min(window.devicePixelRatio||1,2);

/* ---------- 1. исправления позиционирования и блюра ---------- */
try{
var st=document.createElement('style');
st.textContent=
'.hcirc{width:min(78vw,320px)!important;height:min(78vw,320px)!important;right:16px;left:auto;top:auto;'+
'bottom:calc(env(safe-area-inset-bottom,0px) + 82px);transform-origin:50% 50%;contain:layout style;'+
'-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important}'+
'.hcirc .hcv{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;'+
'-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'+
'.hcirc .hcv video{width:100%!important;height:100%!important;display:block}'+
'.hcirc .cring{inset:-4px!important;width:calc(100% + 8px)!important;height:calc(100% + 8px)!important}'+
'.hcirc.toss{transition:none!important;transform:none!important;opacity:1!important}'+
'.recb,.p3lk,.p3lc{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important}'+
'.lgc-cv,.lgb{position:fixed;pointer-events:none;contain:strict}'+
'.lgc-cv{left:0;top:0;z-index:9997}'+
'.lgb{z-index:9996;width:76px;height:89px;contain:layout style;will-change:transform,opacity}'+
'.lgb svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}'+
'.lgb .lgf{z-index:9998}';
document.head.appendChild(st);
}catch(e){}

/* ---------- утилиты ---------- */
function clamp(x,a,b){return x<a?a:x>b?b:x}
function sstep(x){x=clamp(x,0,1);return x*x*(3-2*x)}
function lerp(a,b,t){return a+(b-a)*t}
function easeOutBack(x){x=clamp(x,0,1);var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}
function easeIO(x){x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function hash3(x,y,z){var h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h)}
function vnoise(x,y,z){
 var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=sstep(x-xi),yf=sstep(y-yi),zf=sstep(z-zi);
 function h(a,b,c){return hash3(xi+a,yi+b,zi+c)}
 var x00=lerp(h(0,0,0),h(1,0,0),xf),x10=lerp(h(0,1,0),h(1,1,0),xf),x01=lerp(h(0,0,1),h(1,0,1),xf),x11=lerp(h(0,1,1),h(1,1,1),xf);
 return lerp(lerp(x00,x10,yf),lerp(x01,x11,yf),zf)*2-1;
}
var probe=null,pc=null,px=null;
function rgbOf(css,fallback){
 try{
  if(!probe){probe=document.createElement('i');probe.style.cssText='position:fixed;left:-9px;top:-9px;width:1px;height:1px;pointer-events:none';
   pc=document.createElement('canvas');pc.width=pc.height=1;px=pc.getContext('2d',{willReadFrequently:true})}
  document.body.appendChild(probe);probe.style.color=css;
  var v=getComputedStyle(probe).color;probe.remove();
  px.clearRect(0,0,1,1);px.fillStyle='#000';px.fillStyle=v;px.fillRect(0,0,1,1);
  var d=px.getImageData(0,0,1,1).data;return [d[0],d[1],d[2]];
 }catch(e){return fallback||[124,92,230]}
}
function mixc(a,b,t){return [Math.round(lerp(a[0],b[0],t)),Math.round(lerp(a[1],b[1],t)),Math.round(lerp(a[2],b[2],t))]}
function css(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+(a==null?1:a)+')'}
function lum(c){return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255}

/* ---------- 2. текстуры из РЕАЛЬНЫХ элементов ---------- */
function texVoice(r,html,ac){
 var W=Math.max(8,Math.round(r.width*DPR)),H=Math.max(8,Math.round(r.height*DPR));
 var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
 /* клон реальной разметки .recb — меряем фактические бары, точку и таймер */
 var host=document.createElement('div');host.className='recb on';
 host.style.cssText='position:fixed;left:-9999px;top:0;width:'+r.width+'px;height:'+r.height+'px;transition:none!important;opacity:1;transform:none;inset:auto';
 host.style.left='-9999px';host.style.top='0';host.innerHTML=html;document.body.appendChild(host);
 var hb=host.getBoundingClientRect(),bars=[],dot=null,tm='';
 try{
  host.querySelectorAll('.rwv i').forEach(function(i){var b=i.getBoundingClientRect(),cs=getComputedStyle(i);
   bars.push({x:b.left-hb.left,y:b.top-hb.top,w:b.width,h:b.height,c:cs.backgroundColor})});
  var d=host.querySelector('.rdot');if(d){var b=d.getBoundingClientRect();dot={x:b.left-hb.left,y:b.top-hb.top,w:b.width,h:b.height,c:getComputedStyle(d).backgroundColor}}
  var t=host.querySelector('.rtm');if(t){tm=t.textContent||'';var tb=t.getBoundingClientRect(),tcs=getComputedStyle(t);
   dot=dot||{};dot.tx=tb.left-hb.left;dot.ty=tb.top-hb.top+tb.height/2;dot.tf=tcs.fontWeight+' '+(parseFloat(tcs.fontSize)*DPR)+'px '+tcs.fontFamily}
 }catch(e){}
 host.remove();
 var light=lum(ac)>.62,fg=light?[20,20,28]:[255,255,255];
 var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,css(mixc(ac,[255,255,255],.16)));g.addColorStop(.55,css(ac));g.addColorStop(1,css(mixc(ac,[0,0,0],.45)));
 x.fillStyle=g;x.beginPath();
 if(x.roundRect)x.roundRect(0,0,W,H,H*.5);else{var rr=H/2;x.moveTo(rr,0);x.arcTo(W,0,W,H,rr);x.arcTo(W,H,0,H,rr);x.arcTo(0,H,0,0,rr);x.arcTo(0,0,W,0,rr)}
 x.fill();
 x.lineWidth=2*DPR;x.strokeStyle=css(mixc(ac,[255,255,255],.5),.55);x.stroke();
 x.fillStyle=css(fg,.92);
 bars.forEach(function(b){var bw=Math.max(2*DPR,b.w*DPR),bh=Math.max(3*DPR,b.h*DPR),bx=b.x*DPR,by=(b.y*DPR)+(b.h*DPR-bh)/2;
  x.beginPath();if(x.roundRect)x.roundRect(bx,by,bw,bh,bw/2);else x.rect(bx,by,bw,bh);x.fill()});
 if(dot&&dot.w){x.fillStyle=css(mixc(fg,ac,.15),.95);x.beginPath();x.arc((dot.x+dot.w/2)*DPR,(dot.y+dot.h/2)*DPR,dot.w*DPR/2,0,6.283);x.fill()}
 if(dot&&dot.tf&&tm){x.font=dot.tf;x.textBaseline='middle';x.fillStyle=css(fg,.95);x.fillText(tm,dot.tx*DPR,dot.ty*DPR)}
 return c;
}
function texCircle(r,cv,ac){
 var S=Math.max(16,Math.round(Math.min(r.width,r.height)*DPR));
 var c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d');
 var ring=Math.round(S*.035),R=S/2;
 /* реальный кадр камеры */
 x.save();x.beginPath();x.arc(R,R,R-ring,0,6.283);x.clip();
 try{if(cv)x.drawImage(cv,0,0,cv.width,cv.height,ring,ring,S-ring*2,S-ring*2);else{x.fillStyle='#111';x.fillRect(0,0,S,S)}}catch(e){x.fillStyle='#111';x.fillRect(0,0,S,S)}
 x.restore();
 /* оболочка / градиент кольца */
 var g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,css(mixc(ac,[255,255,255],.45)));g.addColorStop(.5,css(ac));g.addColorStop(1,css(mixc(ac,[0,0,0],.4)));
 x.lineWidth=ring*1.6;x.strokeStyle=g;x.beginPath();x.arc(R,R,R-ring*.8,0,6.283);x.stroke();
 var v=x.createRadialGradient(R,R,R*.55,R,R,R-ring);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,css(mixc(ac,[0,0,0],.5),.35));
 x.fillStyle=v;x.beginPath();x.arc(R,R,R-ring,0,6.283);x.fill();
 return c;
}

/* ---------- 3. WebGL-меш: сминание ---------- */
var VS='attribute vec3 p;attribute vec2 uv;attribute vec2 sh;uniform vec2 res;varying vec2 vuv;varying vec2 vsh;'+
'void main(){vuv=uv;vsh=sh;gl_Position=vec4(p.x/res.x*2.-1.,1.-p.y/res.y*2.,clamp(-p.z/2000.,-.99,.99),1.);}';
var FS='precision mediump float;uniform sampler2D tx;uniform vec3 tint;uniform vec3 dk;uniform vec3 hi;uniform float fade;varying vec2 vuv;varying vec2 vsh;'+
'void main(){vec4 t=texture2D(tx,vuv);float l=clamp(vsh.x,0.,1.);float s=vsh.y;'+
'vec3 mat=mix(dk,tint,l);vec3 lit=mix(t.rgb*(.5+.7*l),mat,fade);vec3 col=lit+hi*s*(.3+.7*fade);'+
'float a=mix(t.a,1.,fade);gl_FragColor=vec4(col*a,a);}';

function makeGL(w,h){
 var cv=document.createElement('canvas');cv.className='lgc-cv';cv.width=Math.round(w*DPR);cv.height=Math.round(h*DPR);
 cv.style.width=w+'px';cv.style.height=h+'px';
 var gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,depth:true,powerPreference:'low-power'});
 if(!gl)return null;
 function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw 1;return o}
 var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 2;
 gl.useProgram(pr);
 return {cv:cv,gl:gl,pr:pr};
}

function Mesh(W,H,circle){
 var cols=circle?22:(W/H>2?34:24),rows=circle?22:(W/H>2?10:20);
 this.cols=cols;this.rows=rows;this.W=W;this.H=H;
 var n=(cols+1)*(rows+1);this.n=n;
 this.p0=new Float32Array(n*2);this.tg=new Float32Array(n*3);this.wr=new Float32Array(n*3);this.stg=new Float32Array(n);this.uv=new Float32Array(n*2);
 var Rf=.37*Math.sqrt(W*H);this.Rf=Rf;var seed=Math.random()*50;
 for(var j=0;j<=rows;j++)for(var i=0;i<=cols;i++){
  var k=j*(cols+1)+i,u=i/cols,v=j/rows;
  this.uv[k*2]=u;this.uv[k*2+1]=v;
  this.p0[k*2]=(u-.5)*W;this.p0[k*2+1]=(v-.5)*H;
  var lon=(u-.5)*2*Math.PI*.92,lat=(v-.5)*Math.PI*.9;
  var dx=Math.cos(lat)*Math.sin(lon),dy=Math.sin(lat),dz=Math.cos(lat)*Math.cos(lon);
  var q=vnoise(dx*2.2+seed,dy*2.2,dz*2.2),q2=vnoise(dx*4.6,dy*4.6+seed,dz*4.6);
  q=(q>=0?1:-1)*Math.pow(Math.abs(q),.72);
  var rr=Rf*(1+.3*q+.12*q2);
  this.tg[k*3]=dx*rr;this.tg[k*3+1]=dy*rr;this.tg[k*3+2]=dz*rr;
  this.wr[k*3]=vnoise(u*5.5+seed,v*5.5,1.3);this.wr[k*3+1]=vnoise(u*7+3,v*7+seed,4.1);this.wr[k*3+2]=vnoise(u*3.1,v*3.1,seed);
  this.stg[k]=(vnoise(u*3+seed,v*3,9)+1)/2;
 }
 this.P=new Float32Array(n*3);
 this.buf=new Float32Array(cols*rows*6*7);
}
/* t — сминание 0..1; extra — доп. вращение комка в полёте; (cx,cy) — центр; sc — масштаб */
Mesh.prototype.pose=function(t,extra,cx,cy,sc){
 var W=this.W,H=this.H,m=Math.min(W,H),bell=Math.sin(Math.PI*clamp(t,0,1)),n=this.n,P=this.P;
 var ry=t*1.5+extra*1.3,rx=t*.9+extra*.8,rz=(t*.7)+extra*.5;
 var cyy=Math.cos(ry),syy=Math.sin(ry),cxx=Math.cos(rx),sxx=Math.sin(rx),czz=Math.cos(rz),szz=Math.sin(rz);
 for(var k=0;k<n;k++){
  var g=sstep(clamp(t*1.3-this.stg[k]*.3,0,1));
  var x=lerp(this.p0[k*2],this.tg[k*3],g),y=lerp(this.p0[k*2+1],this.tg[k*3+1],g),z=this.tg[k*3+2]*g;
  var wb=bell*(1-g*.35);
  z+=this.wr[k*3]*wb*m*.55;x+=this.wr[k*3+1]*wb*W*.06;y+=this.wr[k*3+2]*wb*H*.22;
  /* вращение */
  var x1=x*czz-y*szz,y1=x*szz+y*czz,z1=z;
  var y2=y1*cxx-z1*sxx,z2=y1*sxx+z1*cxx;
  var x3=x1*cyy+z2*syy,z3=-x1*syy+z2*cyy;
  var f=700,pp=f/(f-z3*sc);
  P[k*3]=cx+x3*sc*pp;P[k*3+1]=cy+y2*sc*pp;P[k*3+2]=z3*sc;
 }
};
var LX=-.38,LY=-.55,LZ=.74,LL=Math.sqrt(LX*LX+LY*LY+LZ*LZ);LX/=LL;LY/=LL;LZ/=LL;
var HXv=LX,HYv=LY,HZv=LZ+1,HL=Math.sqrt(HXv*HXv+HYv*HYv+HZv*HZv);HXv/=HL;HYv/=HL;HZv/=HL;
Mesh.prototype.fill=function(){
 var c=this.cols,r=this.rows,P=this.P,uv=this.uv,b=this.buf,o=0,self=this;
 function tri(a,bb,cc){
  var ax=P[a*3],ay=P[a*3+1],az=P[a*3+2],bx=P[bb*3]-ax,by=P[bb*3+1]-ay,bz=P[bb*3+2]-az,cx=P[cc*3]-ax,cy=P[cc*3+1]-ay,cz=P[cc*3+2]-az;
  var nx=by*cz-bz*cy,ny=bz*cx-bx*cz,nz=bx*cy-by*cx,nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;nx/=nl;ny/=nl;nz/=nl;
  if(nz<0){nx=-nx;ny=-ny;nz=-nz}
  var d=Math.max(0,nx*LX+ny*LY+nz*LZ),h=Math.max(0,nx*HXv+ny*HYv+nz*HZv);
  var l=.22+.78*d+.18*(1-nz),s=Math.pow(h,22);
  var ids=[a,bb,cc];
  for(var q=0;q<3;q++){var id=ids[q];b[o++]=P[id*3];b[o++]=P[id*3+1];b[o++]=P[id*3+2];b[o++]=uv[id*2];b[o++]=uv[id*2+1];b[o++]=l;b[o++]=s}
 }
 for(var j=0;j<r;j++)for(var i=0;i<c;i++){
  var a=j*(c+1)+i,bb=a+1,cc=a+c+1,dd=cc+1;
  if(((i+j)&1)===0){tri(a,bb,cc);tri(bb,dd,cc)}else{tri(a,bb,dd);tri(a,dd,cc)}
 }
 return b;
};

/* ---------- 4. урна: корпус статичен, двигается только крышка ---------- */
var NS='http://www.w3.org/2000/svg';
function bin(L,T){
 var el=document.createElement('div');el.className='lgb';el.style.left=L+'px';el.style.top=T+'px';
 var ribs='';[[32,37],[46,48.5],[60,60],[74,71.5],[88,83]].forEach(function(r){ribs+='<path d="M'+r[0]+' 70L'+r[1]+' 126" stroke="#fff" stroke-opacity=".07" stroke-width="6" stroke-linecap="round"/><path d="M'+(r[0]-1.5)+' 70L'+(r[1]-1.5)+' 126" stroke="#fff" stroke-opacity=".16" stroke-width="1.4" stroke-linecap="round"/>'});
 var defs='<defs><linearGradient id="lgbB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b2733"/><stop offset=".3" stop-color="#17141d"/><stop offset=".75" stop-color="#0b0a10"/><stop offset="1" stop-color="#1d1a25"/></linearGradient>'+
 '<radialGradient id="lgbI" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#6b32d6"/><stop offset=".6" stop-color="#2a0f58"/><stop offset="1" stop-color="#07030f"/></radialGradient>'+
 '<linearGradient id="lgbT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4456"/><stop offset=".5" stop-color="#1c1824"/><stop offset="1" stop-color="#0d0b13"/></linearGradient>'+
 '<linearGradient id="lgbU" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a3df0"/><stop offset=".6" stop-color="#34136e"/><stop offset="1" stop-color="#14062e"/></linearGradient></defs>';
 var back=document.createElementNS(NS,'svg');back.setAttribute('viewBox','0 0 120 140');
 back.innerHTML=defs+'<ellipse cx="60" cy="58" rx="42" ry="9.5" fill="url(#lgbI)"/><path d="M18 58Q60 40 102 58" fill="none" stroke="#b58cff" stroke-opacity=".45" stroke-width="2"/>'+
  '<g class="lidB" style="display:none"><path class="lp" fill="url(#lgbT)" stroke="#d7c2ff" stroke-opacity=".7" stroke-width="1.6" stroke-linejoin="round"/><line class="lh" stroke="#8a7fa0" stroke-width="3.2" stroke-linecap="round"/></g>';
 var front=document.createElementNS(NS,'svg');front.setAttribute('viewBox','0 0 120 140');front.setAttribute('class','lgf');
 front.innerHTML='<path d="M18 58Q60 76 102 58L92 126Q60 142 28 126Z" fill="url(#lgbB)" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/>'+ribs+
  '<path d="M18 58Q60 76 102 58" fill="none" stroke="#c9a8ff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/><path d="M18 58Q60 76 102 58" fill="none" stroke="#e6d6ff" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round"/>'+
  '<path d="M30 130Q60 143 90 130" fill="none" stroke="#9b6bff" stroke-opacity=".35" stroke-width="1.4"/>'+
  '<g class="lidF"><path class="lp" fill="url(#lgbT)" stroke="#d7c2ff" stroke-opacity=".7" stroke-width="1.6" stroke-linejoin="round"/><line class="lh" stroke="#8a7fa0" stroke-width="3.2" stroke-linecap="round"/></g>';
 el.appendChild(back);el.appendChild(front);
 var o={el:el,back:back,front:front,lB:back.querySelector('.lidB'),lF:front.querySelector('.lidF')};
 var R=45,s=Math.sin(12*Math.PI/180),c=Math.cos(12*Math.PI/180),hy=58-R*s*1.0;
 o.setLid=function(deg){
  var th=deg*Math.PI/180,ct=Math.cos(th),sn=Math.sin(th),pts=[];
  for(var a=0;a<48;a++){var al=a/48*6.2832,px=R*Math.cos(al),d=R+R*Math.sin(al);
   pts.push((60+px).toFixed(1)+' '+(hy+d*ct*s-d*sn*c).toFixed(1))}
  var dd='M'+pts.join('L')+'Z',back=deg>8,act=back?o.lB:o.lF,off=back?o.lF:o.lB;
  off.style.display='none';act.style.display='';
  var lp=act.querySelector('.lp');lp.setAttribute('d',dd);
  var topVis=th<12*Math.PI/180;lp.setAttribute('fill',topVis?'url(#lgbT)':'url(#lgbU)');
  var h=act.querySelector('.lh');
  if(topVis){var d0=R,hx0=60,hy0=hy+d0*ct*s-d0*sn*c-5*(Math.cos(th)*c+Math.sin(th)*s*0);h.setAttribute('x1',hx0-9);h.setAttribute('x2',hx0+9);h.setAttribute('y1',hy0-3);h.setAttribute('y2',hy0-3);h.style.display=''}else h.style.display='none';
 };
 o.setLid(0);
 return o;
}

/* ---------- 5. основная анимация ---------- */
var busy=null;
function run(r,circle,cvFrame,html){
 if(busy)busy.kill();
 var vw=window.innerWidth,vh=window.innerHeight,GLo;
 var ac=rgbOf('var(--ac)',[139,92,246]);
 var tex;
 try{tex=circle?texCircle(r,cvFrame,ac):texVoice(r,html||'',ac)}catch(e){return false}
 try{GLo=makeGL(vw,vh)}catch(e){GLo=null}
 if(!GLo)return false;
 var gl=GLo.gl,pr=GLo.pr,cv=GLo.cv;
 var k=76/120,bw=76,bh=140*k,by=clamp(r.top+r.height/2,70+bh*.4,vh-bh*.55-12);
 var L=Math.max(6,Math.min(18,vw*.04)),T=by-58*k;
 var B=bin(L,T);B.el.style.opacity='0';
 var W=r.width,H=r.height,M=new Mesh(W,H,circle);
 /* GL state */
 var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tex);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 var vb=gl.createBuffer(),A=function(n){return gl.getAttribLocation(pr,n)},U=function(n){return gl.getUniformLocation(pr,n)};
 var aP=A('p'),aUV=A('uv'),aSH=A('sh');
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
 gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U('res'),vw,vh);
 var tint=mixc(ac,[255,255,255],.08),dk=mixc(ac,[0,0,0],.72),hi=mixc(ac,[255,255,255],.78);
 gl.uniform3f(U('tint'),tint[0]/255,tint[1]/255,tint[2]/255);gl.uniform3f(U('dk'),dk[0]/255,dk[1]/255,dk[2]/255);gl.uniform3f(U('hi'),hi[0]/255,hi[1]/255,hi[2]/255);
 var uFade=U('fade');
 /* вставка: урна (back) → canvas → урна (front) */
 document.body.appendChild(B.el);
 B.el.insertBefore(B.back,B.front);
 /* canvas между слоями: переносим слои урны на уровень body */
 var back=B.el;back.style.zIndex=9996;
 var frontBox=document.createElement('div');frontBox.className='lgb';frontBox.style.cssText='left:'+L+'px;top:'+T+'px;z-index:9998;will-change:transform,opacity';
 frontBox.appendChild(B.front);document.body.appendChild(frontBox);
 document.body.appendChild(cv);
 var Bs=[back,frontBox];function bset(f){Bs.forEach(f)}

 var D1=circle?820:720,DF=400,DD=190,tOpen=D1*.32,DO=380,tClose=D1+DF+DD+60,DC=300,tOut=tClose+DC+220,DOUT=240,TOTAL=tOut+DOUT;
 var x0=r.left+r.width/2,y0=r.top+r.height/2;
 var mx=L+60*k,my=T+20*k,inY=T+88*k,ctrlX=(x0+mx)/2,ctrlY=Math.max(24,Math.min(y0,my)-90);
 var ballSc0=1,ballSc1=Math.min(.36,(42*k)/(2*M.Rf));
 var t0=performance.now(),raf=0,dead=false;
 function ball(ms){ /* → [t, extra, cx, cy, sc, visible] */
  if(ms<D1){var q=ms/D1,e=easeIO(q);return [e,0,lerp(x0,x0+(mx-x0)*.12,e),lerp(y0,y0-(circle?8:0),Math.sin(q*Math.PI)),lerp(1,.92,e)]}
  var f=ms-D1;
  if(f<DF){var u=f/DF,e2=u*u*(3-2*u),a=1-e2,cx=a*a*x0+2*a*e2*ctrlX+e2*e2*mx,cy=a*a*y0+2*a*e2*ctrlY+e2*e2*my;
   return [1,e2*2.6,cx,cy,lerp(.92,ballSc1*1.1,e2)]}
  var d=f-DF,u2=clamp(d/DD,0,1),e3=u2*u2;
  return [1,2.6+u2*.6,mx,lerp(my,inY,e3),lerp(ballSc1*1.1,ballSc1*.85,u2)];
 }
 function lidAngle(ms){
  if(ms<tOpen)return 0;
  if(ms<tClose){return 108*easeOutBack((ms-tOpen)/DO)}
  var q=(ms-tClose)/DC;
  if(q<1)return 108*(1-easeIO(q));
  var s=ms-tClose-DC;return Math.max(0,5*Math.exp(-s/70)*Math.sin(s/22)) ; /* дрожь при закрытии */
 }
 function frame(now){
  if(dead)return;
  var ms=now-t0;if(ms>=TOTAL){kill();return}
  /* урна */
  var inA=sstep(ms/260),outA=1-sstep((ms-tOut)/DOUT),op=Math.min(inA,outA),
      sx=lerp(-60,0,easeOutBack(clamp(ms/320,0,1)))+lerp(0,-70,sstep((ms-tOut)/DOUT)),
      hop=ms>tClose+DC*.9&&ms<tOut?-3*Math.sin(clamp((ms-tClose-DC*.9)/160,0,1)*Math.PI):0;
  bset(function(e){e.style.opacity=op;e.style.transform='translate('+sx+'px,'+hop+'px)'});
  B.setLid(lidAngle(ms));
  /* комок */
  var b=ball(ms);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  if(ms<tClose+DC*.1||true){
   M.pose(b[0],b[1],b[2],b[3],b[4]);var data=M.fill();
   gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
   gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,28,0);
   gl.enableVertexAttribArray(aUV);gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,28,12);
   gl.enableVertexAttribArray(aSH);gl.vertexAttribPointer(aSH,2,gl.FLOAT,false,28,20);
   gl.uniform1f(uFade,sstep((b[0]-.4)/.5));
   gl.drawArrays(gl.TRIANGLES,0,data.length/7);
  }
  raf=requestAnimationFrame(frame);
 }
 function kill(){
  if(dead)return;dead=true;cancelAnimationFrame(raf);
  try{gl.deleteTexture(tx);gl.deleteBuffer(vb);var ext=gl.getExtension('WEBGL_lose_context');ext&&ext.loseContext()}catch(e){}
  try{cv.remove();back.remove();frontBox.remove()}catch(e){}
  document.removeEventListener('visibilitychange',vis);
  if(busy&&busy.kill===kill)busy=null;
 }
 function vis(){if(document.hidden)kill()}
 document.addEventListener('visibilitychange',vis);
 busy={kill:kill};
 raf=requestAnimationFrame(function(n){t0=n;frame(n)});
 return true;
}
window.__lgCrumple=function(r,circle,cv,html){
 try{return run(r,circle,cv,html)}catch(e){try{busy&&busy.kill()}catch(x){}return false}
};
})();
