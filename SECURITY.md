# SECURITY.md — BallsGame

## Objectif

Définir les règles de sécurité applicables au développement, aux tests et au déploiement de BallsGame.

## Protection des secrets

- Ne jamais intégrer de jetons, mots de passe, clés API, cookies de session ou identifiants dans le code ou les journaux.
- Utiliser les secrets du gestionnaire prévu par la plateforme pour les workflows automatisés.
- Ne jamais afficher ni transmettre de secrets dans les rapports, les issues ou les pull requests.
- En cas de secret exposé, recommander sa révocation et son remplacement immédiats.

## Dépendances

- Examiner les dépendances nouvelles ou mises à jour.
- Privilégier les sources officielles et les versions maintenues.
- Exécuter les outils d'audit disponibles.
- Signaler les dépendances vulnérables, abandonnées ou inutilement privilégiées.
- Ne pas effectuer de mise à jour majeure risquée sans vérifier sa compatibilité.

## Application web

- Valider les données provenant de l'utilisateur.
- Éviter les injections HTML, JavaScript et les vulnérabilités XSS.
- Ne pas utiliser de code dynamique dangereux avec des données non fiables.
- Vérifier les permissions, les accès aux fichiers et les éventuels endpoints.
- Ne pas faire confiance aux seules validations réalisées côté client.

## Export vidéo et fichiers

- Vérifier les noms, types et tailles de fichiers traités.
- Éviter l'écrasement de fichiers inattendus et les chemins arbitraires.
- Gérer les erreurs d'import, d'export et de traitement des médias sans exposer de données sensibles.

## Automatisation et CI

- Appliquer le principe du moindre privilège aux workflows.
- Limiter les permissions des jetons et des actions GitHub.
- Ne jamais exécuter aveuglément du code provenant d'une contribution non fiable avec des secrets disponibles.
- Examiner les modifications des workflows avant leur validation.
- Ne pas désactiver les contrôles de sécurité pour faire passer un test.

## Rapport d'un problème

Tout problème de sécurité doit être décrit avec :
- la gravité estimée ;
- les composants affectés ;
- les conditions nécessaires à l'exploitation ;
- l'impact potentiel ;
- une correction ou une mesure de réduction du risque.

Ne pas publier de secrets ni de procédure d'exploitation détaillée dans un rapport public lorsque cela pourrait faciliter une attaque.

## Règle de validation

Aucune revue ne doit affirmer qu'un système est totalement sécurisé. Indiquer les contrôles effectivement réalisés, les résultats observés et les limites des vérifications.
