import PathogenLogo from '../../assets/images/pathogen_logo.png';
import Button from '../../components/Button';
import styles from './styles.module.scss';

const Home = () => {
  return (
    <div className={styles['page-container']}>
      <div className={styles['header-wrapper']}>
        <div className={styles['header-container']}>
          <img className={styles['logo']} src={PathogenLogo} />
          <div className={styles['text-container']}>
            <h1>pathogen</h1>
            <h2>dApp for decentralized anonymous public health data</h2>
            <Button label={'view demo'} onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
