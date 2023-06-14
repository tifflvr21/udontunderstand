import styles from './index.module.css';

const Loader = ({ variant, className }) => (
  <span data-variant={variant || 'simple'} className={`${styles.loader} ${className || ''}`}></span>
)

export default Loader;