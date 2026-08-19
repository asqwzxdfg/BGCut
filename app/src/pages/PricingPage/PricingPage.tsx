import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './PricingPage.module.css';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, upgradeToPro } = useAuth();

  const handleFreePlan = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  const handleProPlan = () => {
    if (!user) {
      navigate('/login');
    } else if (user.plan === 'pro') {
      navigate('/');
    } else {
      // 실제로는 결제 페이지로 이동
      // 여기서는 시뮬레이션으로 바로 업그레이드
      if (window.confirm('Pro 플랜으로 업그레이드 하시겠습니까?\n(데모 버전에서는 무료로 업그레이드됩니다)')) {
        upgradeToPro();
        alert('Pro 플랜으로 업그레이드 되었습니다!');
        navigate('/');
      }
    }
  };

  const scrollToTop = () => {
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>요금제</span>
            <h1 className={styles.title}>나에게 맞는 플랜을 선택하세요</h1>
            <p className={styles.subtitle}>
              무료로 시작하고, 더 많은 기능이 필요하면 언제든 업그레이드하세요
            </p>
          </div>

          <div className={styles.plans}>
            {/* Free Plan */}
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <h2 className={styles.planName}>Free</h2>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>₩</span>
                  <span className={styles.amount}>0</span>
                  <span className={styles.period}>/월</span>
                </div>
                <p className={styles.planDescription}>
                  가볍게 시작하기 좋은 무료 플랜
                </p>
              </div>

              <ul className={styles.features}>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  하루 3회 배경 제거
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  투명 배경 PNG 다운로드
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  최대 10MB 이미지
                </li>
                <li className={`${styles.feature} ${styles.featureDisabled}`}>
                  <svg className={styles.xIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  배경 색상 변경
                </li>
                <li className={`${styles.feature} ${styles.featureDisabled}`}>
                  <svg className={styles.xIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  커스텀 배경 이미지
                </li>
              </ul>

              <button 
                className={styles.planButton}
                onClick={handleFreePlan}
              >
                {user ? '무료로 시작하기' : '가입하고 시작하기'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`${styles.planCard} ${styles.planCardPro}`}>
              <div className={styles.popularBadge}>인기</div>
              <div className={styles.planHeader}>
                <h2 className={styles.planName}>Pro</h2>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>₩</span>
                  <span className={styles.amount}>9,900</span>
                  <span className={styles.period}>/월</span>
                </div>
                <p className={styles.planDescription}>
                  전문가를 위한 무제한 플랜
                </p>
              </div>

              <ul className={styles.features}>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>무제한</strong> 배경 제거
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  투명 배경 PNG 다운로드
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  최대 10MB 이미지
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>배경 색상</strong> 자유 변경
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>커스텀 배경 이미지</strong> 합성
                </li>
              </ul>

              <button 
                className={`${styles.planButton} ${styles.planButtonPro}`}
                onClick={handleProPlan}
              >
                {user?.plan === 'pro' ? '현재 플랜' : 'Pro 시작하기'}
              </button>
            </div>
          </div>

          <div className={styles.faq}>
            <h2 className={styles.faqTitle}>자주 묻는 질문</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>무료 플랜으로 충분한가요?</h3>
                <p className={styles.faqAnswer}>
                  개인적인 용도로 가끔 사용한다면 하루 3회면 충분합니다. 
                  쇼핑몰 운영이나 대량 작업이 필요하다면 Pro 플랜을 추천드려요.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Pro 플랜은 언제든 취소할 수 있나요?</h3>
                <p className={styles.faqAnswer}>
                  네, 언제든 취소할 수 있습니다. 취소 후에도 결제 기간이 끝날 때까지 Pro 기능을 사용할 수 있어요.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>배경 커스텀 기능이란?</h3>
                <p className={styles.faqAnswer}>
                  Pro 플랜에서는 투명 배경 외에도 원하는 색상으로 배경을 채우거나, 
                  다른 이미지를 배경으로 합성할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
