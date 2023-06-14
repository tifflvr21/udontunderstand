import { useEffect } from 'react';
import useForceUpdate from '../../hooks/useForceUpdate';


const UpdateEverySec = ({ timeUpdated, TIME_TO_JOIN, onlySeconds }) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const interval = setInterval(forceUpdate, 500);

    return () => clearInterval(interval);
  }, []);


  const now = Math.round(+new Date() / 1000);
  const timeOverAt = (timeUpdated || 0) + (TIME_TO_JOIN || 0); // todo: replace now and 120
  const time = timeOverAt - now >= 0 ? timeOverAt - now : 0; 

  // format timer
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return onlySeconds ? time : formattedTime;
}

export default UpdateEverySec;