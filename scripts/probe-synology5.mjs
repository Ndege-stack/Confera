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

const infoRes = await fetch(
  `${base}/sharing/webapi/query.cgi?${new URLSearchParams({
    api: "SYNO.API.Info",
    version: "1",
    method: "query",
    query: "all",
  })}`,
  { headers: { cookie } },
);
const info = await infoRes.json();
const apis = Object.keys(info.data || {}).filter((k) => k.includes("Sharing") || k.includes("File"));
console.log("sharing/file apis:", apis.join(", "));

async function post(params) {
  const r = await fetch(`${base}/sharing/webapi/entry.cgi`, {
    method: "POST",
    headers: {
      cookie,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
    body: new URLSearchParams({ sharing_id: id, sharing_sid: sid, ...params }),
  });
  return r.json();
}

const methods = ["list", "get", "enum", "enumerate", "browse"];
for (const method of methods) {
  const j = await post({
    api: "SYNO.Core.Sharing",
    version: "1",
    method,
    offset: "0",
    limit: "20",
  });
  if (j.success) console.log("Core.Sharing", method, JSON.stringify(j).slice(0, 500));
  else console.log("Core.Sharing", method, j.error?.code);
}

const fs = await post({
  api: "SYNO.FileStation.List",
  version: "2",
  method: "list",
  folder_path: '""',
  offset: "0",
  limit: "20",
});
console.log("FileStation POST", fs.success ? JSON.stringify(fs).slice(0, 800) : fs.error);
