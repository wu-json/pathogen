import { Input, InputNumber, Modal } from 'antd';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import PathogenLogo from '../../assets/images/pathogen_logo.png';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import usePathogens from '../../hooks/api/usePathogens';
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
  return <Button label='add pathogen' onClick={onClick} />;
};

const Pathogens = () => {
  const { pathogens } = usePathogens();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    return { valid: true, message: '' };
  }, []);

  const submit = useCallback(() => {
    const { valid, message } = validate();
    if (valid) {
    } else {
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [validate]);

  return (
    <>
      <div className={styles['page-container']}>
        <WalletHeader>
          <AddPathogenButton openModal={() => setIsModalVisible(true)} />
        </WalletHeader>
        <div className={styles['container']}>
          <div className={styles['header-container']}>
            <img src={PathogenLogo} alt='pathogen-logo' />
            <h1>pathogen</h1>
          </div>
          <div className={styles['pathogens-container']}>
            {pathogens.map(pathogen => (
              <Pathogen pathogen={pathogen} />
            ))}
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
      >
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
      </Modal>
    </>
  );
};

export default Pathogens;
