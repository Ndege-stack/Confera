const base = "https://kabuniv.direct.quickconnect.to:2025";
const id = "z5pqNThJi";

async function call(params, cookie, post = false) {
  const url = `${base}/sharing/webapi/entry.cgi`;
  const r = await fetch(url, {
    method: post ? "POST" : "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      ...(cookie ? { cookie } : {}),
    },
    body: post ? new URLSearchParams(params) : undefined,
    ...(post ? {} : { redirect: "follow" }),
  });
  const finalUrl = post ? url : r.url;
  if (!post) {
    const getUrl = `${url}?${new URLSearchParams(params)}`;
    const r2 = await fetch(getUrl, {
      headers: { "User-Agent": "Mozilla/5.0", ...(cookie ? { cookie } : {}) },
    });
    return { json: await r2.json(), url: getUrl };
  }
  return { json: await r.json(), url: finalUrl };
}

const loginRes = await call({
  api: "SYNO.Core.Sharing.Login",
  version: "1",
  method: "login",
  sharing_id: id,
});
const sid = loginRes.json.data?.sharing_sid;
const cookie = `sharing_sid=${sid}`;
console.log("login", loginRes.json);

for (const status of ["valid", "none"]) {
  const session = await call(
    {
      api: "SYNO.Core.Sharing.Session",
      version: "1",
      method: "get",
      sharing_id: id,
      sharing_status: status,
    },
    cookie,
  );
  console.log("session", status, session.json.success, session.json.error);
}

const tries = [
  { api: "SYNO.Core.Sharing.Initdata", version: "1", method: "get", sharing_id: id },
  { api: "SYNO.Core.Sharing", version: "1", method: "list", sharing_id: id, offset: "0", limit: "200" },
];

for (const params of tries) {
  const get = await call({ ...params, sharing_sid: sid }, cookie, false);
  console.log("GET", params.method, get.json.success, get.json.error || Object.keys(get.json.data || {}));
  if (get.json.success) console.log(JSON.stringify(get.json, null, 2).slice(0, 4000));

  const post = await call({ ...params, sharing_sid: sid }, cookie, true);
  console.log("POST", params.method, post.json.success, post.json.error || Object.keys(post.json.data || {}));
  if (post.json.success) console.log(JSON.stringify(post.json, null, 2).slice(0, 4000));
}

// file_share.cgi path
const fsUrl = `${base}/sharing/webapi/file_share.cgi?${new URLSearchParams({
  api: "SYNO.FileStation.List",
  version: "2",
  method: "list",
  sharing_id: id,
  sharing_sid: sid,
  folder_path: '"/"',
  offset: "0",
  limit: "50",
})}`;
const fs = await fetch(fsUrl, { headers: { "User-Agent": "Mozilla/5.0", cookie } });
console.log("file_share", await fs.text());
