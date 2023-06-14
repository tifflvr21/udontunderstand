import React, { useEffect, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import styles from './index.module.css';

const MsgDropdown = ({ links, visible, width, toggle, left, right, top, bottom }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const clickRef = React.useRef();

  useClickOutside(clickRef, () => visible && toggle(false));

  useEffect(() => {
    if(visible) return setShouldRender(true);

    const tmt = setTimeout(() => setShouldRender(false), 300);

    return () => clearTimeout(tmt);
  }, [visible]);

  return shouldRender ? (
    <ul data-visible={!!visible} className={styles.dropdown} style={{
      width: width || null,
      left: typeof left !== 'undefined' ? left : null,
      right: typeof right !== 'undefined' ? right : null,
      bottom: typeof bottom !== 'undefined' ? bottom : null,
      top: typeof top !== 'undefined' ? top : null,
    }} ref={clickRef}>
      {links.map((item, key) => {
        const onClick = () => {
          if(item.onClick) item.onClick();
          toggle(false);
        }

        return (
          <li onClick={onClick} key={key}>
            {item.icon || null}
            <span>{item.name}</span>
          </li>
        );
      })}
    </ul>
  ) : null;
};

export default MsgDropdown;