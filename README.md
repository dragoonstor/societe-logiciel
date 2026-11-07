# societe-logiciel

Skill Claude Code qui simule une **société d'édition de logiciel multi-agents** : tu donnes un besoin, une équipe de sous-agents le mène en sprint Scrum autonome.

## L'équipe

| Rôle | Modèle | Travail |
|---|---|---|
| **Chargé de compte** | Sonnet | pose au client jusqu'à 3 tours de 4 questions au départ (réponses proposées, arrêt dès que c'est clair), écrit le cahier des charges ; si le besoin reste flou, le sprint passe en mode cadrage |
| **Product Owner** | Sonnet | user stories, critères d'acceptation, priorités, choix du mode (cadrage ou implémentation), sprint review |
| **Tech Lead / Architecte** | Opus | architecture, découpage en tâches parallélisables, revue de code |
| **Développeurs** | Sonnet | un agent par tâche, en parallèle, chacun dans son git worktree et sur sa branche |
| **DevOps** | Sonnet | build, CI, scripts, intégration des branches, préparation du déploiement (jamais exécuté) |
| **Sécurité** | Sonnet | analyse de menaces puis revue sécurité du code |
| **Testeurs QA** | Sonnet | plan de test, exécution contre les critères d'acceptation, rapport de bugs |

Chaque agent reçoit son propre modèle au lieu d'hériter de celui de la session : seul le Tech Lead utilise Opus. Demande un sprint « économique » pour passer QA et Sécurité en Haiku.

## Déroulé

![Déroulé d'un sprint](docs/schema-sprint.svg)

Brief → Questions au client + cahier des charges (chargé de compte) → Backlog (PO) → Architecture + tâches (Tech Lead) → Cadrage sécurité / QA / DevOps
→ *(mode implémentation)* Dev en parallèle → Intégration (DevOps) → Revue Tech Lead + Sécurité → QA → boucle de correction (max 3 tours)
→ Sprint review (PO) → Rapport de sprint → Push de la branche du sprint + PR.

Tous les livrables sont écrits dans `.societe/sprint-<N>/` à la racine du projet (exclu de git via `.git/info/exclude`).

## Git

Inspiré des orchestrateurs qui isolent chaque agent dans son worktree (comme Scion) :

- une branche d'intégration `societe/sprint-<N>`, dans un worktree à côté du projet (`<projet>.societe/s<N>`) ;
- une branche et un worktree par tâche (`societe/sprint-<N>-T<k>`), où le dev commite ;
- le DevOps fusionne les branches de tâches dans la branche du sprint, résout les conflits mécaniques et renvoie les conflits de logique ;
- en fin de sprint, la branche du sprint est poussée et une PR est ouverte avec le rapport de sprint comme description.

Ton dossier de travail n'est jamais touché, et tes modifications non commitées restent hors du sprint. Dis « en local » ou « sans push » pour que rien ne soit poussé. Le détail est dans [`references/git.md`](references/git.md).

## Voir l'équipe travailler

Le Directeur tient un journal, `.societe/sprint-<N>/journal.jsonl` : une ligne par phase et par agent lancé ou terminé (format dans [`references/journal.md`](references/journal.md)).

- **En direct** : le mod [`mod/societe-panneau`](mod/societe-panneau) ouvre un panneau à côté du chat avec la phase du sprint, les agents au travail (rôle, tâche, modèle, chrono) et ceux qui ont fini. Il s'ouvre tout seul quand un sprint démarre, ou avec `/societe`. Pour le charger : `claude --plugin-dir <chemin>/mod/societe-panneau`.
- **En fin de sprint** : `sprint-replay.html`, une page autonome qui rejoue le sprint. On y voit la durée, le parallélisme, une frise de qui a travaillé quand et le temps passé par modèle.

## Installation

Copie le dossier dans tes skills Claude Code :

```bash
git clone https://github.com/dragoonstor/societe-logiciel.git ~/.claude/skills/societe-logiciel
```

Puis dans Claude Code : « Lance un sprint avec la société pour … » ou `/societe-logiciel`.

## Garde-fous

Après le tour de questions du chargé de compte, l'équipe travaille sans te solliciter. Elle commite uniquement sur ses branches `societe/…` et pousse uniquement la branche du sprint. Elle ne pousse jamais sur `main` ou ta branche de base, ne fait jamais de `--force` et **ne fusionne jamais la PR** : c'est toi qui valides. Pas de déploiement ni de publication non plus.
