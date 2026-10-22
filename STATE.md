# STATE.md — État opérationnel du projet BallsGame

> Document de référence pour tout agent chargé de concevoir, développer, tester et maintenir BallsGame.
>
> Ce document définit la vision produit, les exigences fonctionnelles, les priorités et le protocole de reprise. Il ne remplace pas l'inspection du code : toute fonctionnalité doit être vérifiée avant d'être déclarée opérationnelle.

## 1. Informations générales

- **Projet :** BallsGame
- **Dépôt GitHub :** https://github.com/Riiddiimz/BallsGame
- **Branche principale :** `main` (métadonnées GitHub vérifiées).
- **Branche de travail actuelle :** `audit/initial-repository-inventory`.
- **Dernière mise à jour vérifiée :** 2026-10-22 — création du prototype web initial et des tests.
- **Dernier commit vérifié avant audit :** `6ff9cde37a58ed2301699f1cd1e030868f1f166c` (`Create SECURITY.md`).
- **État général :** prototype web initial ajouté sur la branche de travail ; fonctionnalités avancées et validation navigateur encore incomplètes.
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


## 11. Résultat de l'audit initial — 2026-10-22

### Dépôt et historique vérifiés
- Dépôt confirmé : `Riiddiimz/BallsGame`, public.
- Branche par défaut confirmée : `main`. Une recherche des branches retourne `main` uniquement ; aucune branche de développement distincte n'a été trouvée par cet outil.
- Dernier commit retourné par la recherche d'historique : `6ff9cde37a58ed2301699f1cd1e030868f1f166c` — `Create SECURITY.md` (2026-10-22 11:28:44 UTC).
- Les trois fichiers de gouvernance ont été lus intégralement : `STATE.md`, `AGENTS.md`, `SECURITY.md`.
- Les lectures directes de `README.md`, `package.json`, `index.html`, `playwright.config.js` et du chemin `.github/workflows` ont retourné `404 Not Found`. Cela ne prouve pas à lui seul l'absence de tout code dans le dépôt, mais aucun point d'entrée applicatif ni manifeste de dépendances n'a pu être identifié.
- La recherche de code n'a fourni aucun résultat exploitable ; l'indexation de code du dépôt est signalée comme indisponible.
- L'outil GitHub disponible dans cette session ne fournit pas de lecture complète de l'arborescence. L'inventaire exhaustif des fichiers et le diff local ne peuvent donc pas être établis ici.

### Comparaison aux critères d'acceptation
| Domaine | État vérifié | Motif |
|---|---|---|
| Démarrage du site | Impossible à vérifier | Aucun point d'entrée ni commande de lancement identifiés |
| Cartes jouables | Impossible à vérifier | Code du moteur et catalogue des cartes non accessibles |
| Physique, collisions et pièges | Impossible à vérifier | Code source non identifié |
| Pouvoirs | Impossible à vérifier | Catalogue et gestionnaire non identifiés |
| Chronomètre et fin entre 00:58 et 01:05 | Impossible à vérifier | Logique de simulation non identifiée |
| Export MP4 | Impossible à vérifier | Pipeline d'enregistrement non identifié |
| Tests automatisés / Playwright | Impossible à vérifier | Aucun manifeste ou fichier de configuration de test accessible |
| Contrôles de sécurité applicatifs | Non évalués | Pas de code applicatif à inspecter ; aucun audit de dépendances n'a été exécuté |

### Tâches priorisées après audit
1. **P0 — Retrouver et rendre accessible le code applicatif** : vérifier que le dépôt officiel choisi est bien celui qui contient l'application, ou pousser/relier le code au dépôt attendu. Ne pas créer une application de remplacement à l'aveugle.
2. **P0 — Obtenir un inventaire complet de l'arborescence et du dernier commit applicatif** : identifier les fichiers de démarrage, dépendances, moteur, cartes, pouvoirs, export vidéo et tests.
3. **P0 — Exécuter les vérifications de base** : syntaxe/build, tests existants et contrôle de sécurité des dépendances, selon les outils déclarés par le projet.
4. **P1 — Construire une matrice de tests de non-régression** pour les cartes, pouvoirs, limites de l'arène, chronomètre, fin de combat et export MP4.
5. **P1 — Corriger le premier défaut reproductible** trouvé par les tests, sans réécriture générale.

### Première tâche concrète effectuée
- Création de la branche de travail `audit/initial-repository-inventory` depuis `main`.
- Mise à jour de ce document pour consigner les preuves disponibles, les chemins testés, les limites d'accès et la prochaine action exacte.
- Aucun code applicatif n'a été modifié : aucun fichier applicatif n'a pu être identifié et il serait risqué d'inventer son architecture.
- Tests : aucun test applicatif exécuté, faute de point d'entrée/manifeste accessible. Les lectures GitHub et recherches de commits sont des contrôles d'inventaire, pas des tests logiciels.
- Diff local : impossible à générer avec les outils disponibles dans cette session. Le changement est limité à `STATE.md` sur la branche d'audit.

