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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button className={styles.logo} onClick={onScrollToTop} aria-label="홈으로 이동">
          <span className={styles.logoIcon}>✂️</span>
          <span className={styles.logoText}>BGCut</span>
        </button>

        <nav className={styles.nav}>
          <LanguageSelector />
          <Link to="/pricing" className={styles.navLink}>{t.header.pricing}</Link>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user.name}</span>
              {user.plan === 'pro' && <span className={styles.proBadge}>Pro</span>}
              <button className={styles.logoutButton} onClick={handleLogout}>
                {t.header.logout}
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.ctaButton}>
              {t.header.login}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
