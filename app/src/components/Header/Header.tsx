import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
  onScrollToTop: () => void;
}

export default function Header({ onScrollToTop }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <Link to="/pricing" className={styles.navLink}>요금제</Link>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user.name}</span>
              {user.plan === 'pro' && <span className={styles.proBadge}>Pro</span>}
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.ctaButton}>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
