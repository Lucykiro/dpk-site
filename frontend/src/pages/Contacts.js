import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getSettlementInfo } from '../services/settlements';

const Contacts = () => {
  const { settlement } = useOutletContext();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettlementInfo(settlement)
      .then(res => setInfo(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [settlement]);

  if (loading) return <div>Загрузка...</div>;
  if (!info) return <div>Контакты не найдены</div>;

  return (
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
        <form>
          <div className="form-group">
            <label>Ваше имя</label>
            <input type="text" placeholder="Имя" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label>Сообщение</label>
            <textarea rows="4" placeholder="Ваше сообщение"></textarea>
          </div>
          <button type="submit">Отправить</button>
        </form>
        <p className="small">(Форма пока не подключена к бэкенду, демо-режим)</p>
      </div>
    </div>
  );
};

export default Contacts;