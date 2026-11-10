/* Logos UI v4 — glass + unified rec + smooth gestures */
(function(){
if(window.__lgUiPatch)return;window.__lgUiPatch=1;

/* ---------- glass + rounded tab bar ---------- */
try{
var css=document.createElement('style');
css.id='lg-ui-v4';
css.textContent=`
:root{
  --lg-fill:rgba(255,255,255,.09);
  --lg-fill2:rgba(255,255,255,.13);
  --lg-stroke:rgba(255,255,255,.20);
  --lg-soft:rgba(255,255,255,.12);
  --lg-inset:inset 0 1px 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(0,0,0,.12);
  --lg-shadow:0 10px 36px rgba(0,0,0,.28);
  --ease-out:cubic-bezier(.22,1,.36,1);
  --ease-spring:cubic-bezier(.34,1.4,.64,1);
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
  border-radius:28px!important;
  overflow:hidden!important;
  clip-path:none!important;
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
  border:1px solid var(--lg-stroke)!important;
  border-radius:22px!important;
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
  background:rgba(255,255,255,.14)!important;
  border:1px solid var(--lg-stroke)!important;
  border-radius:16px!important;
  box-shadow:var(--lg-inset)!important;
}
/* unified rec button */
.cact .ib.cam,.cact .ib.mic,.cact [data-hold="circle"],.cact [data-hold="voice"]{display:none!important}
.cact .ib.recmode{
  width:48px;height:48px;min-width:48px;border-radius:50%;
  display:grid!important;place-items:center;
  background:rgba(255,255,255,.10)!important;
  border:1px solid var(--lg-soft)!important;
  transition:transform .18s var(--ease-out),background .18s,box-shadow .18s;
}
.cact .ib.recmode.on-circle{
  background:rgba(255,255,255,.18)!important;
  box-shadow:0 0 0 2px rgba(255,255,255,.25)!important;
}
.cact .ib.recmode:active{transform:scale(.92)}
/* bigger circle preview */
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
  -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
}
.hcirc,.recb{
  transition:transform .28s var(--ease-out),opacity .28s var(--ease-out),filter .28s!important;
}
.hcirc.lock .hh,.recb.lock .rhint{color:#a7f3d0!important}
.hcirc.cx,.recb.cx{filter:saturate(.6) brightness(.85)}
.hcirc.toss{
  transition:transform .42s var(--ease-out),opacity .42s var(--ease-out)!important;
  transform:translate(-40vw,16vh) scale(.15)!important;opacity:0!important;
}
.rec-trash-fly{
  position:fixed;z-index:9999;pointer-events:none;
  width:56px;height:56px;border-radius:50%;
  left:14vw;bottom:24vh;
  background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);
  display:grid;place-items:center;color:#fff;font-size:22px;
  animation:lgTrash .5s var(--ease-out) forwards;
}
@keyframes lgTrash{
  0%{transform:scale(1);opacity:1}
  100%{transform:translateY(110px) scale(.35);opacity:0}
}
/* smoother list / sheet transitions */
.crow,.row,#cl .row{
  transition:background .18s var(--ease-out),transform .18s var(--ease-out)!important;
}
#sh .shc,.dlg{
  transition:transform .32s var(--ease-out),opacity .28s var(--ease-out)!important;
}
`;
document.head.appendChild(css);
}catch(e){}

/* scrub leaked text */
try{
  function scrub(){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),k=[];
    while(w.nextNode()){
      var v=(w.currentNode.nodeValue||'').trim();
      if(v.length>40&&/parseFromString|Yt===|let i=P\?|DOMParser/.test(v)) k.push(w.currentNode);
    }
    k.forEach(function(n){try{n.parentNode.removeChild(n)}catch(e){}});
  }
  scrub();setTimeout(scrub,400);
}catch(e){}

/* ---------- unified mic/circle ---------- */
window.__recMode=window.__recMode||'voice';
var __busy=0;

function modeIcon(){
  try{
    if(window.__recMode==='circle') return typeof ic==='function'?ic('circle'):'◯';
    return typeof ic==='function'?ic('mic'):'🎤';
  }catch(e){return '●'}
}

function ensureRecBtn(){
  if(__busy) return;
  __busy=1;
  try{
    var act=document.querySelector('.cact');
    if(!act) return;
    act.querySelectorAll('.ib.cam,.ib.mic,[data-hold="circle"],[data-hold="voice"]').forEach(function(el){
      if(!el.classList.contains('recmode')) el.style.display='none';
    });
    var btn=act.querySelector('.ib.recmode');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='ib recmode';
      btn.setAttribute('aria-label','Запись');
      var snd=act.querySelector('.ib.snd');
      if(snd) act.insertBefore(btn,snd); else act.appendChild(btn);

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
        },200);
      },{passive:true});
      btn.addEventListener('pointermove',function(e){
        if(Math.abs(e.movementX)+Math.abs(e.movementY)>5) moved=1;
      },{passive:true});
      function endTap(){
        clearTimeout(timer);
        if(!holding && Date.now()-t0<200 && !moved){
          window.__recMode=window.__recMode==='circle'?'voice':'circle';
          btn.dataset.hold=window.__recMode;
          btn.classList.toggle('on-circle',window.__recMode==='circle');
          btn.innerHTML=modeIcon();
          try{toast(window.__recMode==='circle'?'Кружок':'Голосовое')}catch(x){}
          try{vib&&vib(8)}catch(x){}
        }
        holding=0;
      }
      btn.addEventListener('pointerup',endTap,{passive:true});
      btn.addEventListener('pointercancel',function(){clearTimeout(timer);holding=0},{passive:true});
    }
    btn.dataset.hold=window.__recMode;
    btn.classList.toggle('on-circle',window.__recMode==='circle');
    if(!btn.childNodes.length) btn.innerHTML=modeIcon();
  }catch(e){}
  __busy=0;
}

