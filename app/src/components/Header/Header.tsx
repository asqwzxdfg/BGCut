import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import styles from './Header.module.css';

interface HeaderProps {
  onScrollToTop: () => void;
}

export default function Header({ onScrollToTop }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const isKorean = t.background.transparent === '투명';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button className={styles.logo} onClick={onScrollToTop} aria-label="홈으로 이동">
          <img src="/icon.png" alt="BGCut" className={styles.logoIcon} />
          <span className={styles.logoText}>BGCut</span>
        </button>

        <nav className={styles.nav}>
          <Link to="/editor" className={styles.navLink}>
            {isKorean ? '작업' : 'Editor'}
          </Link>
          <Link to="/hub" className={styles.navLink}>
            {isKorean ? '허브' : 'Hub'}
          </Link>
          <Link to="/pricing" className={styles.navLink}>{t.header.pricing}</Link>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user.name}</span>
              {user.plan === 'pro' && <span className={styles.proBadge}>Pro</span>}
              <button className={styles.logoutButton} onClick={handleLogout}>
                {t.header.logout}
              </button>
              <LanguageSelector />
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.ctaButton}>
                {t.header.login}
              </Link>
              <LanguageSelector />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
