'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  type BusinessInputs,
  type BusinessModuleKey,
  defaultBusinessInputs,
} from '@/lib/business-math'

export interface JourneyNode {
  id: string
  title: string
  lane: 'acquisition' | 'conversion' | 'delivery' | 'retention'
  conversionRate: number
  avgDays: number
  leakageCost: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  productivity: number
  engagement: number
  stress: number
  salary: number
  squad: 'growth' | 'ops' | 'finance'
}

export interface CanvasCard {
  id: string
  lane: 'problem' | 'solution' | 'revenue' | 'go-to-market' | 'esg' | 'pitch'
  title: string
  body: string
}

export interface ComplianceRisk {
  id: string
  area: string
  legalRisk: number
  ethicalRisk: number
  impact: number
}

export interface MarketSignal {
  id: string
  label: string
  value: number
  delta: number
  sentiment: 'up' | 'down' | 'neutral'
}

export interface UploadSummary {
  name: string
  type: string
  rows: number
  metrics: {
    revenue?: number
    costs?: number
    cash?: number
    cac?: number
    ltv?: number
  }
  preview: Array<Record<string, string | number>>
  status: 'parsed' | 'captured'
  note: string
}

export interface BusinessWorkspace {
  id: string
  name: string
  kind: 'company' | 'client'
  sector: string
  status: 'active' | 'archived'
  sourceStatus: 'empty' | 'manual' | 'connected' | 'validated'
  sourceLabel: string
  updatedAt: string
  archivedAt: string | null
  inputs: BusinessInputs
  journey: JourneyNode[]
  team: TeamMember[]
  modelCanvas: CanvasCard[]
  risks: ComplianceRisk[]
  marketSignals: MarketSignal[]
  uploadSummary: UploadSummary | null
}

export type BusinessSection = 'panorama' | 'macro' | 'setores' | 'plataformas' | 'problemas' | 'simulacao'

interface BusinessState {
  activeModule: BusinessModuleKey
  activeWorkspaceId: string
  businessActiveSection: BusinessSection
  workspaces: BusinessWorkspace[]
  studyNotes: Record<string, string>
  studyProgress: Record<string, boolean>
  updateStudyNote: (submoduleId: string, text: string) => void
  markSubmoduleRead: (submoduleId: string) => void
  setActiveModule: (module: BusinessModuleKey) => void
  setBusinessSection: (section: BusinessSection) => void
  setActiveWorkspace: (workspaceId: string) => void
  createClient: (payload: { name: string; sector: string }) => void
  updateWorkspaceMeta: (workspaceId: string, payload: { name: string; sector: string }) => void
  archiveWorkspace: (workspaceId: string) => void
  restoreWorkspace: (workspaceId: string) => void
  resetWorkspaceData: (workspaceId: string) => void
  updateInput: <K extends keyof BusinessInputs>(key: K, value: BusinessInputs[K]) => void
  patchInputs: (partial: Partial<BusinessInputs>) => void
  moveJourneyNode: (id: string, lane: JourneyNode['lane']) => void
  moveTeamMember: (id: string, squad: TeamMember['squad']) => void
  moveCanvasCard: (id: string, lane: CanvasCard['lane']) => void
  setUploadSummary: (summary: UploadSummary | null) => void
  updateMarketSignals: (signals: MarketSignal[]) => void
  updateRisk: (id: string, partial: Partial<Omit<ComplianceRisk, 'id'>>) => void
  addRisk: (risk: Omit<ComplianceRisk, 'id'>) => void
  deleteRisk: (id: string) => void
}

const defaultJourney: JourneyNode[] = [
  { id: 'lead', title: 'Lead Capture', lane: 'acquisition', conversionRate: 42, avgDays: 2, leakageCost: 1200 },
  { id: 'qualify', title: 'Qualification', lane: 'conversion', conversionRate: 28, avgDays: 4, leakageCost: 2600 },
  { id: 'proposal', title: 'Proposal & Price', lane: 'conversion', conversionRate: 19, avgDays: 6, leakageCost: 3400 },
  { id: 'delivery', title: 'Delivery Flow', lane: 'delivery', conversionRate: 92, avgDays: 8, leakageCost: 1500 },
  { id: 'retention', title: 'Retention Loop', lane: 'retention', conversionRate: 76, avgDays: 18, leakageCost: 800 },
]

