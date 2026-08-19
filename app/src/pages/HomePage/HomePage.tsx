import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [showVisual, setShowVisual] = useState(true);

  const scrollToTop = useCallback(() => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleStartClick = useCallback(() => {
    setShowVisual(false);
  }, []);

  return (
    <div className={styles.page}>
      <Header onScrollToTop={scrollToTop} />

      <main className={styles.main}>
        <Hero 
          showVisual={showVisual}
          onStartClick={handleStartClick}
        />
      </main>
    </div>
  );
}
