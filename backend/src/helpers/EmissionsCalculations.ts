export const validateEmissions = (nodes: any[], edges: any[]) => {
  const { updatedNodes, updatedEdges } = recalculateEmissions(nodes, edges);

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].data.totalEmissions !== updatedNodes[i].data.totalEmissions) {
      return false;
    }
  }

  for (let i = 0; i < edges.length; i++) {
    if (edges[i].data.emissions !== updatedEdges[i].data.emissions) {
      return false;
    }
  }

  return true;
};

const recalculateEmissions = (nodes: any[], edges: any[]) => {
  const nodeMap = new Map(
    nodes.map((node) => [
      node.id,
      {
        ...node,
        data: {
          ...node.data,
          emissions: node.data.ownEmissions,
          totalEmissions: node.data.ownEmissions,
        },
      },
    ])
  );

  const edgeMap = new Map(
    edges.map((edge) => [
      edge.id,
      { ...edge, data: { ...edge.data, emissions: 0 } },
    ])
  );

  const initialNodes = nodes.filter(
    (node) => !edges.some((edge) => edge.target === node.id)
  );

  const queue = [...initialNodes.map((node) => node.id)];

  while (queue.length > 0) {
    const currentNodeId = queue.shift();
    const currentNode = nodeMap.get(currentNodeId || "");

    if (!currentNode || !currentNode.data.outgoingEdges) continue;

    currentNode.data.outgoingEdges.forEach(({ target, weight, edgeId }) => {
      const targetNode = nodeMap.get(target);
      const edge = edgeMap.get(edgeId);

      if (!targetNode || !edge) return;

      const edgeEmissions =
        (currentNode.data.weight / weight) * currentNode.data.ownEmissions;

      edgeMap.set(edgeId, {
        ...edge,
        data: { ...edge.data, emissions: edgeEmissions },
        label: `Weight: ${weight} \n Emissions: ${edgeEmissions}`,
      });

      targetNode.data.totalEmissions += edgeEmissions;

      if (!queue.includes(targetNode.id)) {
        queue.push(targetNode.id);
      }
    });
  }
  return {
    updatedNodes: Array.from(nodeMap.values()),
    updatedEdges: Array.from(edgeMap.values()),
  };
};
