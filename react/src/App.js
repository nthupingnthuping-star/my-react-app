// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homescreen from "./components/Homescreen";
import StudentAuth from "./components/StudentAuth";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/student-login" element={<StudentAuth />} />
        {/* Add other routes later: /lecturer, etc. */}
      </Routes>
    </Router>
  );
}

export default App;