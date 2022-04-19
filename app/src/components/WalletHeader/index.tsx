import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

import styles from './styles.module.scss';

type Props = {
  TopLeftButton?: FC;
};

const WalletHeader = ({ TopLeftButton }: Props) => (
  <div
    className={styles['container']}
    style={{ justifyContent: TopLeftButton ? 'space-between' : 'flex-end' }}
  >
    {TopLeftButton && <TopLeftButton />}
    <WalletMultiButton />
  </div>
);

export default WalletHeader;