const defaultTeam: TeamMember[] = [
  { id: 'ana', name: 'Ana', role: 'Growth Strategist', productivity: 86, engagement: 82, stress: 28, salary: 7800, squad: 'growth' },
  { id: 'joao', name: 'Joao', role: 'Ops Lead', productivity: 72, engagement: 68, stress: 54, salary: 8400, squad: 'ops' },
  { id: 'bia', name: 'Bia', role: 'Finance Analyst', productivity: 91, engagement: 78, stress: 36, salary: 7600, squad: 'finance' },
  { id: 'leo', name: 'Leo', role: 'Product Designer', productivity: 79, engagement: 88, stress: 33, salary: 6900, squad: 'growth' },
  { id: 'marina', name: 'Marina', role: 'Customer Ops', productivity: 69, engagement: 74, stress: 47, salary: 5800, squad: 'ops' },
  { id: 'caio', name: 'Caio', role: 'FP&A', productivity: 83, engagement: 71, stress: 41, salary: 8100, squad: 'finance' },
]

const defaultCanvas: CanvasCard[] = [
  { id: 'c1', lane: 'problem', title: 'Cash chaos', body: 'MEIs nao enxergam caixa e margem em tempo real.' },
  { id: 'c2', lane: 'solution', title: 'Command deck', body: 'Painel vivo com simulacao, twin e diagnostico.' },
  { id: 'c3', lane: 'revenue', title: 'SaaS', body: 'Assinatura premium com modulos verticais.' },
  { id: 'c4', lane: 'go-to-market', title: 'Consultoria-led', body: 'Entrada com consultoria e expansao por squads.' },
  { id: 'c5', lane: 'esg', title: 'Ethical score', body: 'Produto mede impacto social e risco etico.' },
  { id: 'c6', lane: 'pitch', title: 'Investor pitch', body: 'Narrativa automatica baseada nos indicadores.' },
]

const defaultRisks: ComplianceRisk[] = [
  { id: 'r1', area: 'LGPD', legalRisk: 72, ethicalRisk: 58, impact: 94000 },
  { id: 'r2', area: 'Pricing', legalRisk: 42, ethicalRisk: 34, impact: 38000 },
  { id: 'r3', area: 'ESG', legalRisk: 28, ethicalRisk: 66, impact: 52000 },
  { id: 'r4', area: 'Payroll', legalRisk: 61, ethicalRisk: 41, impact: 47000 },
  { id: 'r5', area: 'Vendor Risk', legalRisk: 54, ethicalRisk: 45, impact: 65000 },
]

const defaultSignals: MarketSignal[] = [
  { id: 'm1', label: 'Inflacao', value: 5.4, delta: 0.7, sentiment: 'up' },
  { id: 'm2', label: 'Dolar', value: 5.12, delta: -0.2, sentiment: 'down' },
  { id: 'm3', label: 'PIB', value: 2.3, delta: 0.4, sentiment: 'up' },
  { id: 'm4', label: 'Demanda', value: 68, delta: 8, sentiment: 'up' },
  { id: 'm5', label: 'Pressao competitiva', value: 57, delta: 11, sentiment: 'up' },
]

function cloneInputs(overrides: Partial<BusinessInputs> = {}): BusinessInputs {
  return { ...defaultBusinessInputs, ...overrides }
}

function cloneJourney(): JourneyNode[] {
  return defaultJourney.map((item) => ({ ...item }))
}

function cloneTeam(): TeamMember[] {
  return defaultTeam.map((item) => ({ ...item }))
}

function cloneCanvas(): CanvasCard[] {
  return defaultCanvas.map((item) => ({ ...item }))
}

function cloneRisks(): ComplianceRisk[] {
  return defaultRisks.map((item) => ({ ...item }))
}

function cloneSignals(): MarketSignal[] {
  return defaultSignals.map((item) => ({ ...item }))
}

function createWorkspace(
  id: string,
  name: string,
  kind: BusinessWorkspace['kind'],
  sector: string,
  sourceStatus: BusinessWorkspace['sourceStatus'],
  sourceLabel: string,
  overrides: Partial<BusinessInputs> = {},
): BusinessWorkspace {
  return {
    id,
    name,
    kind,
    sector,
    status: 'active',
    sourceStatus,
    sourceLabel,
    updatedAt: new Date().toISOString(),
    archivedAt: null,
    inputs: cloneInputs(overrides),
    journey: cloneJourney(),
    team: cloneTeam(),
    modelCanvas: cloneCanvas(),
    risks: cloneRisks(),
    marketSignals: cloneSignals(),
    uploadSummary: null,
  }
}

