import React, { Dispatch } from "react";
import { updateNodeData } from "../helpers/NodeControl";

import { myNode } from "../types/graphTypes";

interface NodeEditorProps {
  nodes: myNode[];
  setNodes: Dispatch<React.SetStateAction<myNode[]>>;
  selectedNodeIds: string[];
  setSelectedNodeIds: Dispatch<React.SetStateAction<string[]>>;
  panelPosition: { x: number; y: number };
  setPanelPosition: Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
  onClosed: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  nodes,
  setNodes,
  selectedNodeIds,
  setSelectedNodeIds,
  panelPosition,
  setPanelPosition,
  onClosed,
}) => {
  const selectedNode = nodes.find((node) => node.id === selectedNodeIds[0]);

  if (!selectedNode) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: panelPosition.x,
        top: panelPosition.y,
        background: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <h4>Edit Node</h4>
      <label>Name: </label>
      <input
        type="text"
        placeholder="Enter node name"
        value={selectedNode.data.label || ""}
        onChange={(e) =>
          updateNodeData("label", e.target.value, setNodes, selectedNodeIds)
        }
      />
      <br />
      <label>Weight: </label>
      <input
        type="number"
        placeholder="Enter node weight"
        value={selectedNode.data.weight || ""}
        onChange={(e) =>
          updateNodeData(
            "weight",
            Number(e.target.value),
            setNodes,
            selectedNodeIds
          )
        }
      />
      <br />
      <label>Emissions: </label>
      <input
        type="number"
        placeholder="Enter node emissions"
        value={selectedNode.data.ownEmissions || ""}
        onChange={(e) =>
          updateNodeData(
            "ownEmissions",
            Number(e.target.value),
            setNodes,
            selectedNodeIds
          )
        }
      />
      <br />
      <label>Total Emissions: </label>
      <input
        disabled
        type="number"
        placeholder="..."
        value={selectedNode.data.totalEmissions || ""}
      />
      <br />
      <button
        onClick={() => {
          setSelectedNodeIds([]);
          setPanelPosition(null);
          onClosed();
        }}
      >
        Close
      </button>
    </div>
  );
};

export default NodeEditor;
