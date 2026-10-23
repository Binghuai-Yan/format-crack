import yaml from 'js-yaml'
import { XMLParser } from 'fast-xml-parser'
import Papa from 'papaparse'
import type { FormatType, GraphData, GraphItem } from './types'

export const examples: Record<FormatType, string> = {
  json: '{\n  "project": "Format Crack",\n  "version": 1,\n  "features": ["JSON", "YAML", "XML", "CSV", "Mermaid"],\n  "fast": true\n}',
  yaml: 'project: Format Crack\nversion: 1\nfeatures:\n  - JSON\n  - YAML\n  - XML\n  - CSV\n  - Mermaid\nfast: true',
  xml: '<project version="1"><name>Format Crack</name><features><item>JSON</item><item>YAML</item><item>XML</item></features></project>',
  csv: 'name,type,status\nJSON,parser,ready\nYAML,parser,ready\nMermaid,renderer,ready',
  mermaid: 'flowchart LR\n  A[Input] --> B{Parse}\n  B -->|JSON / YAML / XML| C[Tree Graph]\n  B -->|CSV| D[Data Table]\n  B -->|Mermaid| E[SVG Preview]'
}

export function parseSource(type: FormatType, source: string): { value: unknown; rows?: string[][] } {
  if (type === 'json') return { value: JSON.parse(source) }
  if (type === 'yaml') return { value: yaml.load(source) }
  if (type === 'xml') return { value: new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(source) }
  if (type === 'csv') { const parsed = Papa.parse<string[]>(source.trim(), { skipEmptyLines: true }); if (parsed.errors.length) throw new Error(parsed.errors[0].message); return { value: parsed.data, rows: parsed.data } }
  return { value: source }
}

function add(value: unknown, label: string, parent: string | undefined, depth: number, items: GraphItem[], edges: GraphData['edges'], path: string) {
  const id = path || 'root'; const kind = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value
  const display = value !== null && typeof value !== 'object' ? String(value) : undefined
  items.push({ id, label, value: display, kind, depth, parent }); if (parent) edges.push({ source: parent, target: id })
  if (value && typeof value === 'object') Object.entries(value as Record<string, unknown>).slice(0, 80).forEach(([key, child], index) => add(child, Array.isArray(value) ? `[${index}]` : key, id, depth + 1, items, edges, `${id}.${key}`))
}

export function toGraph(value: unknown): GraphData { const items: GraphItem[] = []; const edges: GraphData['edges'] = []; add(value, 'root', undefined, 0, items, edges, 'root'); return { items, edges } }
export function formatSource(type: FormatType, source: string): string {
  const parsed = parseSource(type, source)
  if (type === 'json') return JSON.stringify(parsed.value, null, 2)
  if (type === 'yaml') return yaml.dump(parsed.value, { noRefs: true, lineWidth: 120 })
  if (type === 'xml') return formatXml(source)
  if (type === 'csv') return Papa.unparse(parsed.rows ?? [])
  return source.trim()
}
function formatXml(source: string) { let depth = 0; return source.replace(/></g, '>\n<').split('\n').map(line => { if (line.match(/^<\//)) depth--; const out = '  '.repeat(Math.max(0, depth)) + line.trim(); if (line.match(/^<[^!?/][^>]*[^/]>/) && !line.includes('</')) depth++; return out }).join('\n') }
export function countStats(value: unknown, source: string) { let nodes = 0; const walk = (v: unknown) => { nodes++; if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(walk) }; walk(value); return { nodes, chars: source.length } }
