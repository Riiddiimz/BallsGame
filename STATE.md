# STATE.md — État opérationnel du projet BallsGame

> Document de référence pour tout agent chargé de concevoir, développer, tester et maintenir BallsGame.
>
> Ce document définit la vision produit, les exigences fonctionnelles, les priorités et le protocole de reprise. Il ne remplace pas l'inspection du code : toute fonctionnalité doit être vérifiée avant d'être déclarée opérationnelle.

## 1. Informations générales

- **Projet :** BallsGame
- **Dépôt GitHub :** `Riiddiimz/BallsGame`.
- **Branche principale :** `main` (vérifiée le 2026-10-22).
- **Branche de travail :** aucune ; les nouveaux commits sont directement sur `main` conformément à la consigne utilisateur.
- **Dernière mise à jour vérifiée :** 2026-10-22.
- **Dernier commit vérifié :** à actualiser depuis l'API GitHub au terme de chaque session.
- **État général :** première version de l'application web en cours d'implémentation ; contrôles unitaires et navigateur configurés, résultats CI à vérifier.
- **Documentation de référence :** ce fichier `STATE.md`.

### Principes de développement

1. Commencer par comprendre l'état réel du code et les fonctionnalités déjà présentes.
2. Ne pas reconstruire inutilement un composant qui fonctionne et répond aux exigences.
3. Ne jamais déclarer une fonctionnalité terminée sans preuve suffisante.
4. Travailler par étapes courtes, vérifiables et réversibles.
5. Exécuter les tests pertinents après chaque modification importante.
6. Conserver les décisions, les problèmes et les résultats dans ce document.
7. Ne pas demander à l'utilisateur de répéter une information déjà documentée.
8. Ne solliciter l'utilisateur que lorsqu'une décision indispensable, une autorisation ou une dépendance bloque réellement la progression.
9. Ne jamais écraser des modifications existantes sans avoir vérifié leur origine et leur importance.
10. Prioriser un produit fonctionnel et stable plutôt que l'accumulation de fonctionnalités non testées.

## 2. Objectif du projet

### 2.1 Vision générale

BallsGame est une application web permettant de générer des simulations de combats entre plusieurs boules dans des arènes, avec pour objectif principal de produire des vidéos verticales spectaculaires destinées aux plateformes de vidéos courtes, notamment TikTok.

Le produit doit permettre de configurer les participants, sélectionner des cartes, activer des pouvoirs, lancer une simulation et enregistrer le résultat.

BallsGame n'a pas pour objectif principal de devenir un jeu vidéo complet avec campagne, progression ou économie virtuelle. Le développement doit se concentrer sur la simulation, les interactions, le rendu visuel et la production automatisée de vidéos.

### 2.2 Résultat attendu

L'utilisateur doit pouvoir :

1. Ouvrir le site.
2. Configurer les boules et leurs paramètres.
3. Sélectionner une carte parmi les cartes disponibles.
4. Configurer les pouvoirs et les options de simulation.
5. Lancer un combat.
6. Observer une simulation dynamique et lisible.
7. Contrôler les paramètres de vitesse et la seed lorsque ces fonctions sont disponibles.
8. Enregistrer le combat en vidéo MP4.
9. Reproduire une simulation à partir de sa configuration et de sa seed lorsque le moteur le permet.

Le parcours doit être simple, fiable et utilisable sans intervention technique.

### 2.3 Critères de réussite

Le projet sera considéré comme suffisamment abouti lorsque :

- Le site démarre sans erreur bloquante.
- Toutes les cartes publiées dans le menu Maps sont jouables.
- Les boules interagissent correctement avec l'arène, les obstacles et les pièges.
- Les pouvoirs fonctionnent conformément à leur définition.
- Les combats restent lisibles dans le format vertical.
- Le chronomètre correspond au temps réel de la simulation selon les règles définies.
- Les combats se terminent dans la fenêtre de durée prévue.
- L'enregistrement MP4 produit une vidéo exploitable.
- Les fonctionnalités critiques sont couvertes par des tests reproductibles.
- L'ajout d'une nouvelle carte ou d'un nouveau pouvoir ne nécessite pas de réécrire le moteur entier.

