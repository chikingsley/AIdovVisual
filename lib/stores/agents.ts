import { create } from 'zustand'
import { type Node, type Edge } from 'reactflow'

interface AgentsState {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
}

const initialNodes: Node[] = [
  {
    id: 'document-1',
    type: 'agent',
    position: { x: 250, y: 100 },
    data: {
      name: 'Document Processor',
      description: 'Analyzes and extracts information from construction documents',
      type: 'document',
      status: 'processing',
      currentTask: 'Processing floor plans',
      progress: 45,
    },
  },
  {
    id: 'technical-1',
    type: 'agent',
    position: { x: 100, y: 250 },
    data: {
      name: 'Technical Reviewer',
      description: 'Validates technical specifications and requirements',
      type: 'technical',
      status: 'idle',
    },
  },
  {
    id: 'compliance-1',
    type: 'agent',
    position: { x: 400, y: 250 },
    data: {
      name: 'Compliance Checker',
      description: 'Ensures compliance with building codes and regulations',
      type: 'compliance',
      status: 'error',
      error: 'Missing required safety specifications',
    },
  },
  {
    id: 'cost-1',
    type: 'agent',
    position: { x: 250, y: 400 },
    data: {
      name: 'Cost Estimator',
      description: 'Calculates project costs and budget implications',
      type: 'cost',
      status: 'complete',
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'edge-1',
    source: 'document-1',
    target: 'technical-1',
    animated: true,
  },
  {
    id: 'edge-2',
    source: 'document-1',
    target: 'compliance-1',
    animated: true,
  },
  {
    id: 'edge-3',
    source: 'technical-1',
    target: 'cost-1',
  },
  {
    id: 'edge-4',
    source: 'compliance-1',
    target: 'cost-1',
  },
]

export const useStore = create<AgentsState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  setNodes: (nodes) => set((state) => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),
  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),
}))