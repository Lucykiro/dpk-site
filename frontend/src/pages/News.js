import React, { useEffect, useState } from 'react';
import { useOutletContext, Link, useParams } from 'react-router-dom';
import { getNews, getNewsItem } from '../services/news';

const NewsList = () => {
  const { settlement } = useOutletContext();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews(settlement)
      .then(res => setNews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [settlement]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Новости и объявления</h2>
      {news.map(item => (
        <div key={item.id} className="card">
          <h3><Link to={`/${settlement}/news/${item.id}`}>{item.title}</Link></h3>
          <small>{new Date(item.createdAt).toLocaleDateString()}</small>
          <p>{item.content.substring(0, 200)}...</p>
        </div>
      ))}
      {news.length === 0 && <p>Новостей пока нет.</p>}
    </div>
  );
};

const NewsDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settlement } = useOutletContext();

  useEffect(() => {
    getNewsItem(id)
      .then(res => setItem(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!item) return <div>Новость не найдена</div>;

  return (
    <div className="card">
      <h2>{item.title}</h2>
      <small>{new Date(item.createdAt).toLocaleDateString()}</small>
      {item.image && <img src={item.image} alt={item.title} style={{ maxWidth: '100%', marginTop: '10px' }} />}
      <div style={{ marginTop: '20px' }}>{item.content}</div>
      <Link to={`/${settlement}/news`}>← Назад к новостям</Link>
    </div>
  );
};

export { NewsList, NewsDetail };