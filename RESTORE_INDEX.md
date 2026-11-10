# Restore index.html

The commit that set index.html to "PLACEHOLDER" must be reverted.

Good commit SHA: 251da3dd2b07866883176cd7bd307f623d330b58

In GitHub: Code → History → find that commit → Browse files → download index.html → replace.

Or: git revert the bad commit.

After restore, add near the end of index.html (before </body>):

<script src="logos-groups-patch.js" defer></script>

Then run logos-del-log.sql in Supabase SQL editor (safe to re-run).

Features in the patch:
- Create group/channel with avatar, description, channel username + live link
- Contact search when creating group
- Deleted messages journal (24h) for owner/admin
- Channel admins can edit published messages + "изм." mark
- Hooks delMsg to record into journal