function hasAnyBusinessInputValue(inputs: BusinessInputs) {
  return Object.values(inputs).some((value) => Number.isFinite(value) && value > 0)
}

function resolveWorkspaceSource(inputs: BusinessInputs, uploadSummary: UploadSummary | null) {
  if (uploadSummary) {
    return {
      sourceStatus: 'connected' as const,
      sourceLabel: `${uploadSummary.type} • ${uploadSummary.name}`,
    }
  }

  if (hasAnyBusinessInputValue(inputs)) {
    return {
      sourceStatus: 'manual' as const,
      sourceLabel: 'Base manual preenchida',
    }
  }

  return {
    sourceStatus: 'empty' as const,
    sourceLabel: 'Base vazia',
  }
}

const defaultWorkspaces: BusinessWorkspace[] = [
  createWorkspace(
    'workspace-main',
    'Empresa principal',
    'company',
    'Consultoria, SaaS, Fintech',
    'manual',
    'Base manual preenchida',
    {
      monthlyRevenue: 120000,
      operatingExpenses: 48000,
      cashReserve: 35000,
      pricePerUnit: 120,
      cac: 1800,
      ltv: 9800,
      growthRate: 8.2,
      inflationRate: 5.4,
      fxRate: 5.12,
      ethicsRisk: 22,
      plannedInvestment: 60000,
      expectedReturn: 180000,
    }
  ),
]

