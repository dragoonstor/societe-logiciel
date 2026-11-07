# Flux git de la société (mode `implementation`)

Chaque développeur travaille dans son propre **git worktree**, sur sa propre branche, comme dans un vrai éditeur. Le DevOps, en rôle d'**intégrateur**, fusionne les branches des tâches dans une branche de sprint. En fin de sprint, la branche du sprint est poussée et une PR est ouverte. **Le client fusionne lui-même la PR.**

Pourquoi : des devs parallèles dans un même dossier se marchent dessus dès qu'ils touchent un fichier partagé (`package.json`, lockfile, registre de routes) ou lancent leurs tests en même temps. Avec un worktree par tâche, chacun a sa copie. Les conflits deviennent des conflits de fusion visibles, traités à l'intégration, au lieu d'écrasements silencieux.

En mode `cadrage`, rien de tout ça : pas de branche, pas de commit.

## Noms et chemins

Avec `<projet>` le dossier du dépôt du client et `<parent>` son dossier parent :

| Quoi | Branche | Worktree |
|---|---|---|
| Sprint (intégration) | `societe/sprint-<N>` | `<parent>/<projet>.societe/s<N>` |
| Tâche | `societe/sprint-<N>-T<k>` | `<parent>/<projet>.societe/s<N>-T<k>` |
| Correction (tour c) | `societe/sprint-<N>-T<k>-c<c>` | `<parent>/<projet>.societe/s<N>-T<k>-c<c>` |

Les branches de tâches sont des sœurs de la branche du sprint (`sprint-<N>-T<k>`), pas des sous-branches (`sprint-<N>/T<k>`) : git refuse qu'une branche `societe/sprint-<N>` et une branche `societe/sprint-<N>/…` existent en même temps.

Les worktrees vivent **à côté** du projet, pas dedans : les outils du projet (tests, linters, watchers) ne les voient pas. Les chemins sont courts exprès : sous Windows, git échoue au-delà de 260 caractères.

Le dossier du sprint `.societe/sprint-<N>/` reste dans le dossier du client, hors des worktrees. Chaque agent reçoit son chemin absolu.

## 0. Préparation (le Directeur, avant l'étape 4)

1. **Dépôt.** Si le projet n'est pas un dépôt git : `git init`, puis `git commit --allow-empty -m "Initialisation"`. Sous Windows : `git config core.longpaths true`.
2. **Identité.** Si `git config user.email` est vide, configure une identité **locale au dépôt** : `git config user.name "societe-logiciel"` et `git config user.email "societe-logiciel@localhost"`. Signale-le dans le rapport.
3. **Base.** Note dans `brief.md` la branche courante du client (`git branch --show-current`) et son commit (`git rev-parse HEAD`). Les modifications non commitées du client **ne font pas partie du sprint** : ne les stashe pas, ne les touche pas, mentionne-les dans le brief.
4. **Exclusion.** Ajoute `.societe/` à `.git/info/exclude` s'il n'y est pas. Ce fichier est local : le `.gitignore` du client reste intact.
5. **Branche de sprint.** `git worktree add -b societe/sprint-<N> <parent>/<projet>.societe/s<N> <commit de base>`
6. **Mode de livraison.** `push` par défaut. Passe en `local` si le client a dit « en local » ou « sans push », s'il n'y a pas de remote `origin`, ou si `gh auth status` échoue. Note le mode dans `brief.md`.

## 1. Une vague de développement

Pour chaque tâche de la vague (dépendances satisfaites) :

```
git worktree add -b societe/sprint-<N>-T<k> <parent>/<projet>.societe/s<N>-T<k> societe/sprint-<N>
```

La tâche part de la tête actuelle de la branche du sprint, qui contient donc déjà les tâches des vagues précédentes. Donne au Développeur ce chemin comme **Projet**. Il code, teste et **commite sur sa branche**. Il ne pousse rien.

Tu peux aussi utiliser l'option `isolation: "worktree"` de l'outil `Agent`, mais elle part du `HEAD` du dossier du client, pas de la branche du sprint. Préfère les worktrees créés à la main ci-dessus.

## 2. Intégration (DevOps intégrateur)

Une fois la vague finie, lance le DevOps en mission « intégration » dans le worktree du sprint. Il fusionne chaque branche de tâche :

```
git merge --no-ff societe/sprint-<N>-T<k> -m "Intègre T<k> : <titre>"
```

- Conflit mécanique (lockfile, imports ajoutés des deux côtés, liste de routes) : il le résout. Pour un lockfile, il le régénère avec le gestionnaire de paquets du projet au lieu de l'éditer à la main.
- Conflit de logique : `git merge --abort`, et la tâche repart chez son développeur, qui la reprend depuis la tête du sprint.
- Après chaque fusion : build et tests. S'ils cassent, la fusion est annulée (`git reset --hard ORIG_HEAD`, **uniquement dans le worktree du sprint**) et le problème est noté.

Ensuite, le Directeur supprime les worktrees des tâches intégrées (`git worktree remove <chemin>`) puis leurs branches avec `git branch -d`, **lancé depuis le worktree du sprint**. `-d` refuse une branche non fusionnée dans la branche courante : depuis le dossier du client (sur `main`), il refuserait toutes les branches. Jamais `-D`.

## 3. Revue, QA et corrections

- **Revue** (Tech Lead et Sécurité) : dans le worktree du sprint, sur `git diff <commit de base>..societe/sprint-<N>`. Chaque revue note dans `review.md` / `security.md` le commit revu (`git rev-parse societe/sprint-<N>`). Au tour suivant, on ne relit que `git diff <commit revu>..societe/sprint-<N>`.
- **QA** : dans le worktree du sprint, donc sur le code réellement livré. Ses tests d'intégration sont commités sur la branche du sprint.
- **Corrections** : même mécanique qu'une vague, avec les branches `T<k>-c<c>`, puis une nouvelle intégration.

## 4. Livraison (le Directeur, après la sprint review)

1. Vérifie que la branche du sprint est propre (`git status` dans son worktree) et que les worktrees de tâches sont supprimés.
2. **Mode `push`** :
   ```
   git push -u origin societe/sprint-<N>
   gh pr create --base <branche de base> --head societe/sprint-<N> --title "Sprint <N> — <objectif>" --body-file <dossier du sprint>/sprint-report.md
   ```
   Ajoute le lien de la PR au rapport.
3. **Mode `local`** : rien n'est poussé. Le rapport donne le nom de la branche et la commande pour la pousser plus tard.
4. Garde le worktree du sprint : le client peut y essayer le produit. Le rapport donne la commande pour le retirer (`git worktree remove <parent>/<projet>.societe/s<N>`).

## Interdits

Ces actions sont irréversibles, publiques ou touchent le travail du client. Aucun agent ne les fait, même pour débloquer un sprint :

- pousser sur une autre branche que `societe/sprint-<N>` (jamais sur `main` ni sur la branche de base) ;
- `git push --force`, réécrire l'historique d'une branche poussée, pousser des tags ;
- fusionner la PR, activer l'auto-merge, supprimer une branche distante ;
- toucher le dossier du client hors `.societe/` et `.git/info/exclude` : pas de `stash`, `checkout`, `reset`, `clean` ;
- `--no-verify` : si un hook de pre-commit échoue, on corrige le code.
