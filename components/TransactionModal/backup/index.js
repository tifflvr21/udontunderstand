import React, { useState, useEffect, useCallback } from "react";
import { Gun } from '@styled-icons/fa-solid';
// import { CircleQuestion } from '@styled-icons/fa-solid';
import { KeyboardArrowLeft } from '@styled-icons/material-sharp/KeyboardArrowLeft';
// import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';
import { ExclamationCircle } from '@styled-icons/bootstrap/ExclamationCircle';
import { Search, SortUp, SortDown, Steam } from "styled-icons/bootstrap";
import { RefreshOutline } from "styled-icons/evaicons-outline";
import { CloseOutline } from "styled-icons/evaicons-outline";
// import { Steam } from '@styled-icons/fa-brands/Steam';
import Item from "../Item";
import Button from "../Button";
import Loader from "../Loader";
import Modal from "../Modal";
import LoadingSimple from '../LoadingSimple';

import usePrevious from '../../hooks/usePrevious';

import coin from '../../resources/images/coin.png';

import styles from "./index.module.css";


const { events, user, helpers } = window.insolve;
const appid = 440;
const MAX_ITEMS_PER_TRADE = 20;

// let rftmt;

// todo: maybe check if user has tradelink before allowing to deposit

const TransactionModal = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [id, setId] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [sortBy, setSortBy] = useState(2);
  const [loading, setLoading] = useState(false);
  // const [count, setCount] = useState(1);
  // const [type, setType] = useState('deposit');
  const [invLoaded, setInvLoaded] = useState(false);
  const [code, setCode] = useState('-');
  const [tradeId, setTradeId] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [inputTradelink, setInputTradelink] = useState('');
  const [isTradelink, setIsTradelink] = useState(!!user.get('tradelink')); // todo: add event to listen for this change instead
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(true);
  // const [dinoFact, setDinoFact] = useState('that lizards, turtles, snakes and crocodiles all descend from dinosaurs?');

  const selectItem = (assetid, reducer = 1) => {
    const inv = inventory.map(item => {
      if(item.assetid === assetid) {
        // single item already selected
        if(item.amount === 1 && item.amountSelected === 1) {
          item.amountSelected = 0;
          reducer = 0;
        }

        // first time selecting
        if(isNaN(item.amountSelected)) {
          item.amountSelected = 1;
        } else {
          item.amountSelected += reducer;
        }

        // prevent overflow
        if(item.amountSelected > item.amount) {
          item.amountSelected = item.amount;
        }

        // add activeId only if empty
        if(!item.activeId) {
          item.activeId = Math.max(...inventory.map(o => o.activeId || 0)) + 1;
        }

        if(item.amountSelected === 0) {
          delete item.activeId;
        }
      }

      return item;
    });

    setInventory(inv);
  }

  const sumSelected = (returnAmount = false) => {
    return inventory.filter(item => item.amountSelected > 0).reduce((accumulator, object) => {
      return accumulator + (returnAmount ? object.amountSelected : (object.price * object.amountSelected));
    }, 0);
  }

  const selectAll = () => {
    let inv = [...inventory];
    const isAllSelected = inventory.filter(item => item.amountSelected > 0).length === inv.length;

    inv.map(item => item.amountSelected = isAllSelected ? 0 : parseInt(item.amount));
    setInventory(inv);
  }

  const getFilteredInv = () => {
    let inv = JSON.parse(JSON.stringify(inventory));

    // sort by price
    if(sortBy === 0) {
      inv = inv.sort((a,b) => a.name.localeCompare(b.name));
    } else if(sortBy === 1) {
      inv = inv.sort((a,b) => a.price - b.price);
    } else if(sortBy === 2) {
      inv = inv.sort((a,b) => b.price - a.price);
    }

    // search by name
    return inv.filter(item => item.name.toLowerCase().includes(search));
  }

  const action = () => {
    setLoading(true);

    const items = inventory.filter(item => item.amountSelected > 0).map(item => {
      return {assetid: item.assetid, amount: item.amountSelected}
    });

    // todo: add coinflip
    user.requestDeposit(appid, items, 'jackpot').then(data => {
      setId(data.id);
      setCode(data.code);

      events.on(`transactions:${data.id}-status`, onStatus);
      // todo: use data.success here
      // events.emit('internal:toggleTransactionModal', {...data, type});
      // setLoading(false);
    }).catch(e => {
      setError(e);
      setLoading(false);
    });
  }

  const loadInv = useCallback((bypass) => {
    // if(!isTradelink && !bypass) return;
    setInventory([]);
    setInvLoaded(false);
    setError('');
    setIsRefreshDisabled(true);

    user.loadSteamInventory(appid).then(inv => {
      setInventory(inv.sort((a,b) => a.price - b.price));
      setInvLoaded(true);

      // enable setIsRefreshDisabled after 10s
      setIsRefreshDisabled(false);
      // clearTimeout(rftmt);
      // rftmt = setTimeout(() => setIsRefreshDisabled(false), 10 * 1000);
    }).catch(e => {
      setError(e);
      setIsRefreshDisabled(false);
    });
  }, [appid]);

  const updateTradelink = () => {
    setLoading(true);

    user.updateTradelink(inputTradelink).then(() => {
      setIsTradelink(true);
      setError('');
      loadInv(true);
    }).catch(e => {
      setError(e || 'Invalid tradelink, please try again.');
      setIsTradelink(false);
    }).finally(() => {
      setLoading(false);
    });
  }

  const onStatus = ({ status, extra_data }) => {
    if(status === 1 && extra_data.offerid) { // offer went through, show user the link
      setTradeId(extra_data.offerid);
    }

    if(status === 2) { // all is done
      setVisible(false);
    } else if(status === 3) { // an error happened
      setTradeId(0);
      setError(extra_data.error_reason);
    }

    if(extra_data?.error_reason || extra_data?.offerid) {
      setLoading(false);
    }
  }

  const open = useCallback(data => {
    setStep(0);
    setId(data.id);
    setCode(data.code);
    // setDinoFact(data.dino_fact);
    setVisible(true);
    // setType(data.type);
    setSearch('');
    setSortBy(2);
    setInventory([]);
    setInvLoaded(false);
    loadInv();
    setError('');
    setTradeId(0);
    // setIsTradelink(!!insolveTradelink);

    events.on(`transactions:${data.id}-status`, onStatus);
  }, []);

  const updateSortBy = () => {
    setSortBy(prev => prev === 2 ? 1 : 2);
  }

  const dismissTradelink = () => {
    setIsTradelink(true);
    setError('');
    setLoading(false);

    loadInv(true);
  }

  const tryAgain = () => {
    setError('');
  }

  // const close = () => setVisible(false);

  // reset everything on close
  useEffect(() => {
    if(!visible) events.on(`transactions:${id}-status`, onStatus);
  }, [visible, id]);

  // listen for events
  useEffect(() => {
    events.on("internal:toggleTransactionModal", open);
    return () => events.off("internal:toggleTransactionModal", open);
  }, [open]);

  // useEffect(() => {
  //   return () => clearTimeout(rftmt);
  // }, []);


  const inv = getFilteredInv();
  const selected = inventory.filter(item => item.amountSelected > 0);
  const selectedSum = sumSelected();
  const selectedAmount = selected.length;

  return (
    <Modal
      visible={visible}
      toggle={setVisible}
      className={styles.modal}
      width="46%"
    >
      <div className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <div className={styles.title}>
            {isTradelink && (
              <div className={styles.search}>
                <Search />
                <input type="text" placeholder="Search for items..." onChange={e => setSearch(e.target.value)} value={search} />
              </div>
            )}

            {isTradelink && (
              <div className={styles.sort} onClick={updateSortBy}>
                {sortBy === 2 ? <SortUp /> : <SortDown />}
                <p>Price {sortBy === 2 ? 'high to low' : 'low to high'}</p>
              </div>
            )}
            
            <div className={styles.btns}>
              <button type="button" className={styles.close} onClick={() => loadInv()} disabled={isRefreshDisabled}>
                <RefreshOutline />
              </button>

              <button type="button" className={styles.close} onClick={() => setVisible(false)}>
                <CloseOutline />
              </button>
            </div>
          </div>
        </div>


        

        {/* main item list */}
        {isTradelink ? (
            <div className={styles.items}>
            {!invLoaded ? (
              <div className={styles.loading}>
                {error === '' ? <Loader variant="circle" className={styles.spinner} /> : <ExclamationCircle />}
                <h3>{error === '' ? 'Loading your items...' : 'Failed to load your items :('}</h3>
                {error !== '' && <p>{error}</p>}
              </div>
            ) : (
              <div className={styles.list}>
                {inv.map((item, key) => <Item key={key} item={item} select={selectItem} />)}
              </div>
            )}
          </div>
        ) : (
          
          <div className={styles.tradelink}>
            <h3>Input your tradelink</h3>
            <p>Before you can start playing, we need your Steam trade url so we can send offers to you. <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer">Click here</a> to get it.</p>

            <input type="text" value={inputTradelink} onChange={e => setInputTradelink(e.target.value)} placeholder="https://steamcommunity.com/tradeoffer/new/?partner=252289723&token=yORPmBKd" />

            {(error && error !== '') && <p className={styles.error}>{error}</p>}
          </div>
        )}


        {/* footer */}
        <div className={styles.footer}>
          <div className={styles.stats} style={isTradelink ? null : {visibility: 'hidden'}}>
            <div className={styles.stat}>
              <Gun />
              <p data-error={selectedAmount > MAX_ITEMS_PER_TRADE || null}>{selected.length} <span>/ {MAX_ITEMS_PER_TRADE}</span></p>
            </div>

            <div className={styles.stat}>
              <img src={coin} alt="" />
              <p>{helpers.formatBalance(selectedSum)}</p>
            </div>
          </div>

          {/* buttons */}
          {isTradelink ? (
            <div className={styles.btns}>
              {(error === '' && invLoaded) && (
                <Button type="button" variant="primary" onClick={selectAll}>
                  {selectedAmount === inv.length ? 'Unselect' : ' Select'} all
                </Button>
              )}
              <Button type="button" variant="theme" onClick={action} disabled={error !== '' || loading || selectedAmount <= 0 || selectedAmount > MAX_ITEMS_PER_TRADE} shiny>
                {loading ? <><LoadingSimple /><span>Loading...</span></> : 'Join game'}
              </Button>
            </div>
          ) : (
            <div className={styles.btns}>
              <Button type="button" variant="primary" onClick={dismissTradelink}>
                Skip for now
              </Button>

              <Button disabled={loading} type="button" variant="theme" onClick={updateTradelink}>
                {loading ? <LoadingSimple /> : 'Save'}
              </Button>
            </div>
          )}
        </div>


        {/* error/success */}
        {(isTradelink && invLoaded) && (
          <div className={styles.result} data-type={tradeId === 0 ? 'danger' : 'success'} data-visible={error !== '' || tradeId !== 0}>
            <div className={styles.text}>
              <h3>{tradeId === 0 ? 'Error' : 'Success'}!</h3>
              <p>{tradeId === 0 ? error : 'Your trade offer has been sent. You have 5 minutes to accept it.'}</p>
            </div>

            <Button type={tradeId === 0 ? 'button' : 'external'} newTab={tradeId !== 0} variant={tradeId === 0 ? 'danger' : 'success'} onClick={tradeId === 0 ? tryAgain : () => {}} href={tradeId === 0 ? null : `https://steamcommunity.com/tradeoffer/${tradeId}`} shiny={tradeId === 0 || null}>
              {tradeId === 0 ? 'Try again' : (
                <>
                  <Steam />
                  <span>See the trade offer</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TransactionModal;
