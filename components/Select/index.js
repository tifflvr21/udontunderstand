import React, { useState } from 'react';
import { Checkmark } from 'styled-icons/evaicons-solid';
import { ChevronDown } from 'styled-icons/fa-solid';
import useClickOutside from '../../hooks/useClickOutside';
import styles from './index.module.css';


const Select = ({ options, select, selected, className, z, placeholder, cb }) => {
  const [expand, setExpand] = useState(false);

  const toggleExpand = () => setExpand(prev => !prev);
  const choose = key => {
    toggleExpand();
    select(key);

    if(cb) cb(key);
  }

  const clickRef = React.useRef();
  useClickOutside(clickRef, () => expand && setExpand(false));

  return (
    <div className={`${styles.select} ${className || ''}`} data-expand={expand || null} ref={clickRef} style={z ? {zIndex: z} : null}>
      <div className={styles.main} onClick={toggleExpand}>
        <span>{options[selected] || (placeholder || '?')}</span>
        <ChevronDown />
      </div>

      <div className={styles.options}>
        {options.map((item, key) => (
          <div key={key} onClick={() => choose(key)} data-selected={selected === key || null}>
            <span>{item}</span>
            {selected === key && <Checkmark />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;