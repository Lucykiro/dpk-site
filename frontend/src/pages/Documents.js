import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getDocuments } from '../services/documents';
import { useAuth } from '../context/AuthContext';
import { getSEOTags } from '../utils/seo';

const Documents = () => {
  const { settlement } = useOutletContext();
  const { isAuthenticated, user, isAdmin, isChairman } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seo = getSEOTags(settlement, 'Документы', `Устав, положения, кадастровая информация, отчёты посёлка ${settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}. Доступно только авторизованным жителям.`);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    if (user?.role === 'resident' && user?.settlement !== settlement) {
      setError('У вас нет доступа к документам другого посёлка.');
      setLoading(false);
      return;
    }
    getDocuments(settlement)
      .then(res => setDocuments(res.data))
      .catch(err => {
        if (err.response?.status === 403) setError('Нет доступа к документам');
        else setError('Ошибка загрузки');
      })
      .finally(() => setLoading(false));
  }, [settlement, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <>
        <Helmet><title>{seo.title}</title><meta name="description" content={seo.description} /></Helmet>
        <div className="card">Для просмотра документов необходимо <a href="/login">войти</a>.</div>
      </>
    );
  }
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="card" style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="noindex, follow" /> {/* документы не индексируем */}
      </Helmet>
      <div>
        <h2>Документы посёлка</h2>
        <div className="grid">
          {documents.map(doc => (
            <div key={doc.id} className="card">
              <h3>{doc.title}</h3>
              {doc.description && <p>{doc.description}</p>}
              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Скачать</a>
            </div>
          ))}
          {documents.length === 0 && <p>Документов нет.</p>}
        </div>
      </div>
    </>
  );
};

export default Documents;