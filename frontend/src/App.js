import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPasswordForm from './components/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';


import Home from './pages/Home';
import ResetPasswordForm from './components/ResetPasswordForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/" element={<Home />} >
          <Route path="" element={<StudentDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />

          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="timetable" element={<></>} />
          <Route path="almanac" element={<></>} />
          <Route path="support" element={<></>} />
          <Route path="settings" element={<></>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
