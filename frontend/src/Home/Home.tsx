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
  const [panelPosition, setPanelPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `Node ${nodes.length + 1}`,
        weight: 1,
        ownEmissions: 1,
        totalEmissions: 1,
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
  };

  const updateNodeData = (field: string, value: string | number) => {
    setNodes((nds) =>
      nds.map((node) =>
        selectedNodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      )
    );
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

  const deleteEdge = useCallback(() => {
    if (selectedEdgeIds.length === 0) return;

    const edgeIdToDelete = selectedEdgeIds[0].id;

    const edgeToDelete = edges.find((e) => {
      console.log(e, edgeIdToDelete, "Yarrab");
      return e.id === edgeIdToDelete;
    });

    if (!edgeToDelete) return;

    const sourceNodeId = edgeToDelete.source;

    setEdges((eds) => eds.filter((e) => e.id !== edgeIdToDelete));

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
      setPanelPosition({
        x: Math.min(event.clientX, window.innerWidth - 200),
        y: Math.min(event.clientY, window.innerHeight - 200),
      });
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

      {panelPosition && selectedNodeIds.length === 1 && (
        <div
          style={{
            position: "absolute",
            left: panelPosition.x,
            top: panelPosition.y,
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h4>Edit Node</h4>
          <label>Name: </label>
          <input
            type="text"
            placeholder="Enter node name"
            value={
              nodes.find((node) => node.id === selectedNodeIds[0])?.data
                .label || ""
            }
            onChange={(e) => updateNodeData("label", e.target.value)}
          />
          <br />
          <label>Weight: </label>
          <input
            type="number"
            placeholder="Enter node weight"
            value={
              nodes.find((node) => node.id === selectedNodeIds[0])?.data
                .weight || ""
            }
            onChange={(e) => updateNodeData("weight", Number(e.target.value))}
          />
          <br />
          <label>Emissions: </label>
          <input
            type="number"
            placeholder="Enter node emissions"
            value={
              nodes.find((node) => node.id === selectedNodeIds[0])?.data
                .ownEmissions || ""
            }
            onChange={(e) =>
              updateNodeData("ownEmissions", Number(e.target.value))
            }
          />
          <br />
          <label>Total Emissions: </label>
          <input
            disabled
            type="number"
            placeholder="..."
            value={
              nodes.find((node) => node.id === selectedNodeIds[0])?.data
                .totalEmissions || ""
            }
            onChange={(e) =>
              updateNodeData("ownEmissions", Number(e.target.value))
            }
          />
          <br />
          <button
            onClick={() => {
              setSelectedNodeIds([]);
              setPanelPosition(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
