import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Input, InputNumber, Modal, Select } from 'antd';
import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import SolanaCircleLogo from '../../../assets/images/solana_circle_logo.svg';
import useCreateProfile from '../../../hooks/api/useCreateProfile';
import styles from './styles.module.scss';

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

type Props = {
  pathogen: any;
};

const Pathogen = ({ pathogen }: Props) => {
  const { createProfile } = useCreateProfile();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickAddProfile = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onClickViewDetails = useCallback(() => {
    setShowDetails(!showDetails);
  }, [showDetails]);

  // Form fields

  const clearState = useCallback(() => {}, []);

  const validate = useCallback(() => {}, []);

  const submit = useCallback(async () => {}, []);

  return (
    <>
      <div className={styles['pathogen-container']}>
        <div className={styles['left-col']}>
          <h1>{pathogen.account.code}</h1>
          <h3>{pathogen.publicKey.toBase58().slice(0, 24) + '...'}</h3>
          <h3>
            {DateTime.fromMillis(
              pathogen.account.createdAt.toNumber() * 1000,
            ).toFormat('yyyy LLL dd')}
          </h3>
        </div>
        <div className={styles['right-col']}>
          <div className={styles['button-wrapper']}>
            <button
              className={`${styles['pathogen-button']} ${styles['raise']}`}
              onClick={onClickAddProfile}
              style={{ marginRight: 10 }}
            >
              add profile
            </button>
            <button
              className={`${styles['pathogen-button']} ${styles['raise']}`}
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
      <CSSTransition
        in={showDetails}
        timeout={1000}
        classNames={{
          enter: styles['data-container-enter'],
          enterActive: styles['data-container-enter-active'],
          enterDone: styles['data-container-enter-active'],
          exit: styles['data-container-exit'],
          exitActive: styles['data-container-exit-active'],
          exitDone: styles['data-container-exit-active'],
        }}
      >
        <div className={styles['data-container']}>
          <h1>pathogen data</h1>
          <pre id='json'>{prettyPrintPathogen(pathogen)}</pre>
        </div>
      </CSSTransition>
      <Modal
        title={`Submit profile for ${pathogen.account.code}`}
        visible={isModalVisible}
        onOk={() => {}}
        onCancel={() => {
          setIsModalVisible(false);
          clearState();
        }}
      >
        {isLoading ? (
          <div className={styles['loader-container']}>
            <h4>submitting transaction to solana blockchain</h4>
          </div>
        ) : (
          <div className={styles['form-container']}>
            <h4>latest test result</h4>
            <Select defaultValue='positive'>
              <Select.Option value='positive'>positive</Select.Option>
              <Select.Option value='negative'>negative</Select.Option>
            </Select>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Pathogen;
