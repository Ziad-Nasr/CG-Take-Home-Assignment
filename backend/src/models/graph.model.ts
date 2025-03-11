import mongoose, { Schema, Document } from "mongoose";

interface EdgeData {
  weight: number;
  emissions: number;
}

interface NodeEdge {
  target: string;
  weight: number;
  edgeId: string;
}

interface NodeData {
  label: string;
  weight: number;
  ownEmissions: number;
  totalEmissions: number;
  outgoingEdges: NodeEdge[];
}

interface Edge extends Document {
  id: string;
  source: string;
  target: string;
  label: string;
  data: EdgeData;
}

interface Node extends Document {
  id: string;
  position: { x: number; y: number };
  data: NodeData;
  type: string;
}

const EdgeSchema = new Schema<Edge>({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  label: { type: String },
  data: {
    weight: { type: Number, required: true },
    emissions: { type: Number, required: true },
  },
});

const NodeSchema = new Schema<Node>({
  id: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: {
    label: { type: String, required: true },
    weight: { type: Number, required: true },
    ownEmissions: { type: Number, required: true },
    totalEmissions: { type: Number, required: true },
    outgoingEdges: [
      {
        target: { type: String, required: true },
        weight: { type: Number, required: true },
        edgeId: { type: String, required: true },
      },
    ],
  },
  type: { type: String, required: true },
});

export interface IGraphConfig extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: (typeof NodeSchema)[];
  edges: (typeof EdgeSchema)[];
}

const GraphConfigSchema = new Schema<IGraphConfig>(
  {
    name: { type: String, required: true, unique: true },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
  },
  { timestamps: true }
);

export const GraphConfigModel = mongoose.model<IGraphConfig>(
  "GraphConfig",
  GraphConfigSchema
);

