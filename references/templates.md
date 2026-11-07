# Gabarits des livrables

Tous les fichiers vivent dans `.societe/sprint-<N>/`. Garde-les courts et concrets : ils servent à passer le relais, pas à faire joli.

## Sommaire
- brief.md
- backlog.md
- architecture.md
- tasks.md
- dev-notes/<tâche>.md
- review.md
- security.md
- devops.md
- qa-report.md
- sprint-report.md

---

## brief.md
```markdown
# Brief — Sprint <N>
## Besoin du client (verbatim)
<texte exact>
## Contexte technique
Projet : <chemin> — Stack : <...> — Tests : <commande> — Remarques : <...>
```

## backlog.md
```markdown
# Backlog — Sprint <N>
**Objectif du sprint :** <une phrase>
**Mode :** implementation | cadrage — <justification>

## User stories
### US1 — <titre> [Must]
En tant que <...>, je veux <...> afin de <...>.
**Critères d'acceptation**
- [ ] CA1.1 — Étant donné <...>, quand <...>, alors <...>
- [ ] CA1.2 — ...

## Hors périmètre de ce sprint
- ...
## Hypothèses
- H1 — <info manquante> → <choix fait>
## Definition of Done
- ...

## Sprint review
| Story | Statut | Commentaire |
|---|---|---|
| US1 | Acceptée / Partielle / Refusée | <preuve ou manque> |
### Proposition pour le sprint suivant
- ...
```

## architecture.md
```markdown
# Architecture — Sprint <N>
## Vue d'ensemble
<composants, flux>
## Décisions
| # | Décision | Pourquoi | Alternative écartée |
|---|---|---|---|
## Commandes
Build : `...` — Tests : `...` — Lancer : `...`
## Impacts / risques
- ...
```

## tasks.md
```markdown
# Tâches — Sprint <N>
### T1 — <titre>
- Stories : US1
- Rôle : dev | devops
- Fichiers possédés : `src/...`, `tests/...`
- Dépend de : —
- Fini quand : <interface exposée, tests attendus>
- Statut : à faire | en cours | fait
```

## dev-notes/<tâche>.md
```markdown
# Notes — T<n>
## Réalisé
- ...
## Fichiers modifiés
- ...
## Tests
Commande : `...` — Résultat : <x passés / y échoués>
## Besoins hors périmètre
- ...
## Corrections (boucle <k>)
- <point> → <traitement>
```

## review.md
```markdown
# Revue de code — Sprint <N> (tour <k>)
Build : ✅/❌ — Tests : ✅/❌ (<détail>)
| # | Gravité | Fichier:ligne | Problème | Correction attendue | Tâche | Statut |
|---|---|---|---|---|---|---|
| R1 | bloquant | src/a.py:42 | ... | ... | T1 | ouvert / corrigé |
```

## security.md
```markdown
# Sécurité — Sprint <N>
## Conception
| Risque | Impact | Probabilité | Mesure |
|---|---|---|---|
### Exigences pour les devs
- ...
## Revue du code (tour <k>)
| # | Gravité | Fichier:ligne | Problème | Correction | Statut |
|---|---|---|---|---|---|
```

## devops.md
```markdown
# DevOps — Sprint <N>
## Plan
Build local / Tests / CI / Déploiement cible / Variables d'environnement (noms)
## Réalisé
- Fichiers : ...
- Vérifié localement : ...
- Non vérifiable ici : ...
```

## qa-report.md
```markdown
# QA — Sprint <N>
## Plan de test
| Cas | Critère | Étapes | Attendu |
|---|---|---|---|
## Exécution (tour <k>)
| Critère | Résultat | Preuve |
|---|---|---|
| CA1.1 | ✅ / ❌ | <test ou commande + sortie> |
Non-régression : <commande> → <résultat>
## Bugs
| # | Sévérité | Story | Reproduction | Attendu / Obtenu | Statut |
|---|---|---|---|---|---|
```

## sprint-report.md
```markdown
# Rapport de sprint <N> — <objectif>
**Mode :** ... — **Tours de correction :** k/3

## Livré
- US1 — <statut PO> — <ce que le client peut faire maintenant>
## Comment l'essayer
`<commandes>`
## Qualité
Tests : ... — Revue : x points ouverts — Sécurité : x points ouverts — Bugs : x ouverts
## Hypothèses prises (à valider par le client)
- ...
## Dette et points ouverts
- ...
## Proposition de sprint suivant
- ...
## Fichiers du sprint
`.societe/sprint-<N>/`
```
