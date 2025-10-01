import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login.jsx";

export default function App() {
  const [year, setYear] = useState("2023-24");

  return (
    <>
      <Router>
        {/* <Navbar selectedYear={year} setSelectedYear={setYear} /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard selectedYear={year}setSelectedYear={setYear} />} />
      </Routes>
    </Router>
    </>
  );
}
