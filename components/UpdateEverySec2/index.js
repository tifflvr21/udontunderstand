import { useEffect } from 'react';
import useForceUpdate from '../../hooks/useForceUpdate';
import timeSince from '../../helpers/timeSince';

const UpdateEverySec2 = ({ value }) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const interval = setInterval(forceUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeSince(value);
}

export default UpdateEverySec2;