import React, { useState, useCallback, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodesData } from "../data/nodesData";
import { edgesData } from "../data/edgesData";

export default function Home() {
  const [nodes, setNodes] = useState<any []>(nodesData);
  const [edges, setEdges] = useState<any[]>(edgesData);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: any) => {
    
  }, []);

  
  return (
    <div style={{ height: "95vh", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background />
      </ReactFlow>

    </div>
  );
}
