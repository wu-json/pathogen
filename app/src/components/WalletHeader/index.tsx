import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import styles from './styles.module.scss';

const WalletHeader = () => (
  <div className={styles['container']}>
    <WalletMultiButton />
  </div>
);

export default WalletHeader;
