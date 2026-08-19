import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, error, clearError, isLoading, user } = useAuth();
  
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // 이미 로그인되어 있으면 홈으로
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // 모드 전환 시 에러 클리어
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [mode, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setLocalError('비밀번호가 일치하지 않습니다.');
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
  }, [mode, email, password, name, confirmPassword, login, register, navigate]);

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
              로그인
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => setMode('register')}
            >
              회원가입
            </button>
            <div 
              className={styles.tabIndicator} 
              style={{ transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
            />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={`${styles.formContent} ${mode === 'register' ? styles.registerMode : ''}`}>
              {mode === 'register' && (
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>이름</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="홍길동"
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>이메일</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="hello@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>비밀번호</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="8자 이상, 영문+숫자"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              {mode === 'register' && (
                <div className={styles.field}>
                  <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="비밀번호를 다시 입력하세요"
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

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner} />
                ) : (
                  mode === 'login' ? '로그인' : '가입하기'
                )}
              </button>
            </div>
          </form>

          <p className={styles.switchText}>
            {mode === 'login' ? (
              <>
                아직 계정이 없으신가요?{' '}
                <button type="button" onClick={toggleMode} className={styles.switchButton}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <button type="button" onClick={toggleMode} className={styles.switchButton}>
                  로그인
                </button>
              </>
            )}
          </p>
        </div>

        <p className={styles.terms}>
          가입 시 <a href="#terms">서비스 이용약관</a> 및 <a href="#privacy">개인정보 처리방침</a>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
