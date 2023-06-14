import { Gun } from '@styled-icons/fa-solid';
import Button from "../Button";
import LoadingSimple from '../LoadingSimple';
import coin from '../../resources/images/coin.png';
import styles from "./index.module.css";
import { CloseOutline } from '@styled-icons/evaicons-outline/CloseOutline';

import { ReactComponent as JackpotIcon } from '../../domain/Sidebar/resources/jackpot.svg';
import { ReactComponent as CoinflipIcon } from '../../domain/Sidebar/resources/coinflip.svg';
import { ReactComponent as MinesIcon } from '../../domain/Sidebar/resources/upgrader.svg';

const MAX_ITEMS_PER_TRADE = 20;

const TITLES = {
  'coinflip': {
    icon: <CoinflipIcon />,
    title: 'Creating a coinflip game'
  },

  'jackpot': {
    icon: <JackpotIcon />,
    title: 'Joining the jackpot'
  },
  'mines': {
    icon: <MinesIcon />,
    title: 'Joining a mines game'
  }
}

const Header = ({ desc, selectedSum, selected, joinGame, error, loading, game, close }) => {
  return (
    <div className={styles.header}>
      <div className={styles.closeMobile} onClick={close}>
        <CloseOutline />
      </div>

      <div className={styles.left}>
        <div>
          {TITLES[game]?.icon || null}
          <h3>{TITLES[game]?.title || 'Deposit'}</h3>
        </div>
        <p>{TITLES[game]?.desc || 'Deposit your items to get started.'}</p>
      </div>

      <div className={styles.right}>
        <div className={styles.box}>
          <img src={coin} alt="" />
          <span>{window.insolve.helpers.formatBalance(selectedSum)}</span>
        </div>

        <div className={styles.box}>
          <Gun />
          <span style={selected.length > MAX_ITEMS_PER_TRADE ? {color: 'var(--roulette-red-single)'} : null}>{selected.length}</span>
          <span style={{color: 'var(--text-color-secondary)'}}>/{MAX_ITEMS_PER_TRADE}</span>
        </div>

        <Button block type="button" variant="theme" onClick={joinGame} disabled={!!error || selected.length > MAX_ITEMS_PER_TRADE || loading || selected.length <= 0} shiny>
          {loading ? <><LoadingSimple /><span>Loading...</span></> : 'Join game'}
        </Button>
      </div>
    </div>
  );
}

export default Header;