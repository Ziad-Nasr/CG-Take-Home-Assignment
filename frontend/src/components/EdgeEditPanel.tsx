import React from "react";

interface EdgeEditorProps {
  edgeWeight: number;
  setEdgeWeight: (weight: number) => void;
  confirmEdge: () => void;
  setPendingEdgeData: (data: any) => void;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({
  edgeWeight,
  setEdgeWeight,
  confirmEdge,
  setPendingEdgeData,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        zIndex: 2000,
      }}
    >
      <h4>Set Edge Weight</h4>
      <label>Weight: </label>
      <input
        type="number"
        value={edgeWeight}
        onChange={(e) => setEdgeWeight(Number(e.target.value))}
      />
      <br />
      <button onClick={confirmEdge} style={{ marginRight: 5 }}>
        Confirm
      </button>
      <button onClick={() => setPendingEdgeData(null)}>Cancel</button>
    </div>
  );
};

export default EdgeEditor;
