import express from "express";
import {
  listAllGraphs,
  loadGraphConfiguration,
  saveGraphConfiguration,
  updateGraphConfiguration,
} from "../controllers/graph.controller";

const router = express.Router();

router.post("/save-graph", saveGraphConfiguration);

router.get("/load-graph", loadGraphConfiguration);

router.get("/list-all-graphs", listAllGraphs);

router.put("/update-graph", updateGraphConfiguration);

export default router;
