// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authMe } from './utils/api';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientConsole from "./pages/ClientConsole";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProjects from "./pages/ClientProjects";
import ClientProjectDetail from "./pages/ClientProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminProjectDetail from "./pages/AdminProjectDetail";
import AdminLeads from "./pages/AdminLeads";
import Header from './layout/Header';
import Footer from './layout/Footer';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await authMe();
          if (data.ok) setUser(data.user);
          else localStorage.removeItem('token');
        }
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/client'} /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/client" /> : <Register setUser={setUser} />} />
        <Route path="/client" element={user && user.role === 'client' ? <ClientDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/client/projects" element={user && user.role === 'client' ? <ClientProjects user={user} /> : <Navigate to="/login" />} />
        <Route path="/client/projects/:id" element={user && user.role === 'client' ? <ClientProjectDetail user={user} /> : <Navigate to="/login" />} />
        <Route path="/start-project" element={<ClientConsole />} />
        <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/projects" element={user && user.role === 'admin' ? <AdminProjects user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/projects/:id" element={user && user.role === 'admin' ? <AdminProjectDetail user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/leads" element={user && user.role === 'admin' ? <AdminLeads user={user} /> : <Navigate to="/login" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;