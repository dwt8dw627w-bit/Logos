/* Logos UI patch: real glass, tab bar, unified mic/circle hold (2026-11-10) */
(function(){
if(window.__lgUiPatch)return;window.__lgUiPatch=1;

/* ---------- 1) Real glass (transparent, theme bg under) + kill purple triangles ---------- */
const st=document.createElement('style');
st.id='lg-ui-glass';
st.textContent=`
/* Neutral liquid glass — shows lobby/theme under */
:root{
  --glass-bg: rgba(255,255,255,.06) !important;
  --glass-bg-strong: rgba(20,20,22,.42) !important;
  --glass-border: rgba(255,255,255,.16) !important;
  --glass-border-soft: rgba(255,255,255,.10) !important;
  --glass-highlight: rgba(255,255,255,.22) !important;
  --glass-shadow: 0 8px 28px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.14) !important;
  --glass-blur: saturate(140%) blur(24px) !important;
}
html::before{display:none!important;content:none!important;background:none!important}
html:root .lgx-nav, html:root .lgx-bar, html:root .lgx-sheet, html:root .lgx-card, html:root .lgx-btn, html:root .lgx-field{
  --lgt: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04)) !important;
  box-shadow: var(--glass-shadow) !important;
}
html:root :is(.lgx,#tb .tbp.lgx)::after,
html:root .lgx-btn::after,
#tb .tbp::before,#tb .tbp::after,
#tb::before,#tb::after,
.tbp::before,.tbp::after{
  display:none!important; content:none!important; background:none!important;
  box-shadow:none!important; border:0!important; width:0!important; height:0!important;
}
#tb, #tb .tbp, .tbp.lgx, #tb .tbp.lgx{
  background: rgba(18,18,20,.40) !important;
  -webkit-backdrop-filter: saturate(140%) blur(22px) !important;
  backdrop-filter: saturate(140%) blur(22px) !important;
  border: 1px solid rgba(255,255,255,.12) !important;
  box-shadow: 0 8px 28px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12) !important;
  overflow: hidden !important;
  clip-path: none !important;
  border-radius: 22px !important;
}
#tb .tbp button, #tb .tbp.lgx button{
  background: transparent !important;
  box-shadow: none !important;
}
#sh .shc, .shc, .dlg, .dlg > div{
  background: rgba(22,22,24,.48) !important;
  -webkit-backdrop-filter: saturate(150%) blur(28px) !important;
  backdrop-filter: saturate(150%) blur(28px) !important;
  border: 1px solid rgba(255,255,255,.14) !important;
  box-shadow: 0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.12) !important;
}
#main .top, .top{
  background: rgba(12,12,14,.38) !important;
  -webkit-backdrop-filter: saturate(140%) blur(20px) !important;
  backdrop-filter: saturate(140%) blur(20px) !important;
  border-bottom: 1px solid rgba(255,255,255,.08) !important;
}
.btn, button.btn{
  background: rgba(255,255,255,.12) !important;
  color: var(--tx,#f2f2f2) !important;
  border: 1px solid rgba(255,255,255,.18) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 6px 18px rgba(0,0,0,.25) !important;
}
.seg{ background: rgba(255,255,255,.06)!important; border:1px solid rgba(255,255,255,.1)!important }
.seg button.on{ background: rgba(255,255,255,.14)!important; box-shadow: inset 0 1px 0 rgba(255,255,255,.12)!important }

#main .cin, .cin, .cbar, [class*="composer"]{
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px)) !important;
}
.cact{ display:flex; align-items:center; gap:6px; flex:none }
.cact .ib.mic, .cact .ib.cam, .cact .ib.recmode, .cact .ib.snd{
  width:44px; height:44px; min-width:44px; border-radius:50%;
  display:grid; place-items:center;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
}
.cact .ib.recmode{ width:48px; height:48px; min-width:48px }
.cact .ib.recmode.on-circle{ background: rgba(255,255,255,.14); box-shadow: 0 0 0 2px rgba(255,255,255,.2), inset 0 1px 0 rgba(255,255,255,.15) }

.hcirc .hcv, .hcirc .hcv video{
  width: min(78vw, 320px) !important;
  height: min(78vw, 320px) !important;
  border-radius: 50% !important;
  object-fit: cover !important;
}
.hcirc .cring{ width: min(84vw, 340px)!important; height: min(84vw, 340px)!important }
.hcirc .hctl{
  position:absolute; left:0; right:0; bottom: max(28px, env(safe-area-inset-bottom));
  display:flex; justify-content:center; gap:18px; z-index:5; pointer-events:auto;
}
.hcirc .hctl button{
  width:48px; height:48px; border-radius:50%;
  background: rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.2);
  color:#fff; display:grid; place-items:center;
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
}
.hcirc .hh{ font-size:13px; opacity:.85; text-align:center; margin-top:10px }
.hcirc.lock .hh{ color:#a7f3d0 }
.hcirc.cx .hh{ color:#fca5a5 }
.hcirc.toss{
  transition: transform .45s cubic-bezier(.4,0,.2,1), opacity .45s;
  transform: translate(-42vw, 18vh) scale(.18) !important;
  opacity: 0 !important;
}
.rec-trash-fly{
  position:fixed; z-index:9999; pointer-events:none;
  width:56px; height:56px; border-radius:50%;
  background: rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.2);
  display:grid; place-items:center; color:#fff;
  left: 12vw; bottom: 22vh;
  animation: lgTrashOut .55s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes lgTrashOut{
  0%{ transform: scale(1); opacity:1 }
  70%{ transform: translateY(40px) scale(.9); opacity:.7 }
  100%{ transform: translateY(120px) scale(.4); opacity:0 }
}
.recb.lock .rhint{ color:#a7f3d0 }
`;
document.head.appendChild(st);

/* ---------- 2) Unified mic/circle toggle in composer ---------- */
window.__recMode = window.__recMode || 'voice';

function iconForMode(){
  try{
    if(window.__recMode==='circle') return (typeof ic==='function'?ic('circle'):'\u25EF');
    return (typeof ic==='function'?ic('mic'):'\uD83C\uDFA4');
  }catch(e){ return '\u25CF' }
}

function applyRecModeBtn(){
  const act=document.querySelector('.cact');
  if(!act) return;
  act.querySelectorAll('[data-hold="circle"], [data-hold="voice"], .ib.cam, .ib.mic').forEach(el=>{
    if(!el.classList.contains('recmode')) el.style.display='none';
  });
  let btn=act.querySelector('.ib.recmode');
  if(!btn){
    btn=document.createElement('button');
    btn.className='ib recmode';
    btn.type='button';
    btn.setAttribute('aria-label','\u0417\u0430\u043f\u0438\u0441\u044c');
    const snd=act.querySelector('.ib.snd');
    if(snd) act.insertBefore(btn, snd); else act.appendChild(btn);
    let tapT=0, moved=0;
    btn.addEventListener('pointerdown', function(e){
      if(e.button>0) return;
      moved=0; tapT=Date.now();
      btn._holdTimer=setTimeout(()=>{
        if(moved) return;
        const kind=window.__recMode==='circle'?'circle':'voice';
        btn.dataset.hold=kind;
        try{ holdStart(kind, btn, e) }catch(err){}
      }, 220);
    });
    btn.addEventListener('pointermove', function(e){
      if(Math.abs(e.movementX)+Math.abs(e.movementY)>4) moved=1;
    });
    btn.addEventListener('pointerup', function(e){
      clearTimeout(btn._holdTimer);
      if(!H && Date.now()-tapT<220 && !moved){
        window.__recMode = window.__recMode==='circle'?'voice':'circle';
        btn.dataset.hold=window.__recMode;
        btn.classList.toggle('on-circle', window.__recMode==='circle');
        btn.innerHTML=iconForMode();
        try{ toast(window.__recMode==='circle'?'\u041a\u0440\u0443\u0436\u043e\u043a':'\u0413\u043e\u043b\u043e\u0441\u043e\u0432\u043e\u0435') }catch(x){}
        try{ vib&&vib(8) }catch(x){}
      }
    });
    btn.addEventListener('pointercancel', function(){ clearTimeout(btn._holdTimer) });
  }
  btn.dataset.hold=window.__recMode;
  btn.classList.toggle('on-circle', window.__recMode==='circle');
  btn.innerHTML=iconForMode();
}

const _dm = window.drawMain;
if(typeof _dm==='function'){
  window.drawMain=function(){
    const r=_dm.apply(this,arguments);
    try{ applyRecModeBtn() }catch(e){}
    return r;
  };
}
const mo=new MutationObserver(()=>{ try{ applyRecModeBtn() }catch(e){} });
try{ mo.observe(document.body,{childList:true,subtree:true}) }catch(e){}
setTimeout(applyRecModeBtn, 400);

/* ---------- 3) Hold gestures: left=cancel+trash, up=lock ---------- */
const _holdUI=window.holdUI;
window.holdUI=function(h){
  if(typeof _holdUI==='function') _holdUI(h);
  try{
    if(h.kind==='voice'){
      const t=document.getElementById('rhint');
      if(t) t.textContent='\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
    } else {
      let o=document.querySelector('.hcirc');
      if(o){
        const hh=o.querySelector('.hh');
        if(hh) hh.textContent='\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
        if(!o.querySelector('.hctl')){
          const ctl=document.createElement('div');
          ctl.className='hctl';
          ctl.innerHTML=
            `<button type="button" data-a="flip" aria-label="\u041a\u0430\u043c\u0435\u0440\u0430">${typeof ic==='function'?ic('flip'):'\u27F3'}</button>`+
            `<button type="button" data-a="flash" aria-label="\u0412\u0441\u043f\u044b\u0448\u043a\u0430">${typeof ic==='function'?ic('sparkle'):'\u26A1'}</button>`;
          o.appendChild(ctl);
          ctl.addEventListener('pointerdown', e=>e.stopPropagation());
          ctl.addEventListener('click', async e=>{
            const a=e.target.closest('button')?.dataset?.a;
            if(a==='flip'){ try{ await flipCam() }catch(x){} }
            if(a==='flash'){ try{ await toggleFlash(e.target.closest('button')) }catch(x){} }
          });
        }
      }
    }
  }catch(e){}
};

window.toggleFlash=async function(btn){
  try{
    if(!R||!R.st) return;
    const track=R.st.getVideoTracks()[0];
    if(!track) return toast('\u041d\u0435\u0442 \u043a\u0430\u043c\u0435\u0440\u044b');
    const caps=track.getCapabilities&&track.getCapabilities();
    if(!caps||!caps.torch){ toast('\u0412\u0441\u043f\u044b\u0448\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430'); return }
    R.torch=!R.torch;
    await track.applyConstraints({ advanced:[{ torch:!!R.torch }] });
    if(btn) btn.style.background=R.torch?'rgba(250,204,21,.35)':'rgba(0,0,0,.45)';
  }catch(e){ toast('\u0412\u0441\u043f\u044b\u0448\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430') }
};

document.addEventListener('pointermove', function(e){
  if(!H||e.pointerId!==H.id) return;
  const dy=H.y0-e.clientY;
  if(H.x0==null) H.x0=e.clientX;
  if(dy>64 && !H.locked){
    H.locked=true; H.cx=false;
    try{
      document.getElementById('recb')?.classList.add('lock');
      document.querySelector('.hcirc')?.classList.add('lock');
      const t=document.getElementById('rhint'); if(t) t.textContent='\u0417\u0430\u043f\u0438\u0441\u044c \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u0430';
      const hh=document.querySelector('.hcirc .hh'); if(hh) hh.textContent='\u0417\u0430\u043f\u0438\u0441\u044c \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u0430 \u00b7 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u2713';
      vib&&vib(16);
    }catch(x){}
  }
  const cancel=(!H.locked) && ((H.x0-e.clientX)>56);
  if(cancel!==H.cx){
    H.cx=cancel;
    try{ holdCx(H, cancel) }catch(x){}
    try{
      const t=document.getElementById('rhint');
      if(t) t.textContent=cancel?'\u041e\u0442\u043f\u0443\u0441\u0442\u0438\u0442\u0435 \u2014 \u0432 \u043a\u043e\u0440\u0437\u0438\u043d\u0443':'\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
      const hh=document.querySelector('.hcirc .hh');
      if(hh) hh.textContent=cancel?'\u041e\u0442\u043f\u0443\u0441\u0442\u0438\u0442\u0435 \u2014 \u0432 \u043a\u043e\u0440\u0437\u0438\u043d\u0443':'\u2191 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u00b7 \u2190 \u043e\u0442\u043c\u0435\u043d\u0430';
      vib&&vib(cancel?18:8);
    }catch(x){}
  }
}, true);

const _holdEnd=window.holdEnd;
window.holdEnd=function(e, cancelled){
  if(!H||(e&&e.pointerId!==H.id)){
    if(typeof _holdEnd==='function') return _holdEnd(e, cancelled);
    return;
  }
  if(H.locked && !H.cx && !cancelled){
    try{ H.btn.releasePointerCapture(H.id) }catch(x){}
    H=null;
    try{
      const b=document.getElementById('recb');
      if(b && !b.querySelector('.sbtn')){
        const go=document.createElement('button');
        go.className='sbtn'; go.innerHTML=(typeof ic==='function'?ic('send'):'\u27A4');
        go.onclick=()=>recStop();
        b.appendChild(go);
      }
      const cov=document.querySelector('.hcirc');
      if(cov && !cov.querySelector('[data-a=stop]')){
        const ctl=cov.querySelector('.hctl')||cov;
        const stop=document.createElement('button');
        stop.dataset.a='stop'; stop.textContent='\u2713';
        stop.onclick=()=>recStop();
        ctl.appendChild(stop);
      }
    }catch(x){}
    return;
  }
  const wasCancel=H.cx||cancelled;
  const kind=H.kind;
  if(wasCancel){
    try{
      const ball=document.querySelector('.hcirc')||document.getElementById('recb');
      if(ball && kind==='circle'){
        ball.classList.add('toss');
        const trash=document.createElement('div');
        trash.className='rec-trash-fly';
        trash.innerHTML=(typeof ic==='function'?ic('trash'):'\uD83D\uDDD1');
        document.body.appendChild(trash);
        setTimeout(()=>trash.remove(), 600);
      }
    }catch(x){}
  }
  if(typeof _holdEnd==='function') return _holdEnd(e, cancelled||wasCancel);
  const h=H; H=null;
  try{h.btn.releasePointerCapture(h.id)}catch(x){}
  if(!R){ try{holdClear&&holdClear()}catch(x){} return }
  if(wasCancel) recCancel(); else recStop();
};

const _holdStart=window.holdStart;
window.holdStart=async function(kind,btn,e){
  if(typeof _holdStart==='function'){
    const p=_holdStart(kind,btn,e);
    Promise.resolve(p).then(()=>{ if(H){ H.x0=e.clientX; H.y0=e.clientY; H.locked=false } });
    return p;
  }
};

console.log('[Logos] UI patch: glass + rec mode + gestures');
})();
