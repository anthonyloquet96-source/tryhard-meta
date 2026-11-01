# Limites connues (à dire au joueur et à ne pas contourner)

## Mesure
- Position des joueurs **une fois par minute** : aucune règle ne peut prouver qu'un joueur « est resté » quelque part ou « pouvait rejoindre » un combat. D'où les « situations à revoir » plutôt que des erreurs.
- Le flux LoL Esports s'arrête parfois avant les derniers coups : tours et inhibiteurs de la dernière image incomplets ; le score officiel prime.
- 5 parties, c'est peu : une métrique à fiabilité intra-joueur < 0,25 est surtout du hasard sur un cycle (voir `docs/REGLES-COACH.md`). Réussir 3/5 n'est pas une preuve de progression ; le comparateur avant/après (à construire) l'est davantage.
- Un repère Diamant+ est un horizon, pas une obligation pour un joueur Argent.
- Compter des wards, des control wards, des sbires reste manipulable : les garde-fous attrapent les dérives nettes, pas toutes.

## Données et droits
- Repères, builds, statistiques et repères par champion : clé de développement, test privé seulement.
- Vidéos YouTube de tiers : titres et métadonnées seulement, pas de transcription ni de téléchargement ; les analyses Gemini portent sur des contenus publics, sans donnée joueur.
- Clé de production Riot non accordée : ouverture publique impossible ; liaison Riot ID sans Riot Sign-On (à remplacer avant l'ouverture).

## Produit
- Top et ADC n'ont pas encore d'objectif non-farm validé.
- Pas de vidéo, pas d'aide en partie, pas d'IA conversationnelle active.
- Le premier chargement du coach recalcule les parties avec la version courante des métriques (quelques dizaines de secondes).
- Les animations sont coupées si l'appareil demande « réduire les animations ».

## Opérations
- Déploiement du Worker manuel tant que les secrets Cloudflare ne sont pas dans GitHub ; Claude Code bloque ce déploiement.
- Migrations SQL appliquées à la main dans Supabase.
- Les caches privés vivent sur le poste d'Anthony : un recalcul des repères demande ce poste.
