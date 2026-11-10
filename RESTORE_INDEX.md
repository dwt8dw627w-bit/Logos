# Restore index.html

**Сейчас `index.html` на main — PLACEHOLDER.** Рабочий файл нужно вернуть.

## Быстрый способ
1. Открой commit: https://github.com/dwt8dw627w-bit/Logos/commit/251da3dd2b07866883176cd7bd307f623d330b58  
2. Browse files → скачай `index.html`  
3. Замени текущий PLACEHOLDER этим файлом  
4. В конец `index.html` (перед `</body>`) добавь:

```html
<script src="logos-groups-patch.js" defer></script>
```

5. В Supabase SQL Editor выполни `logos-del-log.sql` (можно повторно).

## Через git
```bash
git checkout 251da3dd2b07866883176cd7bd307f623d330b58 -- index.html
# затем вставь script tag и commit
```

## Что уже в `logos-groups-patch.js`
- Создание группы/канала: название, аватар, описание, username канала + ссылка, поиск контактов
- Журнал удалённых сообщений (24ч) для owner/admin
- Редактирование постов канала owner/admin + отметка «изм.»
- Смена аватара группы/канала из карточки чата (grpInfo)
- `leave_chat` на сервере передаёт владение admin → затем любому участнику
- Лёгкий throttle `drawList` через rAF

После restore открой приложение и проверь: «+» → группа/канал, выход владельца, удаление сообщения, правка поста канала.
