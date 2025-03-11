import { useState, useCallback, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodesData } from "../data/nodesData";
import { edgesData } from "../data/edgesData";
import { recalculateEmissions } from "../helpers/Emissions";
import { hasCycle } from "../helpers/Graph";
import { myEdge, myNode } from "../types/graphTypes";

export default function Home() {
  const [nodes, setNodes] = useState<myNode[]>(nodesData);
  const [edges, setEdges] = useState<myEdge[]>(edgesData);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setselectedEdgeIds] = useState<any[]>([]);
  const [panelPosition, setPanelPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pendingEdgeData, setPendingEdgeData] = useState<any | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<number>(0);
  const [needsRecalculation, setNeedsRecalculation] = useState(false);

  //TODO: edges in the below function is not updated to the shown edges numbers
  //?Done

  //TODO: check why it doesn't loop on all edges

  useEffect(() => {
    if (needsRecalculation) {
      recalculateEmissions(nodes, edges, setNodes, setEdges);
      setNeedsRecalculation(false);
    }
  }, [needsRecalculation]);

  const addNode = () => {
    const newNode = {
      id: `${Date.now()}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `New Node`,
        weight: 1,
        ownEmissions: 1,
        totalEmissions: 1,
        outgoingEdges: [],
      },
      type: "default",
    };
    console.log(nodes.length);
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = () => {
    if (selectedNodeIds.length === 0) return;

    setNodes((nds) => {
      const deletedNodeSet = new Set(selectedNodeIds);

      return nds
        .filter((n) => !deletedNodeSet.has(n.id))
        .map((n) => ({
          ...n,
          data: {
            ...n.data,
            outgoingEdges: n.data.outgoingEdges?.filter(
              (edge) => !deletedNodeSet.has(edge.target)
            ),
          },
        }));
    });

    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target)
      )
    );
    setSelectedNodeIds([]);
    setNeedsRecalculation(true);
  };

  const updateNodeData = (field: string, value: string | number) => {
    setNodes((nds) =>
      nds.map((node) =>
        selectedNodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      )
    );
    setNeedsRecalculation(true);
  };

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: any) => {
    setPendingEdgeData(connection);
    console.log("connection", connection);
  }, []);

  const confirmEdge = () => {
    if (!pendingEdgeData || edgeWeight === 0) return;
    console.log("pendingEdgeData", pendingEdgeData);

    if (pendingEdgeData.source === pendingEdgeData.target) {
      console.warn("Self-loops are not allowed.");
      return;
    }
    if (hasCycle(pendingEdgeData.source, pendingEdgeData.target, nodes, edges)) {
      console.warn("Cannot add edge: This would create a cycle!");
      return;
    }
    const sourceIndex = nodes.findIndex((n) => n.id === pendingEdgeData.source);
    if (sourceIndex === -1) return;

    const sourceNode = nodes[sourceIndex];

    const totalExistingWeight = (sourceNode.data.outgoingEdges || []).reduce(
      (sum, edge) => sum + edge.weight,
      0
    );
    console.log("totalExistingWeight", totalExistingWeight);
    if (totalExistingWeight + edgeWeight > sourceNode.data.weight) {
      console.log(
        "Cannot add edge, Total outgoing weight exceeds node weight!"
      );
      return;
    }

    const edgeEmissions =
      (sourceNode.data.weight / edgeWeight) * sourceNode.data.ownEmissions;

    console.log("Here");

    const newEdge = {
      source: pendingEdgeData.source,
      target: pendingEdgeData.target,
      id: `${pendingEdgeData.source}-${pendingEdgeData.target}`,
      data: { weight: Number(edgeWeight), emissions: edgeEmissions },
      label: `Weight: ${edgeWeight} \n\n Emissions: ${edgeEmissions}`,
      animated: true,
    };
    console.log("newEdge", newEdge);

    setEdges((prev) => [...prev, newEdge]);

    setNodes((nds) =>
      nds.map((node) =>
        node.id === pendingEdgeData.source
          ? {
              ...node,
              data: {
                ...node.data,
                outgoingEdges: [
                  ...(node.data.outgoingEdges || []),
                  {
                    target: pendingEdgeData.target,
                    weight: edgeWeight,
                    edgeId: `${pendingEdgeData.source}-${pendingEdgeData.target}`,
                  },
                ],
              },
            }
          : node
      )
    );
    console.log("a5er el Confirm Edge");
    setNeedsRecalculation(true);
  };

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

    setNodes((nds) =>
      nds.map((node) =>
        node.id === sourceNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                outgoingEdges: (node.data.outgoingEdges || []).filter(
                  (outEdge) => outEdge.edgeId !== edgeIdToDelete
                ),
              },
            }
          : node
      )
    );

    setNeedsRecalculation(true);
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

      {pendingEdgeData && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 2000,
          }}
        >
          <h4>Set Edge Weight</h4>
          <label>Weight: </label>
          <input
            type="number"
            value={edgeWeight}
            onChange={(e) => setEdgeWeight(Number(e.target.value))}
          />
          <br />
          <button onClick={confirmEdge} style={{ marginRight: 5 }}>
            Confirm
          </button>
          <button onClick={() => setPendingEdgeData(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

//TODO: Better UI bellah
