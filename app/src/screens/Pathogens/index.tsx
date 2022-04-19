import { useCallback } from 'react';

import PathogenLogo from '../../assets/images/pathogen_logo.png';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import usePathogens from '../../hooks/api/usePathogens';
import Pathogen from './Pathogen';
import styles from './styles.module.scss';

const AddPathogenButton = () => {
  const onClick = useCallback(() => {}, []);
  return <Button label='add pathogen' onClick={onClick} />;
};

const Pathogens = () => {
  const { pathogens } = usePathogens();
  return (
    <div className={styles['page-container']}>
      <WalletHeader TopLeftButton={AddPathogenButton} />
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
  );
};

export default Pathogens;
