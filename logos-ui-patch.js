/* Logos UI v5 — glass, unified rec button (reliable), auto-update */
(function(){
if(window.__lgUiPatch)return;window.__lgUiPatch=1;

/* ---------- CSS ---------- */
try{
var css=document.createElement('style');
css.id='lg-ui-v5';
css.textContent=`
:root{
  --lg-fill:rgba(255,255,255,.09);
  --lg-fill2:rgba(255,255,255,.13);
  --lg-stroke:rgba(255,255,255,.20);
  --lg-soft:rgba(255,255,255,.12);
  --lg-inset:inset 0 1px 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(0,0,0,.12);
  --lg-shadow:0 10px 36px rgba(0,0,0,.28);
  --ease:cubic-bezier(.22,1,.36,1);
}
html::before{display:none!important;content:none!important}
html:root :is(.lgx,#tb .tbp.lgx)::after,html:root .lgx-btn::after,
#tb::before,#tb::after,#tb .tbp::before,#tb .tbp::after,.tbp::before,.tbp::after{
  display:none!important;content:none!important;background:none!important;width:0!important;height:0!important
}
#tb,#tb .tbp,.tbp.lgx,#tb .tbp.lgx{
  background:var(--lg-fill)!important;
  -webkit-backdrop-filter:saturate(170%) blur(26px)!important;
  backdrop-filter:saturate(170%) blur(26px)!important;
  border:1px solid var(--lg-stroke)!important;
  box-shadow:var(--lg-shadow),var(--lg-inset)!important;
  border-radius:28px!important;overflow:hidden!important;clip-path:none!important;
}
#tb .tbp button{background:transparent!important;box-shadow:none!important;border-radius:20px!important}
#main .top,.top{
  background:var(--lg-fill)!important;
  -webkit-backdrop-filter:saturate(170%) blur(22px)!important;
  backdrop-filter:saturate(170%) blur(22px)!important;
  border-bottom:1px solid var(--lg-soft)!important;
}
#sh .shc,.shc,.dlg,.dlg>div{
  background:var(--lg-fill2)!important;
  -webkit-backdrop-filter:saturate(180%) blur(32px)!important;
  backdrop-filter:saturate(180%) blur(32px)!important;
  border:1px solid var(--lg-stroke)!important;border-radius:22px!important;
  box-shadow:var(--lg-shadow),var(--lg-inset)!important;
}
#main .cin,.cin,.cbar{
  background:var(--lg-fill)!important;
  -webkit-backdrop-filter:saturate(160%) blur(20px)!important;
  backdrop-filter:saturate(160%) blur(20px)!important;
  border-top:1px solid var(--lg-soft)!important;
  padding-bottom:max(6px,env(safe-area-inset-bottom,0px))!important;
}
.btn,button.btn{
  background:rgba(255,255,255,.14)!important;border:1px solid var(--lg-stroke)!important;
  border-radius:16px!important;box-shadow:var(--lg-inset)!important;
}
/* hide old separate buttons only when unified exists */
.cact.has-recmode .ib.cam,
.cact.has-recmode .ib.mic,
.cact.has-recmode [data-hold="circle"],
.cact.has-recmode [data-hold="voice"]{display:none!important}
.cact .ib.recmode{
  width:48px;height:48px;min-width:48px;border-radius:50%;
  display:grid!important;place-items:center;flex:none;
  background:rgba(255,255,255,.12)!important;
  border:1px solid var(--lg-soft)!important;
  color:inherit;padding:0;margin:0;
  transition:transform .18s var(--ease),background .18s;
}
.cact .ib.recmode.on-circle{
  background:rgba(255,255,255,.2)!important;
  box-shadow:0 0 0 2px rgba(255,255,255,.28)!important;
}
.cact .ib.recmode:active{transform:scale(.92)}
.cact{display:flex;align-items:center;gap:6px}
.hcirc .hcv,.hcirc .hcv video{
  width:min(78vw,320px)!important;height:min(78vw,320px)!important;
  border-radius:50%!important;object-fit:cover!important;
}
.hcirc .cring{width:min(84vw,340px)!important;height:min(84vw,340px)!important}
.hcirc .hctl{
  position:absolute;left:0;right:0;bottom:max(24px,env(safe-area-inset-bottom));
  display:flex;justify-content:center;gap:16px;z-index:6;pointer-events:auto;
}
.hcirc .hctl button{
  width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.22);
  background:rgba(0,0,0,.4);color:#fff;display:grid;place-items:center;
}
.hcirc,.recb{transition:transform .28s var(--ease),opacity .28s var(--ease),filter .28s!important}
.hcirc.lock .hh,.recb.lock .rhint{color:#a7f3d0!important}
.hcirc.toss{
  transition:transform .42s var(--ease),opacity .42s!important;
  transform:translate(-40vw,16vh) scale(.15)!important;opacity:0!important;
}
.rec-trash-fly{
  position:fixed;z-index:9999;pointer-events:none;width:56px;height:56px;border-radius:50%;
  left:14vw;bottom:24vh;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);
  display:grid;place-items:center;color:#fff;font-size:22px;
  animation:lgTrash .5s var(--ease) forwards;
}
@keyframes lgTrash{0%{transform:scale(1);opacity:1}100%{transform:translateY(110px) scale(.35);opacity:0}}
`;
document.head.appendChild(css);
}catch(e){}

/* scrub leak */
try{
  function scrub(){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),k=[];
    while(w.nextNode()){
      var v=(w.currentNode.nodeValue||'').trim();
      if(v.length>40&&/parseFromString|Yt===|let i=P\?|DOMParser/.test(v)) k.push(w.currentNode);
    }
    k.forEach(function(n){try{n.parentNode.removeChild(n)}catch(e){}});
  }
  scrub();setTimeout(scrub,500);
}catch(e){}

/* ---------- unified record button ---------- */
window.__recMode=window.__recMode||'voice';

function modeIcon(){
  try{
    if(window.__recMode==='circle') return (typeof ic==='function'?ic('circle'):'◯');
    return (typeof ic==='function'?ic('mic'):'🎤');
  }catch(e){return '●'}
}

function wireRecBtn(btn){
  if(btn.__wired) return;
  btn.__wired=1;
  var t0=0,moved=0,holding=0,timer=0;
  btn.addEventListener('pointerdown',function(e){
    if(e.button) return;
    moved=0;holding=0;t0=Date.now();
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(moved) return;
      holding=1;
      var kind=window.__recMode==='circle'?'circle':'voice';
      btn.dataset.hold=kind;
      try{ if(typeof holdStart==='function') holdStart(kind,btn,e); }catch(err){}
    },180);
  },{passive:true});
  btn.addEventListener('pointermove',function(e){
    if(Math.abs(e.movementX)+Math.abs(e.movementY)>5) moved=1;
  },{passive:true});
  function endTap(){
    clearTimeout(timer);
    if(!holding && Date.now()-t0<180 && !moved){
      window.__recMode=window.__recMode==='circle'?'voice':'circle';
      btn.dataset.hold=window.__recMode;
      btn.classList.toggle('on-circle',window.__recMode==='circle');
      btn.innerHTML=modeIcon();
      try{toast(window.__recMode==='circle'?'Кружок':'Голосовое')}catch(x){}
      try{typeof vib==='function'&&vib(8)}catch(x){}
    }
    holding=0;
  }
  btn.addEventListener('pointerup',endTap,{passive:true});
  btn.addEventListener('pointercancel',function(){clearTimeout(timer);holding=0},{passive:true});
}

