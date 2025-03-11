import { Dispatch, SetStateAction } from "react";
import { myEdge, myNode } from "../types/graphTypes";

export const recalculateEmissions = (
  nodes: myNode[],
  edges: myEdge[],
  setNodes: Dispatch<SetStateAction<myNode[]>>,
  setEdges: Dispatch<SetStateAction<myEdge[]>>
) => {
  const nodeMap = new Map(
    nodes.map((node: myNode) => [
      node.id,
      {
        ...node,
        data: {
          ...node.data,
          emissions: node.data.ownEmissions,
          totalEmissions: 0,
        },
      },
    ])
  );
  const edgeMap = new Map(
    edges.map((edge: myEdge) => [
      edge.id,
      { ...edge, data: { ...edge.data, emissions: 0 } },
    ])
  );
  console.log("edgeMap", edgeMap);

  const initialNodes = nodes.filter(
    (node: myNode) => !edges.some((edge: myEdge) => edge.target === node.id)
  );

  const queue = [...initialNodes.map((node: myNode) => node.id)];
  console.log(queue);
  while (queue.length > 0) {
    const currentNodeId = queue.shift();
    const currentNode = nodeMap.get(currentNodeId || "");
    if (!currentNode || !currentNode.data.outgoingEdges) continue;
    console.log("currentNode", currentNode);
    currentNode.data.outgoingEdges.forEach(({ target, weight, edgeId }) => {
      const targetNode = nodeMap.get(target);
      console.log(edgeId);
      const edge = edgeMap.get(edgeId);
      console.log("edgeeee", edge);

      if (!targetNode || !edge) return;

      const edgeEmissions =
        (currentNode.data.weight / weight) * currentNode.data.ownEmissions;

      edgeMap.set(edgeId, {
        ...edge,
        data: { ...edge.data, emissions: edgeEmissions },
        label: `Weight: ${weight} \n Emissions: ${edgeEmissions}`,
      });

      console.log(
        "targetNode.data.totalEmissions",
        targetNode.data.totalEmissions
      );
      if (targetNode.data.totalEmissions) {
        targetNode.data.totalEmissions += edgeEmissions;
      } else {
        targetNode.data.totalEmissions =
          targetNode.data.ownEmissions + edgeEmissions;
      }
      if (!queue.includes(targetNode.id)) {
        queue.push(targetNode.id);
      }
    });
  }

  const newEdges = Array.from(edgeMap.values());
  const newNodes = Array.from(nodeMap.values());

  setEdges((prevEdges: myEdge[]) =>
    JSON.stringify(prevEdges) !== JSON.stringify(newEdges)
      ? newEdges
      : prevEdges
  );
  setNodes((prevNodes: myNode[]) =>
    JSON.stringify(prevNodes) !== JSON.stringify(newNodes)
      ? newNodes
      : prevNodes
  );
};
