import { useEffect, useState } from 'react';
import useInterval from '../../hooks/useInterval';

// import styles from './index.module.css';

const Countdown = ({ start }) => {
  const [current, setCurrent] = useState(start);
  const isAnim = current > -1;
  
  useInterval(() => {
    if(parseInt(current) >= 0) {

      setTimeout(() => setCurrent(prev => parseInt(prev) - 1), 700); // 700 is animation length in css
    }
  }, isAnim ? 1000 : null);

  useEffect(() => setCurrent(start), [start]);

  return <span data-isanim={isAnim} style={{visibility: isAnim ? null : 'hidden'}}>{current}</span>;
}

export default Countdown;