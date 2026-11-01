// Génère coach/final-items.mjs : objets complets de la Faille (pas de suite, au moins 2 000 or, hors bottes) d'après Data Dragon.
// Sert au « premier grand objet » de coach/metrics.mjs. Module plutôt que JSON pour être importé tel quel par Node et par le
// Worker. À relancer à chaque gros patch d'objets : node coach/final-items-build.mjs

import { writeFile } from "node:fs/promises";

const [version] = await fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(r => r.json());
const { data } = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`).then(r => r.json());
const ids = Object.entries(data)
  .filter(([, it]) => !it.into?.length && it.gold.total >= 2000 && !it.tags?.includes("Boots") && it.maps?.["11"] && it.gold.purchasable !== false)
  .map(([id]) => Number(id)).sort((a, b) => a - b);
await writeFile("coach/final-items.mjs", `// Généré par coach/final-items-build.mjs (Data Dragon ${version}, ${new Date().toISOString().slice(0, 10)}) : objets complets de la Faille
// (pas de suite, au moins 2 000 or, hors bottes). « Premier grand objet » dans coach/metrics.mjs. Ne pas éditer à la main.
export const FINAL_ITEMS_VERSION = "${version}";
export const FINAL_ITEMS = new Set(${JSON.stringify(ids)});
`);
console.log(`coach/final-items.mjs : ${ids.length} objets complets (Data Dragon ${version})`);
