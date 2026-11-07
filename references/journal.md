# Journal du sprint

Le Directeur tient `.societe/sprint-<N>/journal.jsonl` : **une ligne JSON par événement**, ajoutée à la fin du fichier, jamais réécrite. Deux choses le lisent :

- le **panneau en direct** (mod `societe-panneau`) le relit toutes les 2 secondes et montre la phase et les agents au travail ;
- la **page récapitulative** (`sprint-replay.html`), générée en fin de sprint, rejoue le sprint sous forme de frise.

Une ligne coûte presque rien. Écris-la avec une seule commande shell, dans le même message que l'appel `Agent` qu'elle annonce (début) ou juste après son résultat (fin). `<J>` est le chemin absolu du journal.

## Les événements

```bash
# Début du sprint (une fois)
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"sprint\",\"numero\":<N>,\"objectif\":\"<objectif court>\",\"mode\":\"implementation\"}" >> <J>
# Le PO a choisi le mode cadrage : le redire
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"mode\",\"mode\":\"cadrage\"}" >> <J>
# Changement de phase
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"phase\",\"phase\":\"developpement\"}" >> <J>
# Un agent démarre
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"agent\",\"id\":\"T1\",\"role\":\"Développeur\",\"tache\":\"T1 — <titre>\",\"modele\":\"sonnet\",\"etat\":\"debut\"}" >> <J>
# Il a fini (ou échoué : \"etat\":\"echec\")
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"agent\",\"id\":\"T1\",\"etat\":\"fin\"}" >> <J>
# Tour de correction k
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"tour\",\"tour\":1}" >> <J>
# Livraison : lien de la PR, ou \"local\"
echo "{\"t\":\"$(date -u +%FT%TZ)\",\"type\":\"livraison\",\"pr\":\"<url>\"}" >> <J>
```

- **Phases** (valeurs exactes) : `accueil`, `client`, `backlog`, `architecture`, `cadrage`, `developpement`, `integration`, `revue`, `qa`, `correction`, `review`, `livraison`.
- **id** : unique pendant que l'agent tourne. `CDC` (chargé de compte), `PO`, `TL`, `SEC`, `QA`, `DEVOPS`, ou l'id de la tâche (`T1`). Un même rôle relancé plus tard réutilise son id : la nouvelle ligne `debut` remplace l'ancienne.
- Garde les textes courts, sans guillemets doubles ni retours à la ligne.
- Le panneau fonctionne même si une ligne est mal formée : elle est ignorée.

## La page récapitulative

En fin de sprint, après la ligne `livraison`, génère la page à partir du gabarit du skill :

```bash
awk -v f="<J>" '/^__JOURNAL__\r?$/{while((getline l<f)>0)print l;next}1' "<chemin du skill>/assets/replay.html" > "<dossier du sprint>/sprint-replay.html"
```

La page ne dépend de rien d'autre : le client l'ouvre dans son navigateur. Donne son chemin dans le rapport de sprint.
