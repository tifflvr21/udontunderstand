import { Search, SortUp, SortDown } from "styled-icons/bootstrap";
import { Refresh } from '@styled-icons/zondicons/Refresh';
import styles from "./index.module.css";

const Header = ({ inventory = [], setSearch, search, sortBy, setSortBy, loadInv }) => {
  return (
    <div className={styles.filter}>
      <div className={styles.search}>
        <Search />
        <input type="text" placeholder={`Search through ${inventory.length} items...`} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={styles.sort} onClick={() => setSortBy(prev => prev === 0 ? 1 : 0)}>
        {sortBy === 0 ? <SortUp /> : <SortDown />}
        <p>
          Sort
          <span>Price ({sortBy === 0 ? 'low to high' : 'high to low'})</span>
        </p>
      </div>

      <div className={styles.sort} onClick={() => loadInv()}>
        <Refresh />
      </div>
    </div>
  );
}

export default Header;