## 3. État réel vérifié

### 3.1 Audit initial obligatoire

Avant toute modification, l'agent doit :

- Vérifier l'accès au dépôt et la branche active.
- Examiner l'arborescence complète du projet.
- Identifier le point d'entrée de l'application.
- Lire les fichiers de configuration et les dépendances.
- Identifier le moteur physique, le système de rendu, la gestion des cartes et celle des pouvoirs.
- Identifier le mécanisme d'enregistrement vidéo.
- Examiner les tests existants.
- Lancer l'application et les tests lorsque l'environnement le permet.
- Relever les erreurs de console, les erreurs de compilation et les défauts reproductibles.

L'audit doit produire un état des lieux concret avant toute réécriture importante.

### 3.2 Fonctionnalités opérationnelles

Aucune fonctionnalité ne doit être déclarée validée avant inspection et test.

Pour chaque fonctionnalité validée, indiquer :

- Son nom.
- Les fichiers ou composants concernés.
- Le commit vérifié.
- Le scénario de test.
- Le résultat observé.
- Les limitations éventuelles.

### 3.3 Fonctionnalités en cours

Au démarrage du projet, les fonctionnalités doivent être classées après audit selon leur état réel :

- Présente et validée.
- Présente mais incomplète.
- Présente mais défectueuse.
- Absente.
- Impossible à vérifier dans l'environnement actuel.

Ne pas confondre une fonctionnalité prévue dans la documentation avec une fonctionnalité réellement implémentée.

### 3.4 Fonctionnalités défectueuses

Pour chaque défaut reproduit, documenter :

- Le comportement attendu.
- Le comportement observé.
- Les étapes de reproduction.
- L'impact sur l'utilisateur.
- Les fichiers concernés.
- La cause identifiée ou les hypothèses restant à tester.
- La correction réalisée.
- Les tests exécutés après correction.

### 3.5 Tests

L'agent doit découvrir les outils et commandes réellement disponibles dans le dépôt.

Les vérifications à prévoir comprennent notamment :

- Démarrage et chargement de l'application.
- Navigation et fonctionnement des menus.
- Sélection et lancement des cartes.
- Mouvements et collisions.
- Déclenchement et effets des pouvoirs.
- Gestion du temps et fin de combat.
- Enregistrement MP4.
- Absence d'erreurs JavaScript bloquantes.
- Tests automatisés Playwright des parcours critiques.

Les tests non exécutés doivent être indiqués comme tels. Un test qui n'a pas été exécuté ne peut pas être déclaré réussi.

## 4. Derniers changements

L'historique doit être construit à partir des commits réellement présents dans le dépôt.

| Date | Modification | Commit | Validation |
|---|---|---|---|
| À vérifier | État initial du dépôt et inventaire du code | SHA à récupérer | Audit à réaliser |
| À faire | Formalisation de l'architecture et des contrats entre composants | — | Non réalisé ou non vérifié |
| À faire | Vérification du moteur de simulation | — | Non réalisé ou non vérifié |
| À faire | Validation des cartes et des pouvoirs | — | Non réalisé ou non vérifié |
| À faire | Validation de l'enregistrement vidéo | — | Non réalisé ou non vérifié |

Après chaque modification significative, ajouter une entrée avec le commit et le résultat des tests.

Ne jamais inventer un commit, une date de réalisation ou un résultat de validation.

## 5. Décisions techniques

### D1 — Priorité à la simulation vidéo

- **Décision :** construire une application centrée sur les combats simulés et leur export vidéo.
- **Motif :** le produit doit générer des vidéos courtes, dynamiques et visuellement engageantes.
- **Conséquences :** privilégier la stabilité de la simulation, la qualité du rendu et la reproductibilité.
- **Statut :** Confirmée.

