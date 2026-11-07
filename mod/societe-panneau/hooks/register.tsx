import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { AgentRow, Sprint } from '../types'

// Le panneau lit le journal que le Directeur de la société tient pendant le
// sprint : .societe/sprint-<N>/journal.jsonl, une ligne JSON par événement
// (format : references/journal.md du skill societe-logiciel).

const PANE = 'societe'
const TITRE = 'Société logiciel'
const sprint = atom({ plugin: 'societe-panneau', key: 'sprint' } as const, null, {
  shape: 'sprint-1',
})

const PHASES_IMPL = [
  'accueil', 'client', 'backlog', 'architecture', 'cadrage', 'developpement',
  'integration', 'revue', 'qa', 'review', 'livraison',
]
const PHASES_CADRAGE = ['accueil', 'client', 'backlog', 'architecture', 'cadrage', 'review']
const LIBELLES: Record<string, string> = {
  accueil: 'accueil', client: 'client', backlog: 'backlog', architecture: 'archi', cadrage: 'cadrage',
  developpement: 'dev', integration: 'intégration', revue: 'revue', qa: 'QA',
  correction: 'correction', review: 'sprint review', livraison: 'livraison',
}

/** Transforme le texte du journal en état du sprint. Une ligne illisible est ignorée. */
export function lireJournal(texte: string, dossier: string, numero: number): Sprint {
  const s: Sprint = {
    dossier, numero, objectif: '', mode: 'implementation', phase: 'accueil',
    phases: PHASES_IMPL, tour: 0, agents: [], livraison: '', majMs: 0,
  }
  const parId = new Map<string, AgentRow>()
  for (const ligne of texte.split(/\r?\n/)) {
    if (!ligne.trim()) continue
    let ev: Record<string, unknown>
    try { ev = JSON.parse(ligne) } catch { continue }
    const t = Date.parse(String(ev.t ?? '')) || 0
    const txt = (k: string) => (typeof ev[k] === 'string' ? (ev[k] as string) : '')
    switch (ev.type) {
      case 'sprint':
        s.objectif = txt('objectif') || s.objectif
        s.mode = txt('mode') || s.mode
        if (typeof ev.numero === 'number') s.numero = ev.numero
        break
      case 'mode':
        s.mode = txt('mode') || s.mode
        break
      case 'phase':
        s.phase = txt('phase') || s.phase
        break
      case 'tour':
        if (typeof ev.tour === 'number') s.tour = ev.tour
        break
      case 'livraison':
        s.livraison = txt('pr') || 'local'
        break
      case 'agent': {
        const id = txt('id')
        if (!id) break
        const etat = txt('etat')
        const connu = parId.get(id)
        if (etat === 'debut' || !connu) {
          const row: AgentRow = {
            id, role: txt('role') || connu?.role || id, tache: txt('tache') || connu?.tache || '',
            modele: txt('modele') || connu?.modele || '', etat: 'en cours', debut: t,
          }
          parId.set(id, row)
          s.agents = [...s.agents.filter(a => a.id !== id), row]
          if (etat === 'debut') break
        }
        const row = parId.get(id)!
        row.etat = etat === 'echec' ? 'echec' : 'fini'
        row.fin = t
        break
      }
    }
  }
  s.phases = s.mode === 'cadrage' ? PHASES_CADRAGE : PHASES_IMPL
  return s
}

function duree(ms: number): string {
  const sec = Math.max(0, Math.round(ms / 1000))
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  return min < 60 ? `${min}m${String(sec % 60).padStart(2, '0')}` : `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`
}

let dernierMtime = -1
let ouvert = false

