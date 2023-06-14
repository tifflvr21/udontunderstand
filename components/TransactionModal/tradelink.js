import { useState } from "react";
import Button from "../Button";
import LoadingSimple from '../LoadingSimple';
import styles from "./index.module.css";

const Tradelink = ({ setError, continueProcess }) => {
  const [tl, setTL] = useState('');
  const [error2, setError2] = useState('');
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    setError2('');

    window.insolve.user.updateTradelink(tl).then(() => {
      continueProcess();
    }).catch(e => {
      setError2(e || 'Invalid tradelink, please try again.');
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className={styles.input}>
      <input type="text" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=252289723&token=yORPmBKd" value={tl} onChange={e => setTL(e.target.value)} />
      <Button type="button" variant="theme" onClick={save} disabled={loading} shiny>
        {loading ? <><LoadingSimple /><span>Loading...</span></> : 'Save & Continue'}
      </Button>

      {error2 !== '' && <p className={styles.error2}>{error2}</p>}
    </div>
  );
}

export default Tradelink;