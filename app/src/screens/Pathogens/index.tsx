import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Input, InputNumber, Modal } from 'antd';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import PathogenLogo from '../../assets/images/pathogen_logo.png';
import UndrawRocket from '../../assets/images/undraw_rocket.svg';
import UndrawVoid from '../../assets/images/undraw_void.svg';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import useCreatePathogen from '../../hooks/api/useCreatePathogen';
import usePathogens from '../../hooks/api/usePathogens';
import useWorkspace from '../../hooks/useWorkspace';
import Pathogen from './Pathogen';
import styles from './styles.module.scss';

const Spacer = () => <div style={{ height: 15 }} />;

type AddPathogenButtonProps = {
  openModal: () => void;
};

const AddPathogenButton = ({ openModal }: AddPathogenButtonProps) => {
  const onClick = useCallback(() => {
    openModal();
  }, [openModal]);
  return (
    <Button
      label='add pathogen'
      onClick={onClick}
      style={{ marginRight: 20 }}
    />
  );
};

const Pathogens = () => {
  const { wallet } = useWorkspace();
  const { createPathogen } = useCreatePathogen();
  const { pathogens, setPathogens, pathogensReady } = usePathogens();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [bounty, setBounty] = useState(10);
  const [rewardPerProfile, setRewardPerProfile] = useState(1);

  const clearState = useCallback(() => {
    setCode('');
    setName('');
    setBounty(10);
    setRewardPerProfile(1);
  }, []);

  const validate = useCallback(() => {
    if (!code.length) {
      return { valid: false, message: 'Pathogen code is required.' };
    }
    if (!name.length) {
      return { valid: false, message: 'Pathogen name is required.' };
    }
    if (bounty <= 0) {
      return { valid: false, message: 'Bounty must be a positive number.' };
    }
    if (rewardPerProfile <= 0) {
      return {
        valid: false,
        message: 'Reward per profile must be a positive number.',
      };
    }
    if (bounty < rewardPerProfile) {
      return { valid: false, message: 'Bounty must be greater than reward.' };
    }
    if ((bounty * LAMPORTS_PER_SOL) % 1 !== 0) {
      return { valid: false, message: 'Bounty must be at least 1 lamport.' };
    }
    if ((rewardPerProfile * LAMPORTS_PER_SOL) % 1 !== 0) {
      return {
        valid: false,
        message: 'Reward per profile must be at least 1 lamport.',
      };
    }

    return { valid: true, message: '' };
  }, [bounty, code, name, rewardPerProfile]);

  const submit = useCallback(async () => {
    const { valid, message } = validate();
    if (valid) {
      try {
        setIsLoading(true);
        const pathogen = await createPathogen(
          code,
          name,
          bounty,
          rewardPerProfile,
        );
        setPathogens([pathogen, ...pathogens]);
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
  }, [
    bounty,
    clearState,
    code,
    name,
    rewardPerProfile,
    createPathogen,
    pathogens,
    setPathogens,
    validate,
  ]);

  return (
    <>
      <div className={styles['page-container']}>
        <WalletHeader>
          {wallet && (
            <AddPathogenButton openModal={() => setIsModalVisible(true)} />
          )}
        </WalletHeader>
        <div className={styles['container']}>
          <div className={styles['header-container']}>
            <img src={PathogenLogo} alt='pathogen-logo' />
            <h1>pathogen</h1>
          </div>
          <div className={styles['pathogens-container']}>
            {pathogens.length && pathogensReady ? (
              pathogens.map((pathogen, i) => (
                <Pathogen pathogen={pathogen} key={i} />
              ))
            ) : (
              <div className={styles['empty-container']}>
                {pathogensReady && (
                  <>
                    <img src={wallet ? UndrawVoid : UndrawRocket} alt='void' />
                    <h3>
                      {wallet
                        ? 'no pathogens created yet'
                        : 'select wallet to view pathogens'}
                    </h3>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <Modal
        title='Add Pathogen'
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
            <h4>pathogen code</h4>
            <Input
              placeholder='covid-19'
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <Spacer />
            <h4>pathogen name</h4>
            <Input
              placeholder='Coronavirus disease 2019'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Spacer />
            <div>
              <h4>Bounty (SOL)</h4>
              <InputNumber value={bounty} onChange={num => setBounty(num)} />
            </div>
            <Spacer />
            <div>
              <h4>Reward Per Profile (SOL)</h4>
              <InputNumber
                value={rewardPerProfile}
                onChange={num => setRewardPerProfile(num)}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Pathogens;