### D2 — Format vertical

- **Décision :** utiliser un rendu adapté au format 9:16.
- **Motif :** destination principale sur les plateformes de vidéos courtes.
- **Conséquences :** concevoir l'arène, les éléments visuels, les textes et les effets pour ce cadrage.
- **Statut :** Confirmée.

### D3 — Durée des combats

- **Décision :** viser une durée finale d'environ 60 secondes, avec une fin entre 00:58 et 01:05.
- **Motif :** maintenir un format vidéo cohérent.
- **Conséquences :** le moteur doit gérer la durée de simulation et la fin du combat de manière contrôlée.
- **Règle complémentaire :** la victoire finale doit correspondre à l'élimination effective de tous les autres participants. Les effets visuels ou les clones ne doivent pas être confondus avec des participants vivants.
- **Statut :** Confirmée comme exigence ; implémentation à vérifier.

### D4 — Chronomètre et vitesse

- **Décision :** le chronomètre affiché doit représenter le temps réel du combat et rester indépendant du réglage de vitesse de simulation.
- **Motif :** éviter les incohérences entre la durée affichée et la durée réelle.
- **Conséquences :** séparer le temps de simulation, le temps réel et le facteur de vitesse.
- **Statut :** Confirmée comme exigence.

### D5 — Limites de l'arène

Les limites de référence souhaitées sont :

| Paramètre | Valeur |
|---|---:|
| Haut | 16 % |
| Bas | 10 % |
| Gauche | 0 % |
| Droite | 14 % |

- **Décision :** respecter ces limites pour l'arène de combat.
- **Motif :** conserver un cadrage vertical cohérent.
- **Conséquences :** vérifier la convention de coordonnées utilisée par le moteur et appliquer les limites à toutes les cartes.
- **Statut :** Confirmée comme exigence ; application technique à vérifier.

### D6 — Cartes modulaires

- **Décision :** les cartes doivent être sélectionnables depuis un menu commun et fonctionner avec le moteur principal.
- **Motif :** faciliter l'ajout de nouveaux environnements.
- **Conséquences :** séparer la définition visuelle d'une carte de ses éléments physiques lorsque cela est pertinent, sans perdre les effets particuliers de chaque carte.
- **Statut :** Confirmée.

### D7 — Pouvoirs modulaires

- **Décision :** les pouvoirs doivent être configurables et intégrés au moteur commun.
- **Motif :** éviter les implémentations isolées et les doublons.
- **Conséquences :** définir des contrats communs pour l'activation, la durée, les effets, les collisions, le nettoyage et le rendu.
- **Statut :** Confirmée.

### D8 — Fidélité aux références approuvées

- **Décision :** lorsqu'une référence visuelle ou fonctionnelle est approuvée, ne pas la modifier arbitrairement.
- **Motif :** préserver le résultat attendu.
- **Conséquences :** comparer le résultat intégré à la référence et documenter les différences nécessaires à l'intégration.
- **Statut :** Confirmée.

### D9 — Tests avant validation

- **Décision :** les fonctionnalités critiques doivent être testées avant d'être déclarées terminées.
- **Motif :** prévenir les régressions.
- **Conséquences :** privilégier des tests automatisés reproductibles et des preuves conservées.
- **Statut :** Confirmée.

## 6. Problèmes connus

Au début de l'audit, aucun défaut actuel ne doit être considéré comme confirmé sans reproduction.

Les points suivants constituent des risques à vérifier.

### BG-001 — Fiabilité du moteur physique

- **Description :** vérifier la stabilité des collisions et des interactions.
- **Étapes de reproduction :** lancer plusieurs simulations avec différentes configurations et observer les contacts, les rebonds et les éliminations.
- **Impact potentiel :** mouvements incohérents, boules bloquées ou sorties incorrectes de l'arène.
- **Tentatives déjà réalisées :** à déterminer dans l'historique Git.
- **Résultats observés :** à établir.
- **Prochaine action :** auditer les fonctions physiques et créer des tests reproductibles.

