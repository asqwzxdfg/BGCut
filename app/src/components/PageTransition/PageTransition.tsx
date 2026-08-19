import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
  locationKey: string;
}

export default function PageTransition({ children, locationKey }: PageTransitionProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const previousKeyRef = useRef(locationKey);

  useEffect(() => {
    if (locationKey !== previousKeyRef.current) {
      // 페이지 변경 감지 - 애니메이션 시작
      setTransitionStage('exiting');
      
      // exit 애니메이션 후 새 컨텐츠로 교체
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('entering');
        previousKeyRef.current = locationKey;
        
        // enter 애니메이션 완료 후 idle 상태로
        const enterTimer = setTimeout(() => {
          setTransitionStage('idle');
        }, 600);
        
        return () => clearTimeout(enterTimer);
      }, 400);

      return () => clearTimeout(exitTimer);
    } else {
      // 첫 로드 또는 같은 페이지
      setDisplayChildren(children);
    }
  }, [children, locationKey]);

  return (
    <div 
      className={`${styles.pageTransition} ${
        transitionStage === 'exiting' ? styles.exiting : ''
      } ${
        transitionStage === 'entering' ? styles.entering : ''
      }`}
    >
      {displayChildren}
    </div>
  );
}