function ensureRecBtn(){
  try{
    var acts=document.querySelectorAll('.cact');
    if(!acts.length) return false;
    var ok=false;
    acts.forEach(function(act){
      var btn=act.querySelector('.ib.recmode');
      if(!btn){
        btn=document.createElement('button');
        btn.type='button';
        btn.className='ib recmode';
        btn.setAttribute('aria-label','Запись');
        var snd=act.querySelector('.ib.snd');
        if(snd) act.insertBefore(btn,snd);
        else act.appendChild(btn);
      }
      act.classList.add('has-recmode');
      btn.dataset.hold=window.__recMode;
      btn.classList.toggle('on-circle',window.__recMode==='circle');
      btn.innerHTML=modeIcon();
      btn.style.display='grid';
      wireRecBtn(btn);
      ok=true;
    });
    return ok;
  }catch(e){return false}
}

/* retry until composer exists, then light interval while in chat */
var tries=0;
function bootRec(){
  if(ensureRecBtn()) return;
  if(++tries<40) setTimeout(bootRec,250);
}
bootRec();
setInterval(function(){
  try{
    if(document.querySelector('.cact') && !document.querySelector('.cact .ib.recmode'))
      ensureRecBtn();
  }catch(e){}
},2000);

try{
  if(typeof window.drawMain==='function' && !window.drawMain.__lg5){
    var _dm=window.drawMain;
    window.drawMain=function(){
      var r=_dm.apply(this,arguments);
      setTimeout(ensureRecBtn,0);
      setTimeout(ensureRecBtn,80);
      return r;
    };
    window.drawMain.__lg5=1;
  }
}catch(e){}

/* openChat hook */
try{
  if(typeof window.openChat==='function' && !window.openChat.__lg5){
    var _oc=window.openChat;
    window.openChat=function(){
      var r=_oc.apply(this,arguments);
      setTimeout(ensureRecBtn,50);
      setTimeout(ensureRecBtn,200);
      return r;
    };
    window.openChat.__lg5=1;
  }
}catch(e){}

