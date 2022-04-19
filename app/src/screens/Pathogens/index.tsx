import Footer from '../../components/Footer';
import WalletHeader from '../../components/WalletHeader';
import styles from './styles.module.scss';

const Pathogens = () => {
  return (
    <div className={styles['page-container']}>
      <WalletHeader />
      <Footer />
    </div>
  );
};

export default Pathogens;
