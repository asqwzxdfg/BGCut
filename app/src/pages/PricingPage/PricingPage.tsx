import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './PricingPage.module.css';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, upgradeToPro } = useAuth();
  const { t, currency } = useLanguage();

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
      if (window.confirm(t.pricing.upgradeConfirm)) {
        upgradeToPro();
        alert(t.pricing.upgradeSuccess);
        navigate('/');
      }
    }
  };

  const scrollToTop = () => {
    navigate('/');
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price === 0) return '0';
    if (Number.isInteger(price)) return price.toLocaleString();
    return price.toFixed(2);
  };

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>{t.pricing.badge}</span>
            <h1 className={styles.title}>{t.pricing.title}</h1>
            <p className={styles.subtitle}>{t.pricing.subtitle}</p>
          </div>

          <div className={styles.plans}>
            {/* Free Plan */}
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <h2 className={styles.planName}>{t.pricing.free.name}</h2>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>{currency.symbol}</span>
                  <span className={styles.amount}>{t.pricing.free.price}</span>
                  <span className={styles.period}>{currency.period}</span>
                </div>
                <p className={styles.planDescription}>{t.pricing.free.description}</p>
              </div>

              <ul className={styles.features}>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t.pricing.features.dailyLimit.replace('{count}', '3')}
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t.pricing.features.transparent}
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t.pricing.features.maxSize}
                </li>
                <li className={`${styles.feature} ${styles.featureDisabled}`}>
                  <svg className={styles.xIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  {t.pricing.features.colorChange}
                </li>
                <li className={`${styles.feature} ${styles.featureDisabled}`}>
                  <svg className={styles.xIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  {t.pricing.features.customImage}
                </li>
              </ul>

              <button className={styles.planButton} onClick={handleFreePlan}>
                {user ? t.pricing.free.button : t.pricing.free.buttonLoggedOut}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`${styles.planCard} ${styles.planCardPro}`}>
              <div className={styles.popularBadge}>{t.pricing.popular}</div>
              <div className={styles.planHeader}>
                <h2 className={styles.planName}>{t.pricing.pro.name}</h2>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>{currency.symbol}</span>
                  <span className={styles.amount}>{formatPrice(currency.price)}</span>
                  <span className={styles.period}>{currency.period}</span>
                </div>
                <p className={styles.planDescription}>{t.pricing.pro.description}</p>
              </div>

              <ul className={styles.features}>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>{t.pricing.features.unlimited}</strong>
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t.pricing.features.transparent}
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t.pricing.features.maxSize}
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>{t.pricing.features.colorChange}</strong>
                </li>
                <li className={styles.feature}>
                  <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>{t.pricing.features.customImage}</strong>
                </li>
              </ul>

              <button className={`${styles.planButton} ${styles.planButtonPro}`} onClick={handleProPlan}>
                {user?.plan === 'pro' ? t.pricing.pro.currentPlan : t.pricing.pro.button}
              </button>
            </div>
          </div>

          <div className={styles.faq}>
            <h2 className={styles.faqTitle}>{t.pricing.faq.title}</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{t.pricing.faq.q1}</h3>
                <p className={styles.faqAnswer}>{t.pricing.faq.a1}</p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{t.pricing.faq.q2}</h3>
                <p className={styles.faqAnswer}>{t.pricing.faq.a2}</p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{t.pricing.faq.q3}</h3>
                <p className={styles.faqAnswer}>{t.pricing.faq.a3}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
