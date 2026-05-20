import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChairmanRoute = ({ children }) => {
  const { isAdmin, isChairman, loading } = useAuth();
  if (loading) return <div className="container">Загрузка...</div>;
  return (isAdmin || isChairman) ? children : <Navigate to="/" />;
};

export default ChairmanRoute;