### Session en cours — reprise
- **Dernière étape réussie :** prototype applicatif initial, moteur de simulation, tests unitaires et workflow CI ajoutés sur la branche de travail.
- **Blocage actuel :** le clone Git local échoue car la résolution DNS de github.com est indisponible dans l'environnement local, mais le workflow GitHub Actions a ensuite validé les fichiers exacts de la branche.
- **Prochaine action exacte :** corriger les limites de la simulation (éliminations crédibles, temps réel indépendant de la vitesse, export MP4) et ajouter des tests de parcours navigateur.


## 12. Première version applicative — 2026-10-22

### Architecture choisie
- Application web sans framework, en HTML/CSS/JavaScript ES modules : réduit la complexité et supprime les dépendances runtime initiales.
- `server.mjs` : serveur HTTP statique Node.js local avec résolution de chemins sous la racine, réponses 404/403 et en-tête `X-Content-Type-Options: nosniff`.
- `src/simulation.js` : logique de simulation séparée du rendu, générateur pseudo-aléatoire déterministe par seed, boules, rebonds, collisions et fin au plus tard après 60 secondes de simulation.
- `src/app.js` : interface et rendu Canvas, contrôles de carte, vitesse, seed, démarrage/pause/réinitialisation et capture navigateur via MediaRecorder.
- `index.html` et `styles.css` : interface responsive conçue autour d'une arène verticale 9:16.
- `tests/simulation.test.js` : tests natifs Node.js, sans dépendance externe.
- `.github/workflows/ci.yml` : workflow de vérification syntaxique et de tests sur push, pull request ou déclenchement manuel.
- `README.md` : instructions de démarrage et de vérification.

### Fonctionnalités ajoutées dans le prototype
- Trois cartes sélectionnables : Néon Grid, classique et orbite centrale.
- Configuration de 2 à 8 boules, vitesse et seed.
- Animation Canvas, rebonds sur les limites, collisions entre boules et obstacles propres aux cartes.
- Pause/reprise, réinitialisation, chronomètre de simulation et statistiques de collisions.
- Enregistrement navigateur en WebM lorsque MediaRecorder et captureStream sont pris en charge.
- **Limites connues :** export MP4 non implémenté ; aucune élimination crédible des boules n'est encore modélisée ; la fin au bout de 60 secondes de simulation n'assure pas une durée réelle de 58–65 secondes ; les tests de navigateur/Playwright n'ont pas été exécutés ; la sécurité et le rendu visuel n'ont pas fait l'objet d'un audit complet.

### Tests et preuve d'exécution
- Copie locale de vérification créée dans `/tmp/ballsgame` à partir du moteur et des cas de test écrits pour cette version.
- `npm run check` — réussi sur la copie locale de `src/simulation.js` (contrôle de syntaxe Node.js).
- `npm test` — 8 tests réussis, 0 échec : reproductibilité d'une seed, différence entre seeds, bornage du nombre de boules, position initiale dans l'arène, avancement temporel, rejet des pas de temps invalides, fin à 60 secondes simulées et déterminisme du générateur aléatoire.
- **Précision importante :** ces commandes ont été exécutées sur une copie locale de vérification, et non sur un clone exact de la branche GitHub. Le clone Git a échoué avec `Could not resolve host: github.com`; le résultat doit donc être confirmé sur les fichiers exacts de la branche par CI ou dès que le clone est possible.
- GitHub Actions : workflow `BallsGame CI` réussi sur le commit `6a7710083cf968c2d66a9570998f9f740db881f0` (run [39771932740](https://github.com/Riiddiimz/BallsGame/actions/runs/39771932740)). Les étapes `Check JavaScript syntax` et `Run simulation tests` sont toutes deux réussies sur le code exact commité.

### Historique de réalisation
| Date | Modification | Commit | Validation |
|---|---|---|---|
| 2026-10-22 | Prototype initial, serveur statique, moteur Canvas, tests et workflow CI | Plusieurs commits de fichiers sur `audit/initial-repository-inventory` ; CI confirmée sur `6a7710083cf968c2d66a9570998f9f740db881f0` | CI GitHub réussie : syntaxe + 8 tests unitaires |

### Feuille de route actualisée
1. **P0 — Validation du code exact** : vérifier les fichiers de la branche, le contrôle syntaxique de tous les modules et le workflow GitHub Actions.
2. **P1 — Simulation crédible** : ajouter une mécanique d'élimination clairement définie, un vrai gagnant et des tests de collisions reproductibles.
3. **P1 — Temps et durée** : distinguer le temps réel écoulé du temps de simulation pour que le compteur affiché reste cohérent avec le temps réel.
4. **P1 — Tests navigateur** : ajouter Playwright si son installation et son exécution sont disponibles en CI ; tester chargement, sélection de carte, démarrage/pause et erreurs console.
5. **P1 — Export MP4** : évaluer une chaîne d'export réellement compatible avec le navigateur et le format demandé ; ne pas déclarer WebM comme MP4.
6. **P2 — Cartes et pouvoirs modulaires** : séparer leurs contrats et étendre progressivement le catalogue après fiabilisation du cœur.
