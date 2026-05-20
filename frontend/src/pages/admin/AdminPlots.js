import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlots, createPlot, updatePlot, deletePlot } from '../../services/plots';

const AdminPlots = () => {
  const { user, isAdmin } = useAuth();
  const [plots, setPlots] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ number: '', area: '', price: '', status: 'available', description: '', settlement: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      let settlement = null;
      if (!isAdmin && user?.role === 'chairman') settlement = user.settlement;
      const res = await getPlots(settlement);
      setPlots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.number || !form.area) {
      alert('Заполните номер и площадь участка');
      return;
    }
    try {
      if (editing) {
        await updatePlot(editing.id, form);
        alert('Участок обновлён');
      } else {
        await createPlot(form);
        alert('Участок создан');
      }
      resetForm();
      fetchPlots();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (plot) => {
    setEditing(plot);
    setForm({
      number: plot.number,
      area: plot.area,
      price: plot.price || '',
      status: plot.status,
      description: plot.description || '',
      settlement: plot.settlement,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить участок?')) return;
    try {
      await deletePlot(id);
      fetchPlots();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      number: '',
      area: '',
      price: '',
      status: 'available',
      description: '',
      settlement: isAdmin ? '' : (user?.settlement || ''),
    });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление участками</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3>{editing ? 'Редактировать участок' : 'Добавить участок'}</h3>
        <div className="form-group">
          <label>Номер участка *</label>
          <input type="text" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Площадь (сотки) *</label>
          <input type="number" step="0.01" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Цена (₽)</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Статус</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="available">В продаже</option>
            <option value="reserved">Забронирован</option>
            <option value="sold">Продан</option>
          </select>
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
        <button type="submit">{editing ? 'Обновить' : 'Создать'}</button>
        {editing && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>

      <h3>Список участков</h3>
      <table>
        <thead>
          <tr><th>№</th><th>Площадь</th><th>Цена</th><th>Статус</th><th>Посёлок</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {plots.map(plot => (
            <tr key={plot.id}>
              <td>{plot.number}</td>
              <td>{plot.area} сот.</td>
              <td>{plot.price ? plot.price.toLocaleString() + ' ₽' : '—'}</td>
              <td>{plot.status === 'available' ? 'В продаже' : plot.status === 'reserved' ? 'Забронирован' : 'Продан'}</td>
              <td>{plot.settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</td>
              <td>
                <button onClick={() => handleEdit(plot)}>Редакт.</button>
                <button onClick={() => handleDelete(plot.id)} className="danger">Удалить</button>
              </td>
            </tr>
          ))}
          {plots.length === 0 && <tr><td colSpan="6">Нет участков</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPlots;