import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "styled-icons/fa-solid";
import Button from "../Button";
import Item from "../Item";
import styles from "./index.module.css";

const SAMPLE_INV = [{"amount":1,"appid":"440","assetid":"12301962282","classid":"101785959","color":"7D6D00","contextid":"2","id":"3d0bb3dd-769b-4f29-a6a9-1eee723e279f","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","instanceid":"11040578","name":"Mann Co. Supply Crate Key","nametag":"","owner":"76561198212555451","price":2.14,"stickers":[],"tradableAfter":0},{"amount":1,"appid":"440","assetid":"12301962015","classid":"101785959","color":"7D6D00","contextid":"2","id":"d9e618f5-252a-41be-8b77-a5ea1da41b4a","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ","instanceid":"11040578","name":"Mann Co. Supply Crate Key","nametag":"","owner":"76561198212555451","price":2.14,"stickers":[],"tradableAfter":0},{"amount":1,"appid":"440","assetid":"12301961919","classid":"3051917503","color":"7D6D00","contextid":"2","id":"97a8d246-7460-4fe4-87cf-87dd086eb36c","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDbQsdUgznvTYR2Jm-MvGNG-U_l9sn4pUbim88kgAtY-XnNWdiJFKTAqUIWaFsoVC7DH4xvsQ6BtW0ou1VLQi5vZyGbedz97Kp4g","instanceid":"0","name":"Violet Vermin Case","nametag":"","owner":"76561198212555451","price":0.24,"stickers":[],"tradableAfter":0},{"amount":1,"appid":"440","assetid":"12301962221","classid":"4585828412","color":"7D6D00","contextid":"2","id":"87986b56-a852-49ee-86f4-c7b03a7a7b93","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEDewlDDUmzhyhMh9j_MvaDDd8Mmsgy4N4CgGBqxlkobeezYWRmdgGRB_YKD_Bo9Qm5W3VmsJFgUIK38-hVLAi8qsKYZOIn1AlP","instanceid":"11042427","name":"Poopy Doe","nametag":"","owner":"76561198212555451","price":0.13,"stickers":[],"tradableAfter":0},{"amount":1,"appid":"440","assetid":"12319859614","classid":"2569654532","color":"b0c3d9","contextid":"2","id":"8163d387-74c2-41ac-afc0-488e94944554","image":"https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTdinxVwPffkZGNYexDHDPkLD6MF4w3tG3N8sZBmBofk9O8AcF-659OQYbclZtlPGpGCWvbXNwj_vEM4gPAPLsffoTSvg3pIE5HoXw","instanceid":"4992641124","name":"Civic Duty Mk.II War Paint (Well-Worn)","nametag":"","owner":"76561198212555451","price":0.11,"stickers":[],"tradableAfter":0}];
const SHOW_AT_ONCE = 48;

const Items = ({ inventory, setInventory, setError, error, search = '', sortBy = 0 }) => {
  const [page, setPage] = useState(0);

  const prevPage = () => {
    setPage(prev => {
      return prev - 1 < 0 ? 0 : prev - 1;
    });
  }

  const nextPage = () => {
    setPage(prev => {
      return prev + 1 > maxPages ? maxPages : prev + 1;
    });
  }

  const selectItem = (assetid, reducer = 1) => {
    const inv = inventory.map(item => {
      if(item.assetid === assetid) {
        if(!item.accept) return item;
        
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

  const getFilteredInv = () => {
    let inv = JSON.parse(JSON.stringify(inventory || []));

    inv = inv.filter(item => item.name.toLowerCase().includes(search));

    // sort by price
    if(sortBy === 0) {
      inv = inv.sort((a,b) => (a.price || 0) - (b.price || 0));
    } else if(sortBy === 1) {
      inv = inv.sort((a,b) => (b.price || 0) - (a.price || 0));
    }

    // search by name
    return inv;
  }

  const filteredInv = getFilteredInv();
  const inv = error ? filteredInv.length > 0 ? filteredInv : [...SAMPLE_INV, ...SAMPLE_INV, ...SAMPLE_INV, ...SAMPLE_INV] : filteredInv;
  const index = {
    min: page * SHOW_AT_ONCE,
    max: (page * SHOW_AT_ONCE) + SHOW_AT_ONCE
  }
  const maxPages = Math.floor(inv.length / SHOW_AT_ONCE);

  useEffect(() => {
    setPage(0);
  }, [search]);

  // todo: add a screen to show if no items found
  return (
    <>
      <div className={styles.itemsContainer}>
        {inv.length > 0 && (
          <div className={styles.items}>
            {inv.map((item, key) => (key >= index.min && key < index.max) ? <Item key={key} item={item} select={selectItem} /> : null)}
          </div>
        )}

        
      </div>

      {(inv.length > 0 && inv.length > SHOW_AT_ONCE) && (
        <div className={styles.btnsNextPrev}>
          <Button type="button" variant="primary" disabled={page <= 0} onClick={prevPage}>
            <span>Previous page</span>
            <ArrowLeft />
          </Button>

          <div>
            <p><span className={styles.noMobile}>Page</span> {page + 1} out of {maxPages + 1}</p>
            <p className={styles.null}>Showing items {index.min} - {index.max > inv.length ? inv.length : index.max} &#40;{inv.length} total&#41;</p>
          </div>

          <Button type="button" variant="primary" disabled={page >= maxPages} onClick={nextPage}>
            <span>Next page</span>
            <ArrowRight />
          </Button>
        </div>
      )}
    </>
  );
}

export default Items;