import { Link } from 'react-router-dom';
import styles from './index.module.css';

const Button = ({
  type = 'link',
  to,
  href,
  variant = 'theme',
  disabled,
  className,
  block,
  title,
  onClick,
  newTab,
  children,
  style,
  shiny
}) => {
  const props = {
    to: type === 'link' ? to : null,
    href: type === 'external' ? href : null,
    className: `${styles.btn} ${className || ''}`,
    'data-variant': variant,
    'data-block': block || null,
    'data-shiny': shiny || null,
    onClick: onClick,
    style: style || null,
    disabled: disabled,
    title
  };

  if(type === 'link') return <Link {...props}>{children}</Link>;
  else if(type === 'button') return <button {...props}>{children}</button>;
  else if(type === 'external') return <a {...props} target={newTab ? '_blank' : null}>{children}</a>
  
  return null;
}

export default Button;