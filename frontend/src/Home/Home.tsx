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
  const [nodes, setNodes] = useState(nodesData);
  const [edges, setEdges] = useState<any[]>(edgesData);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setselectedEdgeIds] = useState<any[]>([]);
  
  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `Node ${nodes.length + 1}`,
        weight: 1,
        Emissions: 1,
        },
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
    setSelectedNodeIds([]);
  };;

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: any) => {
  }, []);

  

  const deleteEdge = useCallback(() => {
    console.log("selectedEdgeIds", selectedEdgeIds);
    const targetNodeForTheDeletedEdge = selectedEdgeIds[0].target;
    console.log("targetNodeForTheDeletedEdge", targetNodeForTheDeletedEdge);
    if (selectedEdgeIds.length === 0) return;
    setEdges((eds) => eds.filter((e) => !selectedEdgeIds[0].id.includes(e.id)));
    setselectedEdgeIds([]);
  }, [selectedEdgeIds]);

  const onNodeClick = useCallback((event: any, node: any) => {
    if (event.ctrlKey) {
      setSelectedNodeIds((prev) =>
        prev.includes(node.id)
          ? prev.filter((id) => id !== node.id)
          : [...prev, node.id]
      );
    } else {
      setSelectedNodeIds([node.id]);
    }
  }, []);

  const onEdgeClick = useCallback((event: any, edge: any) => {
    if (event.ctrlKey) {
      setselectedEdgeIds((prev) =>
        prev.includes(edge.id)
          ? prev.filter((id) => id !== edge.id)
          : [...prev, edge.id]
      );
    } else {
      console.log("edge", edge);
      setselectedEdgeIds([edge]);
    }
  }, []);

  return (
    <div style={{ height: "95vh", position: "relative" }}>
      <button onClick={deleteNode} disabled={!selectedNodeIds.length}>
        Delete Node
      </button>
      <button onClick={deleteEdge} disabled={!selectedEdgeIds.length}>
        Delete Edge
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
        onEdgeClick={onEdgeClick}
      >
        <Controls />
        <Background />
      </ReactFlow>

      
    </div>
  );
}
