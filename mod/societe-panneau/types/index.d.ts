export type AgentRow = {
  id: string
  role: string
  tache: string
  modele: string
  etat: 'en cours' | 'fini' | 'echec'
  debut: number
  fin?: number
}

export type Sprint = {
  dossier: string
  numero: number
  objectif: string
  mode: string
  phase: string
  phases: string[]
  tour: number
  agents: AgentRow[]
  livraison: string
  majMs: number
}

declare module 'claude-code' {
  interface PluginState {
    'societe-panneau': { sprint: Shaped<Sprint | null> }
  }
}
