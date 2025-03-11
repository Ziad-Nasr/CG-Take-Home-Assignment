import { myEdge } from "../types/graphTypes";

export const edgesData: myEdge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    label: "test",
    data: { weight: 1, emissions: 0 },
    animated: false,
  },
  {
    id: "1-3",
    source: "1",
    target: "3",
    animated: true,
    data: { weight: 1, emissions: 0 },
  },
  {
    id: "2-4",
    source: "2",
    target: "4",
    animated: true,
    data: { weight: 1, emissions: 0 },
  },
  {
    id: "3-4",
    source: "3",
    target: "4",
    animated: false,
    data: { weight: 1, emissions: 0 },
  },
];
