import { Input, InputNumber, Modal } from 'antd';
import { useCallback, useState } from 'react';

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
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className={styles['form-container']}>
          <h4>pathogen code</h4>
          <Input placeholder='covid-19' />
          <Spacer />
          <h4>pathogen name</h4>
          <Input placeholder='Coronavirus disease 2019' />
          <Spacer />
          <div>
            <h4>Bounty (SOL)</h4>
            <InputNumber placeholder='5' />
          </div>
          <Spacer />
          <div>
            <h4>Reward Per Profile (SOL)</h4>
            <InputNumber placeholder='.25' />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Pathogens;
