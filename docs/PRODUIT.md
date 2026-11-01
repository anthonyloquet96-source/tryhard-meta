# MINDIFF — le produit (source de vérité, mise à jour le 01/11/2026)

Les agents et les sessions Claude lisent ce dossier `docs/` avant d'affirmer quoi que ce soit sur le projet. Quand le code et ce document se contredisent, le code a raison et ce document doit être corrigé (signaler, ne pas inventer).

## En une phrase
Application web (GitHub Pages, vanilla JS, français d'abord, anglais traduit à l'affichage) pour League of Legends : esport (matchs pro, résumés factuels, équipes), méta (tier lists, patchs) et un **coach** qui lit les ranked d'un joueur et lui donne **un seul objectif mesurable à la fois**, suivi sur 5 parties.

## Promesse du coach
« Il y a dix parties tu travaillais ce point ; voici ce qui a changé, les preuves, et la suite. » Pas une encyclopédie de statistiques : un entraîneur qui vérifie que le joueur progresse, sans le pousser à jouer pour la stat.

## Parcours joueur (coach)
1. Connexion au test privé (code d'invitation, compte Supabase, Riot ID saisi ; pas encore de Riot Sign-On).
2. Lecture des 30 dernières ranked solo/duo (match + timeline), recalcul à chaque ouverture.
3. **Objectif** : proposé après 15 parties au même poste ; carte « Toi aujourd'hui → Ta cible », exercice en une phrase, conseils de coachs sourcés ; « Je commence » ; 5 parties ; verdict (maîtrisé, en progrès, stable, à revoir, inconclusif) ; écran « Objectif rempli », compte rendu, palmarès, palier suivant, écran « Nouvel objectif ».
4. **Bilan de chaque partie** : constats (règles validées au banc), comparaison aux Diamant+, replay sur minimap avec moments clés et situations à revoir.
5. **Bilan complet** sur une vingtaine de parties : erreurs récurrentes, forces, adversaires à préparer.
6. **Champions** : fiche « toi sur ce champion » comparée aux Diamant+ du même champion ; build Diamant+ ; conseils.
7. Notifications (matchs pro en direct, rappels du coach), même appli fermée.

## Ce que MINDIFF ne fait pas (et pourquoi)
- Rien pendant la partie, aucun overlay, aucune lecture mémoire ni replay : 100 % API officielle Riot, post-game (choix produit et conformité Riot ; voir `docs/DECISIONS.md`).
- Pas de classement alternatif (MMR), pas de paris, pas d'identification d'adversaires masqués.
- Pas d'IA conversationnelle active : le tuteur existe mais reste désactivé (coût, confidentialité, validation).
- Pas de vidéo analysée.

## Direction artistique
Appli sombre, accent orange, sobre, « appli de performance », thème clair disponible. Français simple, tutoiement, jargon joueur gardé en anglais (wave, ward, back, farm, lane…). Pas de promesse impossible : le coach dit « je ne sais pas » quand la mesure ne permet pas de conclure.

## État au 01/11/2026
Test privé sur invitation (clé Riot personnelle ; clé de production demandée, en attente). Moteur d'objectifs goals-3, métriques metrics-2 (voir `docs/REGLES-COACH.md`). Site publié à chaque fusion sur `main` ; Worker déployé à la main tant que les secrets Cloudflare ne sont pas dans GitHub.
