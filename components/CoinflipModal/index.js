import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import CoinflipGame from '../../scenes/CoinflipGame';

import styles from './index.module.css';

const CoinflipModal = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(undefined);

  const openModal = d => {
    setData(d);
    setVisible(prev => !prev);
  }

  useEffect(() => {
    window.insolve.events.on('internal:toggleCfModal', openModal);

    return () => window.insolve.events.off('internal:toggleCfModal', openModal);
  }, []);

  if(!data) return null;

  return (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="50%" styleOverlay={{zIndex: '119'}} style={{zIndex: '120'}}>
      <CoinflipGame id={data} />
    </Modal>
  );
}

export default CoinflipModal;