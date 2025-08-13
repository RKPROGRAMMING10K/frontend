import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FormBuilder from "./components/FormBuilder";
import FormPreview from "./components/FormPreview";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<FormBuilder />} />
          <Route path="/preview/:id" element={<FormPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
