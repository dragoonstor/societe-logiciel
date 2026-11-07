# Gabarits des livrables

Tous les fichiers vivent dans `.societe/sprint-<N>/`. Garde-les courts et concrets : ils servent à passer le relais, pas à faire joli.

## Sommaire
- brief.md
- cahier-des-charges.md
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
## Git (mode implementation)
Branche de base : <nom> @ <commit> — Branche du sprint : `societe/sprint-<N>` — Worktree du sprint : <chemin>
Livraison : push | local — <raison si local>
Modifications non commitées du client (hors sprint) : <aucune | liste>
```

## cahier-des-charges.md
```markdown
# Cahier des charges — Sprint <N>
## Le besoin, reformulé
<2-3 phrases : ce que le client pourra faire à la fin>
## Utilisateurs
- <qui> *(supposé | réponse du client)*
## Résultat attendu et critères de réussite
- <comment le client jugera que c'est réussi>
## Contraintes
- <stack, plateforme, délai, données existantes…>
## Hors sujet
- ...
## Questions pour le client — tour <k> (4 au plus, 0 si tout est clair ; 3 tours au plus)
1. <question> — options : <A (recommandé)> / <B> / <C>
## Réponses du client — tour <k>
<rempli par le Directeur ; « faites au mieux » : plus de questions, les suppositions tiennent>
## Bilan
clair | flou — <inconnues importantes restantes, s'il y en a>
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
- Branche : `societe/sprint-<N>-T1`
- Statut : à faire | en cours | fait | intégrée
```

## dev-notes/<tâche>.md
```markdown
# Notes — T<n>
## Réalisé
- ...
## Fichiers modifiés
- ...
## Commits
Branche : `societe/sprint-<N>-T<n>` — <sha court> <message>
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
Diff revu : `<commit de départ>..<commit revu>`
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
Diff revu : `<commit de départ>..<commit revu>`
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
## Intégration (vague <v>)
| Branche | Résultat | Conflits | Build / tests après |
|---|---|---|---|
| `societe/sprint-<N>-T1` | intégrée / annulée | aucun / résolu : <fichier> / logique : <détail> | ✅ / ❌ |
Tâches à reprendre : <aucune | T<k> — raison>
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

## Livraison
Branche : `societe/sprint-<N>` (base : <branche> @ <commit>) — PR : <lien | non poussée (mode local) : `git push -u origin societe/sprint-<N>`>
La PR n'est pas fusionnée : c'est au client de la relire et de la fusionner.
Worktree pour essayer : <chemin> — à retirer ensuite avec `git worktree remove <chemin>`

## Livré
- US1 — <statut PO> — <ce que le client peut faire maintenant>
## Comment l'essayer
`<commandes>`
## Qualité
Tests : ... — Revue : x points ouverts — Sécurité : x points ouverts — Bugs : x ouverts
## Ce que le client a demandé
<résumé du cahier des charges et de ses réponses>
## Hypothèses prises (à valider par le client)
- ...
## Dette et points ouverts
- ...
## Proposition de sprint suivant
- ...
## Fichiers du sprint
`.societe/sprint-<N>/` — replay du sprint : `.societe/sprint-<N>/sprint-replay.html`
```
