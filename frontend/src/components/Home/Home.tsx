import { useState, useCallback, useEffect } from "react";
import {
  Background,
  Connection,
  Controls,
  EdgeChange,
  NodeChange,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./Home.css";

import { Button } from "@mui/material";
import { Save, Menu, Add, Delete } from "@mui/icons-material";
import { nodesData } from "../../data/nodesData";
import { edgesData } from "../../data/edgesData";
import { recalculateEmissions } from "../../helpers/Emissions";
import { hasCycle } from "../../helpers/Graph";
import { myEdge, myGraph, myNode } from "../../types/graphTypes";
import { addNode, deleteNode } from "../../helpers/NodeControl";
import NodeEditor from "../NodeEditPanel";
import EdgeEditor from "../EdgeEditPanel";
import useAxios from "../../hooks/useAxios";
import Modal from "../Modal/Modal";

export default function Home() {
  const [graphMeta, setGraphMeta] = useState({
    name: "",
    updatedAt: "",
    createdAt: "",
  });
  const [nodes, setNodes] = useState<myNode[]>(nodesData);
  const [edges, setEdges] = useState<myEdge[]>(edgesData);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setselectedEdgeIds] = useState<any[]>([]);
  const [panelPosition, setPanelPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pendingEdgeData, setPendingEdgeData] = useState<Connection | null>(
    null
  );
  const [edgeWeight, setEdgeWeight] = useState<number>(0);
  const [needsRecalculation, setNeedsRecalculation] = useState(false);
  const [showModal, setShowModal] = useState<"" | "save" | "load">("");

  const { data: allData, request: refetchAll } = useAxios<myGraph[]>(
    "GET",
    "/list-all-graphs"
  );

  const { data: graphData } = useAxios<myGraph>(
    "GET",
    graphMeta.name ? `/load-graph?name=${graphMeta.name}` : ""
  );
  const { request: saveGraph } = useAxios("POST", "/save-graph");
  const { request: updateGraph } = useAxios(
    "PUT",
    `/update-graph?name=${graphMeta.name}`
  );

  useEffect(() => {
    if (!graphData?.name) return;
    setNodes(graphData.nodes || []);
    setEdges(graphData.edges || []);
    setGraphMeta((prev) => ({
      ...prev,
      updatedAt: graphData.updatedAt || "",
      createdAt: graphData.createdAt || "",
    }));
  }, [graphData]);

  useEffect(() => {
    if (!needsRecalculation) return;
    recalculateEmissions(nodes, edges, setNodes, setEdges);
    setNeedsRecalculation(false);
  }, [needsRecalculation]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as myNode[]);
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as myEdge[]);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
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
    if (
      hasCycle(pendingEdgeData.source, pendingEdgeData.target, nodes, edges)
    ) {
      console.warn("Cannot add edge: This would create a cycle!");
      return;
    }
    const sourceIndex = nodes.findIndex((n) => n.id === pendingEdgeData.source);
    if (sourceIndex === -1) return;

    const sourceNode = nodes[sourceIndex];

    const totalExistingWeight = (sourceNode.data.outgoingEdges || [])
      .filter((edge) => edge.target !== pendingEdgeData.target)
      .reduce((sum, edge) => sum + edge.weight, 0);

    if (totalExistingWeight + edgeWeight > sourceNode.data.weight) {
      console.log(
        "Cannot add edge, Total outgoing weight exceeds node weight!"
      );
      return;
    }

    const edgeEmissions =
      (sourceNode.data.weight / edgeWeight) * sourceNode.data.ownEmissions;

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

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== pendingEdgeData.source) return node;

        const existingEdges = node.data.outgoingEdges || [];
        const edgeIndex = existingEdges.findIndex(
          (edge) => edge.target === pendingEdgeData.target
        );

        const updatedEdges =
          edgeIndex !== -1
            ? existingEdges.map((edge, index) =>
                index === edgeIndex ? { ...edge, weight: edgeWeight } : edge
              )
            : [
                ...existingEdges,
                {
                  target: pendingEdgeData.target,
                  weight: edgeWeight,
                  edgeId: `${pendingEdgeData.source}-${pendingEdgeData.target}`,
                },
              ];

        return {
          ...node,
          data: {
            ...node.data,
            outgoingEdges: updatedEdges,
          },
        };
      })
    );

    console.log("a5er el Confirm Edge");
    setNeedsRecalculation(true);
  };

  const deleteEdge = useCallback(() => {
    if (selectedEdgeIds.length === 0) return;

    const edgeIdToDelete = selectedEdgeIds[0].id;

    const edgeToDelete = edges.find((e) => {
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
      setPendingEdgeData({
        source: edge.source,
        target: edge.target,
        sourceHandle: null,
        targetHandle: null,
      });
      setselectedEdgeIds([edge]);
    }
  }, []);

  return (
    <div style={{ height: "90vh", position: "relative" }}>
      <div className="container">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={() => {
            if (graphMeta.name !== "") {
              updateGraph({
                name: graphMeta.name,
                nodes,
                edges,
                createdAt: graphMeta.createdAt,
                updatedAt: new Date().toISOString(),
              }).then(() => refetchAll());
            } else {
              setShowModal("save");
            }
          }}
        >
          Save
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Menu />}
          onClick={() => setShowModal("load")}
        >
          Graphs Menu
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() => {
            deleteNode(setNodes, setEdges, selectedNodeIds, setSelectedNodeIds);
            setNeedsRecalculation(true);
          }}
          disabled={!selectedNodeIds.length}
        >
          Delete Node
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={deleteEdge}
          disabled={!selectedEdgeIds.length}
        >
          Delete Edge
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={() => {
            addNode(setNodes);
            setNeedsRecalculation(true);
          }}
        >
          Add Node
        </Button>
      </div>

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
        <NodeEditor
          nodes={nodes}
          setNodes={setNodes}
          selectedNodeIds={selectedNodeIds}
          setSelectedNodeIds={setSelectedNodeIds}
          panelPosition={panelPosition}
          setPanelPosition={setPanelPosition}
          onClosed={() => setNeedsRecalculation(true)}
        />
      )}

      {pendingEdgeData && (
        <EdgeEditor
          edgeWeight={edgeWeight}
          setEdgeWeight={setEdgeWeight}
          confirmEdge={confirmEdge}
          setPendingEdgeData={setPendingEdgeData}
        />
      )}

      {showModal !== "" && (
        <Modal
          data={allData || []}
          onClose={() => setShowModal("")}
          onAction={(name) => {
            if (showModal === "load") {
              setGraphMeta((prev) => ({ ...prev, name: name }));
              setShowModal("");
            } else if (showModal === "save") {
              saveGraph({
                name: name,
                nodes: nodes,
                edges: edges,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              }).then(() => refetchAll());
            }
          }}
          actionType={showModal}
        />
      )}
    </div>
  );
}
