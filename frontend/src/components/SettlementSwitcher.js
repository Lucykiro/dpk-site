import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SETTLEMENTS, SETTLEMENTS_NAMES } from '../utils/constants';

const SettlementSwitcher = ({ currentSettlement, onSwitch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (settlement) => {
    if (onSwitch) {
      onSwitch(settlement);
    } else {
      // Получаем текущий путь без settlement
      const pathParts = location.pathname.split('/').filter(part => part && part !== 'zapovednoe' && part !== 'kolosok');
      const newPath = `/${settlement}${pathParts.length ? '/' + pathParts.join('/') : ''}`;
      navigate(newPath);
    }
  };

  return (
    <div className="settlement-switcher">
      <button
        className={`settlement-btn ${currentSettlement === SETTLEMENTS.ZAPOVEDNOE ? 'active' : ''}`}
        onClick={() => handleSwitch(SETTLEMENTS.ZAPOVEDNOE)}
      >
        {SETTLEMENTS_NAMES[SETTLEMENTS.ZAPOVEDNOE]}
      </button>
      <button
        className={`settlement-btn ${currentSettlement === SETTLEMENTS.KOLOSOK ? 'active' : ''}`}
        onClick={() => handleSwitch(SETTLEMENTS.KOLOSOK)}
      >
        {SETTLEMENTS_NAMES[SETTLEMENTS.KOLOSOK]}
      </button>
    </div>
  );
};

export default SettlementSwitcher;