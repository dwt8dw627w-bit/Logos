/* Logos UI patch v2: real glass, tab bar, unified mic/circle — no freeze */
(function(){
if(window.__lgUiPatch)return;window.__lgUiPatch=1;

/* ---------- 1) Glass CSS (no purple, no corner flares) ---------- */
try{
const st=document.createElement('style');
st.id='lg-ui-glass';
st.textContent=`
html::before{display:none!important;content:none!important;background:none!important}
html:root .lgx-nav,html:root .lgx-bar,html:root .lgx-sheet,html:root .lgx-card,html:root .lgx-btn,html:root .lgx-field{
  --lgt:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.04))!important;
  box-shadow:0 8px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.12)!important;
}
html:root :is(.lgx,#tb .tbp.lgx)::after,
html:root .lgx-btn::after,
#tb .tbp::before,#tb .tbp::after,#tb::before,#tb::after,.tbp::before,.tbp::after{
  display:none!important;content:none!important;background:none!important;
  box-shadow:none!important;width:0!important;height:0!important;
}
#tb,#tb .tbp,.tbp.lgx,#tb .tbp.lgx{
  background:rgba(18,18,20,.40)!important;
  -webkit-backdrop-filter:saturate(140%) blur(22px)!important;
  backdrop-filter:saturate(140%) blur(22px)!important;
  border:1px solid rgba(255,255,255,.12)!important;
  box-shadow:0 8px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.12)!important;
  overflow:hidden!important;clip-path:none!important;border-radius:22px!important;
}
#tb .tbp button,#tb .tbp.lgx button{background:transparent!important;box-shadow:none!important}
#sh .shc,.shc,.dlg,.dlg>div{
  background:rgba(22,22,24,.48)!important;
  -webkit-backdrop-filter:saturate(150%) blur(28px)!important;
  backdrop-filter:saturate(150%) blur(28px)!important;
  border:1px solid rgba(255,255,255,.14)!important;
}
#main .top,.top{
  background:rgba(12,12,14,.38)!important;
  -webkit-backdrop-filter:saturate(140%) blur(20px)!important;
  backdrop-filter:saturate(140%) blur(20px)!important;
}
.cact .ib.recmode{
  width:48px;height:48px;min-width:48px;border-radius:50%;
  display:grid;place-items:center;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
}
.cact .ib.recmode.on-circle{background:rgba(255,255,255,.14);box-shadow:0 0 0 2px rgba(255,255,255,.2)}
.hcirc .hcv,.hcirc .hcv video{width:min(78vw,320px)!important;height:min(78vw,320px)!important;border-radius:50%!important;object-fit:cover!important}
.hcirc .cring{width:min(84vw,340px)!important;height:min(84vw,340px)!important}
.hcirc .hctl{position:absolute;left:0;right:0;bottom:max(28px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:18px;z-index:5}
.hcirc .hctl button{width:48px;height:48px;border-radius:50%;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);color:#fff;display:grid;place-items:center}
.hcirc.toss{transition:transform .45s cubic-bezier(.4,0,.2,1),opacity .45s;transform:translate(-42vw,18vh) scale(.18)!important;opacity:0!important}
.rec-trash-fly{position:fixed;z-index:9999;pointer-events:none;width:56px;height:56px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.2);display:grid;place-items:center;color:#fff;left:12vw;bottom:22vh;animation:lgTrashOut .55s cubic-bezier(.4,0,.2,1) forwards}
@keyframes lgTrashOut{0%{transform:scale(1);opacity:1}100%{transform:translateY(120px) scale(.4);opacity:0}}
.recb.lock .rhint,.hcirc.lock .hh{color:#a7f3d0}
`;
document.head.appendChild(st);
}catch(e){}

/* ---------- 2) Unified rec button — NO MutationObserver (was freezing) ---------- */
window.__recMode = window.__recMode || 'voice';
let __recBusy=0;

function iconForMode(){
  try{
    if(window.__recMode==='circle') return (typeof ic==='function'?ic('circle'):'\u25EF');
    return (typeof ic==='function'?ic('mic'):'\uD83C\uDFA4');
  }catch(e){return '\u25CF'}
}

function applyRecModeBtn(){
  if(__recBusy) return;
  __recBusy=1;
  try{
    const act=document.querySelector('.cact');
    if(!act) return;
    act.querySelectorAll('[data-hold="circle"],[data-hold="voice"],.ib.cam,.ib.mic').forEach(el=>{
      if(!el.classList.contains('recmode')) el.style.display='none';
    });
    let btn=act.querySelector('.ib.recmode');
    if(!btn){
      btn=document.createElement('button');
      btn.className='ib recmode';
      btn.type='button';
      btn.setAttribute('aria-label','\u0417\u0430\u043f\u0438\u0441\u044c');
      const snd=act.querySelector('.ib.snd');
      if(snd) act.insertBefore(btn,snd); else act.appendChild(btn);
      let tapT=0,moved=0,holding=0;
      btn.addEventListener('pointerdown',function(e){
        if(e.button>0) return;
        moved=0;holding=0;tapT=Date.now();
        clearTimeout(btn._holdTimer);
        btn._holdTimer=setTimeout(function(){
          if(moved) return;
          holding=1;
          const kind=window.__recMode==='circle'?'circle':'voice';
          btn.dataset.hold=kind;
          try{ if(typeof holdStart==='function') holdStart(kind,btn,e); }catch(err){}
        },250);
      },{passive:true});
      btn.addEventListener('pointermove',function(e){
        if(Math.abs(e.movementX)+Math.abs(e.movementY)>6) moved=1;
      },{passive:true});
      const end=function(){
        clearTimeout(btn._holdTimer);
        if(!holding && Date.now()-tapT<250 && !moved){
          window.__recMode=window.__recMode==='circle'?'voice':'circle';
          btn.dataset.hold=window.__recMode;
          btn.classList.toggle('on-circle',window.__recMode==='circle');
          btn.innerHTML=iconForMode();
          try{toast(window.__recMode==='circle'?'\u041a\u0440\u0443\u0436\u043e\u043a':'\u0413\u043e\u043b\u043e\u0441\u043e\u0432\u043e\u0435')}catch(x){}
        }
        holding=0;
      };
      btn.addEventListener('pointerup',end,{passive:true});
      btn.addEventListener('pointercancel',function(){clearTimeout(btn._holdTimer);holding=0},{passive:true});
    }
    btn.dataset.hold=window.__recMode;
    btn.classList.toggle('on-circle',window.__recMode==='circle');
    if(!btn.innerHTML) btn.innerHTML=iconForMode();
  }catch(e){}
  finally{ __recBusy=0; }
}

try{
  if(typeof window.drawMain==='function' && !window.drawMain.__lgRec){
    const _dm=window.drawMain;
    window.drawMain=function(){
      const r=_dm.apply(this,arguments);
      try{ requestAnimationFrame(applyRecModeBtn); }catch(e){}
      return r;
    };
    window.drawMain.__lgRec=1;
  }
}catch(e){}
setTimeout(applyRecModeBtn,600);
setTimeout(applyRecModeBtn,1500);

/* ---------- 3) Gestures ---------- */
try{
const _holdUI=window.holdUI;
window.holdUI=function(h){
  if(typeof _holdUI==='function') try{_holdUI(h)}catch(e){}
  try{
    if(h&&h.kind==='voice'){
      const t=document.getElementById('rhint');
      if(t) t.textContent='\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
    }else if(h){
      const o=document.querySelector('.hcirc');
      if(o){
        const hh=o.querySelector('.hh');
        if(hh) hh.textContent='\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
        if(!o.querySelector('.hctl')){
          const ctl=document.createElement('div');
          ctl.className='hctl';
          ctl.innerHTML='<button type="button" data-a="flip">'+(typeof ic==='function'?ic('flip'):'\u27F3')+'</button>'+
            '<button type="button" data-a="flash">'+(typeof ic==='function'?ic('sparkle'):'\u26A1')+'</button>';
          o.appendChild(ctl);
          ctl.addEventListener('pointerdown',function(e){e.stopPropagation()});
          ctl.addEventListener('click',async function(e){
            const a=e.target.closest('button')&&e.target.closest('button').dataset.a;
            if(a==='flip'){ try{ await flipCam(); }catch(x){} }
            if(a==='flash'){ try{ await toggleFlash(e.target.closest('button')); }catch(x){} }
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
    const track=R.st.getVideoTracks()[0];
    if(!track) return;
    const caps=track.getCapabilities&&track.getCapabilities();
    if(!caps||!caps.torch){ try{toast('\u0412\u0441\u043f\u044b\u0448\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430')}catch(x){} return; }
    R.torch=!R.torch;
    await track.applyConstraints({advanced:[{torch:!!R.torch}]});
    if(btn) btn.style.background=R.torch?'rgba(250,204,21,.35)':'rgba(0,0,0,.45)';
  }catch(e){ try{toast('\u0412\u0441\u043f\u044b\u0448\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430')}catch(x){} }
};

document.addEventListener('pointermove',function(e){
  try{
    if(typeof H==='undefined'||!H||e.pointerId!==H.id) return;
    if(H.x0==null) H.x0=e.clientX;
    const dy=(H.y0||0)-e.clientY;
    if(dy>64 && !H.locked){
      H.locked=true; H.cx=false;
      try{
        document.getElementById('recb')&&document.getElementById('recb').classList.add('lock');
        const hc=document.querySelector('.hcirc'); if(hc) hc.classList.add('lock');
        const t=document.getElementById('rhint'); if(t) t.textContent='\u0417\u0430\u043f\u0438\u0441\u044c \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u0430';
        const hh=document.querySelector('.hcirc .hh'); if(hh) hh.textContent='\u0417\u0430\u043f\u0438\u0441\u044c \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u0430 \u00b7 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u2713';
      }catch(x){}
    }
    const cancel=!H.locked && ((H.x0-e.clientX)>56);
    if(cancel!==H.cx){
      H.cx=cancel;
      try{ if(typeof holdCx==='function') holdCx(H,cancel); }catch(x){}
    }
  }catch(err){}
},true);

try{
const _holdEnd=window.holdEnd;
window.holdEnd=function(e,cancelled){
  try{
    if(typeof H!=='undefined'&&H&&H.locked&&!H.cx&&!cancelled){
      try{ H.btn&&H.btn.releasePointerCapture(H.id); }catch(x){}
      window.H=null; H=null;
      try{
        const b=document.getElementById('recb');
        if(b&&!b.querySelector('.sbtn')){
          const go=document.createElement('button');
          go.className='sbtn';
          go.innerHTML=(typeof ic==='function'?ic('send'):'\u27A4');
          go.onclick=function(){ try{recStop()}catch(x){} };
          b.appendChild(go);
        }
      }catch(x){}
      return;
    }
    if(typeof H!=='undefined'&&H&&(H.cx||cancelled)){
      try{
        const ball=document.querySelector('.hcirc');
        if(ball){
          ball.classList.add('toss');
          const trash=document.createElement('div');
          trash.className='rec-trash-fly';
          trash.textContent='\uD83D\uDDD1';
          document.body.appendChild(trash);
          setTimeout(function(){ try{trash.remove()}catch(x){} },600);
        }
      }catch(x){}
    }
  }catch(err){}
  if(typeof _holdEnd==='function') return _holdEnd(e,cancelled);
};
}catch(e){}

try{
const _hs=window.holdStart;
if(typeof _hs==='function'){
  window.holdStart=async function(kind,btn,e){
    const p=_hs(kind,btn,e);
    try{
      Promise.resolve(p).then(function(){
        try{ if(typeof H!=='undefined'&&H){ H.x0=e.clientX; H.y0=e.clientY; H.locked=false; } }catch(x){}
      });
    }catch(x){}
    return p;
  };
}
}catch(e){}

console.log('[Logos] UI patch v2 ready');
})();
