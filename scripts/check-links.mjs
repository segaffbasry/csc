// Checks every link on the rendered homepage. cscscreeding.co.uk has no usable sitemap (sitemap.xml is an empty
// <urlset>) and answers unknown paths with a 301 to /oh-no, so a link only passes when it follows through to a 200
// that is not /oh-no. Other external URLs must answer 2xx/3xx. Every outbound link must open in a new tab with
// rel="noopener"; "#" links must point at an element on the page. Usage: node scripts/check-links.mjs [url]
const page = process.argv[2] ?? "http://127.0.0.1:3044/";
const UA = { "user-agent": "Mozilla/5.0 (Macintosh) Chrome/130" };
const html = await (await fetch(page)).text();
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const problems = [], seen = new Map();
for (const a of anchors) {
  const href = (a.match(/href="([^"]*)"/) ?? [])[1];
  if (href === undefined) continue;
  const h = href.replace(/&amp;/g, "&");
  if (h.startsWith("#")) { if (h === "#") problems.push("bare # link"); else if (h !== "#top" && !ids.has(h.slice(1))) problems.push(`missing anchor ${h}`); seen.set(h, "anchor"); continue; }
  if (h.startsWith("tel:") || h.startsWith("mailto:")) { seen.set(h, "ok"); continue; }
  if (!/target="_blank"/.test(a) || !/rel="noopener"/.test(a)) problems.push(`not new-tab/noopener: ${h}`);
  if (!seen.has(h)) seen.set(h, null);
}
for (const h of seen.keys()) {
  if (seen.get(h)) continue;
  let status;
  try {
    const r = await fetch(h, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
    status = r.status;
    if (new URL(r.url).pathname === "/oh-no") status = "oh-no";
  } catch (e) { status = "error " + e.message; }
  seen.set(h, status);
  if (!(typeof status === "number" && status < 400)) problems.push(`${status}: ${h}`);
}
console.log(`${seen.size} unique destinations, ${anchors.length} links`);
for (const [h, s] of seen) console.log(String(s).padEnd(7), h);
console.log(problems.length ? "\nPROBLEMS\n" + problems.join("\n") : "\nAll links OK");