/* only hook drawMain once, rAF once */
try{
  if(typeof window.drawMain==='function' && !window.drawMain.__lg4){
    var _dm=window.drawMain;
    window.drawMain=function(){
      var r=_dm.apply(this,arguments);
      requestAnimationFrame(ensureRecBtn);
      return r;
    };
    window.drawMain.__lg4=1;
  }
}catch(e){}
setTimeout(ensureRecBtn,500);
setTimeout(ensureRecBtn,1600);

/* ---------- gestures: up=lock, left=cancel+trash (smooth) ---------- */
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
              var a=e.target.closest('button');
              if(!a) return;
              if(a.dataset.a==='flip'){ try{flipCam()}catch(x){} }
              if(a.dataset.a==='flash'){ try{toggleFlash(a)}catch(x){} }
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
    var track=R.st.getVideoTracks()[0];
    if(!track) return;
    var caps=track.getCapabilities&&track.getCapabilities();
    if(!caps||!caps.torch){try{toast('Вспышка недоступна')}catch(x){} return}
    R.torch=!R.torch;
    await track.applyConstraints({advanced:[{torch:!!R.torch}]});
    if(btn) btn.style.background=R.torch?'rgba(250,204,21,.35)':'rgba(0,0,0,.4)';
  }catch(e){try{toast('Вспышка недоступна')}catch(x){}}
};

/* smooth gesture tracking — rAF throttled */
var __gRaf=0,__gE=null;
function applyGesture(){
  __gRaf=0;
  var e=__gE; if(!e) return;
  try{
    if(typeof H==='undefined'||!H||e.pointerId!==H.id) return;
    if(H.x0==null){ H.x0=e.clientX; H.y0=e.clientY; }
    var dy=H.y0-e.clientY;
    var dx=H.x0-e.clientX;
    /* lock up */
    if(dy>52 && !H.locked){
      H.locked=true; H.cx=false;
      try{
        var rb=document.getElementById('recb'); if(rb) rb.classList.add('lock');
        var hc=document.querySelector('.hcirc'); if(hc) hc.classList.add('lock');
        var t=document.getElementById('rhint'); if(t) t.textContent='Запись зафиксирована';
        var hh=document.querySelector('.hcirc .hh'); if(hh) hh.textContent='Запись зафиксирована · нажмите ✓';
        if(typeof vib==='function') vib(14);
      }catch(x){}
    }
    /* cancel left */
    var cancel=!H.locked && dx>48;
    if(cancel!==!!H.cx){
      H.cx=cancel;
      try{ if(typeof holdCx==='function') holdCx(H,cancel); }catch(x){}
      try{
        var t2=document.getElementById('rhint');
        if(t2) t2.textContent=cancel?'Отпустите — в корзину':'↑ фиксация  ·  ← отмена';
        var hh2=document.querySelector('.hcirc .hh');
        if(hh2) hh2.textContent=cancel?'Отпустите — в корзину':'↑ фиксация  ·  ← отмена';
      }catch(x){}
    }
  }catch(err){}
}
document.addEventListener('pointermove',function(e){
  if(typeof H==='undefined'||!H||e.pointerId!==H.id) return;
  __gE=e;
  if(!__gRaf) __gRaf=requestAnimationFrame(applyGesture);
},true);

try{
  var _holdEnd=window.holdEnd;
  window.holdEnd=function(e,cancelled){
    try{
      if(typeof H!=='undefined'&&H&&H.locked&&!H.cx&&!cancelled){
        try{H.btn&&H.btn.releasePointerCapture(H.id)}catch(x){}
        var lockedKind=H.kind;
        window.H=null; H=null;
        try{
          var b=document.getElementById('recb');
          if(b&&!b.querySelector('.sbtn')){
            var go=document.createElement('button');
            go.className='sbtn';
            go.innerHTML=typeof ic==='function'?ic('send'):'➤';
            go.onclick=function(){try{recStop()}catch(x){}};
            b.appendChild(go);
          }
          var cov=document.querySelector('.hcirc');
          if(cov&&!cov.querySelector('[data-a="stop"]')){
            var ctl=cov.querySelector('.hctl')||cov;
            var stop=document.createElement('button');
            stop.dataset.a='stop'; stop.textContent='✓';
            stop.onclick=function(){try{recStop()}catch(x){}};
            ctl.appendChild(stop);
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
            trash.className='rec-trash-fly';
            trash.textContent='🗑';
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
        try{ if(typeof H!=='undefined'&&H){ H.x0=e.clientX; H.y0=e.clientY; H.locked=false; } }catch(x){}
      });
      return p;
    };
  }
}catch(e){}

console.log('[Logos] UI v4 ready');
})();
