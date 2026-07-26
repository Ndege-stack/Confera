const base = "https://kabuniv.direct.quickconnect.to:2025";
const id = "z5pqNThJi";

const loginRes = await fetch(
  `${base}/sharing/webapi/entry.cgi?${new URLSearchParams({
    api: "SYNO.Core.Sharing.Login",
    version: "1",
    method: "login",
    sharing_id: id,
  })}`,
);
console.log("cookies", loginRes.headers.getSetCookie?.());
const login = await loginRes.json();
const sid = login.data.sharing_sid;
const cookie = `sharing_sid=${sid}`;

const folderPaths = ['""', '"/"', "/", "Annual Health Conference (SMHS)"];
for (const fp of folderPaths) {
  const params = new URLSearchParams({
    api: "SYNO.FileStation.List",
    version: "2",
    method: "list",
    sharing_id: id,
    sharing_sid: sid,
    folder_path: fp,
    offset: "0",
    limit: "20",
    additional: '["real_path","size","type"]',
  });
  const r = await fetch(`${base}/sharing/webapi/entry.cgi?${params}`, {
    headers: { cookie, "User-Agent": "Mozilla/5.0" },
  });
  console.log("fp", fp, await r.text());
}

// Initdata variations
for (const extra of [{}, { sharing_sid: sid }]) {
  const params = new URLSearchParams({
    api: "SYNO.Core.Sharing.Initdata",
    version: "1",
    method: "get",
    sharing_id: id,
    ...extra,
  });
  const r = await fetch(`${base}/sharing/webapi/entry.cgi?${params}`, {
    headers: { cookie, "User-Agent": "Mozilla/5.0" },
  });
  console.log("initdata", JSON.stringify(extra), await r.text());
}

// Core.Sharing list v1
const listParams = new URLSearchParams({
  api: "SYNO.Core.Sharing",
  version: "1",
  method: "list",
  sharing_id: id,
  sharing_sid: sid,
  offset: "0",
  limit: "50",
});
const listRes = await fetch(`${base}/sharing/webapi/entry.cgi?${listParams}`, {
  headers: { cookie, "User-Agent": "Mozilla/5.0" },
});
console.log("list v1", await listRes.text());
