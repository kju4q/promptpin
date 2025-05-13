"use client";

import React from "react";
import ReactFlow, { Background, ReactFlowProps } from "reactflow";
import { NODE_TYPES, INITIAL_NODES, INITIAL_EDGES } from "./flowNodes";
import "reactflow/dist/style.css";

// Flow configuration
const flowConfig: Partial<ReactFlowProps> = {
  fitView: true,
  minZoom: 0.5,
  maxZoom: 1,
  nodesDraggable: false,
  nodesConnectable: false,
  elementsSelectable: false,
  panOnDrag: false,
  zoomOnScroll: false,
  proOptions: { hideAttribution: true },
};

export default function PromptTreeTooltip() {
  return (
    <div className="w-[200px] h-[120px] bg-white rounded-lg shadow-lg border border-gray-200">
      <ReactFlow
        nodes={INITIAL_NODES}
        edges={INITIAL_EDGES}
        nodeTypes={NODE_TYPES}
        {...flowConfig}
      >
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
    </div>
  );
}
