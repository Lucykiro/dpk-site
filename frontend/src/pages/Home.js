import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getNews } from '../services/news';
import { getGallery } from '../services/gallery';
import { getSEOTags } from '../utils/seo';

const Home = () => {
  const { settlement } = useOutletContext();
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const seo = getSEOTags(settlement, 'Главная', `Добро пожаловать в ${settlement === 'zapovednoe' ? 'ДПК Заповедное' : 'ДПК Колосок'} – уютный дачный посёлок с развитой инфраструктурой`);

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
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
      </Helmet>
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
    </>
  );
};

export default Home;