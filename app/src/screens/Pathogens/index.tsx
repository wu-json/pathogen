import PathogenLogo from '../../assets/images/pathogen_logo.png';
import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import usePathogens from '../../hooks/api/usePathogens';
import Pathogen from './Pathogen';
import styles from './styles.module.scss';

const Pathogens = () => {
  const { pathogens } = usePathogens();
  return (
    <div className={styles['page-container']}>
      <WalletHeader />
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
