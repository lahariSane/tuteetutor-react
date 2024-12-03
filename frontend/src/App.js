import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPasswordForm from "./components/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Home from "./pages/Home";
import ResetPasswordForm from "./components/ResetPasswordForm";
import Almanac from "./components/Almanac";
import TimeTable from "./components/TimeTable";
import Courses from "./pages/Courses";
import LandingPage from "./pages/LandingPage";

function App() {
  document.title = "TuteeTutor";
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/" element={<Home />}>
          <Route path="" element={<LandingPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="coursesSelection" element={<Courses />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="timetable" element={<TimeTable />} />
          <Route path="almanac" element={<Almanac />} />
          <Route path="support" element={<></>} />
          <Route path="settings" element={<></>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
