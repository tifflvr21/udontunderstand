import styles from './index.module.css';

const LoadingSimple = ({ className, style }) => <div className={`${styles.loader} ${className || ''}`} style={style || null} />

export default LoadingSimple;