// Cherche le sprint le plus récent du projet et relit son journal s'il a changé.
async function rafraichir($: EngineInterface) {
  const cwd = await $.session.cwd()
  const racine = `${cwd}/.societe`
  if (!(await $.fs.exists(racine))) return
  const sprints = (await $.fs.list(racine))
    .map(x => /^sprint-(\d+)$/.exec(x.name))
    .filter((m): m is RegExpExecArray => m !== null)
    .map(m => Number(m[1]))
    .sort((a, b) => b - a)
  for (const n of sprints) {
    const chemin = `${racine}/sprint-${n}/journal.jsonl`
    if (!(await $.fs.exists(chemin))) continue
    const st = await $.fs.stat(chemin)
    const maintenant = await $.clock.now()
    const actif = (await read($, sprint))?.agents.some(a => a.etat === 'en cours') ?? false
    if (st.mtimeMs === dernierMtime && !actif) return
    if (st.mtimeMs !== dernierMtime) {
      dernierMtime = st.mtimeMs
      const s = lireJournal(await $.fs.read(chemin), `${racine}/sprint-${n}`, n)
      await update($, sprint, () => ({ ...s, majMs: maintenant }))
      // Ouvre le panneau tout seul quand un sprint récent (moins d'une heure) bouge.
      if (!ouvert && maintenant - st.mtimeMs < 3_600_000) {
        ouvert = true
        void $.ui.open({ id: PANE, title: TITRE })
      }
      const enCours = s.agents.filter(a => a.etat === 'en cours').length
      await $.ui.status(
        s.livraison
          ? `Société · sprint ${s.numero} livré`
          : `Société · sprint ${s.numero} · ${LIBELLES[s.phase] ?? s.phase}${enCours ? ` · ${enCours} agent${enCours > 1 ? 's' : ''} au travail` : ''}`,
      )
    } else {
      // Rien de neuf dans le journal, mais des agents tournent : on redessine les chronos.
      await update($, sprint, v => (v ? { ...v, majMs: maintenant } : v))
    }
    return
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'societe',
      description: 'Ouvre le panneau qui montre la société au travail',
    })
    $.clock.every(2000, () => {
      void rafraichir($).catch(() => undefined)
    })
    return next(e)
  })

  on('command.run', { command: 'societe' }, async $ => {
    ouvert = true
    await $.ui.open({ id: PANE, title: TITRE })
    await rafraichir($).catch(() => undefined)
    return { text: 'Panneau de la société ouvert.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const s = await read($, sprint)
    if (!s) {
      return (
        <Box flexDirection="column">
          <Text dimColor>Aucun sprint en cours dans ce projet.</Text>
          <Text dimColor>Lance /societe-logiciel : le panneau suivra l'équipe.</Text>
        </Box>
      )
    }
    const ici = s.phases.indexOf(s.phase === 'correction' ? 'developpement' : s.phase)
    const enCours = s.agents.filter(a => a.etat === 'en cours')
    const finis = s.agents.filter(a => a.etat !== 'en cours')
    const place = Math.max(3, (e.viewport?.rows ?? 30) - 10 - enCours.length)

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text bold>
            Sprint {s.numero} · {s.mode}
            {s.tour > 0 ? ` · correction ${s.tour}/3` : ''}
          </Text>
          {s.objectif !== '' && <Text dimColor>{s.objectif}</Text>}
        </Box>

        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {s.phases.map((p, i) => (
            <Text
              color={i < ici || s.livraison ? 'success' : i === ici ? 'claude' : 'inactive'}
              bold={i === ici && !s.livraison}
            >
              {i < ici || s.livraison ? '✓' : i === ici ? '●' : '○'} {LIBELLES[p] ?? p}
            </Text>
          ))}
        </Box>

        <Box flexDirection="column">
          <Text bold>Au travail ({enCours.length})</Text>
          {enCours.length === 0 && <Text dimColor>Personne en ce moment.</Text>}
          {enCours.map(a => (
            <Text color="claude">
              ● {a.role}{a.tache ? ` — ${a.tache}` : ''}{a.modele ? ` · ${a.modele}` : ''} · {duree(s.majMs - a.debut)}
            </Text>
          ))}
        </Box>

        {finis.length > 0 && (
          <Box flexDirection="column">
            <Text bold>Terminé ({finis.length})</Text>
            {finis.slice(-place).reverse().map(a => (
              <Text color={a.etat === 'echec' ? 'error' : 'subtle'}>
                {a.etat === 'echec' ? '✗' : '✓'} {a.role}{a.tache ? ` — ${a.tache}` : ''}{a.modele ? ` · ${a.modele}` : ''} · {duree((a.fin ?? a.debut) - a.debut)}
              </Text>
            ))}
          </Box>
        )}

        {s.livraison !== '' && (
          <Text color="success" bold>
            Livré : {s.livraison === 'local' ? 'branche locale, rien de poussé' : s.livraison}
          </Text>
        )}
      </Box>
    )
  })
}
