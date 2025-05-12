"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  Position,
  NodeTypes,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

interface NodeData {
  label: string;
}

// Define node components separately
const InputNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
    <Handle type="source" position={Position.Right} id="right" />
    {data.label}
  </div>
);

const OutputNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">
    <Handle type="target" position={Position.Left} id="left" />
    {data.label}
  </div>
);

const DefaultNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
    <Handle type="target" position={Position.Left} id="left" />
    <Handle type="source" position={Position.Right} id="right" />
    {data.label}
  </div>
);

export default function PromptTreeTooltip() {
  // Use useMemo to memoize nodeTypes
  const nodeTypes = useMemo(
    () => ({
      input: InputNode,
      output: OutputNode,
      default: DefaultNode,
    }),
    []
  );

  // Memoize nodes
  const nodes = useMemo<Node<NodeData>[]>(
    () => [
      {
        id: "1",
        type: "input",
        data: { label: "Original" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        type: "default",
        data: { label: "Refined" },
        position: { x: 100, y: 0 },
      },
      {
        id: "3",
        type: "output",
        data: { label: "Final" },
        position: { x: 200, y: 0 },
      },
    ],
    []
  );

  // Memoize edges
  const edges = useMemo<Edge[]>(
    () => [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        sourceHandle: "right",
        targetHandle: "left",
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        sourceHandle: "right",
        targetHandle: "left",
      },
    ],
    []
  );

  return (
    <div className="w-[200px] h-[120px] bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-200 ease-out scale-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
    </div>
  );
}
