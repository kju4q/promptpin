import React from "react";
import { Handle, Position, NodeTypes } from "reactflow";

interface NodeData {
  label: string;
}

// Cozy, soft, slightly larger node components
export const BlueNode = ({ data }: { data: NodeData }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 rounded-md shadow font-bold text-sm relative">
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!w-2.5 !h-2.5 !bg-blue-200 !border-2 !border-white"
    />
    {data.label}
  </div>
);

export const PurpleNode = ({ data }: { data: NodeData }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-md shadow font-bold text-sm relative">
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      className="!w-2.5 !h-2.5 !bg-purple-200 !border-2 !border-white"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!w-2.5 !h-2.5 !bg-purple-200 !border-2 !border-white"
    />
    {data.label}
  </div>
);

export const PinkNode = ({ data }: { data: NodeData }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-pink-100 text-pink-700 rounded-md shadow font-bold text-sm relative">
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      className="!w-2.5 !h-2.5 !bg-pink-200 !border-2 !border-white"
    />
    {data.label}
  </div>
);

export const NODE_TYPES: NodeTypes = {
  blue: BlueNode,
  purple: PurpleNode,
  pink: PinkNode,
};

export const INITIAL_NODES = [
  {
    id: "A",
    type: "blue",
    data: { label: "A" },
    position: { x: 0, y: 28 },
  },
  {
    id: "B",
    type: "purple",
    data: { label: "B" },
    position: { x: 60, y: 0 },
  },
  {
    id: "C",
    type: "purple",
    data: { label: "C" },
    position: { x: 60, y: 56 },
  },
  {
    id: "D",
    type: "pink",
    data: { label: "D" },
    position: { x: 120, y: 28 },
  },
];

export const INITIAL_EDGES = [
  {
    id: "A-B",
    source: "A",
    target: "B",
    sourceHandle: "right",
    targetHandle: "left",
    style: { stroke: "#cbd5e1", strokeWidth: 2 },
    type: "straight",
  },
  {
    id: "A-C",
    source: "A",
    target: "C",
    sourceHandle: "right",
    targetHandle: "left",
    style: { stroke: "#cbd5e1", strokeWidth: 2 },
    type: "straight",
  },
  {
    id: "B-D",
    source: "B",
    target: "D",
    sourceHandle: "right",
    targetHandle: "left",
    style: { stroke: "#cbd5e1", strokeWidth: 2 },
    type: "straight",
  },
];
