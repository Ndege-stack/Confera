const base = "https://kabuniv.direct.quickconnect.to:2025";
const id = "z5pqNThJi";

async function login() {
  const r = await fetch(
    `${base}/sharing/webapi/entry.cgi?${new URLSearchParams({
      api: "SYNO.Core.Sharing.Login",
      version: "1",
      method: "login",
      sharing_id: id,
    })}`,
  );
  const j = await r.json();
  return { sid: j.data?.sharing_sid, cookie: `sharing_sid=${j.data?.sharing_sid}` };
}

async function tryApi(cookie, sid, path, params) {
  const full = { sharing_sid: sid, sharing_id: id, ...params };
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(full).map(([k, v]) => [k, String(v)])),
  );
  const url = `${base}${path}?${qs}`;
  const r = await fetch(url, { headers: { cookie, "User-Agent": "Mozilla/5.0" } });
  const text = await r.text();
  return { url, text: text.slice(0, 300) };
}

const { sid, cookie } = await login();
console.log("sid", sid);

const attempts = [
  ["/sharing/webapi/entry.cgi", { api: "SYNO.FB.File", version: "1", method: "list", folder_path: '""', offset: "0", limit: "20" }],
  ["/sharing/webapi/entry.cgi", { api: "SYNO.FB.File", version: "2", method: "list", path: "/", offset: "0", limit: "20" }],
  ["/sharing/webapi/entry.cgi", { api: "SYNO.FB.Sharing", version: "1", method: "list", offset: "0", limit: "20" }],
  ["/sharing/webapi/entry.cgi", { api: "SYNO.Core.Sharing", version: "2", method: "list", offset: "0", limit: "20" }],
  ["/sharing/webapi/file_share.cgi", { api: "SYNO.FB.File", version: "1", method: "list", folder_path: '""', offset: "0", limit: "20" }],
  ["/sharing/webapi/file_share.cgi", { api: "SYNO.FileStation.List", version: "2", method: "list", folder_path: '"/"', offset: "0", limit: "20" }],
];

for (const [path, params] of attempts) {
  const res = await tryApi(cookie, sid, path, params);
  console.log("\n", params.api, params.method, "=>", res.text);
}

// Query API info
const info = await tryApi(cookie, sid, "/sharing/webapi/query.cgi", {
  api: "SYNO.API.Info",
  version: "1",
  method: "query",
  query: "SYNO.FB.File,SYNO.Core.Sharing,SYNO.FileStation.List,SYNO.FB.Sharing",
});
console.log("\nAPI info:", info.text);
