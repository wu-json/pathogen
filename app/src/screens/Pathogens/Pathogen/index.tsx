import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Input, InputNumber, Modal, Select } from 'antd';
import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Swal from 'sweetalert2';

import SolanaCircleLogo from '../../../assets/images/solana_circle_logo.svg';
import useCreateProfile from '../../../hooks/api/useCreateProfile';
import useProfiles from '../../../hooks/api/useProfiles';
import { TestResult } from '../../../types';
import styles from './styles.module.scss';

const Spacer = () => <div style={{ height: 15 }} />;

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

const prettyPrintProfiles = (profiles: any[]) => {
  const parsedProfiles = profiles.map(profile => ({
    ...profile,
    account: {
      ...profile.account,
      latestTestResultDate: DateTime.fromMillis(
        profile.account.latestTestResultDate.toNumber(),
      ).toFormat('yyyy-LL-dd'),
    },
  }));
  return JSON.stringify(parsedProfiles, null, 2);
};

type Props = {
  pathogen: any;
};

const Pathogen = ({ pathogen }: Props) => {
  const { createProfile } = useCreateProfile();
  const { profiles, setProfiles } = useProfiles(pathogen.publicKey);
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
  const [testResult, setTestResult] = useState<TestResult>(TestResult.Negative);
  const [dateString, setDateString] = useState<string>(
    DateTime.now().toFormat('yyyy-LL-dd'),
  );
  const [age, setAge] = useState<number>(21);

  const clearState = useCallback(() => {
    setTestResult(TestResult.Negative);
    setDateString(DateTime.now().toFormat('yyyy-LL-dd'));
    setAge(21);
  }, []);

  const validate = useCallback(() => {
    const latestTestDateDT = DateTime.fromFormat(dateString, 'yyyy-LL-dd');
    if (!latestTestDateDT.isValid) {
      return { valid: false, message: 'Invalid latest test date.' };
    }
    if (!dateString) {
      return { valid: false, message: 'Latest date string is required.' };
    }
    if (age <= 0) {
      return { valid: false, message: 'Invalid age.' };
    }
    return { valid: true, message: '' };
  }, [age, dateString]);

  const submit = useCallback(async () => {
    const { valid, message } = validate();
    if (valid) {
      try {
        setIsLoading(true);
        const profile = await createProfile(
          pathogen.publicKey,
          testResult,
          DateTime.fromFormat(dateString, 'yyyy-LL-dd'),
          age,
        );
        setProfiles([profile, ...profiles]);
      } catch (e) {
        Swal.fire({
          icon: 'error',
          text: `Something went wrong creating this pathogen: ${e}`,
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
        clearState();
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }, [validate, clearState]);

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
          <h1>profile data</h1>
          <pre id='json'>{prettyPrintProfiles(profiles)}</pre>
        </div>
      </CSSTransition>
      <Modal
        title={`Submit profile for ${pathogen.account.code} (${
          pathogen.account.rewardPerProfile / LAMPORTS_PER_SOL
        } SOL)`}
        visible={isModalVisible}
        onOk={() => submit()}
        onCancel={() => {
          setIsModalVisible(false);
          clearState();
        }}
        confirmLoading={isLoading}
      >
        {isLoading ? (
          <div className={styles['loader-container']}>
            <h4>submitting transaction to solana blockchain</h4>
          </div>
        ) : (
          <div className={styles['form-container']}>
            <h4>latest test result</h4>
            <Select value={testResult} onChange={e => setTestResult(e)}>
              <Select.Option value={TestResult.Positive}>
                positive
              </Select.Option>
              <Select.Option value={TestResult.Negative}>
                negative
              </Select.Option>
            </Select>
            <Spacer />
            <h4>latest test result date ("yyyy-LL-dd" format)</h4>
            <Input
              value={dateString}
              onChange={e => setDateString(e.target.value)}
            />
            <Spacer />
            <h4>age</h4>
            <InputNumber value={age} onChange={num => setAge(num)} />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Pathogen;
