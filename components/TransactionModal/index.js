import React, { useState, useEffect, useCallback } from "react";
import { EmojiSadSlight } from "@styled-icons/fluentui-system-regular/EmojiSadSlight";
import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';
import { ExclamationCircle } from '@styled-icons/bootstrap/ExclamationCircle';
import { SteamSymbol } from '@styled-icons/fa-brands/SteamSymbol';
import { Steam } from "styled-icons/bootstrap";
import Button from "../Button";
import Loader from "../Loader";
import Modal from "../Modal";
import LoadingSimple from '../LoadingSimple';


import Header from './header';
import Filter from './filter';
import Items from './items';
import Tradelink from './tradelink';

import coin1 from '../../resources/images/coin1.png';
import coin2 from '../../resources/images/coin2.png';


import styles from "./index.module.css";
import { QuestionSquare } from "@styled-icons/bootstrap/QuestionSquare";


const { events, user } = window.insolve;

const SignInButton = () => {
  return (
    <Button type="external" href={window.insolve.user._getConfig().url + '/auth/steam'} variant="success" shiny>
      <SteamSymbol />
      <span>Sign in with Steam</span>
    </Button>
  );
}

const ChooseSideCoinflip = ({ setExtraData, setError, continueProcess }) => {
  const choose = choice => {
    // 1 = heads, 2 = tails
    const side = choice === 0 ? (Math.random() > .5 ? 1 : 2) : choice;

    setExtraData({cf_side: side});
    continueProcess();
  }

  return (
    <div className={styles.choose}>
      <button onClick={() => choose(1)}>
        <img src={coin1} alt="Heads" />
        <span>Heads</span>
      </button>

      <button style={{marginLeft: '12px'}} onClick={() => choose(2)}>
        <img src={coin2} alt="Tails" />
        <span>Tails</span>
      </button>

      <button className={styles.full} onClick={() => choose(0)}>
        {/* I don't care, just let me gamble */}
        Pick random
      </button>
    </div>
  )
}

