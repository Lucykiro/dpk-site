import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettlementSwitcher from './SettlementSwitcher';

const Header = ({ settlement, onSettlementChange }) => {
  const { user, logout, isAuthenticated, isAdmin, isChairman } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <h1>ДПК Заповедное & Колосок</h1>
          <p>Ваши дачные посёлки</p>
        </div>
        <nav>
          <ul>
            <li><Link to={`/${settlement}`}>Главная</Link></li>
            <li><Link to={`/${settlement}/about`}>О посёлке</Link></li>
            <li><Link to={`/${settlement}/plots`}>Участки</Link></li>
            <li><Link to={`/${settlement}/infrastructure`}>Инфраструктура</Link></li>
            <li><Link to={`/${settlement}/gallery`}>Галерея</Link></li>
            <li><Link to={`/${settlement}/documents`}>Документы</Link></li>
            <li><Link to={`/${settlement}/contacts`}>Контакты</Link></li>
            <li><Link to={`/${settlement}/news`}>Новости</Link></li>
            {(isAdmin || isChairman) && <li><Link to={`/admin`}>Админка</Link></li>}
            {!isAuthenticated ? (
              <>
                <li><Link to="/login">Вход</Link></li>
                <li><Link to="/register">Регистрация</Link></li>
              </>
            ) : (
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Выйти ({user?.fullName})</button></li>
            )}
          </ul>
        </nav>
        <SettlementSwitcher currentSettlement={settlement} onSwitch={onSettlementChange} />
      </div>
    </header>
  );
};

export default Header;