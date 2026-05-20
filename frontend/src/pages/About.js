import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getSettlementInfo } from '../services/settlements';

const About = () => {
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
  if (!info) return <div>Информация не найдена</div>;

  return (
    <div className="card">
      <h2>О посёлке {info.name}</h2>
      <p><strong>Адрес:</strong> {info.address}</p>
      <p><strong>Телефон:</strong> {info.phone}</p>
      <p><strong>Email:</strong> {info.email}</p>
      <h3>Описание</h3>
      <p>{info.about}</p>
      <h3>Устав и правила</h3>
      <p>{info.rules}</p>
    </div>
  );
};

export default About;