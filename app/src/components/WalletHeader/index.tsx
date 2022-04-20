import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

const WalletHeader = (props: PropsWithChildren<{}>) => (
  <div
    className={styles['container']}
    style={{ justifyContent: props.children ? 'space-between' : 'flex-end' }}
  >
    {props.children}
    <WalletMultiButton />
  </div>
);

export default WalletHeader;
