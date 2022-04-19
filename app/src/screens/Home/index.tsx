import AnchorLogo from '../../assets/images/anchor_logo.png';
import PathogenLogo from '../../assets/images/pathogen_logo.png';
import SolanaLogo from '../../assets/images/solana_logo.png';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import styles from './styles.module.scss';

const Home = () => {
  return (
    <div className={styles['page-container']}>
      <div className={styles['header-wrapper']}>
        <div className={styles['section-container']}>
          <img src={PathogenLogo} alt='pathogen-logo' />
          <div className={styles['text-container']}>
            <h1>pathogen</h1>
            <h2>dApp for decentralized anonymous public health data</h2>
            <Button
              className={styles['button']}
              label={'view demo'}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className={styles['about-wrapper']}>
        <div className={styles['section-container']}>
          <div className={styles['logos-container']}>
            <img src={SolanaLogo} alt='solana-logo' />
            <img src={AnchorLogo} alt='anchor-logo' />
          </div>
          <div className={styles['about-text-container']}>
            <h1 className={styles['section-title']}>about</h1>
            <h2>
              Pathogen is an application built on the Solana blockchain using
              the Anchor dev framework. It allows users to anonymously submit
              public health data in exchange for Solana.
            </h2>
            <h2>
              I built this for my senior thesis at Yale University, and the
              source code can be found{' '}
              <a href='https://github.com/wu-json/pathogen'>here.</a>
            </h2>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
