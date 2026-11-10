/* Logos UI v3 — CSS-only liquid glass. No JS hooks (fixes chat freeze). */
(function(){
if(window.__lgUiPatch)return;window.__lgUiPatch=1;

try{
  if(!document.getElementById('lg-liquid-filter')){
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('id','lg-liquid-filter');
    svg.setAttribute('aria-hidden','true');
    svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
    svg.innerHTML='<defs><filter id="lg-refract" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">'+
      '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="2" result="noise"/>'+
      '<feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/>'+
      '</filter></defs>';
    document.body.appendChild(svg);
  }
}catch(e){}

var css=document.createElement('style');
css.id='lg-ui-glass-v3';
css.textContent=`
:root{
  --lg-blur: 28px;
  --lg-sat: 180%;
  --lg-fill: rgba(255,255,255,.08);
  --lg-fill-strong: rgba(255,255,255,.12);
  --lg-stroke: rgba(255,255,255,.22);
  --lg-stroke-soft: rgba(255,255,255,.12);
  --lg-inset: inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(0,0,0,.15);
  --lg-shadow: 0 10px 40px rgba(0,0,0,.28);
}
html::before{display:none!important;content:none!important;background:none!important}
html:root :is(.lgx,#tb .tbp.lgx)::after,
html:root .lgx-btn::after,
#tb::before,#tb::after,#tb .tbp::before,#tb .tbp::after,.tbp::before,.tbp::after{
  display:none!important;content:none!important;background:none!important;
  width:0!important;height:0!important;box-shadow:none!important;
}
html:root .lgx-nav,html:root .lgx-bar,html:root .lgx-sheet,html:root .lgx-card,html:root .lgx-btn,html:root .lgx-field{
  --lgt: linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.05))!important;
  background: var(--lg-fill)!important;
  box-shadow: var(--lg-shadow), var(--lg-inset)!important;
}
#tb,#tb .tbp,.tbp.lgx,#tb .tbp.lgx{
  background: var(--lg-fill)!important;
  -webkit-backdrop-filter: saturate(var(--lg-sat)) blur(var(--lg-blur))!important;
  backdrop-filter: saturate(var(--lg-sat)) blur(var(--lg-blur))!important;
  border: 1px solid var(--lg-stroke)!important;
  box-shadow: var(--lg-shadow), var(--lg-inset)!important;
  overflow: hidden!important;
  clip-path: none!important;
  border-radius: 24px!important;
}
#tb .tbp button,#tb .tbp.lgx button{
  background: transparent!important;
  box-shadow: none!important;
}
#main .top,.top,#app .top{
  background: var(--lg-fill)!important;
  -webkit-backdrop-filter: saturate(var(--lg-sat)) blur(var(--lg-blur))!important;
  backdrop-filter: saturate(var(--lg-sat)) blur(var(--lg-blur))!important;
  border-bottom: 1px solid var(--lg-stroke-soft)!important;
  box-shadow: var(--lg-inset)!important;
}
#sh .shc,.shc,.dlg,.dlg > div,.sheet,#sh{
  background: var(--lg-fill-strong)!important;
  -webkit-backdrop-filter: saturate(190%) blur(36px)!important;
  backdrop-filter: saturate(190%) blur(36px)!important;
  border: 1px solid var(--lg-stroke)!important;
  box-shadow: var(--lg-shadow), var(--lg-inset)!important;
}
.srch input,.fld input,.fld textarea,input[type="search"]{
  background: rgba(255,255,255,.07)!important;
  -webkit-backdrop-filter: blur(16px) saturate(140%)!important;
  backdrop-filter: blur(16px) saturate(140%)!important;
  border: 1px solid var(--lg-stroke-soft)!important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12)!important;
}
#main .cin,.cin,.cbar,#cmp,.composer{
  background: var(--lg-fill)!important;
  -webkit-backdrop-filter: saturate(var(--lg-sat)) blur(22px)!important;
  backdrop-filter: saturate(var(--lg-sat)) blur(22px)!important;
  border-top: 1px solid var(--lg-stroke-soft)!important;
  box-shadow: var(--lg-inset)!important;
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px))!important;
}
.seg{
  background: rgba(255,255,255,.06)!important;
  -webkit-backdrop-filter: blur(12px)!important;
  backdrop-filter: blur(12px)!important;
  border: 1px solid var(--lg-stroke-soft)!important;
}
.seg button.on{
  background: rgba(255,255,255,.16)!important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2)!important;
}
.btn, button.btn{
  background: rgba(255,255,255,.14)!important;
  color: var(--tx,#f2f2f2)!important;
  border: 1px solid var(--lg-stroke)!important;
  box-shadow: var(--lg-inset), 0 6px 18px rgba(0,0,0,.22)!important;
  -webkit-backdrop-filter: blur(12px) saturate(140%)!important;
  backdrop-filter: blur(12px) saturate(140%)!important;
}
#ms .m:not(.me){
  background: rgba(255,255,255,.09)!important;
  -webkit-backdrop-filter: blur(14px) saturate(130%)!important;
  backdrop-filter: blur(14px) saturate(130%)!important;
  border: 1px solid rgba(255,255,255,.08)!important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1)!important;
}
.xch, .xch-w .xch{
  background: rgba(255,255,255,.06)!important;
  border: 1px solid transparent!important;
  border-radius: 14px!important;
}
.xch:active{
  background: rgba(255,255,255,.12)!important;
  border-color: var(--lg-stroke-soft)!important;
}
.crow:active, #cl .row:active, .row.gp:active{
  background: rgba(255,255,255,.06)!important;
}
@media (prefers-reduced-transparency: reduce){
  #tb,#tb .tbp,#main .top,.shc,.dlg,.cin{
    background: #1c1c1e!important;
    -webkit-backdrop-filter: none!important;
    backdrop-filter: none!important;
  }
}
`;
document.head.appendChild(css);

/* Remove leaked JS text nodes under the UI (broken past injection) */
try{
  function scrubLeaks(){
    var walk=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var kill=[];
    while(walk.nextNode()){
      var t=walk.currentNode, v=(t.nodeValue||'').trim();
      if(v.length>40 && (/parseFromString|Yt===|let i=P\?|DOMParser|function\s*\(/.test(v))) kill.push(t);
    }
    kill.forEach(function(n){ try{ n.parentNode && n.parentNode.removeChild(n); }catch(e){} });
  }
  scrubLeaks();
  setTimeout(scrubLeaks, 300);
  setTimeout(scrubLeaks, 1200);
}catch(e){}

console.log('[Logos] UI v3 glass-only (no freeze hooks)');
})();