function updateActiveWorkspace(
  state: Pick<BusinessState, 'activeWorkspaceId' | 'workspaces'>,
  updater: (workspace: BusinessWorkspace) => BusinessWorkspace,
) {
  return state.workspaces.map((workspace) =>
    workspace.id === state.activeWorkspaceId ? updater(workspace) : workspace
  )
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => {
      // Ignora localStorage se estiver vazio ou corrompido
      try {
        const raw = localStorage.getItem('ipb-business-store-v4')
        if (!raw || raw === '{}' || raw === 'null') {
          localStorage.removeItem('ipb-business-store-v4')
        } else {
          const parsed = JSON.parse(raw)
          if (!parsed.workspaces || parsed.workspaces.length === 0) {
            localStorage.removeItem('ipb-business-store-v4')
          }
        }
      } catch (e) {
        localStorage.removeItem('ipb-business-store-v4')
      }
      return {
        activeModule: 'command',
        activeWorkspaceId: 'workspace-main',
        businessActiveSection: 'panorama',
        workspaces: defaultWorkspaces,
        studyNotes: {},
        studyProgress: {},
        updateStudyNote: (submoduleId, text) =>
          set((state) => ({ studyNotes: { ...state.studyNotes, [submoduleId]: text } })),
        markSubmoduleRead: (submoduleId) =>
          set((state) => ({ studyProgress: { ...state.studyProgress, [submoduleId]: true } })),
        setActiveModule: (module) => set({ activeModule: module }),
        setBusinessSection: (section) => set({ businessActiveSection: section }),
        setActiveWorkspace: (workspaceId) =>
          set((state) => {
            const target = state.workspaces.find((workspace) => workspace.id === workspaceId && workspace.status === 'active')
            if (!target) {
              return state
            }
            return {
              activeWorkspaceId: target.id,
            }
          }),
        createClient: ({ name, sector }) =>
          set((state) => {
            const workspace = createWorkspace(
              `workspace-${Date.now()}`,
              name.trim(),
              'client',
              sector.trim(),
              'empty',
              'Base vazia',
            )
            return {
              workspaces: [...state.workspaces, workspace],
              activeWorkspaceId: workspace.id,
            }
          }),
        updateWorkspaceMeta: (workspaceId, payload) =>
          set((state) => ({
            workspaces: state.workspaces.map((workspace) =>
              workspace.id === workspaceId
                ? {
                  ...workspace,
                  name: payload.name.trim(),
                  sector: payload.sector.trim(),
                  updatedAt: new Date().toISOString(),
                }
                : workspace
            ),
          })),
        archiveWorkspace: (workspaceId) =>
          set((state) => {
            const target = state.workspaces.find((workspace) => workspace.id === workspaceId)
            if (!target || target.kind === 'company' || target.status === 'archived') {
              return state
            }
            const updatedWorkspaces = state.workspaces.map((workspace) =>
              workspace.id === workspaceId
                ? {
                  ...workspace,
                  status: 'archived' as const,
                  archivedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
                : workspace
            )
            const nextActiveId =
              state.activeWorkspaceId === workspaceId
                ? updatedWorkspaces.find((workspace) => workspace.status === 'active')?.id ?? 'workspace-main'
                : state.activeWorkspaceId
            return {
              workspaces: updatedWorkspaces,
              activeWorkspaceId: nextActiveId,
            }
          }),
        restoreWorkspace: (workspaceId) =>
          set((state) => ({
            workspaces: state.workspaces.map((workspace) =>
              workspace.id === workspaceId
                ? {
                  ...workspace,
                  status: 'active',
                  archivedAt: null,
                  updatedAt: new Date().toISOString(),
                }
                : workspace
            ),
            activeWorkspaceId: workspaceId,
          })),
        resetWorkspaceData: (workspaceId) =>
          set((state) => ({
            workspaces: state.workspaces.map((workspace) =>
              workspace.id === workspaceId
                ? {
                  ...workspace,
                  updatedAt: new Date().toISOString(),
                  sourceStatus: 'empty',
                  sourceLabel: 'Base vazia',
                  inputs: cloneInputs(),
                  journey: cloneJourney(),
                  team: cloneTeam(),
                  modelCanvas: cloneCanvas(),
                  risks: cloneRisks(),
                  marketSignals: cloneSignals(),
                  uploadSummary: null,
                }
                : workspace
            ),
          })),
        updateInput: (key, value) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              ...(workspace.sourceStatus === 'connected' || workspace.sourceStatus === 'validated'
                ? {}
                : resolveWorkspaceSource(
                  {
                    ...workspace.inputs,
                    [key]: value,
                  },
                  workspace.uploadSummary,
                )),
              inputs: {
                ...workspace.inputs,
                [key]: value,
              },
            })),
          })),
        patchInputs: (partial) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              ...(workspace.sourceStatus === 'connected' || workspace.sourceStatus === 'validated'
                ? {}
                : resolveWorkspaceSource(
                  {
                    ...workspace.inputs,
                    ...partial,
                  },
                  workspace.uploadSummary,
                )),
              inputs: {
                ...workspace.inputs,
                ...partial,
              },
            })),
          })),
        moveJourneyNode: (id, lane) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              journey: workspace.journey.map((node) => (node.id === id ? { ...node, lane } : node)),
            })),
          })),
        moveTeamMember: (id, squad) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => {
              const squadPeers = workspace.team.filter((m) => m.squad === squad && m.id !== id)
              const squadAvgStress =
                squadPeers.length > 0
                  ? squadPeers.reduce((sum, m) => sum + m.stress, 0) / squadPeers.length
                  : 38
              return {
                ...workspace,
                updatedAt: new Date().toISOString(),
                team: workspace.team.map((member) => {
                  if (member.id !== id) return member
                  const stressDelta = Math.round((squadAvgStress - member.stress) * 0.28)
                  const newStress = Math.min(95, Math.max(10, member.stress + stressDelta))
                  const prodDelta = stressDelta > 0 ? -Math.round(Math.abs(stressDelta) * 0.2) : Math.round(Math.abs(stressDelta) * 0.15)
                  const newProductivity = Math.min(99, Math.max(30, member.productivity + prodDelta))
                  return { ...member, squad, stress: newStress, productivity: newProductivity }
                }),
              }
            }),
          })),
        moveCanvasCard: (id, lane) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              modelCanvas: workspace.modelCanvas.map((card) => (card.id === id ? { ...card, lane } : card)),
            })),
          })),
        setUploadSummary: (summary) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              ...resolveWorkspaceSource(workspace.inputs, summary),
              uploadSummary: summary,
            })),
          })),
        updateMarketSignals: (signals) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              marketSignals: signals,
            })),
          })),
        updateRisk: (id, partial) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              risks: workspace.risks.map((risk) => (risk.id === id ? { ...risk, ...partial } : risk)),
            })),
          })),
        addRisk: (risk) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              risks: [...workspace.risks, { ...risk, id: `risk-${Date.now()}` }],
            })),
          })),
        deleteRisk: (id) =>
          set((state) => ({
            workspaces: updateActiveWorkspace(state, (workspace) => ({
              ...workspace,
              updatedAt: new Date().toISOString(),
              risks: workspace.risks.filter((risk) => risk.id !== id),
            })),
          })),
      }
    },
  {
    name: 'ipb-business-store-v4',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
      activeModule: state.activeModule,
      businessActiveSection: state.businessActiveSection,
      workspaces: state.workspaces,
      studyNotes: state.studyNotes,
      studyProgress: state.studyProgress,
    }),
  },
),
)
