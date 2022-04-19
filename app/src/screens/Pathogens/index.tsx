import { Modal } from 'antd';
import { useCallback, useState } from 'react';

import PathogenLogo from '../../assets/images/pathogen_logo.png';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import usePathogens from '../../hooks/api/usePathogens';
import Pathogen from './Pathogen';
import styles from './styles.module.scss';

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
        <p>hello</p>
      </Modal>
    </>
  );
};

export default Pathogens;
