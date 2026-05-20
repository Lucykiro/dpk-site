import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInfrastructure, createInfrastructure, updateInfrastructure, deleteInfrastructure } from '../../services/infrastructure';

const AdminInfrastructure = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '', settlement: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      let settlement = null;
      if (!isAdmin && user?.role === 'chairman') settlement = user.settlement;
      const res = await getInfrastructure(settlement);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert('Введите название');
      return;
    }
    try {
      if (editing) {
        await updateInfrastructure(editing.id, form);
        alert('Объект обновлён');
      } else {
        await createInfrastructure(form);
        alert('Объект создан');
      }
      resetForm();
      fetchItems();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || '', icon: item.icon || '', settlement: item.settlement });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить объект инфраструктуры?')) return;
    try {
      await deleteInfrastructure(id);
      fetchItems();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', icon: '', settlement: isAdmin ? '' : (user?.settlement || '') });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление инфраструктурой</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3>{editing ? 'Редактировать' : 'Добавить'}</h3>
        <div className="form-group">
          <label>Название *</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Иконка (emoji или ссылка)</label>
          <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🏠, ⚡, 💧" />
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
        <button type="submit">{editing ? 'Обновить' : 'Создать'}</button>
        {editing && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>

      <h3>Список объектов</h3>
      <table>
        <thead>
          <tr><th>Иконка</th><th>Название</th><th>Посёлок</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.icon || '—'}</td>
              <td>{item.title}</td>
              <td>{item.settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Редакт.</button>
                <button onClick={() => handleDelete(item.id)} className="danger">Удалить</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="4">Нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInfrastructure;