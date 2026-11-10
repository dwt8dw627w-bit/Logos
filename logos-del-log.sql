-- Logos: deleted messages journal (24h) + optional edit support
-- Run in Supabase SQL editor. Safe to re-run.

create table if not exists public.deleted_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  msg_id uuid,
  body text,
  sender_id uuid references public.profiles(id) on delete set null,
  deleted_by uuid references public.profiles(id) on delete set null,
  deleted_at timestamptz not null default now()
);

create index if not exists deleted_messages_chat_time on public.deleted_messages (chat_id, deleted_at desc);

alter table public.deleted_messages enable row level security;

drop policy if exists dm_select_admins on public.deleted_messages;
create policy dm_select_admins on public.deleted_messages for select using (
  exists (
    select 1 from public.chat_members cm
    where cm.chat_id = deleted_messages.chat_id
      and cm.user_id = auth.uid()
      and cm.role in ('owner','admin')
  )
);

drop policy if exists dm_insert_members on public.deleted_messages;
create policy dm_insert_members on public.deleted_messages for insert with check (
  deleted_by = auth.uid()
  and exists (
    select 1 from public.chat_members cm
    where cm.chat_id = deleted_messages.chat_id and cm.user_id = auth.uid()
  )
);

create or replace function public.cleanup_deleted_messages()
returns void language sql security definer as $$
  delete from public.deleted_messages where deleted_at < now() - interval '24 hours';
$$;

do $$ begin
  alter table public.messages add column if not exists edited_at timestamptz;
exception when others then null;
end $$;

create or replace function public.edit_message(mid uuid, body text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  k text;
  my_role text;
begin
  select m.chat_id, c.kind into cid, k
  from messages m join chats c on c.id = m.chat_id
  where m.id = mid;
  if cid is null then raise exception 'not found'; end if;
  select role into my_role from chat_members where chat_id = cid and user_id = auth.uid();
  if k = 'channel' then
    if my_role not in ('owner','admin') then raise exception 'no permission'; end if;
  else
    if not exists(select 1 from messages where id = mid and sender_id = auth.uid()) and my_role not in ('owner','admin') then
      raise exception 'no permission';
    end if;
  end if;
  update messages set body = edit_message.body, edited_at = now() where id = mid;
end;
$$;

grant execute on function public.edit_message(uuid, text) to authenticated;

create or replace function public.leave_chat(cid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_role text;
  new_owner uuid;
begin
  select role into my_role from chat_members where chat_id = cid and user_id = auth.uid();
  if my_role is null then return; end if;

  if my_role = 'owner' then
    select user_id into new_owner from chat_members
      where chat_id = cid and user_id <> auth.uid() and role = 'admin'
      order by joined_at nulls last limit 1;
    if new_owner is null then
      select user_id into new_owner from chat_members
        where chat_id = cid and user_id <> auth.uid()
        order by joined_at nulls last limit 1;
    end if;
    if new_owner is not null then
      update chat_members set role = 'owner' where chat_id = cid and user_id = new_owner;
    end if;
  end if;

  delete from chat_members where chat_id = cid and user_id = auth.uid();
end;
$$;

grant execute on function public.leave_chat(uuid) to authenticated;
