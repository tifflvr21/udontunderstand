import React from 'react';
import { Plus } from '@styled-icons/fa-solid/Plus';
import { Minus } from '@styled-icons/fa-solid/Minus';
import { MenuOutline } from '@styled-icons/evaicons-outline/MenuOutline';
import { CircleExclamation } from '@styled-icons/fa-solid/CircleExclamation';
import { CircleCheck, Lock } from 'styled-icons/fa-solid';
import { ReactComponent as Coins } from '../../components/Coins.svg';
import styles from './index.module.css';

const { helpers } = window.insolve;

const CS_WEARS = {
  '(Factory New)': 'FN',
  '(Minimal Wear)': 'MW',
  '(Field-Tested)': 'FT',
  '(Well-Worn)': 'WW',
  '(Battle-Scarred)': 'BS'
}

const Item = ({ item, select, isGame = false }) => {
  const reducer = item.amount > 1 ? (item.amountSelected > 0 ? 0 : 1) : 1;

  Object.keys(CS_WEARS).forEach(wear => {
    item.cs_wear = item.name.includes(wear) ? CS_WEARS[wear] : (!item.cs_wear ? '' : item.cs_wear);
    item.name = item.appid === '730' ? item.name.replace(wear, '') : item.name;
    item.souvenir = item.name.split(' ')[0] === 'Souvenir';
  });
  
  item.stickers = item.stickers || [];
  item.hasExtra = item.stickers.length > 0 || item.nametag !== '';

  item.nametag = !item.nametag ? '' : item.nametag;

  if(isGame) {
    item.accept = true;
  }

  return (
    <div onClick={() => select(item.assetid, reducer)} data-accept={!!item.accept} data-hasextra={item.nametag !== '' ? true : null} data-selector={item.amount > 1 && item.amountSelected > 0 ? true : null} className={styles.item} data-active={item.amountSelected > 0} style={{'--color': item.color ? (item.color[0] === '#' ? item.color : `#${item.color}`) : 'var(--theme-color)'}}>
      <div className={styles.image}>
        <div />
        <img className={styles.main} src={item.image} alt={item.name} />
        
        {item.effect && <img src={`https://tf2hunt.com/assets/imgs/effects/${item.effect_name.replaceAll(' ', '_')}.png`} alt="" className={styles.effect} />}
        {/* {item.effect && <img src={`https://backpack.tf/images/440/particles/${item.effect}_94x94.png`} alt="" className={styles.effect} />} */}
      </div>

      {item.appid === '730' && (
        <>
          <p className={styles.wear} style={item.hasExtra ? {left: '30px'} : null}>{item.cs_wear}</p>
          {item.souvenir && <div className={styles.souvenir} />}
          {item.hasExtra && <CircleExclamation className={styles.cs_info} />}
          {item.nametag !== '' && <p className={styles.nametag}>{item.nametag}</p>}
          {item.stickers.length > 0 && (
            <div className={styles.stickers}>
              {item.stickers.map((sticker, key) => (
                <img src={sticker.img} alt={sticker.name} title={sticker.name} key={key} />
              ))}
            </div>
          )}
        </>
      )}

      <p className={styles.name} title={item.name}>{item.name}</p>

      {item.amount > 1 && (
        <>
          <p className={styles.amount}>
            <MenuOutline />
            <span>{item.amount}</span>
          </p>

          <div className={styles.amountSelector} data-visible={item.amountSelected > 0 ? true : null}>
            <div className={styles.input}>
              <Minus onClick={() => select(item.assetid, -1)} />
              <p>{item.amountSelected}</p>
              <Plus onClick={() => select(item.assetid, 1)} />
            </div>
          </div>
        </>
      )}

      <p className={styles.price}>
        <Coins />
        <span>{helpers.formatBalance(item.price)}</span>
      </p>

      {!item.accept && (
        <div className={styles.accept}>
          <Lock />
          <p>This item is not accepted because it's too low in value.</p>
        </div>
      )}

      <div className={styles.border}  />
      <div className={styles.selected}>
        <CircleCheck />
      </div>
    </div>
  );
}

export default Item;