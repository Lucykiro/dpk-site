import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPlots } from '../services/plots';

const Plots = () => {
  const { settlement } = useOutletContext();
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ minArea: '', maxArea: '', minPrice: '', maxPrice: '', status: '' });

  useEffect(() => {
    fetchPlots();
  }, [settlement, filters]);

  const fetchPlots = async () => {
    try {
      const cleanFilters = {};
      if (filters.minArea) cleanFilters.minArea = filters.minArea;
      if (filters.maxArea) cleanFilters.maxArea = filters.maxArea;
      if (filters.minPrice) cleanFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) cleanFilters.maxPrice = filters.maxPrice;
      if (filters.status) cleanFilters.status = filters.status;
      const res = await getPlots(settlement, cleanFilters);
      setPlots(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ minArea: '', maxArea: '', minPrice: '', maxPrice: '', status: '' });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'В продаже';
      case 'sold': return 'Продан';
      case 'reserved': return 'Забронирован';
      default: return status;
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Участки в посёлке {settlement === 'zapovednoe' ? 'Заповедное' : 'Колосок'}</h2>
      <div className="card">
        <h3>Фильтры</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: '10px' }}>
          <input type="number" name="minArea" placeholder="Площадь от (сотки)" value={filters.minArea} onChange={handleFilterChange} />
          <input type="number" name="maxArea" placeholder="Площадь до (сотки)" value={filters.maxArea} onChange={handleFilterChange} />
          <input type="number" name="minPrice" placeholder="Цена от (₽)" value={filters.minPrice} onChange={handleFilterChange} />
          <input type="number" name="maxPrice" placeholder="Цена до (₽)" value={filters.maxPrice} onChange={handleFilterChange} />
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Любой статус</option>
            <option value="available">В продаже</option>
            <option value="reserved">Забронирован</option>
            <option value="sold">Продан</option>
          </select>
          <button onClick={resetFilters}>Сбросить</button>
        </div>
      </div>
      <div className="grid">
        {plots.map(plot => (
          <div key={plot.id} className="card">
            <h3>Участок №{plot.number}</h3>
            <p><strong>Площадь:</strong> {plot.area} сот.</p>
            {plot.price && <p><strong>Цена:</strong> {plot.price.toLocaleString()} ₽</p>}
            <p><strong>Статус:</strong> {getStatusText(plot.status)}</p>
            {plot.description && <p>{plot.description}</p>}
          </div>
        ))}
        {plots.length === 0 && <p>Участков не найдено.</p>}
      </div>
    </div>
  );
};

export default Plots;