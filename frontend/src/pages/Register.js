import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { SETTLEMENTS, SETTLEMENTS_NAMES } from '../utils/constants';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [settlement, setSettlement] = useState(SETTLEMENTS.ZAPOVEDNOE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, fullName, settlement);
      setSuccess('Регистрация успешна! Теперь вы можете войти.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <>
      <Helmet>
        <title>Регистрация | ДПК Заповедное и Колосок</title>
        <meta name="description" content="Зарегистрируйтесь как житель дачного посёлка для доступа к документам и новостям." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>Регистрация</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Полное имя</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Пароль (мин. 6 символов)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
          </div>
          <div className="form-group">
            <label>Посёлок</label>
            <select value={settlement} onChange={e => setSettlement(e.target.value)}>
              <option value={SETTLEMENTS.ZAPOVEDNOE}>{SETTLEMENTS_NAMES[SETTLEMENTS.ZAPOVEDNOE]}</option>
              <option value={SETTLEMENTS.KOLOSOK}>{SETTLEMENTS_NAMES[SETTLEMENTS.KOLOSOK]}</option>
            </select>
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
        <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </div>
    </>
  );
};

export default Register;