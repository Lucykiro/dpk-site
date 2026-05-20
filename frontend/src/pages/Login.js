import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <>
      <Helmet>
        <title>Вход | ДПК Заповедное и Колосок</title>
        <meta name="description" content="Вход в личный кабинет для просмотра документов и управления данными." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>Вход</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Войти</button>
        </form>
        <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        <p><small>Тестовые учётные записи: admin@dpk.ru / admin123, chairman@zapovednoe.ru / chair123, resident@kolosok.ru / resident123</small></p>
      </div>
    </>
  );
};

export default Login;