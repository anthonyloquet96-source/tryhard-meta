# Décisions (acceptées, rejetées, et pourquoi)

Chaque ligne : date · décision · raison. Les détails sont dans `coach/JOURNAL.md` à la date indiquée.

## Acceptées
- 25/10 · Un seul objectif mesurable à la fois, évalué sur 5 parties, garde-fous anti-passivité · brief V1 d'Anthony.
- 26/10 · « Morts avant 14 min » suspendu comme objectif · poussait au jeu passif.
- 27/10 · Repères mesurés (clé dev) utilisés dans le test privé seulement, jamais sur le site public · conformité Riot.
- 28/10 · Repères Master+ : Corée, EUW et Amérique du Nord réunis · volume.
- 31/10 · Veille YouTube : lecture de la page « vidéos » autorisée, recherche automatique de chaînes arrêtée · robots.txt.
- 31/10 · Règles « objectif disputé en infériorité » et « combat perdu sans toi » remises comme **situations à revoir** (question, pas reproche) · demande d'Anthony, accord GPT.
- 31/10 · Cible d'un objectif au moins +0,25 σ au-dessus de la médiane · réussite par hasard 42 % → 34 %.
- 31/10 · Écrans « objectif validé », palmarès, paliers, « Objectif rempli » et « Nouvel objectif » animés · demande d'Anthony.
- 01/11 · Fiche champion « toi sur ce champion » comparée aux Diamant+ du même champion ; pas de récolte par champion et par rang pour l'instant · 50 000 parties par groupe de rangs nécessaires, non autorisées en production.
- 01/11 · Participation aux kills retirée des objectifs et des vetos · fiabilité intra-joueur 0,02-0,14.
- 01/11 · Control wards avant 20 min activé (support, jungle) · fiabilité 0,60-0,67, hasard 19 %.
- 01/11 · Six catégories de compétences et rotation anti-monotonie · demande d'Anthony : ne pas tourner en rond sur le farm.
- 01/11 · Vision/min gardé avec garde-fou « score par ward » · objection d'Anthony : une stat de quantité pousse au spam.
- 01/11 · Vainqueur d'une partie esport : inhibiteurs, puis écart d'or, puis tours ; le score officiel tranche les séries sans appel · BLG–HLE annoncé à l'envers.
- 01/11 · Données privées hors du bundle du Worker (bucket `coach-data`), déploiement depuis GitHub · supprimer le déploiement manuel.
- 01/11 · Tests en CI à chaque push.

## Rejetées (pour l'instant)
- Objectifs : pings (très stables, aucun lien avec la victoire, risque de spam), wards détruites, premier grand objet, or qui dort, morts (toutes variantes), écarts face à l'adversaire de lane (hasard de la partie).
- Modèle de probabilité de victoire minute par minute : prototype de recherche au mieux ; calibré sur Diamant+, données de la clé dev.
- « Pourquoi tu as perdu » généré par IA, score global de jeu, capture vidéo, overlay, replays, assistant conversationnel permanent, cartes à collectionner, appli hors ligne.
- Récolte par champion × rang : après la clé de production, 20-30 champions populaires au plus.
- Veille Gemini hebdomadaire (proposition GPT) : refusée, 1 741 vidéos en attente ; le frein est le quota, pas la cadence.

## À trancher par Anthony
- Budget vidéo (Gemini payant ≈ 150 $ pour toute la file, ou gratuit sur plusieurs mois).
- Secrets Cloudflare dans GitHub pour le déploiement automatique.
- Vision/min pour l'ADC (0,45 de stabilité, faible séparation par rang).
- Confirmation de l'e-mail à l'inscription Supabase.
- Audit du face-à-face vis-à-vis des règles Riot (identification d'adversaires).
