const base = "https://kabuniv.direct.quickconnect.to:2025";
const id = "z5pqNThJi";
const quotedId = `"${id}"`;

const loginRes = await fetch(
  `${base}/sharing/webapi/entry.cgi?${new URLSearchParams({
    api: "SYNO.Core.Sharing.Login",
    version: "1",
    method: "login",
    sharing_id: quotedId,
  })}`,
);
let login = await loginRes.json();
console.log("login quoted", login.success, login.error);

if (!login.success) {
  const loginRes2 = await fetch(
    `${base}/sharing/webapi/entry.cgi?${new URLSearchParams({
      api: "SYNO.Core.Sharing.Login",
      version: "1",
      method: "login",
      sharing_id: id,
    })}`,
  );
  login = await loginRes2.json();
}
const sid = login.data.sharing_sid;
const cookie = `sharing_sid=${sid}`;

async function get(params) {
  const r = await fetch(
    `${base}/sharing/webapi/entry.cgi?${new URLSearchParams(Object.fromEntries(Object.entries({ sharing_sid: sid, ...params }).map(([k, v]) => [k, String(v)])))}`,
    { headers: { cookie } },
  );
  return r.json();
}

const init = await get({
  api: "SYNO.Core.Sharing.Initdata",
  version: "1",
  method: "get",
  sharing_id: quotedId,
});
console.log("initdata quoted", init.success, init.error, init.data ? Object.keys(init.data) : "");

const init2 = await get({
  api: "SYNO.Core.Sharing.Initdata",
  version: "1",
  method: "get",
  sharing_id: id,
});
console.log("initdata plain", init2.success, init2.error, init2.data ? JSON.stringify(init2.data).slice(0, 400) : "");

const session = await get({
  api: "SYNO.Core.Sharing.Session",
  version: "1",
  method: "get",
  sharing_id: quotedId,
  sharing_status: '"none"',
});
console.log("session", session.success, session.error);

const list = await get({
  api: "SYNO.FolderSharing.List",
  version: "2",
  method: "list",
  sharing_id: quotedId,
  offset: "0",
  limit: "20",
});
console.log("folder list quoted", list.success, list.error, list.data ? JSON.stringify(list.data).slice(0, 800) : "");

const list2 = await get({
  api: "SYNO.FolderSharing.List",
  version: "2",
  method: "list",
  offset: "0",
  limit: "20",
});
console.log("folder list no id", list2.success, list2.error, list2.data ? JSON.stringify(list2.data).slice(0, 800) : "");
