import mongoose, { Schema, Document } from "mongoose";

interface EdgeData {
  weight: number;
  emissions: number;
}

interface NodeData {
  label: string;
  weight: number;
  ownEmissions: number;
  totalEmissions: number;
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
  id: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  label: { type: String },
  data: {
    weight: { type: Number, required: true },
    emissions: { type: Number, required: true },
  },
});

const NodeSchema = new Schema<Node>({
  id: { type: String, required: true, unique: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: {
    label: { type: String, required: true },
    weight: { type: Number, required: true },
    ownEmissions: { type: Number, required: true },
    totalEmissions: { type: Number, required: true },
  },
  type: { type: String, required: true },
});

const EdgeModel = mongoose.model<Edge>("Edge", EdgeSchema);
const NodeModel = mongoose.model<Node>("Node", NodeSchema);

export { EdgeModel, NodeModel };
