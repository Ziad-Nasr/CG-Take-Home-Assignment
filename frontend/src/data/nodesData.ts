import { myNode } from "../types/graphTypes";
export const nodesData: myNode[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      label: "Initial Node",
      weight: 5,
      ownEmissions: 5,
      totalEmissions: 5,
      outgoingEdges: [
        { target: "2", weight: 2, edgeId: "1-2" },
        { target: "3", weight: 1, edgeId: "1-3" },
      ],
    },
    type: "input",
  },
  {
    id: "2",
    position: { x: 300, y: 100 },
    data: {
      label: "Node 2",
      weight: 1,
      ownEmissions: 5,
      totalEmissions: 5,
      outgoingEdges: [{ target: "4", weight: 2, edgeId: "2-4" }],
    },
    type: "default",
  },
  {
    id: "3",
    position: { x: 100, y: 300 },
    data: {
      label: "Node 3",
      weight: 1,
      ownEmissions: 5,
      totalEmissions: 5,
      outgoingEdges: [{ target: "4", weight: 2, edgeId: "3-4" }],
    },
    type: "default",
  },
  {
    id: "4",
    position: { x: 400, y: 400 },
    data: {
      label: "Node 4",
      weight: 1,
      ownEmissions: 5,
      totalEmissions: 5,
      outgoingEdges: [],
    },
    type: "default",
  },
];
