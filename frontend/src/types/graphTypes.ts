export interface NodeData {
  label: string;
  weight: number;
  ownEmissions: number;
  totalEmissions?: number;
  outgoingEdges?: { target: string; weight: number; edgeId: string }[];
  [key: string]: unknown;
}

export interface myNode {
  id: string;
  position: { x: number; y: number };
  data: NodeData;
  type?: string;
}

export interface EdgeData {
  weight: number;
  emissions: number;
  [key: string]: unknown;
}

export interface myEdge {
  id: string;
  source: string;
  target: string;
  data: EdgeData;
  label?: string;
  animated: boolean;
}

export interface myGraph {
  nodes: myNode[];
  edges: myEdge[];
  createdAt: string;
  updatedAt: string;
  name: string;
}