### BG-002 — Compatibilité des cartes

- **Description :** vérifier que chaque carte respecte les limites de l'arène et les contrats du moteur.
- **Étapes de reproduction :** sélectionner chaque carte et observer ses collisions et ses interactions.
- **Impact potentiel :** comportements incohérents ou éléments inaccessibles.
- **Tentatives déjà réalisées :** à déterminer.
- **Résultats observés :** à établir.
- **Prochaine action :** construire un inventaire des cartes et une matrice de validation.

### BG-003 — Pouvoirs et doublons

- **Description :** vérifier l'unicité des entrées du catalogue et le bon fonctionnement des déclenchements.
- **Étapes de reproduction :** examiner les menus, configurer plusieurs apparitions et lancer des combats.
- **Impact potentiel :** doublons, effets non déclenchés ou configurations incohérentes.
- **Tentatives déjà réalisées :** à déterminer.
- **Résultats observés :** à établir.
- **Prochaine action :** vérifier le catalogue, le système d'apparition et les cycles de vie des effets.

### BG-004 — Durée et fin du combat

- **Description :** vérifier le chronomètre et les conditions de victoire.
- **Étapes de reproduction :** lancer des combats avec différentes vitesses et observer la fin effective.
- **Impact potentiel :** durée incohérente ou victoire déclarée trop tôt.
- **Tentatives déjà réalisées :** à déterminer.
- **Résultats observés :** à établir.
- **Prochaine action :** séparer les conditions de fin, les effets visuels et l'affichage du temps.

### BG-005 — Enregistrement MP4

- **Description :** vérifier que l'export produit une vidéo complète et cohérente avec la simulation.
- **Étapes de reproduction :** lancer un combat, démarrer l'enregistrement, attendre la fin et contrôler le fichier produit.
- **Impact potentiel :** fichier absent, incomplet, illisible ou désynchronisé.
- **Tentatives déjà réalisées :** à déterminer.
- **Résultats observés :** à établir.
- **Prochaine action :** auditer la capture, le traitement des frames et la finalisation du fichier.

## 7. Feuille de route priorisée

### P0 — Établir une base fiable

- [ ] Vérifier le dépôt, la branche, le dernier commit et les changements en cours.
- [ ] Réaliser un inventaire de tous les fichiers.
- [ ] Identifier l'architecture et le point d'entrée de l'application.
- [ ] Dresser l'inventaire des cartes, pouvoirs, menus et fonctionnalités.
- [ ] Identifier les commandes de lancement et de test.
- [ ] Exécuter les tests disponibles et enregistrer les résultats.
- [ ] Identifier les erreurs bloquantes et les défauts reproduits.
- [ ] Définir l'état réel de chaque fonctionnalité dans ce document.

### P1 — Stabiliser le cœur du produit

- [ ] Valider le moteur physique.
- [ ] Valider les limites de l'arène.
- [ ] Fiabiliser les conditions d'élimination et de victoire.
- [ ] Fiabiliser le chronomètre et le réglage de vitesse.
- [ ] Vérifier le système de sélection des cartes.
- [ ] Vérifier le cycle de vie des pouvoirs et de leurs effets.
- [ ] Valider l'enregistrement MP4.
- [ ] Corriger les régressions identifiées pendant l'audit.

### P2 — Compléter les fonctionnalités

- [ ] Rendre toutes les cartes prévues sélectionnables et jouables.
- [ ] Préserver la fidélité des visuels de référence.
- [ ] Vérifier la compatibilité des cartes avec les pouvoirs.
- [ ] Améliorer la lisibilité des combats.
- [ ] Réduire les effets physiques excessifs lorsqu'ils nuisent à la visibilité.
- [ ] Améliorer la reproductibilité des simulations.
- [ ] Automatiser les parcours critiques avec Playwright.

### P3 — Améliorer le produit

