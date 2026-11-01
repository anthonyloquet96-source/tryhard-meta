// Envoie les données privées du coach dans le bucket privé « coach-data » de Supabase Storage (voir worker/data.mjs) :
// benchmarks.json, champstats.json, builds.json (coach/cache, copiés dans worker/ par la routine des repères) et champrefs.json
// (coach/champ-references.mjs), plus un manifeste (date, empreintes, statut). À relancer après chaque recalcul des repères ;
// le Worker les relit dans le quart d'heure, sans redéploiement.
// Usage : node --env-file=../.env put-data.mjs   (depuis worker/)   ou   node --env-file=.env worker/put-data.mjs

import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FILES } from "./data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const url = process.env.SUPABASE_URL?.trim(), key = process.env.SUPABASE_SERVICE_KEY?.trim();
if (!url || !key) throw new Error("SUPABASE_URL et SUPABASE_SERVICE_KEY sont nécessaires (.env)");
const headers = { apikey: key, Authorization: `Bearer ${key}` };
const put = async (name, body) => {
  const r = await fetch(`${url}/storage/v1/object/coach-data/${name}`, { method: "POST", headers: { ...headers, "Content-Type": "application/json", "x-upsert": "true" }, body });
  if (!r.ok) throw new Error(`${name} : HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
};
const manifest = { at: new Date().toISOString(), source_authorization: "private_research", published: false, files: {} };
for (const f of FILES) {
  const bytes = await readFile(join(here, `${f}.json`));
  JSON.parse(bytes); // fichier valide avant envoi
  await put(`${f}.json`, bytes);
  manifest.files[f] = { bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex").slice(0, 16) };
  console.log(`${f}.json envoyé (${Math.round(bytes.length / 1024)} ko)`);
}
await put("manifest.json", JSON.stringify(manifest));
console.log("manifeste envoyé :", manifest.at, "(published: false)");
