import { Request, RequestHandler, Response } from "express";
import { GraphConfigModel } from "../models/graph.model";

export const saveGraphConfiguration = async (req: Request, res: Response) => {
  try {
    const { name, edges, nodes } = req.body;
    console.log(name, edges, nodes);
    if (!edges || !nodes || !name) {
      res.status(400).json({ error: "Name, Edges and Nodes are required" });
      return;
    }

    const existingGraph = await GraphConfigModel.findOne({ name });
    if (existingGraph) {
      res.status(400).json({ error: "Graph name already exists" });
      return;
    }

    const newGraph = new GraphConfigModel({ name, nodes, edges });
    await newGraph.save();

    res.status(200).json({ message: "Graph configuration saved successfully" });
  } catch (error) {
    console.error("Error saving graph configuration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loadGraphConfiguration = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    const graph = await GraphConfigModel.findOne({ name });

    if (!graph) {
      res.status(404).json({ error: "Graph not found" });
      return;
    }
    res.status(200).json(graph);
  } catch (error) {
    console.error("Error loading graph:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listAllGraphs = async (req: Request, res: Response) => {
  try {
    const graphs = await GraphConfigModel.find({}, "name createdAt updatedAt");
    res.status(200).json(graphs);
  } catch (error) {
    console.error("Error loading graphs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateGraphConfiguration = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const { nodes, edges } = req.body;
    console.log("name", name);
    const updatedGraph = await GraphConfigModel.findOneAndUpdate(
      { name },
      { nodes, edges, updateAt: new Date() },
      { new: true }
    );

    if (!updatedGraph) {
      res.status(404).json({ error: "Graph not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Graph updated successfully", graph: updatedGraph });
  } catch (error) {
    console.error("Error Loading Graph", Error);
    res.status(500).json({ message: "Server Internal Error" });
  }
};