const TransactionModal = () => {
  const [visible, setVisible] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(1);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0); // transaction id
  const [game, setGame] = useState('jackpot');
  const [extraData, setExtraData] = useState({});
  // const [offerId, setOfferId] = useState(0); // trade offer id
  // const [code, setCode] = useState(0);
  
  const open = useCallback(data => {
    setVisible(true);
    setGame(data?.game || 'jackpot');
    setExtraData({});

    console.log(`My user data is`, user.get());

    // non-signed in message
    if(!user.get('steamid')) {
      return setError({
        icon: <ExclamationCircle />,
        title: 'Please sign in first!',
        text: <span>To play on the site you need to sign in. Please click the button below to do so.</span>,
        action: <SignInButton setError={setError} continueProcess={continueProcess} />
      });
    }

    // check tradelink
    const isTradelink = user.get('tradelink') !== '' && !!user.get('tradelink');

    if(isTradelink) {
      setError(undefined);
      continueProcess(data);
    } else {
      setError({
        icon: <ExclamationCircle />,
        title: 'One more thing...',
        text: <span>Before you can start playing, we need your Steam trade url. <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer" className={`${styles.a} ${styles.noflex}`}>Click here</a> to get it.</span>,
        action: <Tradelink setError={setError} continueProcess={continueProcess} />
      });
    }
    // events.on(`transactions:${data.id}-status`, onStatus);
  }, []);

  const continueProcess = data => {
    console.log(data);
    // save game id when joining cf
    if(data?.game === 'coinflip' && data?.id) {
      console.log('(cf) setting id to', data?.id);
      setExtraData({cf_id: data?.id});
      // setTitle(`Joining coinflip #id`);
    }

    if(data?.game === 'mines' && data?.id) {
      console.log('(mn) setting id to', data?.id);
      setExtraData({mines_id: data?.id});
      // setTitle(`Joining coinflip #id`);
    }

    // show side choose option
    if(data?.game === 'coinflip' && extraData?.cf_side === undefined && !data?.id) {
      return setError({
        title: 'Choose your side!',
        text: 'Heads or tails? What\'s it gonna be?',
        // icon: null,
        icon: <QuestionSquare />,
        action: <ChooseSideCoinflip setExtraData={setExtraData} setError={setError} continueProcess={continueProcess} />
      });
    }

    setError(undefined);
    loadInv();
  }

  const loadInv = () => {
    setInventory(undefined);
    setError({
      title: 'Loading...',
      text: 'Requesting your items, please wait a few seconds...',
      icon: <Loader variant="circle" className={styles.spinner} />
    });

    user.loadSteamInventory(window.insolve.config.appid).then(inv => {
      setInventory(inv.sort((a,b) => a.price - b.price));

      if(inv.length === 0) {
        setError({
          icon: <EmojiSadSlight />,
          title: 'Empty!',
          text: `We didn't find any items in your inventory. Make sure it's set to public and try again.`,
          action: <Button type="button" variant="theme" onClick={loadInv}>Try again</Button>
        });
      } else {
        setError(undefined);
      }
    }).catch(e => {
      setError({
        icon: <EmojiSadSlight />,
        title: 'Something went wrong',
        text: e,
        action: <Button type="button" variant="theme" onClick={loadInv}>Try again</Button>
      });
      
      setInventory([]);
    });
  };

  // const updateSortBy = () => {
  //   setSortBy(prev => prev === 2 ? 1 : 2);
  // }

  // const dismissTradelink = () => {
  //   setIsTradelink(true);
  //   setError('');
  //   setLoading(false);

  //   loadInv(true);
  // }

  // const tryAgain = () => {
  //   setError('');
  // }

  const close = () => setVisible(false);

  // reset everything on close
  useEffect(() => {
    if(!visible) events.off(`transactions:${id}-status`, onStatus);
  }, [visible, id]);

  // listen for events
  useEffect(() => {
    events.on("internal:toggleTransactionModal", open);
    return () => events.off("internal:toggleTransactionModal", open);
  }, [open]);

  // useEffect(() => {
  //   setErrorVisible(!!error);
  // }, [error]);

  const sumSelected = (returnAmount = false) => {
    return (inventory || []).filter(item => item.amountSelected > 0).reduce((accumulator, object) => {
      return accumulator + (returnAmount ? object.amountSelected : (object.price * object.amountSelected));
    }, 0);
  }

  const onStatus = ({ status, extra_data }) => {
    if(status === 1 && extra_data.offerid) { // offer went through, show user the link
      setError({
        title: 'Final step!',
        text: `Your trade offer is ready! Accept it to join the game. Security code: ${extra_data.code}`,
        icon: <CheckCircle />,
        action: (
          <div className={styles.load}>
            <Button type="external" variant="theme" href={`https://steamcommunity.com/tradeoffer/${extra_data.offerid}`} shiny newTab>
              <Steam />
              <span>Open the trade offer</span>
            </Button>
          </div>
        )
      });
    }

    if(status === 2) { // all is done
      setVisible(false);
    } else if(status === 3) { // an error happened
      // setTradeId(0);
      setError({
        title: 'Something wrong happened with the trade offer',
        text: extra_data.error_reason || '?',
        icon: <EmojiSadSlight />,
        action: <Button type="button" variant="theme" onClick={() => setError(undefined)}>Try again</Button>
      });
    }

    // if(extra_data?.error_reason || extra_data?.offerid) {
    //   setLoading(false);
    // }
  }

  const joinGame = () => {
    setLoading(true);

    const items = inventory.filter(item => item.amountSelected > 0).map(item => {
      return {assetid: item.assetid, amount: item.amountSelected}
    });

    user.requestDeposit(window.insolve.config.appid, items, {
      game: game,
      ...extraData
    }).then(data => {
      setId(data.id);
      // setCode(data.code);

      events.on(`transactions:${data.id}-status`, onStatus);

      setError({
        title: 'Almost done!',
        text: `Your trade offer will be sent to you shortly - you will join the game as soon as it is accepted.`,
        icon: <CheckCircle />,
        action: (
          <div className={styles.load}>
            <Button type="button" variant="theme" disabled={true} shiny>
              <LoadingSimple />
              <span>Sending your offer...</span>
            </Button>
          </div>
        )
        // icon: <Loader variant="circle" className={styles.spinner} />
      });
    }).catch(e => {
      setError({
        title: 'Failed to send the offer',
        text: e,
        icon: <EmojiSadSlight />,
        action: <Button type="button" variant="theme" onClick={() => setError(undefined)}>Try again</Button>
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const selected = (inventory || []).filter(item => item.amountSelected > 0);
  const selectedSum = sumSelected();

  const passProps = {
    error,
    setError,
    inventory,
    setInventory,
    search,
    setSearch,
    selectedSum,
    selected,
    sortBy,
    setSortBy,
    loading,
    joinGame,
    game,
    close,
    loadInv
  }

  return (
    <Modal visible={visible} toggle={setVisible} className={styles.modal} width="46%">
      <div className={styles.error} data-visible={!!error || null}>
        {/* {error?.icon || <EmojiSadSlight />} */}
        {/* <h3>{error?.title || 'Error!'}</h3> */}
        {/* <p>{error?.text || 'An unknown error has happened. Please refresh the site and try again.'}</p> */}
        {error?.icon || null}
        <h3>{error?.title || null}</h3>
        <p>{error?.text || null}</p>

        {error?.action || null}
      </div>

      <div className={styles.all} data-blur={!!error || null}>
        <Header {...passProps} />
        <Filter {...passProps} />
        <Items {...passProps} />
      </div>
    </Modal>
  );
};

export default TransactionModal;
