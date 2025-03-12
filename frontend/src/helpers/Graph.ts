import { toast } from "react-toastify";
import { myEdge, myNode } from "../types/graphTypes";

export const hasCycle = (
  source: string,
  target: string,
  nodes: myNode[],
  edges: myEdge[]
) => {
  const graph = new Map();

  nodes.forEach((node: myNode) => graph.set(node.id, []));
  edges.forEach((edge: myEdge) => graph.get(edge.source).push(edge.target));

  const visited = new Set();
  const dfs = (node: string) => {
    if (node === source) {
      toast.error("Cycle detected!");
      return true;
    }
    if (visited.has(node)) return false;
    visited.add(node);
    return (graph.get(node) || []).some(dfs);
  };

  return dfs(target);
};
