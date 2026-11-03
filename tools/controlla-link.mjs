// Controlla i link esterni del sito e dei documenti, compresi quelli che i runner di GitHub non raggiungono.
// Va lanciato da qui, dall'Italia: node tools/controlla-link.mjs
// Esce con errore se un link è sparito (404, 410, dominio inesistente, connessione rifiutata). Chi rifiuta i controlli
// automatici (401, 403, 429) o non risponde in tempo viene solo segnalato.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : /\.html$/.test(name) ? [path] : []; });
const files = [...walk("docs"), "README.md", "CONDIZIONI.md", "PRIVACY.md"];
const found = new Map();
for (const file of files) for (const match of readFileSync(file, "utf8").matchAll(/https?:\/\/[^\s"'<>)\]]+/g)) {
  const url = match[0].replace(/&amp;/g, "&").replace(/[.,;:]+$/, "");
  if (/github\.io\/jarvis-releases|releases\/latest\/download|fonts\.g|w3\.org|\$\{/.test(url)) continue;
  if (!found.has(url)) found.set(url, file);
}
const ask = async (url) => {
  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(25_000), headers: { "user-agent": "Mozilla/5.0", accept: "*/*" } });
      if (response.ok || method === "GET") return response.status;
    } catch (error) { if (method === "GET") return String(error.cause?.code ?? error.name); }
  }
};
const urls = [...found.keys()], gone = [], unsure = [];
for (let at = 0; at < urls.length; at += 8) await Promise.all(urls.slice(at, at + 8).map(async (url) => {
  const result = await ask(url);
  if (result === 404 || result === 410 || ["ENOTFOUND", "ECONNREFUSED", "ERR_TLS_CERT_ALTNAME_INVALID", "CERT_HAS_EXPIRED"].includes(result)) gone.push(`${result}  ${url}  (${found.get(url)})`);
  else if (typeof result !== "number" || result >= 400) unsure.push(`${result}  ${url}  (${found.get(url)})`);
}));
console.log(`${urls.length} link controllati.`);
if (unsure.length) console.log(`\nDa guardare (rifiutano i controlli o non rispondono):\n${unsure.sort().join("\n")}`);
if (gone.length) { console.log(`\nSpariti, da sostituire:\n${gone.sort().join("\n")}`); process.exit(1); }