/* ---------- gestures ---------- */
try{
  var _holdUI=window.holdUI;
  window.holdUI=function(h){
    if(typeof _holdUI==='function') try{_holdUI(h)}catch(e){}
    try{
      if(!h) return;
      if(h.kind==='voice'){
        var t=document.getElementById('rhint');
        if(t) t.textContent='↑ фиксация  ·  ← отмена';
      } else {
        var o=document.querySelector('.hcirc');
        if(o){
          var hh=o.querySelector('.hh');
          if(hh) hh.textContent='↑ фиксация  ·  ← отмена';
          if(!o.querySelector('.hctl')){
            var ctl=document.createElement('div');
            ctl.className='hctl';
            ctl.innerHTML='<button type="button" data-a="flip">'+(typeof ic==='function'?ic('flip'):'⟳')+'</button>'+
              '<button type="button" data-a="flash">'+(typeof ic==='function'?ic('sparkle'):'⚡')+'</button>';
            o.appendChild(ctl);
            ctl.addEventListener('pointerdown',function(e){e.stopPropagation()},{passive:true});
            ctl.addEventListener('click',function(e){
              var a=e.target.closest('button'); if(!a) return;
              if(a.dataset.a==='flip') try{flipCam()}catch(x){}
              if(a.dataset.a==='flash') try{toggleFlash(a)}catch(x){}
            });
          }
        }
      }
    }catch(e){}
  };
}catch(e){}

window.toggleFlash=async function(btn){
  try{
    if(!R||!R.st) return;
    var track=R.st.getVideoTracks()[0]; if(!track) return;
    var caps=track.getCapabilities&&track.getCapabilities();
    if(!caps||!caps.torch){try{toast('Вспышка недоступна')}catch(x){} return}
    R.torch=!R.torch;
    await track.applyConstraints({advanced:[{torch:!!R.torch}]});
    if(btn) btn.style.background=R.torch?'rgba(250,204,21,.35)':'rgba(0,0,0,.4)';
  }catch(e){try{toast('Вспышка недоступна')}catch(x){}}
};

var __gRaf=0,__gE=null;
function applyGesture(){
  __gRaf=0; var e=__gE; if(!e) return;
  try{
    if(typeof H==='undefined'||!H||e.pointerId!==H.id) return;
    if(H.x0==null){H.x0=e.clientX;H.y0=e.clientY}
    var dy=H.y0-e.clientY, dx=H.x0-e.clientX;
    if(dy>52&&!H.locked){
      H.locked=true;H.cx=false;
      try{
        var rb=document.getElementById('recb'); if(rb) rb.classList.add('lock');
        var hc=document.querySelector('.hcirc'); if(hc) hc.classList.add('lock');
        var t=document.getElementById('rhint'); if(t) t.textContent='Запись зафиксирована';
        var hh=document.querySelector('.hcirc .hh'); if(hh) hh.textContent='Запись зафиксирована · нажмите ✓';
      }catch(x){}
    }
    var cancel=!H.locked&&dx>48;
    if(cancel!==!!H.cx){
      H.cx=cancel;
      try{if(typeof holdCx==='function') holdCx(H,cancel)}catch(x){}
    }
  }catch(err){}
}
document.addEventListener('pointermove',function(e){
  if(typeof H==='undefined'||!H||e.pointerId!==H.id) return;
  __gE=e; if(!__gRaf) __gRaf=requestAnimationFrame(applyGesture);
},true);

try{
  var _holdEnd=window.holdEnd;
  window.holdEnd=function(e,cancelled){
    try{
      if(typeof H!=='undefined'&&H&&H.locked&&!H.cx&&!cancelled){
        try{H.btn&&H.btn.releasePointerCapture(H.id)}catch(x){}
        window.H=null;H=null;
        try{
          var b=document.getElementById('recb');
          if(b&&!b.querySelector('.sbtn')){
            var go=document.createElement('button'); go.className='sbtn';
            go.innerHTML=typeof ic==='function'?ic('send'):'➤';
            go.onclick=function(){try{recStop()}catch(x){}};
            b.appendChild(go);
          }
        }catch(x){}
        return;
      }
      if(typeof H!=='undefined'&&H&&(H.cx||cancelled)){
        try{
          var ball=document.querySelector('.hcirc');
          if(ball){
            ball.classList.add('toss');
            var trash=document.createElement('div');
            trash.className='rec-trash-fly'; trash.textContent='🗑';
            document.body.appendChild(trash);
            setTimeout(function(){try{trash.remove()}catch(x){}},520);
          }
        }catch(x){}
      }
    }catch(err){}
    if(typeof _holdEnd==='function') return _holdEnd(e,cancelled);
  };
}catch(e){}

try{
  var _hs=window.holdStart;
  if(typeof _hs==='function'){
    window.holdStart=function(kind,btn,e){
      var p=_hs(kind,btn,e);
      Promise.resolve(p).then(function(){
        try{if(typeof H!=='undefined'&&H){H.x0=e.clientX;H.y0=e.clientY;H.locked=false}}catch(x){}
      });
      return p;
    };
  }
}catch(e){}

/* ---------- auto-update: SW bump + reload when new version ---------- */
try{
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(function(regs){
      regs.forEach(function(r){
        try{ r.update(); }catch(e){}
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange',function(){
      if(window.__lgReloaded) return;
      window.__lgReloaded=1;
      location.reload();
    });
  }
}catch(e){}

console.log('[Logos] UI v5 ready');
})();
