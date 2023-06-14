import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import { Info } from '@styled-icons/evaicons-solid/Info';
// import Button from '../../components/Button';
import Modal from '../../components/Modal';
// import Item from '../../components/Item';

// import Header from './header';


import styles from './index.module.css';

// const { helpers } = window.insolve;

const CoinflipModal = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(undefined);

  const openModal = d => {
    setData(d);
    setVisible(prev => !prev);
  }

  useEffect(() => {
    window.insolve.events.on('internal:togglePFmodal', openModal);

    return () => window.insolve.events.off('internal:togglePFmodal', openModal);
  }, []);


  return (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="26%">
      <h4>Provably fair</h4>
      <p>These are the raw values that go into generating the final result. To learn more how it works, visit our <Link to="/provably-fair">Provably fair</Link> page.</p>
    
      <label>Public server hash</label>
      <div>{data?.publicServerHash || '-'}</div>

      <label>Server hash</label>
      <div>{data?.serverHash || '-'}</div>

      <label>Random.org result</label>
      <div>{data?.randomorgResult?.result?.toString() || '-'}</div>

      <label>Random.org random</label>
      <div>{data?.randomorgResult?.random?.toString() || '-'}</div>

      <label>Random.org signature</label>
      <div>{data?.randomorgResult?.signature?.toString() || '-'}</div>
      <p className={styles.sub}>
        To verify legitimacy of these results you need to input them into the <a href="https://api.random.org/signatures/form" target="_blank" rel="noopener noreferrer">Signature Verification Form on random.org</a>.
      </p>

      <label>Final hash</label>
      <div>{data?.finalHash || '-'}</div>

      {['jackpot', 'coinflip'].includes(data?.game) && (
        <>
          <label>Winning ticket</label>
          <div>{data?.[data?.game === 'coinflip' ? 'winTicket' : 'winningTicket'] || '-'}</div>
        </>
      )}

      {data?.game === 'mines' && (
        <>
          <label>Mines placement</label>
          <div>{JSON.stringify(data?.minesRaw || [], null, 2)}</div>
        </>
      )}
    </Modal>
  );
}

export default CoinflipModal;