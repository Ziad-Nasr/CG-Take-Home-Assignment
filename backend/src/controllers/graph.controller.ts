import { Request, RequestHandler, Response } from "express";
import { NodeModel, EdgeModel } from "../models/graph.model";

export const saveGraphConfiguration = async (req: Request, res: Response) => {
  try {
    const {edges, nodes } = req.body;
    console.log(edges, nodes);
    if (!edges || !nodes) {
      res.status(400).json({ error: "Edges and Nodes are required" });
      return;
    }

    for (const node of nodes) {
      await NodeModel.findOneAndUpdate({ id: node.id }, node, {
        upsert: true,
        new: true,
      });
    }

    for (const edge of edges) {
      await EdgeModel.findOneAndUpdate({ id: edge.id }, edge, {
        upsert: true,
        new: true,
      });
    }

    res.status(200).json({ message: "Graph configuration saved successfully" });
  } catch (error) {
    console.error("Error saving graph configuration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
