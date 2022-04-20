import { CSSProperties } from 'react';

import styles from './styles.module.scss';

type Props = {
  className?: string;
  label: string;
  onClick: () => void;
  style?: CSSProperties;
};

const Button = ({ className, label, onClick, style }: Props) => (
  <button
    className={styles['button'] + (className ? ` ${className}` : '')}
    onClick={onClick}
    style={style}
  >
    {label}
  </button>
);

export default Button;
