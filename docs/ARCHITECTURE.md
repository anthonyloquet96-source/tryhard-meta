# Architecture (01/11/2026)

## Vue d'ensemble
| Couche | Quoi | Où ça tourne | Comment ça se met à jour |
|---|---|---|---|
| Site | `index.html`, `app.js` (esport, méta, actus, navigation), `coach2.js` (coach V1), `coach.js` (base de conseils, stratégies, carte d'accueil : pas l'ancien écran, retiré du parcours), `coach-select.js`, `i18n.js`, `story.mjs`, `notif-events.mjs`, `sw.js` | GitHub Pages | `collecte.yml` publie à chaque push sur `main` et toutes les 30 min |
| Données publiées | `data/auto.json` (esport), `data/news.js`, `data/esport.js`, `data/meta.js`, `data/coach.json` | GitHub Pages | collecte (`collector/`), veille (`veille.yml`, toutes les 6 h, Gemini gratuit, contenus publics) |
| Serveur du coach | `worker/` : Cloudflare Worker `mindiff-coach` (`index.mjs` → `/api/coach`, `/api/push`, `/api/v1`), `v1.mjs` (jeton, test privé, quotas), `push.mjs` | Cloudflare (offre gratuite) | `deploy-worker.yml` à chaque push sur `main` (secrets Cloudflare requis), sinon `cd worker && npx wrangler deploy` |
| Base | Supabase (UE) : `players`, `matches`, `match_metrics`, `coaching_goals`, `goal_evaluations`, `pilot_testers`, `pilot_feedback`, `metric_references`, `sync_jobs`, `push_*` ; buckets privés `riot-raw` (JSON bruts) et `coach-data` (repères, builds, statistiques) | Supabase | migrations `supabase/migrations/*.sql` appliquées à la main dans l'éditeur SQL ; `worker/put-data.mjs` pour `coach-data` |
| Moteur du coach | `coach/normalize.mjs` → `metrics.mjs` → `goals.mjs` ; `review.mjs`, `tactics.mjs` (bilan et replay) ; `coach/v1/` (API, synchronisation, stockage) | partagé : Worker, serveur local (`server/server.mjs`), scripts | avec le site |
| Sécurité | RLS sur toutes les tables (lecture du propriétaire seulement, aucune écriture client), clé Riot et clé de service côté serveur, Content-Security-Policy sur la page, jeton Supabase vérifié par le Worker, quotas | | tour de sécurité du 01/11 (`coach/JOURNAL.md`) |

## Flux d'une synchronisation
`POST /players/:id/sync` → tâche en file → Riot (match + timeline, 3 parties par paquet, reprise après 20 s) → JSON brut gzip dans `riot-raw` → `computeMetrics` → `match_metrics` → `advanceGoals` (évaluer l'objectif ouvert, archiver, proposer le suivant) → l'appli relit `/goals/active`, `/progress`, `/diagnostic`, `/champion`.

## Scripts de données (poste local, cache privé)
`references.mjs` (Diamant+), `references-tiers.mjs --upload` (par rang → base), `champ-references.mjs` (par champion → `worker/champrefs.json`), `final-items-build.mjs` (objets complets, à chaque gros patch), `bench.mjs` (banc des constats), `battery-raw.mjs` + `stability.mjs` + `stability-chance.mjs` + `replay-raw.mjs` (validation d'une métrique), `pilot-report.mjs` (test privé). Après un recalcul : `worker/put-data.mjs`.

## Tests
`node coach/tests/run.mjs` : 60 tests (fixtures + tests sur cache privé, ignorés sans cache). Lancés par `tests.yml` à chaque push et par `veille.yml`. Attendu : tous verts, 1 ignoré sans cache.

## Agents Claude (.claude/agents)
analyste-donnees (explore, propose), **statisticien-validateur** (valide ou refuse, indépendant), analyste-lol (base de conseils), chercheur-sources (trouve des sources), relecteur-joueur (lit comme un joueur Argent), testeur-site, testeur-service, motion-designer. Skills : veille-lol, analyse-contenu-lol, controle-critique-lol. Tous lisent `docs/` d'abord.
