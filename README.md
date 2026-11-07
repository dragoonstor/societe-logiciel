# societe-logiciel

Skill Claude Code qui simule une **société d'édition de logiciel multi-agents** : tu donnes un besoin, une équipe de sous-agents le mène en sprint Scrum autonome.

## L'équipe

- **Product Owner** — user stories, critères d'acceptation, priorités, choix du mode (cadrage ou implémentation), sprint review
- **Tech Lead / Architecte** — architecture, découpage en tâches parallélisables, revue de code
- **Développeurs** — un agent par tâche, en parallèle, chacun sur ses propres fichiers
- **DevOps** — build, CI, scripts, préparation du déploiement (jamais exécuté)
- **Sécurité** — analyse de menaces puis revue sécurité du code
- **Testeurs QA** — plan de test, exécution contre les critères d'acceptation, rapport de bugs

## Déroulé

![Déroulé d'un sprint](docs/schema-sprint.svg)

Brief → Backlog (PO) → Architecture + tâches (Tech Lead) → Cadrage sécurité / QA / DevOps
→ *(mode implémentation)* Dev en parallèle → Revue Tech Lead + Sécurité → QA → boucle de correction (max 3 tours)
→ Sprint review (PO) → Rapport de sprint.

Tous les livrables sont écrits dans `.societe/sprint-<N>/` à la racine du projet.

## Installation

Copie le dossier dans tes skills Claude Code :

```bash
git clone <url-du-depot> ~/.claude/skills/societe-logiciel
```

Puis dans Claude Code : « Lance un sprint avec la société pour … » ou `/societe-logiciel`.

## Garde-fous

L'équipe travaille sans te solliciter, mais ne fait ni `git push`, ni déploiement, ni publication, ni commit (sauf si tu le demandes). Tu relis tout à la fin.
