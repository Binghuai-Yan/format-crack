export type FormatType = 'json' | 'yaml' | 'xml' | 'csv' | 'mermaid'
export type Status = { kind: 'success' | 'error' | 'idle'; message: string }
export type GraphItem = { id: string; label: string; value?: string; kind: string; depth: number; parent?: string }
export type GraphData = { items: GraphItem[]; edges: Array<{ source: string; target: string }> }
