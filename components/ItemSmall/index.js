import React from 'react';
import { CloseCircle } from '@styled-icons/ionicons-outline/CloseCircle';
import { MenuOutline } from '@styled-icons/evaicons-outline/MenuOutline';
import { Check2 } from '@styled-icons/bootstrap/Check2';
import { ReactComponent as Coins } from '../../components/Coins.svg';
import styles from './index.module.css';

const { helpers } = window.insolve;

const ItemSmall = ({ item, select, checkbox }) => (
  <div className={styles.itemSmall} data-active={item.active} style={{'--color': item.color ? `#${item.color}` : 'var(--theme-color)'}}>
    <div className={styles.image}>
      <div />
      <img src={item.image} alt={item.name} />
    </div>

    <div className={styles.text}>
      <p className={styles.name}>{item.name}</p>
      <p className={styles.price}>
        <Coins />
        <span>{helpers.formatBalance(item.price)}</span>
      </p>

      {item.amountSelected > 1 && (
        <p className={styles.amount}>
          <MenuOutline />
          <span>{item.amountSelected}</span>
        </p>
      )}
    </div>

    {checkbox ? (
      <div className={styles.checkbox} onClick={() => select(item.assetid)}>
        <Check2 />
      </div>
    ) : (
      <CloseCircle className={styles.close} onClick={() => select(item.assetid, -item.amountSelected)} />
    )}
  </div>
)

export default ItemSmall;