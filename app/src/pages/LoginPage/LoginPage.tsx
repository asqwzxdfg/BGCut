import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './LoginPage.module.css';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, error, clearError, isLoading, user } = useAuth();
  const { t } = useLanguage();
  
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
    setLocalError('');
  }, [mode, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setLocalError(t.errors.passwordMismatch);
        return;
      }

      const success = await register(email, password, name);
      if (success) {
        navigate('/');
      }
    } else {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    }
  }, [mode, email, password, name, confirmPassword, login, register, navigate, t]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const displayError = localError || error;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✂️</span>
          <span className={styles.logoText}>BGCut</span>
        </Link>

        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => setMode('login')}
            >
              {t.login.title}
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => setMode('register')}
            >
              {t.login.register}
            </button>
            <div 
              className={styles.tabIndicator} 
              style={{ transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
            />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formContent}>
              {mode === 'register' && (
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>{t.login.name}</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder={t.login.namePlaceholder}
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>{t.login.email}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder={t.login.emailPlaceholder}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>{t.login.password}</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder={t.login.passwordPlaceholder}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              {mode === 'register' && (
                <div className={styles.field}>
                  <label htmlFor="confirmPassword" className={styles.label}>{t.login.confirmPassword}</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder={t.login.confirmPlaceholder}
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}

              {displayError && (
                <div className={styles.error} role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {displayError}
                </div>
              )}

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? (
                  <span className={styles.spinner} />
                ) : (
                  mode === 'login' ? t.login.loginButton : t.login.registerButton
                )}
              </button>
            </div>
          </form>

          <p className={styles.switchText}>
            {mode === 'login' ? (
              <>
                {t.login.noAccount}{' '}
                <button type="button" onClick={toggleMode} className={styles.switchButton}>
                  {t.login.register}
                </button>
              </>
            ) : (
              <>
                {t.login.hasAccount}{' '}
                <button type="button" onClick={toggleMode} className={styles.switchButton}>
                  {t.login.title}
                </button>
              </>
            )}
          </p>
        </div>

        <p className={styles.terms}>{t.login.terms}</p>
      </div>
    </div>
  );
}
