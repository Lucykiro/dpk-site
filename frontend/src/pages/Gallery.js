import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getGallery } from '../services/gallery';

const Gallery = () => {
  const { settlement } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery(settlement)
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [settlement]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Фото и видео</h2>
      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card">
            {item.type === 'photo' ? (
              <img src={item.imageUrl} alt={item.title || 'Фото'} style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={item.imageUrl} type="video/mp4" />
              </video>
            )}
            {item.title && <p><strong>{item.title}</strong></p>}
          </div>
        ))}
        {items.length === 0 && <p>Медиафайлов пока нет.</p>}
      </div>
    </div>
  );
};

export default Gallery;