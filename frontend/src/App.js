import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage';
import SettlementLayout from './pages/SettlementLayout';
import Home from './pages/Home';
import About from './pages/About';
import Plots from './pages/Plots';
import Infrastructure from './pages/Infrastructure';
import Gallery from './pages/Gallery';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';
import { NewsList, NewsDetail } from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ChairmanRoute from './components/ChairmanRoute';
import AdminPanel from './pages/admin/AdminPanel';
import AdminNews from './pages/admin/AdminNews';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminPlots from './pages/admin/AdminPlots';
import AdminInfrastructure from './pages/admin/AdminInfrastructure';
import AdminGallery from './pages/admin/AdminGallery';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:settlement" element={<SettlementLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="plots" element={<Plots />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="documents" element={
              <PrivateRoute>
                <Documents />
              </PrivateRoute>
            } />
            <Route path="contacts" element={<Contacts />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/:id" element={<NewsDetail />} />
          </Route>
          <Route path="/admin" element={
            <ChairmanRoute>
              <AdminPanel />
            </ChairmanRoute>
          }>
            <Route path="news" element={<AdminNews />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="plots" element={<AdminPlots />} />
            <Route path="infrastructure" element={<AdminInfrastructure />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;