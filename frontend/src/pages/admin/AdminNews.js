import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNews, createNews, updateNews, deleteNews } from '../../services/news';
import { uploadFile } from '../../services/upload';

const AdminNews = () => {
  const { user, canEditSettlement } = useAuth();
  const [news, setNews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', settlement: '', image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Если председатель, показываем новости только его посёлка
      const settlement = user.role === 'chairman' ? user.settlement : null;
      const res = await getNews(settlement);
      setNews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      setForm({ ...form, image: res.data.fileUrl });
    } catch (err) {
      alert('Ошибка загрузки изображения');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateNews(editing.id, form);
      } else {
        await createNews(form);
      }
      resetForm();
      fetchNews();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, settlement: item.settlement, image: item.image || '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить новость?')) {
      await deleteNews(id);
      fetchNews();
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', content: '', settlement: user.role === 'chairman' ? user.settlement : '', image: '' });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление новостями</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3>{editing ? 'Редактировать' : 'Добавить новость'}</h3>
        <div className="form-group">
          <label>Заголовок</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Содержание</label>
          <textarea rows="5" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
        </div>
        {user.role === 'admin' && (
          <div className="form-group">
            <label>Посёлок</label>
            <select value={form.settlement} onChange={e => setForm({ ...form, settlement: e.target.value })} required>
              <option value="">Выберите</option>
              <option value="zapovednoe">Заповедное</option>
              <option value="kolosok">Колосок</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Изображение (URL или загрузить)</label>
          <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="http://..." />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <button type="submit">{editing ? 'Обновить' : 'Создать'}</button>
        {editing && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>

      <h3>Существующие новости</h3>
      <table>
        <thead>
          <tr><th>Заголовок</th><th>Посёлок</th><th>Дата</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {news.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Редакт.</button>
                <button onClick={() => handleDelete(item.id)} className="danger">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNews;