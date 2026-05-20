import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../../services/documents';
import { uploadFile } from '../../services/upload';

const AdminDocuments = () => {
  const { user, isAdmin, canEditSettlement } = useAuth();
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '', settlement: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      let settlement = null;
      if (!isAdmin && user?.role === 'chairman') {
        settlement = user.settlement;
      }
      const res = await getDocuments(settlement);
      setDocs(res.data);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки документов');
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
      setForm({ ...form, fileUrl: res.data.fileUrl });
      alert('Файл загружен');
    } catch (err) {
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl) {
      alert('Заполните название и файл');
      return;
    }
    try {
      if (editing) {
        await updateDocument(editing.id, form);
        alert('Документ обновлён');
      } else {
        await createDocument(form);
        alert('Документ создан');
      }
      resetForm();
      fetchDocs();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (doc) => {
    setEditing(doc);
    setForm({ title: doc.title, description: doc.description || '', fileUrl: doc.fileUrl, settlement: doc.settlement });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить документ?')) return;
    try {
      await deleteDocument(id);
      fetchDocs();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', fileUrl: '', settlement: isAdmin ? '' : (user?.settlement || '') });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление документами</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3>{editing ? 'Редактировать документ' : 'Добавить документ'}</h3>
        <div className="form-group">
          <label>Название *</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
          <label>URL файла *</label>
          <input type="text" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." />
          <div style={{ marginTop: '5px' }}>
            <input type="file" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <span>Загрузка...</span>}
          </div>
        </div>
        <button type="submit" disabled={uploading}>{editing ? 'Обновить' : 'Создать'}</button>
        {editing && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>

      <h3>Список документов</h3>
      <table>
        <thead>
          <tr><th>Название</th><th>Посёлок</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {docs.map(doc => (
            <tr key={doc.id}>
              <td>{doc.title}</td>
              <td>{doc.settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</td>
              <td>
                <button onClick={() => handleEdit(doc)}>Редакт.</button>
                <button onClick={() => handleDelete(doc.id)} className="danger">Удалить</button>
              </td>
            </tr>
          ))}
          {docs.length === 0 && <tr><td colSpan="3">Нет документов</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDocuments;