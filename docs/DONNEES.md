# Données — provenance, statut, limites (01/11/2026)

## Règle absolue
Tout ce qui a été relevé avec la **clé Riot de développement** (ou la clé personnelle, hors du volume annoncé à Riot) sert au **test privé seulement**. Rien de publié sur le site public tant que Riot n'a pas accordé la clé de production et clarifié la réutilisation. Les fichiers correspondants sont hors git (`coach/cache/`, `worker/*.json`) et, côté serveur, dans le bucket privé Supabase `coach-data` avec un manifeste `published: false`.

## Jeux de données
| Jeu | Volume | Source | Usage | Où |
|---|---|---|---|---|
| Fins de partie Diamant+ | 48 549 parties | clé dev, EUW, patchs 16.19-16.21 | repères par champion, builds, statistiques, matchups | `coach/cache/champstats.json`, `builds.json`, `matchups.json` |
| Chronologies Diamant+ | 38 181 parties | clé dev (EUW), clé personnelle (Master+ EUW/KR/NA) | repères par poste et par champion (metrics-2) | `coach/cache/timelines`, `timelines-perso` → `metric-references.json`, `worker/champrefs.json` |
| Banc d'essai | 1 600 parties, 160 par rang | clé dev | validation des constats (fréquence par rang, lien victoire) | `coach/cache/bench-raw`, `bench.json` |
| Récolte par joueur | 70 joueurs × 30 parties | clé dev | stabilité intra-joueur, hasard, rejeu | `coach/cache/battery-raw` |
| Batterie historique | 90 joueurs (mid, jungle) | clé dev | rejeu ancien/nouveau moteur | `coach/cache/battery*` |
| Repères par rang | Fer → Challenger | banc + chronologies | test privé (Supabase `metric_references`, versions metrics-1 et metrics-2) | base |
| Parties des testeurs | selon testeurs | clé personnelle, consentement | leur coach | Supabase (`match_metrics`, bucket `riot-raw`), suppression RGPD en cascade |
| Base de conseils | 1 023 conseils (851 exploitables) | articles et vidéos publics, Riot | exercices, fiches | `coach/kb/`, `data/coach.json` |
| Esport | matchs, équipes, flux minute par minute | API LoL Esports, Liquipedia | résumés factuels | `data/auto.json` |

Toutes les parties en cache sont anonymisées (joueurs `p1`…`p10`, aucun nom) ; la récolte par joueur garde seulement l'alias du joueur suivi.

## Ce que la timeline Riot donne et ne donne pas
Donne : position de chaque joueur **une fois par minute**, or, XP, niveau, sbires, dégâts cumulés ; événements horodatés (kills avec assistants, wards posées et détruites avec type, achats, bâtiments, plaques, monstres épiques, niveaux). Ne donne pas : intention, état des waves, caméra, pings situés, sorts adverses, replay. Conséquence : aucune règle ne doit affirmer « tu es resté » ou « tu pouvais rejoindre ».

## Indicateurs Riot « challenges »
129 champs par joueur. Utiles et testés : control wards, wards détruites, scuttles, CC convertis. Cassés ou trompeurs : `turretPlatesTaken` (jusqu'à 38 par joueur), symptômes de victoire (dragons, tourelles, Baron), dépendants du champion (skillshots, soins).

## Vie privée
Aucune adresse e-mail ni donnée personnelle vers une IA gratuite. E-mails de créateurs masqués dans la base publiée. Riot ID des tiers masqués dans les textes. Suppression de compte : tout ce qui concerne le joueur disparaît (voir `coach/confidentialite-v1.md`).
