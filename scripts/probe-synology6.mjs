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
const login = await loginRes.json();
const sid = login.data.sharing_sid;
const cookie = `sharing_sid=${sid}`;

async function call(params, post = false) {
  const all = { sharing_id: id, sharing_sid: sid, ...params };
  if (post) {
    const r = await fetch(`${base}/sharing/webapi/entry.cgi`, {
      method: "POST",
      headers: { cookie, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Object.fromEntries(Object.entries(all).map(([k, v]) => [k, String(v)]))),
    });
    return r.json();
  }
  const r = await fetch(
    `${base}/sharing/webapi/entry.cgi?${new URLSearchParams(Object.fromEntries(Object.entries(all).map(([k, v]) => [k, String(v)])))}`,
    { headers: { cookie } },
  );
  return r.json();
}

// Query FolderSharing API info
const info = await fetch(
  `${base}/sharing/webapi/query.cgi?${new URLSearchParams({
    api: "SYNO.API.Info",
    version: "1",
    method: "query",
    query: "SYNO.FolderSharing.List,SYNO.FolderSharing.Thumb,SYNO.FolderSharing.Download",
  })}`,
  { headers: { cookie } },
).then((r) => r.json());
console.log("API info", JSON.stringify(info.data, null, 2));

const listAttempts = [
  { api: "SYNO.FolderSharing.List", version: "1", method: "list", offset: "0", limit: "50" },
  { api: "SYNO.FolderSharing.List", version: "2", method: "list", offset: "0", limit: "50" },
  { api: "SYNO.FolderSharing.List", version: "1", method: "list", folder_path: '""', offset: "0", limit: "50" },
  { api: "SYNO.FolderSharing.List", version: "1", method: "list", path: "/", offset: "0", limit: "50" },
];

for (const params of listAttempts) {
  const get = await call(params, false);
  console.log("GET", params.version, params.method, get.success ? "OK" : get.error, get.success ? JSON.stringify(get).slice(0, 600) : "");
  const post = await call(params, true);
  console.log("POST", params.version, params.method, post.success ? "OK" : post.error, post.success ? JSON.stringify(post).slice(0, 600) : "");
}
