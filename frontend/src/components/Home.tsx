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
import { nodesData } from "../data/nodesData";
import { edgesData } from "../data/edgesData";
import { recalculateEmissions } from "../helpers/Emissions";
import { hasCycle } from "../helpers/Graph";
import { myEdge, myGraph, myNode } from "../types/graphTypes";
import { addNode, deleteNode, updateNodeData } from "../helpers/NodeControl";
import NodeEditor from "./NodeEditPanel";
import EdgeEditor from "./EdgeEditPanel";
import useAxios from "../hooks/useAxios";
import Modal from "./Modal/Modal";

export default function Home() {
  const [graphName, setGraphName] = useState<string>("");
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (needsRecalculation) {
      recalculateEmissions(nodes, edges, setNodes, setEdges);
      setNeedsRecalculation(false);
    }
  }, [needsRecalculation]);

  // const { data } = useAxios("/load-graph?name=Sample Graph");
  const { data: allData } = useAxios<myGraph[]>("/list-all-graphs");
  const { data: graphData } = useAxios<myGraph>(
    `/load-graph?name=${graphName}`
  );
  useEffect(() => {
    if (graphData?.name === "") return;

    setNodes(graphData?.nodes || []);
    setEdges(graphData?.edges || []);
  }, [graphData]);

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
      <button
        onClick={() => {
          setShowModal(true);
        }}
      >
        Graphs Menu
      </button>
      <button
        onClick={() => {
          deleteNode(setNodes, setEdges, selectedNodeIds, setSelectedNodeIds);
          setNeedsRecalculation(true);
        }}
        disabled={!selectedNodeIds.length}
      >
        Delete Node
      </button>
      <button onClick={deleteEdge} disabled={!selectedEdgeIds.length}>
        Delete Edge
      </button>
      <br />
      <button
        onClick={() => {
          addNode(setNodes);
          setNeedsRecalculation(true);
        }}
        style={{ marginBottom: 10 }}
      >
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
        <NodeEditor
          nodes={nodes}
          setNodes={setNodes}
          selectedNodeIds={selectedNodeIds}
          setSelectedNodeIds={setSelectedNodeIds}
          panelPosition={panelPosition}
          setPanelPosition={setPanelPosition}
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

      {showModal && (
        <Modal
          data={allData || []}
          onClose={() => setShowModal(false)}
          title="Graphs"
          onLoadGraph={(graph) => {
            console.log("graph", graph);
            setGraphName(graph);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
