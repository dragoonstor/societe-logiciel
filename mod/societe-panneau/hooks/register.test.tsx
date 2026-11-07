import { expect, test } from 'claude-code/testing'

import { lireJournal } from './register'

const NOW = Date.parse('2026-11-07T22:00:30Z')
const JOURNAL = [
  '{"t":"2026-11-07T21:50:00Z","type":"sprint","numero":2,"objectif":"Outil de liste de tâches","mode":"implementation"}',
  '{"t":"2026-11-07T21:51:00Z","type":"phase","phase":"backlog"}',
  '{"t":"2026-11-07T21:51:00Z","type":"agent","id":"PO","role":"Product Owner","tache":"backlog","modele":"sonnet","etat":"debut"}',
  '{"t":"2026-11-07T21:52:10Z","type":"agent","id":"PO","etat":"fin"}',
  'ligne cassée',
  '{"t":"2026-11-07T22:00:00Z","type":"phase","phase":"developpement"}',
  '{"t":"2026-11-07T22:00:00Z","type":"agent","id":"T1","role":"Développeur","tache":"T1 — CLI","modele":"sonnet","etat":"debut"}',
].join('\n')

const PANE = {
  plugin: 'societe-panneau',
  component: 'Pane',
  requestId: 'societe',
  props: {
    title: 'Société logiciel',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const

test('le journal donne la phase, les agents et ignore une ligne cassée', () => {
  const s = lireJournal(JOURNAL, '/p/.societe/sprint-2', 2)
  expect(s.phase).toBe('developpement')
  expect(s.objectif).toBe('Outil de liste de tâches')
  expect(s.agents.map(a => `${a.id}:${a.etat}`)).toEqual(['PO:fini', 'T1:en cours'])
  expect((s.agents[0].fin ?? 0) - s.agents[0].debut).toBe(70_000)
})

test('le panneau montre le dev au travail et le PO terminé', async ($, on) => {
  on('command.register', () => ({ value: { command: 'societe' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.status', () => ({ value: undefined }))
  on('clock.every', () => ({ value: { cancel: () => undefined } }))
  on('clock.now', () => ({ value: NOW }))
  on('session.cwd', () => ({ value: '/p' }))
  on('fs.exists', () => ({ value: true }))
  on('fs.list', () => ({
    value: [{ name: 'sprint-2', kind: 'directory', size: 0, mtimeMs: 0, isLink: false }],
  }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 1, mtimeMs: NOW - 10_000, isLink: false } }))
  on('fs.read', () => ({ value: JOURNAL }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/p', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'societe', args: '' })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Sprint 2/ }))?.text).toContain('implementation')
  expect((await ui.find({ type: 'Text', text: /Développeur/ }))?.text).toBe('● Développeur — T1 — CLI · sonnet · 30s')
  expect((await ui.find({ type: 'Text', text: /Product Owner/ }))?.text).toBe('✓ Product Owner — backlog · sonnet · 1m10')
  await ui.unmount()
})

test('sans sprint, le panneau le dit', async $ => {
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('Aucun sprint en cours dans ce projet.')
  await ui.unmount()
})
