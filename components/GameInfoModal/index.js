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
    window.insolve.events.on('internal:toggleGameInfoModal', openModal);

    return () => window.insolve.events.off('internal:toggleGameInfoModal', openModal);
  }, []);


  return (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="26%">
      <h4>What is this gamemode?</h4>
      
      {data === 'jackpot' && <p>Jackpot is a game where the winner takes all - players deposit any amount they wish into the pot, the more they deposit the higher their chance to win is. The game starts once there is atleast 2 players in the round.</p>}
      {data === 'coinflip' && <p>Coinflip is a very straight forward game where two players deposit a similar amount of items and the winner is determined by a coin flip - the lucky one gets everything! The final odds are determined by how much each player has deposited and displayed under their name. The difference in amounts can't be more than 10% to keep the game fair.</p>}
      {data === 'mines' && <p>Mines is inspired by the classic game of minesweeper. There can be up to 4 players in a game, each one deposits a similar amount of skins. When the game starts, players take turns on picking a box to check if there is a bomb hiding or not. If a player finds a bomb they are eliminated from the game - this goes on until there is only one player left - the last one standing wins everything!</p>}
    </Modal>
  );
}

export default CoinflipModal;