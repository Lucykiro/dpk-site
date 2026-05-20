import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../../services/gallery';
import { uploadFile } from '../../services/upload';

const AdminGallery = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '', type: 'photo', settlement: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      let settlement = null;
      if (!isAdmin && user?.role === 'chairman') settlement = user.settlement;
      const res = await getGallery(settlement);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setForm({ ...form, imageUrl: res.data.fileUrl });
      alert('Файл загружен');
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      alert('Загрузите фото или видео');
      return;
    }
    try {
      await createGalleryItem(form);
      alert('Элемент добавлен');
      setForm({ title: '', imageUrl: '', type: 'photo', settlement: isAdmin ? '' : (user?.settlement || '') });
      fetchGallery();
    } catch (err) {
      alert('Ошибка создания');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить элемент?')) return;
    try {
      await deleteGalleryItem(id);
      fetchGallery();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление галереей</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3>Добавить фото/видео</h3>
        <div className="form-group">
          <label>Название (необязательно)</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Тип</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="photo">Фото</option>
            <option value="video">Видео</option>
          </select>
        </div>
        {isAdmin && (
          <div className="form-group">
            <label>Посёлок *</label>
            <select value={form.settlement} onChange={e => setForm({ ...form, settlement: e.target.value })} required>
              <option value="">Выберите</option>
              <option value="zapovednoe">Заповедное</option>
              <option value="kolosok">Колосок</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label>URL файла</label>
          <input type="text" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <div><input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} /> {uploading && 'Загрузка...'}</div>
        </div>
        <button type="submit" disabled={uploading}>Добавить</button>
      </form>

      <h3>Элементы галереи</h3>
      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card">
            {item.type === 'photo' ? (
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={item.imageUrl} type="video/mp4" />
              </video>
            )}
            <p><strong>{item.title || 'Без названия'}</strong></p>
            <p><small>{item.settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</small></p>
            <button onClick={() => handleDelete(item.id)} className="danger">Удалить</button>
          </div>
        ))}
        {items.length === 0 && <p>Нет элементов</p>}
      </div>
    </div>
  );
};

export default AdminGallery;