- [ ] Faciliter l'ajout de futures cartes.
- [ ] Faciliter l'ajout de futurs pouvoirs.
- [ ] Améliorer les performances et la stabilité sur les simulations longues.
- [ ] Améliorer les effets visuels lorsque cela ne compromet pas la lisibilité.
- [ ] Documenter les contrats techniques et les procédures de diagnostic.
- [ ] Étudier les nouvelles fonctionnalités uniquement après validation des priorités précédentes.

## 8. Session en cours

- **Dernière tâche commencée :** établir une spécification complète permettant de développer et de maintenir BallsGame de manière autonome.
- **Dernière étape réussie :** définition du périmètre fonctionnel et des exigences principales.
- **Dernière étape échouée :** aucune étape technique ne peut être déclarée échouée sans résultats vérifiés.
- **Fichiers modifiés :** à déterminer après inspection du dépôt.
- **Tests restant à exécuter :** audit initial, démarrage du site, inventaire des fonctionnalités et tests disponibles.
- **Prochaine action exacte :** inspecter le dépôt officiel, identifier l'état du code et établir un rapport technique comparant les fonctionnalités présentes aux exigences de ce document.
- **Étape suivante :** corriger les défauts bloquants identifiés, puis reprendre la feuille de route dans l'ordre de priorité.

### Règles de mise à jour

Après chaque étape significative, enregistrer :
- Ce qui a été inspecté.
- Ce qui a été modifié.
- Les fichiers concernés.
- Le commit produit, s'il existe.
- Les tests exécutés.
- Les résultats observés.
- Les problèmes encore ouverts.
- La prochaine action exacte.

Ne pas inscrire une action dans les modifications terminées avant que le travail correspondant soit réellement effectué.

## 9. Blocages et interventions requises

Au démarrage, vérifier :

- L'accès au dépôt.
- Les permissions de lecture et d'écriture.
- La disponibilité des dépendances.
- La possibilité de lancer l'application et les tests.
- La disponibilité des fichiers et ressources nécessaires.

Si un accès ou une dépendance indispensable manque, documenter précisément le blocage et demander uniquement l'intervention nécessaire.

Si aucun blocage ne subsiste, poursuivre automatiquement la feuille de route sans attendre une nouvelle instruction.

Ne pas demander une validation utilisateur pour chaque correction locale et réversible. En revanche, ne pas effectuer de suppression irréversible, de publication ou de changement majeur de périmètre sans autorisation.

## 10. Protocole de reprise

À chaque nouvelle session :

1. Lire intégralement ce fichier.
2. Vérifier l'état réel du dépôt et de la branche active.
3. Récupérer le dernier commit et examiner les changements non commités.
4. Vérifier si les tâches précédemment déclarées terminées sont toujours valides.
5. Examiner les résultats des derniers tests.
6. Identifier la priorité la plus élevée encore inachevée.
7. Reprendre la prochaine action exacte indiquée dans la section 8.
8. Lire le code concerné avant de le modifier.
9. Effectuer une modification ciblée et réversible.
10. Exécuter les tests pertinents.
11. Corriger les défauts reproduits.
12. Mettre à jour ce document avec les preuves et le nouvel état réel.
13. Continuer tant qu'aucun blocage indispensable ne nécessite l'intervention de l'utilisateur.

### Règles de fiabilité

- Le code et les résultats vérifiés priment sur toute documentation ancienne.
- Ne jamais inventer un résultat de test, un commit ou un état de fonctionnalité.
- Ne jamais considérer une modification comme terminée uniquement parce que le code a été écrit.
- Ne jamais recommencer tout le travail sans avoir vérifié ce qui existe déjà.
- Préserver les fonctionnalités validées lors de chaque correction.
- Préférer les changements minimaux, traçables et testables.
- Documenter les échecs avec les erreurs exactes et les prochaines actions utiles.
- Maintenir ce fichier à jour pour qu'un autre agent puisse reprendre le travail sans dépendre de l'historique des conversations.

