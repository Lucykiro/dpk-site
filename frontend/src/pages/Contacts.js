import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSettlementInfo } from '../services/settlements';
import { sendContactMessage } from '../services/contacts';
import { getSEOTags } from '../utils/seo';

const Contacts = () => {
  const { settlement } = useOutletContext();
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const seo = getSEOTags(settlement, 'Контакты', `Адрес, телефон, схема проезда и форма обратной связи для посёлка ${settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}.`);

  useEffect(() => {
    getSettlementInfo(settlement)
      .then(res => setInfo(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [settlement]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Заполните все поля' });
      return;
    }
    try {
      await sendContactMessage({ ...form, settlement });
      setStatus({ type: 'success', text: 'Сообщение отправлено! Мы свяжемся с вами.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Ошибка отправки. Попробуйте позже.' });
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!info) return <div>Контакты не найдены</div>;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>
      <div>
        <div className="card">
          <h2>Контакты {info.name}</h2>
          <p><strong>Адрес:</strong> {info.address}</p>
          <p><strong>Телефон:</strong> {info.phone}</p>
          <p><strong>Email:</strong> {info.email}</p>
        </div>
        <div className="card">
          <h3>Схема проезда</h3>
          <div dangerouslySetInnerHTML={{ __html: info.mapEmbed }} />
        </div>
        <div className="card">
          <h3>Форма обратной связи</h3>
          {status.text && <div style={{ color: status.type === 'success' ? 'green' : 'red', marginBottom: '10px' }}>{status.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ваше имя *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Сообщение *</label>
              <textarea name="message" rows="4" value={form.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit">Отправить</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contacts;