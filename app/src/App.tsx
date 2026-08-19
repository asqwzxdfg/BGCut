import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { HubProvider } from './contexts/HubContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import HubPage from './pages/HubPage';
import EditorPage from './pages/EditorPage';
import PageTransition from './components/PageTransition';
import styles from './App.module.css';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <PageTransition locationKey={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HubProvider>
          <BrowserRouter>
            <div className={styles.app}>
              <AnimatedRoutes />
            </div>
          </BrowserRouter>
        </HubProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
