import React from "react";
import { Handle, Position, NodeTypes } from "reactflow";

interface NodeData {
  label: string;
}

// Define node components
export const InputNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
    <Handle type="source" position={Position.Right} id="right" />
    {data.label}
  </div>
);

export const OutputNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">
    <Handle type="target" position={Position.Left} id="left" />
    {data.label}
  </div>
);

export const DefaultNode = ({ data }: { data: NodeData }) => (
  <div className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
    <Handle type="target" position={Position.Left} id="left" />
    <Handle type="source" position={Position.Right} id="right" />
    {data.label}
  </div>
);

// Export nodeTypes object
export const NODE_TYPES: NodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
};

// Define initial nodes and edges
export const INITIAL_NODES = [
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
];

export const INITIAL_EDGES = [
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
];
