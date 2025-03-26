import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPasswordForm from "./components/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Home from "./pages/Home";

import ResetPasswordForm from "./components/ResetPasswordForm";
import FacultyList from "./components/Faculty";
import Almanac from "./components/Almanac";
import TimeTable from "./components/TimeTable";
import Courses from "./pages/Courses";
import LandingPage from "./pages/LandingPage";
import Settings from "./pages/Settings";
import Features from "./pages/Features";
import ContactUs from "./pages/ContactUs";
import MessageSent from "./pages/MessageSent";
import ChatPage from "./pages/ChatPage";
import HodList from "./components/Hod";

function App() { 
  document.title = "TuteeTutor";
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/message-sent" element={<MessageSent />} />
        <Route path="/" element={<Home />}>
          <Route path="" element={<StudentDashboard />} />
          <Route path="coursesSelection" element={<Courses />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="timetable" element={<TimeTable />} />
          <Route path="almanac" element={<Almanac />} />
          <Route path="support" element={<ChatPage />} />
          <Route path="faculty" element={<FacultyList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="hod" element={<HodList />} />
          <Route path="users" element={<FacultyList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