**Objectif opérationnel :** obtenir une application BallsGame fiable, complète et testée, permettant de configurer des combats de boules, de sélectionner des cartes, d'utiliser des pouvoirs et de produire des vidéos verticales de qualité.


---

## État opérationnel vérifié — 2026-10-22

La section ci-dessous remplace les anciens champs « à déterminer » pour l'état de l'application web initiale. Les spécifications historiques ci-dessus restent utiles comme feuille de route, mais ne décrivent pas toutes des fonctions présentes.

### Code présent sur `main`

- `index.html`, `styles.css` : interface web en français, présentation d'une arène verticale.
- `src/simulation.js` : générateur de seed déterministe, 2 à 8 boules, obstacles selon la carte, collisions, santé, dégâts, éliminations, dégâts doublés à partir de 50 secondes, mort subite à 58 secondes et résolution d'un gagnant au plus tard à 65 secondes.
- `src/app.js` : rendu canvas, choix de carte et de nombre de boules, contrôles de simulation, chronomètre indépendant du facteur de vitesse, anneaux de santé, indicateur de dégâts et enregistrement navigateur.
- `server.mjs` : serveur statique Node.js avec restriction des chemins et en-tête `nosniff`.
- `package.json` : commandes `start`, `check`, `test` et `test:e2e`.
- `tests/simulation.test.js` : tests unitaires de reproductibilité, limites, horloge, fin du combat, dégâts et élimination.
- `tests/browser.test.js` : smoke test Playwright de chargement, contrôles et enregistrement.
- `.github/workflows/ci.yml` : workflow syntaxe, tests unitaires, installation Chromium et tests navigateur.
- `README.md` : instructions de lancement et limites connues.

### Limites encore ouvertes

- L'enregistrement préfère MP4 natif si le navigateur le prend en charge et utilise WebM en repli. La conversion MP4 universelle dans Chromium n'est pas implémentée.
- La mort subite à 65 secondes garantit un seul gagnant en sélectionnant la boule vivante ayant le meilleur état si le combat n'a pas naturellement produit un survivant.
- La suite Playwright est ajoutée mais ne doit être considérée comme validée qu'après un résultat CI terminé avec succès.
- La fidélité visuelle, l'accessibilité, la compatibilité navigateur et la sécurité n'ont pas encore fait l'objet d'un audit exhaustif.
- Les cartes actuellement implémentées sont un prototype de trois cartes, pas le catalogue final.

### Prochaine action exacte

1. Vérifier le workflow GitHub Actions déclenché depuis `main`, notamment l'installation de Chromium et le smoke test Playwright.
2. Corriger tout échec observé sans désactiver les assertions.
3. Ajouter des scénarios de test pour les trois cartes et les cas de fin de combat.
4. Vérifier le format produit sur les navigateurs cibles et ajouter une conversion MP4 multiplateforme si nécessaire, sans renommer artificiellement un fichier WebM.
5. Continuer l'implémentation des cartes et du rendu vidéo, en mettant à jour cet état après chaque tâche.

### Règle Git active

La consigne utilisateur la plus récente impose que tout développement futur et tout commit se fasse directement sur `main`. Ne pas créer ni utiliser une autre branche pour le développement. Avant chaque écriture, vérifier l'état actuel de `main`; ne pas réécrire ni supprimer des commits existants.


## 14. Évolutions vérifiées sur main — 2026-10-22

