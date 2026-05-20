import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminUsers = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      alert('Роль обновлена');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  const roleOptions = isAdmin 
    ? ['guest', 'resident', 'chairman', 'admin']
    : ['guest', 'resident']; // председатель может назначать только жителя или гостя

  return (
    <div>
      <h2>Управление пользователями</h2>
      <p>{!isAdmin && 'Вы можете менять роли только для жителей и гостей вашего посёлка.'}</p>
      <table>
        <thead>
          <tr><th>ID</th><th>ФИО</th><th>Email</th><th>Посёлок</th><th>Роль</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.settlement === 'zapovednoe' ? 'Заповедное' : user.settlement === 'kolosok' ? 'Колосок' : '—'}</td>
              <td>{user.role}</td>
              <td>
                {currentUser.id !== user.id && (
                  <select value={editingRole === user.id ? newRole : user.role} onChange={(e) => {
                    setEditingRole(user.id);
                    setNewRole(e.target.value);
                  }}>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                )}
                {editingRole === user.id && (
                  <>
                    <button onClick={() => updateUserRole(user.id, newRole)}>Сохранить</button>
                    <button onClick={() => setEditingRole(null)}>Отмена</button>
                  </>
                )}
                {editingRole !== user.id && currentUser.id !== user.id && (
                  <button onClick={() => setEditingRole(user.id)}>Изменить роль</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;