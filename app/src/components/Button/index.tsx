import styles from './styles.module.scss';

type Props = {
  className?: string;
  label: string;
  onClick: () => void;
};

const Button = ({ className, label, onClick }: Props) => {
  return (
    <button
      className={styles['button'] + (className ? ` ${className}` : '')}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