- Les réglages de l'arène comprennent maintenant un nombre d'obstacles de 0 à 10. Le moteur borne cette valeur et génère les emplacements à partir de la seed, afin de rendre la disposition reproductible.
- Les matériaux visuels des plateformes varient selon la carte (Néon Grid, classique, orbite). Les collisions avec une plateforme repoussent la boule selon la normale de la surface, y compris lorsque son centre se retrouve dans la plateforme.
- Le vainqueur n'est plus affiché avant 58 secondes lorsque le combat n'a plus qu'un survivant. La mort subite garantit une résolution au plus tard à 65 secondes.
- Le serveur statique normalise son chemin racine avant de vérifier les chemins demandés. Avant cette correction, la racine pouvait conserver un séparateur final et faire échouer la vérification de préfixe pour toutes les requêtes.
- Les tests Playwright contrôlent le chargement, le démarrage/pause, le changement de carte, le réglage du nombre de boules et d'obstacles, la seed, l'enregistrement WebM et le ratio vertical mobile.
- CI complet **confirmé réussi** au commit `99e0f6e0e5dc74de4be18dfdda9b627f491ea422`, exécution [39776728323](https://github.com/Riiddiimz/BallsGame/actions/runs/39776728323) : syntaxe, tests unitaires et smoke test Playwright réussis. Le test spécifique des piques a ensuite été ajouté et reste à valider dans le CI suivant.
- Des changements plus récents sur la collision des plateformes et son test déterministe sont poussés sur `main`; leurs exécutions CI doivent être vérifiées avant de les déclarer validés.
- Le dépôt est développé directement sur `main` conformément à la consigne utilisateur. La PR provisoire `#1` a été fermée sans fusion ; aucun développement futur ne doit être effectué sur la branche existante qui avait servi de source pour transférer les fichiers utiles.
- **Prochaine action exacte :** récupérer le résultat du CI du commit le plus récent ; corriger tout échec, puis poursuivre les cartes et le pipeline MP4 sans présenter WebM comme MP4.


## 15. Pouvoirs et enregistrement — 2026-10-22

- Trois pouvoirs sont intégrés au moteur : **Surge** (vitesse augmentée pendant 4 s), **Bouclier** (réduit les dégâts de collision et de Nova pendant 5 s) et **Nova** (impulsion radiale et dégâts aux adversaires proches).
- Les apparitions sont déterministes à partir de la seed : 7 apparitions planifiées entre 6 s et 51 s, chaque bonus disparaît après 5 s s'il n'est pas ramassé. Le paramètre `powersEnabled` permet de désactiver les pouvoirs pour une simulation.
- Le rendu affiche les bonus ramassables, leur couleur/symbole, l'aura de vitesse et l'anneau de bouclier. Le menu contient une case à cocher pour activer/désactiver les pouvoirs.
- L'enregistrement tente maintenant les formats MP4 natifs pris en charge, puis WebM. Le nom de fichier et le statut reflètent le vrai format rapporté par `MediaRecorder`. Le test navigateur attend le téléchargement et vérifie l'extension réelle.
- Tests unitaires ajoutés pour la seed et le planning des pouvoirs, Surge, Bouclier, Nova, les collisions avec les plateformes et les seuils de 50/58 secondes.
- Le smoke test Playwright valide le chargement, les commandes, les trois cartes, les réglages, la case des pouvoirs, l'enregistrement/téléchargement et le ratio 9:16 sur mobile.
- Le workflow CI n'installe plus les paquets système avec `--with-deps`, car cette étape apt a été annulée pendant un téléchargement lent. Chromium est installé directement ; si le runner signale une bibliothèque système manquante, rétablir uniquement les dépendances requises.
- **Prochaine action exacte :** valider le dernier workflow sur le code incluant le test de téléchargement vidéo, puis ajouter une conversion MP4 fiable pour Chromium si le besoin MP4 doit être garanti sur tous les navigateurs.


## 16. Pièges de Néon Grid — 2026-10-22

- À partir de quatre obstacles, Néon Grid génère un piège de piques identifiable par sa silhouette et son rendu rose/rouge lumineux.
- La zone de collision correspond à la hauteur visible des pointes. Un contact inflige 8 points de dégâts (multiplicateur global inclus), déclenche un flash et repousse la boule selon la normale de la surface.
- Un test déterministe vérifie la présence du piège, les dégâts et le rebond. Le CI de ce commit doit être contrôlé avant de considérer cette évolution validée.
- **Prochaine action exacte :** vérifier le workflow du dernier commit sur `main`, puis poursuivre les cartes et le format vidéo.
