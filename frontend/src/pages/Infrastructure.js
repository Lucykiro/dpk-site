import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getInfrastructure } from '../services/infrastructure';
import { getSEOTags } from '../utils/seo';

const Infrastructure = () => {
  const { settlement } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const seo = getSEOTags(settlement, 'Инфраструктура', `Дороги, электричество, водоснабжение, охрана, магазины в посёлке ${settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}.`);

  useEffect(() => {
    getInfrastructure(settlement)
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [settlement]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>
      <div>
        <h2>Инфраструктура</h2>
        <div className="grid">
          {items.map(item => (
            <div key={item.id} className="card">
              {item.icon && <div style={{ fontSize: '2rem' }}>{item.icon}</div>}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
          {items.length === 0 && <p>Информация об инфраструктуре отсутствует.</p>}
        </div>
      </div>
    </>
  );
};

export default Infrastructure;