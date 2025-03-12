import React, { useState } from "react";
import { myGraph } from "../../types/graphTypes";
import "./Modal.css";

interface ModalProps {
  data: myGraph[];
  onClose: () => void;
  title: string;
  onLoadGraph: (name: string) => void;
}

const Modal: React.FC<ModalProps> = ({ data, onClose, title, onLoadGraph }) => {
  if (data.length === 0) {
    return (
      <div className="modal-container">
        <div className="modal-content">
          <h2>No Graphs Found</h2>
          <button className="close-btn" onClick={() => onClose()}>
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Graphs Menu</h2>
        <table className="graph-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th>Updated At</th>
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
                    onClick={() => {
                      onLoadGraph(graph.name);
                    }}
                  >
                    Load
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="close-btn" onClick={() => onClose()}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
