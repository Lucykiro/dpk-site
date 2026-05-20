import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>Панель управления</h1>
      <p>Добро пожаловать, {user?.fullName} ({user?.role})</p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <Link to="/admin/news"><button>Новости</button></Link>
        <Link to="/admin/documents"><button>Документы</button></Link>
        <Link to="/admin/plots"><button>Участки</button></Link>
        <Link to="/admin/infrastructure"><button>Инфраструктура</button></Link>
        <Link to="/admin/gallery"><button>Галерея</button></Link>
        {user?.role === 'admin' && <Link to="/admin/users"><button>Пользователи</button></Link>}
      </div>
      <Outlet />
    </div>
  );
};

export default AdminPanel;