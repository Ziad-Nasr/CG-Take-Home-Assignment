import React, { useState } from "react";
import { myGraph } from "../../types/graphTypes";
import "./Modal.css";
import { toast } from "react-toastify";

interface ModalProps {
  data?: myGraph[];
  onClose: () => void;
  actionType: string;
  onAction: (name: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  data = [],
  onClose,
  actionType,
  onAction,
}) => {
  const [graphName, setGraphName] = useState("");

  const handleSave = () => {
    if (graphName.trim()) {
      onAction(graphName);
    } else {
      toast.error("Please enter a valid graph name.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>{actionType === "load" ? "Load Graph" : "Save Graph"}</h2>
        <div className="modal-body">
          {actionType === "load" ? (
            data.length > 0 ? (
              <table className="graph-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((graph) => (
                    <tr key={graph.name}>
                      <td>{graph.name}</td>
                      <td>{new Date(graph.createdAt).toLocaleString()}</td>
                      <td>{new Date(graph.updatedAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="success-btn"
                          onClick={() => onAction(graph.name)}
                        >
                          Load
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No graphs found.</p>
            )
          ) : (
            <div className="save-container">
              <input
                type="text"
                placeholder="Enter graph name..."
                value={graphName}
                onChange={(e) => setGraphName(e.target.value)}
                className="graph-input"
              />
              <button
                className="success-btn"
                onClick={handleSave}
                // disabled={!graphName.trim()}
              >
                Save
              </button>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
