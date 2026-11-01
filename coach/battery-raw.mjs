// Récolte brute pour mesurer la stabilité intra-joueur de nouveaux indicateurs (brainstorm objectifs du 01/11/2026).
// La batterie (coach/battery.mjs) ne garde que nos métriques calculées : impossible d'y tester un indicateur nouveau. Ici,
// pour chaque palier Fer → Challenger, des joueurs tirés au sort (tous postes), leurs 30 dernières ranked avec timeline,
// anonymisées comme dans coach/timelines.mjs (puuid → p1…p10, aucun nom), rangées par joueur dans
// coach/cache/battery-raw/<palier>-<n>/ avec l'alias du joueur suivi (meta.json). Clé de développement : données privées,
// jamais publiées (coach/cache/ est ignoré par git). Reprise possible : un dossier déjà complet est sauté.
// Usage : node --env-file=.env coach/battery-raw.mjs [--par-palier 7] [--parties 30]

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { createRiot } from "./review.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const PER_TIER = arg("--par-palier", 7), GAMES = arg("--parties", 30), MIN_GAMES = 20;
const TIERS = [["IRON", "II"], ["BRONZE", "II"], ["SILVER", "II"], ["GOLD", "II"], ["PLATINUM", "II"], ["EMERALD", "II"], ["DIAMOND", "II"], ["MASTER", "I"], ["GRANDMASTER", "I"], ["CHALLENGER", "I"]];
const OUT = "coach/cache/battery-raw";
const hash = s => createHash("sha256").update(s).digest("hex").slice(0, 12);

async function playersOf(riot, tier, division) {
  const apex = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier);
  const url = apex ? `https://euw1.api.riotgames.com/lol/league/v4/${tier.toLowerCase()}leagues/by-queue/RANKED_SOLO_5x5` : `https://euw1.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${tier}/${division}?page=${1 + Math.floor(Math.random() * 5)}`;
  const r = await riot(url);
  return (apex ? r.entries : r).filter(e => e.puuid).sort(() => Math.random() - 0.5);
}

// Même anonymisation que coach/timelines.mjs : alias par participant, aucun nom ni identifiant de compte
function anonymize(match, timeline, me) {
  const alias = new Map(match.info.participants.map(p => [p.puuid, `p${p.participantId}`]));
  const m = structuredClone(match), t = structuredClone(timeline);
  m.metadata.participants = m.metadata.participants.map(x => alias.get(x) || "p?");
  for (const p of m.info.participants) { p.puuid = alias.get(p.puuid); for (const k of ["riotIdGameName", "riotIdTagline", "summonerName", "summonerId", "profileIcon"]) delete p[k]; }
  t.metadata.participants = t.metadata.participants.map(x => alias.get(x) || "p?");
  for (const p of t.info.participants) p.puuid = alias.get(p.puuid);
  return { alias: alias.get(me), match: m, timeline: t };
}

async function main() {
  const key = process.env.RIOT_API_KEY?.trim();
  if (!key) throw new Error("RIOT_API_KEY absente");
  const riot = createRiot(key);
  await mkdir(OUT, { recursive: true });
  const dirs = new Set(await readdir(OUT));
  let requests = 0;
  const call = url => { requests++; return riot(url); };
  for (const [tier, div] of TIERS) {
    let n = [...dirs].filter(d => d.startsWith(tier + "-")).length;
    if (n >= PER_TIER) continue;
    for (const e of await playersOf(riot, tier, div)) {
      if (n >= PER_TIER) break;
      try {
        const ids = await call(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${e.puuid}/ids?queue=420&count=${GAMES}`);
        if (ids.length < MIN_GAMES) continue;
        const dir = `${OUT}/${tier}-${n}`;
        await mkdir(dir, { recursive: true });
        let kept = 0, alias = null;
        for (const id of ids) {
          try {
            const [m, tl] = await Promise.all([call(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}`), call(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}/timeline`)]);
            if (!m?.info?.participants?.some(p => p.puuid === e.puuid) || !tl?.info?.frames?.length) continue;
            const a = anonymize(m, tl, e.puuid);
            alias ||= a.alias;
            await writeFile(`${dir}/${hash(id)}.json.gz`, gzipSync(JSON.stringify({ tier, me: a.alias, match: a.match, timeline: a.timeline })));
            kept++;
          } catch (err) { if (/clé Riot/.test(err.message)) throw err; }
        }
        await writeFile(`${dir}/meta.json`, JSON.stringify({ tier, me_hint: "alias dans chaque fichier (clé me)", games: kept, player: hash(e.puuid), at: new Date().toISOString() }));
        n++; dirs.add(`${tier}-${n - 1}`);
        console.log(`${tier} ${n}/${PER_TIER} : ${kept} parties · ${requests} requêtes`);
      } catch (err) {
        if (/clé Riot/.test(err.message)) throw err;
        console.log(`${tier} : joueur écarté (${err.message || err})`);
      }
    }
  }
  console.log(`Terminé : ${requests} requêtes.`);
}

if (process.argv[1]?.endsWith("battery-raw.mjs")) main().catch(e => { console.error(e.stack || e); process.exit(1); });
