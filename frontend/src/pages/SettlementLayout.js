import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SETTLEMENTS } from '../utils/constants';

const SettlementLayout = () => {
  const { settlement } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSettlement, setCurrentSettlement] = useState(settlement || SETTLEMENTS.ZAPOVEDNOE);

  useEffect(() => {
    if (settlement && (settlement === SETTLEMENTS.ZAPOVEDNOE || settlement === SETTLEMENTS.KOLOSOK)) {
      setCurrentSettlement(settlement);
    } else if (settlement) {
      navigate(`/${SETTLEMENTS.ZAPOVEDNOE}`, { replace: true });
    }
  }, [settlement, navigate]);

  const handleSettlementChange = (newSettlement) => {
    if (newSettlement === currentSettlement) return;
    const pathAfterSettlement = location.pathname.split('/').slice(2).join('/');
    navigate(`/${newSettlement}/${pathAfterSettlement}`);
  };

  return (
    <>
      <Header settlement={currentSettlement} onSettlementChange={handleSettlementChange} />
      <main className="container">
        <Outlet context={{ settlement: currentSettlement }} />
      </main>
      <Footer />
    </>
  );
};

export default SettlementLayout;