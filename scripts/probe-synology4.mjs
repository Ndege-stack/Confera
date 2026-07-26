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

const pages = [
  `${base}/sharing/${id}`,
  `${base}/sharing/${id}/`,
  `${base}/sharing/webman/sharing.cgi?sharing_id=${id}`,
];

for (const url of pages) {
  const r = await fetch(url, {
    headers: { cookie, "User-Agent": "Mozilla/5.0", Accept: "text/html" },
    redirect: "follow",
  });
  const html = await r.text();
  console.log("\nURL", url, "status", r.status, "len", html.length);
  const hits = [
    ...html.matchAll(/\.(jpg|jpeg|png|webp|gif)/gi),
  ].slice(0, 5);
  console.log("image ext hits", hits.length);
  const apiHits = html.match(/SYNO\.[A-Za-z.]+/g)?.slice(0, 20);
  console.log("api refs", apiHits);
  const jsonBlocks = html.match(/\{[^{}]*"files"[^{}]*\}/g)?.slice(0, 3);
  console.log("json blocks", jsonBlocks);
}

// Try download endpoint pattern
const dl = await fetch(`${base}/sharing/${id}/download`, {
  headers: { cookie },
  redirect: "manual",
});
console.log("\ndownload redirect", dl.status, dl.headers.get("location"));
