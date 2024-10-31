'use client'

import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from 'reactflow'
import { AgentNode } from './nodes/agent-node'
import { useStore } from '@/lib/stores/agents'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import 'reactflow/dist/style.css'

const nodeTypes = {
  agent: AgentNode,
}

export function Dashboard() {
  const { nodes, edges, setNodes, setEdges } = useStore()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )

  const simulateProcessing = () => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'processing',
          progress: 0,
          currentTask: 'Starting analysis...',
        },
      }))
    )

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress <= 100) {
        setNodes((currentNodes) =>
          currentNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              progress,
              currentTask: `Processing step ${progress / 10} of 10...`,
            },
          }))
        )
      } else {
        clearInterval(interval)
        setNodes((currentNodes) =>
          currentNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              status: 'complete',
              currentTask: undefined,
              progress: undefined,
            },
          }))
        )
        toast.success('Processing completed successfully')
      }
    }, 1000)
  }

  const pauseProcessing = () => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
          currentTask: undefined,
          progress: undefined,
        },
      }))
    )
    toast.info('Processing paused')
  }

  const resetNodes = () => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
          currentTask: undefined,
          progress: undefined,
          error: undefined,
        },
      }))
    )
    toast.info('Agents reset to initial state')
  }

  return (
    <div className="h-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-muted/5"
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={simulateProcessing}
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={pauseProcessing}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetNodes}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}