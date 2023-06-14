import { useState, useRef } from 'react';

import { RightArrowAlt } from '@styled-icons/boxicons-regular/RightArrowAlt';
import { LeftArrowAlt } from '@styled-icons/boxicons-regular/LeftArrowAlt';

import styles from './index.module.css';

const ScrollingContainer = ({ height, speed = 50, children }) => {
  const [offset, setOffset] = useState(0);
  const content = useRef();
  const container = useRef();

  const containerWidth = container.current?.offsetWidth;
  const contentWidth = content.current?.offsetWidth;
  const maxOffset = Math.abs(containerWidth - contentWidth);
  // todo: make use of useLayoutEffect for this
  const visible = [
    contentWidth < containerWidth ? false : (offset > 0),
    contentWidth < containerWidth ? false : (offset < maxOffset)
  ];

  const scroll = dir => {
    setOffset(prev => {
      const newOffset = prev + (speed * dir);
      
      return newOffset < 0 ? 0 : (
        newOffset > maxOffset ? maxOffset : newOffset
      );
    });
  }

  return (
    <div className={styles.outer} style={{height: height || null}} ref={container}>
      <div className={styles.inner} style={{transform: `translateX(-${offset}px)`}}>
        <div className={styles.wrapper} ref={content}>
          {children}
        </div>
      </div>

      <div className={styles.arrows}>
        <div className={styles.left} data-visible={visible[0] || null} onClick={() => scroll(-1)}>
          <LeftArrowAlt />
        </div>

        <div className={styles.right} data-visible={visible[1] || null} onClick={() => scroll(1)}>
          <RightArrowAlt />
        </div>
      </div>
    </div>
  );
}

export default ScrollingContainer;