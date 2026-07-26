const base = "https://kabuniv.direct.quickconnect.to:2025";
const id = "z5pqNThJi";

const login = await (
  await fetch(
    `${base}/sharing/webapi/entry.cgi?${new URLSearchParams({
      api: "SYNO.Core.Sharing.Login",
      version: "1",
      method: "login",
      sharing_id: id,
    })}`,
  )
).json();
const sid = login.data.sharing_sid;
const cookie = `sharing_sid=${sid}`;

const extraKeys = ["id", "link_id", "sharelink_id", "folder_id", "node_id", "path", "folder_path", "file_path"];
for (const key of extraKeys) {
  const params = new URLSearchParams({
    api: "SYNO.FolderSharing.List",
    version: "2",
    method: "list",
    sharing_sid: sid,
    offset: "0",
    limit: "10",
    [key]: key.includes("path") ? '""' : id,
  });
  const r = await fetch(`${base}/sharing/webapi/entry.cgi?${params}`, { headers: { cookie } });
  const j = await r.json();
  if (j.success) console.log("SUCCESS", key, JSON.stringify(j).slice(0, 500));
  else console.log(key, j.error?.code);
}
