import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

const Modal = ({ visible, toggle, children, style = {}, styleOverlay, className, width }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if(visible) return setShouldRender(true);

    const tmt = setTimeout(() => setShouldRender(false), 300);

    return () => clearTimeout(tmt);
  }, [visible]);

  return shouldRender ? (
    <>
      <div style={styleOverlay} data-visible={visible} className={styles.overlay} onClick={() => toggle(false)} />
      <div data-visible={visible} className={`${styles.modal} ${className || ''}`} style={{...style, width}}>
        {children}
      </div>
    </>
  ) : null;
};

export default Modal;