import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

const WalletHeader = (props: PropsWithChildren<{}>) => (
  <div className={styles['container']}>
    {props.children}
    <WalletMultiButton />
  </div>
);

export default WalletHeader;
