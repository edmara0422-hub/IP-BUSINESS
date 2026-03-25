import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import type { UploadSummary } from '@/store/business-store'

const rowSchema = z.record(z.string(), z.union([z.string(), z.number(), z.null(), z.undefined()]))

function normalizeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return undefined
  const cleaned = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : undefined
}

function deriveMetrics(rows: Array<Record<string, unknown>>) {
  let revenue = 0
  let costs = 0
  let cash = 0
  let cac = 0
  let ltv = 0
  let cacHits = 0
  let ltvHits = 0

  rows.forEach((row) => {
    Object.entries(row).forEach(([key, rawValue]) => {
      const value = normalizeNumber(rawValue)
      if (value === undefined) return

      const normalizedKey = key.toLowerCase()
      if (normalizedKey.includes('receita') || normalizedKey.includes('revenue')) revenue += value
      if (normalizedKey.includes('custo') || normalizedKey.includes('cost')) costs += value
      if (normalizedKey.includes('caixa') || normalizedKey.includes('cash')) cash += value
      if (normalizedKey.includes('cac')) {
        cac += value
        cacHits += 1
      }
      if (normalizedKey.includes('ltv')) {
        ltv += value
        ltvHits += 1
      }
    })
  })

  return {
    revenue: revenue || undefined,
    costs: costs || undefined,
    cash: cash || undefined,
    cac: cacHits ? cac / cacHits : undefined,
    ltv: ltvHits ? ltv / ltvHits : undefined,
  }
}

function buildSummary(name: string, type: string, rows: Array<Record<string, unknown>>, status: UploadSummary['status'], note: string): UploadSummary {
  const safeRows = rows
    .map((row) => rowSchema.parse(row))
    .slice(0, 4)
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === 'number' ? value : value === null || value === undefined ? '' : String(value),
        ])
      )
    ) as Array<Record<string, string | number>>

  return {
    name,
    type,
    rows: rows.length,
    metrics: deriveMetrics(rows),
    preview: safeRows,
    status,
    note,
  }
}

export async function ingestBusinessFile(file: File): Promise<UploadSummary> {
  const lower = file.name.toLowerCase()

  if (lower.endsWith('.csv')) {
    const text = await file.text()
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    })

    return buildSummary(
      file.name,
      'CSV',
      parsed.data as Array<Record<string, unknown>>,
      'parsed',
      'Planilha CSV convertida para cockpit e simulacao.'
    )
  }

  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: '',
    })

    return buildSummary(file.name, 'Spreadsheet', rows, 'parsed', 'Planilha XLSX lida e conectada ao painel financeiro.')
  }

  if (lower.endsWith('.pdf')) {
    return {
      name: file.name,
      type: 'PDF',
      rows: 0,
      metrics: {},
      preview: [],
      status: 'captured',
      note: 'PDF capturado para pipeline de leitura contabil e classificacao documental.',
    }
  }

  return {
    name: file.name,
    type: 'Unknown',
    rows: 0,
    metrics: {},
    preview: [],
    status: 'captured',
    note: 'Arquivo recebido. Formato fora da rota principal de leitura automatica.',
  }
}
