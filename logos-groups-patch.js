/* Logos runtime patch: groups/channels UX, deleted log, channel edit, ownership (2026-11-10) */
(function(){
if(window.__lgPatchGroups)return;window.__lgPatchGroups=1;
const $=s=>document.querySelector(s);
const toast=(m)=>{try{window.toast(m)}catch(e){}};
const esc=window.esc||(t=>String(t||'').replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c])));
const ic=window.ic||(()=>'');
const av=window.av||(()=>'<div></div>');
const at=window.at||(u=>u?'@'+u:'');
const isG=c=>c&&(c.kind==='group'||c.kind==='channel');
const adm=c=>c&&['owner','admin'].includes(c.role);

window._delLog=window._delLog||{};
window._recordDel=async function(m){
  try{
    if(!window.cur||!isG(cur)||!m)return;
    const row={chat_id:cur.id,msg_id:m.id,body:typeof m.body==='string'?m.body:JSON.stringify(m.body||{}),sender_id:m.sender_id,deleted_by:me.id,deleted_at:new Date().toISOString()};
    (window._delLog[cur.id]=window._delLog[cur.id]||[]).unshift(row);
    window._delLog[cur.id]=window._delLog[cur.id].slice(0,200);
    try{await SB.from('deleted_messages').insert({chat_id:row.chat_id,msg_id:row.msg_id,body:row.body,sender_id:row.sender_id,deleted_by:row.deleted_by})}catch(e){}
  }catch(e){}
};
window.grpDelLog=async function(){
  const c=cur;if(!isG(c)||!adm(c))return;
  sheet('Удалённые · 24 часа','<div id="gdl" class="sub" style="padding:12px">Загрузка…</div>');
  try{
    let rows=[];
    const r=await SB.from('deleted_messages').select('id,body,sender_id,deleted_by,deleted_at,msg_id,profiles:sender_id(name,username)').eq('chat_id',c.id).gte('deleted_at',new Date(Date.now()-864e5).toISOString()).order('deleted_at',{ascending:false}).limit(100);
    if(r.error)rows=(window._delLog[c.id])||[];
    else rows=r.data||[];
    const e=$('#gdl');if(!e)return;
    if(!rows.length){e.innerHTML='<div class="sub" style="padding:8px;white-space:normal">За последние 24 часа удалений нет.</div>';return}
    e.innerHTML=rows.map(x=>{
      const who=(x.profiles&&x.profiles.name)||'Участник';
      const body=typeof x.body==='string'?x.body:(x.body&&x.body.text)||'[медиа]';
      const t=x.deleted_at?new Date(x.deleted_at).toLocaleString('ru',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
      return `<div class="row" style="padding:8px 2px;align-items:flex-start"><div class="b"><div class="n">${esc(who)}</div><div class="sub" style="white-space:pre-wrap;color:var(--tx);opacity:.85">${esc(String(body).slice(0,280))}</div><div class="sub">${t}</div></div></div>`;
    }).join('');
  }catch(err){const e=$('#gdl');if(e)e.innerHTML='<div class="sub">Нужна таблица deleted_messages — выполните logos-del-log.sql</div>'}
};

window.editChannelMsg=async function(id,text){
  if(!cur||cur.kind!=='channel'||!adm(cur))return toast('Нет прав');
  const t=(text||'').trim();if(!t)return;
  try{
    let error=null;
    try{const r=await SB.rpc('edit_message',{mid:String(id),body:t});error=r.error}catch(e){error=e}
    if(error){
      const u=await SB.from('messages').update({body:t,edited_at:new Date().toISOString()}).eq('id',id).eq('chat_id',cur.id);
      if(u.error)return toast('Не удалось изменить');
    }
    const m=msgs.find(x=>x.id===id);if(m){m.body=t;m.edited=1;m.edited_at=new Date().toISOString()}
    drawMsgs();toast('Сообщение изменено');
  }catch(e){toast('Ошибка')}
};

if(typeof window.delMsg==='function'){
  const _d=window.delMsg;
  window.delMsg=async function(id){
    const m=msgs.find(x=>x.id===id);
    if(m)try{await _recordDel(m)}catch(e){}
    return _d.apply(this,arguments);
  };
}

/* --- create group/channel with avatar, desc, username, contact search --- */
if(typeof window.newGroup==='function'){
  window.gFilterContacts=function(q){
    const box=$('#gch_list');if(!box)return;
    const s=(q||'').toLowerCase().replace(/^@/,'').trim();
    const L=(contacts||[]).filter(p=>p&&(!s||((p.name||'')+' '+(p.username||'')).toLowerCase().includes(s)));
    box.innerHTML=L.length?L.map(p=>`<div class="row gp${GS.has(p.id)?' on':''}" onclick="gTog('${p.id}',this)">${av(p,40)}<div class="b"><div class="n">${esc(p.name)}</div><div class="sub">${at(p.username)}</div></div><i class="gck"></i></div>`).join(''):'<div class="sub" style="padding:12px">Никого не найдено</div>';
  };
  window.gPickAv=()=>{$('#gav_in')&&$('#gav_in').click()};
  let GAV=null;
  window.gAvChange=async function(f){
    if(!f)return;
    try{GAV=await img(f,320,320);const u=URL.createObjectURL(GAV);const el=$('#gav_prev');if(el){el.src=u;el.style.display='block'}const ph=$('#gav_ph');if(ph)ph.style.display='none'}catch(e){toast('Не удалось')}
  };
  window.newGroup=function(k){
    GK=k||'group';GS=new Set();GAV=null;
    const isCh=k==='channel';
    sheet(isCh?'Новый канал':'Новая группа',`
      <div class="seg" id="gseg"><button data-k="group" onclick="gKind('group')">Группа</button><button data-k="channel" onclick="gKind('channel')">Канал</button></div>
      <div style="display:flex;align-items:center;gap:14px;margin:8px 2px 12px">
        <div onclick="gPickAv()" style="width:72px;height:72px;border-radius:50%;background:var(--s3);display:grid;place-items:center;cursor:pointer;overflow:hidden;flex:none;border:1px solid #ffffff18">
          <img id="gav_prev" style="width:100%;height:100%;object-fit:cover;display:none"><span id="gav_ph" style="opacity:.5">${ic('image')}</span>
        </div>
        <div style="flex:1;min-width:0"><label class="fld" style="margin:0"><small>Название</small><input id="gnm" maxlength="60" placeholder="${isCh?'Название канала':'Например: Друзья'}"></label></div>
      </div>
      <input type="file" id="gav_in" accept="image/*" hidden onchange="gAvChange(this.files[0])">
      <div id="gun_wrap" style="display:${isCh?'':'none'}"><label class="fld"><small>Username канала</small><input id="gun" maxlength="32" placeholder="my_channel" oninput="this.value=this.value.replace(/[^a-zA-Z0-9_]/g,'').toLowerCase();var l=document.getElementById('glink');if(l)l.textContent=this.value||'…'"></label>
      <div class="sub" style="margin:-4px 2px 8px">Ссылка: logos.app/<span id="glink">…</span></div></div>
      <div id="gdesc_wrap"><label class="fld"><small>Описание</small><textarea id="gdesc" maxlength="300" rows="2" placeholder="Кратко о чём чат" style="resize:none;min-height:56px"></textarea></label></div>
      <div class="sub" id="gh" style="white-space:normal;margin:0 2px 8px"></div>
      <div id="gmem_wrap" style="display:${isCh?'none':''}">
        <div class="srch" style="padding:0 0 8px!important"><input id="gq" placeholder="Поиск контактов" oninput="gFilterContacts(this.value)"></div>
        <div class="gpl" id="gch_list">${(contacts&&contacts.length)?contacts.map(p=>`<div class="row gp" onclick="gTog('${p.id}',this)">${av(p,40)}<div class="b"><div class="n">${esc(p.name)}</div><div class="sub">${at(p.username)}</div></div><i class="gck"></i></div>`).join(''):'<div class="sub" style="padding:12px">Добавьте контакты или создайте пустой чат.</div>'}</div>
      </div>
      <button class="btn" id="gok" style="width:100%;margin-top:12px" onclick="gMake()">Создать</button>`);
    if(typeof gKind==='function')gKind(GK);
  };
  const _gk=window.gKind;
  window.gKind=function(k,el){
    if(_gk)_gk(k,el);else{GK=k}
    const un=$('#gun_wrap'),mem=$('#gmem_wrap');
    if(un)un.style.display=k==='channel'?'':'none';
    if(mem)mem.style.display=k==='group'?'':'none';
  };
  window.gMake=async function(){
    const t=($('#gnm')&&$('#gnm').value||'').trim();if(!t)return toast('Введите название');
    const un=($('#gun')&&$('#gun').value||'').trim().toLowerCase();
    const desc=($('#gdesc')&&$('#gdesc').value||'').trim();
    if(GK==='channel'&&un&&(un.length<5||!/^[a-z0-9_]{5,32}$/.test(un)))return toast('Username: 5–32 символа (a-z, 0-9, _)');
    const b=$('#gok');if(b){b.disabled=true;b.textContent='Создаём…'}
    try{
      let avatar_url=null;
      if(GAV){try{avatar_url=await up('avatars',GAV)}catch(e){}}
      const payload={k:GK,t,members:[...GS]};
      if(desc)payload.d=desc;
      if(GK==='channel'&&un)payload.u=un;
      if(avatar_url)payload.a=avatar_url;
      let data,error;
      try{const r=await SB.rpc('create_group',payload);data=r.data;error=r.error}catch(e){error=e}
      if(error){
        const r2=await SB.rpc('create_group',{k:GK,t,members:[...GS]});
        if(r2.error){if(b){b.disabled=false;b.textContent='Создать'}return toast('Запустите logos-update9.sql в Supabase')}
        if(avatar_url&&r2.data){try{await SB.rpc('set_chat_avatar',{chat:String(r2.data),url:avatar_url})}catch(e){}}
        if(desc&&r2.data){try{await SB.from('chats').update({description:desc}).eq('id',r2.data)}catch(e){}}
        if(un&&r2.data){try{await SB.from('chats').update({username:un}).eq('id',r2.data)}catch(e){}}
        closeSheet();await loadChats();go('chats');openChat(r2.data);return;
      }
      closeSheet();await loadChats();go('chats');openChat(data);
    }catch(e){if(b){b.disabled=false;b.textContent='Создать'}toast('Ошибка создания')}
  };
}

/* grpInfo: deleted log + avatar change for owner/admin */
const _gi=window.grpInfo;
if(typeof _gi==='function'){
  window.grpInfo=async function(){
    await _gi.apply(this,arguments);
    try{
      const box=document.querySelector('#sh .xch-w')||document.querySelector('.shc .xch-w');
      if(!box||!cur||!adm(cur))return;
      if(!box.querySelector('[data-lg-dellog]')){
        const b=document.createElement('button');
        b.className='xch';b.setAttribute('data-lg-dellog','1');
        b.innerHTML=(ic('trash')||'')+'Удалённые сообщения';
        b.onclick=()=>grpDelLog();
        box.appendChild(b);
      }
      if(!box.querySelector('[data-lg-av]') && typeof chAv==='function'){
        const lab=document.createElement('label');
        lab.className='xch';lab.setAttribute('data-lg-av','1');
        lab.style.cursor='pointer';
        lab.innerHTML=(ic('image')||'')+'Фото '+(cur.kind==='channel'?'канала':'группы')+'<input type="file" accept="image/*" hidden onchange="chAv(this.files[0])">';
        box.insertBefore(lab, box.firstChild);
      }
    }catch(e){}
  };
}

if(!document.getElementById('lg-edmark')){
  const s=document.createElement('style');s.id='lg-edmark';
  s.textContent='.edmark{font-size:11px;opacity:.55;font-weight:500;margin-right:2px}';
  document.head.appendChild(s);
}

/* edited mark + edit action in channel msg menu */
(function(){
  if(window.__lgExtraMsg)return;window.__lgExtraMsg=1;
  const _mh = window.mh || (typeof mh==='function'?mh:null);
  if(typeof _mh==='function'){
    window.mh = function(m,i){
      let h = _mh(m,i);
      if((m.edited||m.edited_at) && h.indexOf('edmark')<0){
        h = h.replace(/<time>/,'<time><span class="edmark">изм.</span>');
      }
      return h;
    };
  }
  const _mm = window.msgMenu;
  if(typeof _mm==='function'){
    window.msgMenu = function(i){
      _mm(i);
      try{
        const m = msgs[i];
        if(!m || !cur || cur.kind!=='channel' || !['owner','admin'].includes(cur.role)) return;
        if(m.kind && m.kind!=='text') return;
        const dlg = document.querySelector('.dlg');
        if(!dlg || dlg.querySelector('[data-a="e"]')) return;
        const delBtn = dlg.querySelector('[data-a="d"]');
        const btn = document.createElement('button');
        btn.className = 'b2 mi';
        btn.dataset.a = 'e';
        btn.innerHTML = (typeof ic==='function'?ic('pencil'):'')+'Изменить';
        btn.onclick = function(){
          dlg.remove();
          const t = prompt('Изменить сообщение', typeof m.body==='string'?m.body:(m.body&&m.body.text)||'');
          if(t!=null && t.trim()) editChannelMsg(m.id, t.trim());
        };
        if(delBtn) delBtn.parentNode.insertBefore(btn, delBtn);
        else dlg.querySelector('div').appendChild(btn);
      }catch(e){}
    };
  }
})();

/* light perf: throttle list redraw on rapid updates */
(function(){
  if(window.__lgPerf)return;window.__lgPerf=1;
  try{
    if(typeof drawList==='function'){
      const _dl=drawList;let t=0;
      window.drawList=function(){
        if(t)return;t=1;
        requestAnimationFrame(function(){t=0;_dl()});
      };
    }
  }catch(e){}
})();

console.log('[Logos] groups/channels patch loaded');
})();
