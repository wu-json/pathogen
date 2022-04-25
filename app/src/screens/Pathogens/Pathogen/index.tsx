import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';

import SolanaCircleLogo from '../../../assets/images/solana_circle_logo.svg';
import styles from './styles.module.scss';

type Props = {
  pathogen: any;
};

const prettyPrintPathogen = (pathogen: any) => {
  const parsedPathogen = {
    ...pathogen,
    account: {
      ...pathogen.account,
      rewardPerProfile: undefined,
      rewardPerProfileInLamports: pathogen.account.rewardPerProfile.toNumber(),
      totalProfiles: pathogen.account.totalProfiles.toNumber(),
      createdAt: DateTime.fromMillis(
        pathogen.account.createdAt.toNumber() * 1000,
      ).toFormat('yyyy-LL-dd'),
    },
  };

  return JSON.stringify(parsedPathogen, null, 2);
};

const Pathogen = ({ pathogen }: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const onClickViewDetails = useCallback(() => {
    setShowDetails(!showDetails);
  }, [showDetails]);

  return (
    <>
      <div className={styles['pathogen-container']}>
        <div className={styles['left-col']}>
          <h1>{pathogen.account.code}</h1>
          <h3>{pathogen.publicKey.toBase58().slice(0, 32) + '...'}</h3>
          <h3>
            {DateTime.fromMillis(
              pathogen.account.createdAt.toNumber() * 1000,
            ).toFormat('yyyy LLL dd')}
          </h3>
        </div>
        <div className={styles['right-col']}>
          <div className={styles['button-wrapper']}>
            <button
              className={`${styles['details-button']} ${styles['raise']}`}
              onClick={onClickViewDetails}
            >
              {showDetails ? 'hide details' : 'view details'}
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
      <div className={styles['data-container']}>
        <h1>pathogen data</h1>
        <pre id='json'>{prettyPrintPathogen(pathogen)}</pre>
      </div>
    </>
  );
};

export default Pathogen;
