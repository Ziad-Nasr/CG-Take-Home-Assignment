import { Dispatch, SetStateAction } from "react";
import { myEdge, myNode } from "../types/graphTypes";

export const addNode = (setNodes: Dispatch<SetStateAction<myNode[]>>) => {
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
  setNodes((nds) => [...nds, newNode]);
};

export const deleteNode = (
  setNodes: Dispatch<SetStateAction<myNode[]>>,
  setEdges: Dispatch<SetStateAction<myEdge[]>>,
  selectedNodeIds: string[],
  setSelectedNodeIds: Dispatch<SetStateAction<string[]>>
) => {
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
};

export const updateNodeData = (
  field: string,
  value: string | number,
  setNodes: Dispatch<SetStateAction<myNode[]>>,
  selectedNodeIds: string[]
) => {
  setNodes((nds) =>
    nds.map((node) =>
      selectedNodeIds.includes(node.id)
        ? { ...node, data: { ...node.data, [field]: value } }
        : node
    )
  );
};
