import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import usePathogens from '../../hooks/api/usePathogens';
import styles from './styles.module.scss';

const Pathogens = () => {
  const pathogens = usePathogens();

  console.log('PATHOGENS');
  console.log(pathogens);

  return (
    <div className={styles['page-container']}>
      <WalletHeader />
      <Footer />
    </div>
  );
};

export default Pathogens;
