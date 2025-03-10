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
  const [nodes, setNodes] = useState<any[]>(nodesData);
  const [edges, setEdges] = useState<any[]>(edgesData);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string>("");

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      label: `Node ${nodes.length + 1}`,
      type: "default",
    };
    console.log(nodes.length);
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = () => {
    if (selectedNodeIds.length === 0) return;
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target)
      )
    );
    setSelectedNodeIds("");
  };

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: any) => {
    console.log(connection);
  }, []);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNodeIds(node.id);
  }, []);


  return (
    <div style={{ height: "95vh", position: "relative" }}>
      <button onClick={deleteNode} disabled={!selectedNodeIds.length}>
        Delete Node
      </button>
      <br />
      <button onClick={addNode} style={{ marginBottom: 10 }}>
        Add Node
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
      >
        <Controls />
        <Background />
      </ReactFlow>

      
    </div>
  );
}
