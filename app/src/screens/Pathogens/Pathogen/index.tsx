import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import SolanaCircleLogo from '../../../assets/images/solana_circle_logo.svg';
import styles from './styles.module.scss';

type Props = {
  pathogen: any;
};

const Pathogen = ({ pathogen }: Props) => {
  console.log(pathogen);
  return (
    <div className={styles['container']}>
      <div className={styles['left-col']}>
        <h1>{pathogen.account.code}</h1>
        <h3>{pathogen.publicKey.toBase58().slice(0, 32) + '...'}</h3>
      </div>
      <div className={styles['right-col']}>
        <div className={styles['button-wrapper']}>
          <button className={`${styles['profiles-button']} ${styles['raise']}`}>
            view profiles
          </button>
        </div>
        <div className={styles['reward-container']}>
          <h2>
            {pathogen.account.rewardPerProfile.toNumber() / LAMPORTS_PER_SOL}
          </h2>
          <img src={SolanaCircleLogo} alt='solana-logo' />
        </div>
      </div>
    </div>
  );
};

export default Pathogen;
