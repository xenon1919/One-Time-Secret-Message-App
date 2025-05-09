import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReadMessage from "./pages/ReadMessage";
import React from "react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read/:id" element={<ReadMessage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;