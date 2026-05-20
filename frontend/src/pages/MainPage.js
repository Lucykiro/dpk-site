import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SETTLEMENTS } from '../utils/constants';

const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/${SETTLEMENTS.ZAPOVEDNOE}`);
  }, [navigate]);
  return null;
};

export default MainPage;