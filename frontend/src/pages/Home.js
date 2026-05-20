import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getNews } from '../services/news';
import { getGallery } from '../services/gallery';

const Home = () => {
  const { settlement } = useOutletContext();
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsRes = await getNews(settlement);
        setNews(newsRes.data.slice(0, 3));
        const galleryRes = await getGallery(settlement);
        setPhotos(galleryRes.data.filter(item => item.type === 'photo').slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [settlement]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div className="card">
        <h2>Добро пожаловать в ДПК {settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}!</h2>
        <p>Уютный дачный посёлок с развитой инфраструктурой и живописной природой.</p>
      </div>
      <div className="card">
        <h3>Последние новости</h3>
        {news.length === 0 ? <p>Новостей пока нет.</p> : (
          <ul>
            {news.map(item => (
              <li key={item.id}>
                <Link to={`/${settlement}/news/${item.id}`}>{item.title}</Link>
                <small>{new Date(item.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
        <Link to={`/${settlement}/news`}>Все новости →</Link>
      </div>
      <div className="card">
        <h3>Фотогалерея</h3>
        <div className="grid">
          {photos.map(photo => (
            <img key={photo.id} src={photo.imageUrl} alt={photo.title} style={{ width: '100%', borderRadius: '8px' }} />
          ))}
        </div>
        <Link to={`/${settlement}/gallery`}>Смотреть все фото →</Link>
      </div>
    </div>
  );
};

export default Home;