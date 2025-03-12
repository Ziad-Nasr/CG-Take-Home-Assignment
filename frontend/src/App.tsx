import React from "react";
import "./App.css";
import Home from "./components/Home/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Home />
      <ToastContainer />
    </div>
  );
}

export default App;
