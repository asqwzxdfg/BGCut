import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserPlan, UsageInfo } from '../types';
import { hashPassword, verifyPassword, generateId, isValidEmail, validatePassword } from '../utils/crypto';

// 저장된 사용자 정보 (비밀번호 해시 포함)
interface StoredUser {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  upgradeToPro: () => void;
  // 사용량 관련
  usageInfo: UsageInfo;
  canUseService: () => boolean;
  incrementUsage: () => void;
  getRemainingUsage: () => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'bgcut_users',
  CURRENT_USER: 'bgcut_current_user',
  USAGE: 'bgcut_usage',
};

const FREE_DAILY_LIMIT = 3;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageInfo, setUsageInfo] = useState<UsageInfo>({ date: '', count: 0 });

  // 오늘 날짜 가져오기
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // 사용량 정보 로드
  const loadUsageInfo = useCallback((userId: string) => {
    const today = getTodayDate();
    const stored = localStorage.getItem(`${STORAGE_KEYS.USAGE}_${userId}`);
    
    if (stored) {
      const parsed: UsageInfo = JSON.parse(stored);
      if (parsed.date === today) {
        setUsageInfo(parsed);
        return;
      }
    }
    
    // 새로운 날짜이면 카운트 리셋
    const newUsage = { date: today, count: 0 };
    localStorage.setItem(`${STORAGE_KEYS.USAGE}_${userId}`, JSON.stringify(newUsage));
    setUsageInfo(newUsage);
  }, []);

  // 초기화: 저장된 세션 복원
  useEffect(() => {
    const storedUserId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    
    if (storedUserId) {
      const users = getStoredUsers();
      const storedUser = users.find(u => u.id === storedUserId);
      
      if (storedUser) {
        const { passwordHash, salt, ...userData } = storedUser;
        setUser(userData);
        loadUsageInfo(storedUser.id);
      }
    }
    
    setIsLoading(false);
  }, [loadUsageInfo]);

  // 저장된 사용자 목록 가져오기
  const getStoredUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  };

  // 사용자 저장
  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  };

  // 로그인
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // 입력 검증
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return false;
      }

      if (!isValidEmail(email)) {
        setError('올바른 이메일 형식이 아닙니다.');
        return false;
      }

      const users = getStoredUsers();
      const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!storedUser) {
        setError('등록되지 않은 이메일입니다.');
        return false;
      }

      // 비밀번호 검증
      const isValid = await verifyPassword(password, storedUser.passwordHash, storedUser.salt);
      
      if (!isValid) {
        setError('비밀번호가 일치하지 않습니다.');
        return false;
      }

      // 로그인 성공
      const { passwordHash, salt, ...userData } = storedUser;
      setUser(userData);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, storedUser.id);
      loadUsageInfo(storedUser.id);
      
      return true;
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadUsageInfo]);

  // 회원가입
  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // 입력 검증
      if (!email || !password || !name) {
        setError('모든 필드를 입력해주세요.');
        return false;
      }

      if (!isValidEmail(email)) {
        setError('올바른 이메일 형식이 아닙니다.');
        return false;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setError(passwordValidation.message);
        return false;
      }

      if (name.length < 2) {
        setError('이름은 2자 이상이어야 합니다.');
        return false;
      }

      const users = getStoredUsers();
      
      // 이메일 중복 체크
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('이미 등록된 이메일입니다.');
        return false;
      }

      // 비밀번호 해싱
      const { hash, salt } = await hashPassword(password);

      // 새 사용자 생성
      const newUser: StoredUser = {
        id: generateId(),
        email: email.toLowerCase(),
        name: name.trim(),
        plan: 'free',
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
      };

      // 저장
      users.push(newUser);
      saveUsers(users);

      // 자동 로그인
      const { passwordHash, salt: _, ...userData } = newUser;
      setUser(userData);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, newUser.id);
      loadUsageInfo(newUser.id);

      return true;
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadUsageInfo]);

  // 로그아웃
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUsageInfo({ date: '', count: 0 });
  }, []);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Pro 업그레이드 (시뮬레이션)
  const upgradeToPro = useCallback(() => {
    if (!user) return;

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex].plan = 'pro';
      saveUsers(users);
      setUser({ ...user, plan: 'pro' });
    }
  }, [user]);

  // 특정 계정에 Pro 권한 부여 (개발/테스트용)
  // 이름이 "산들"인 계정에 Pro 권한 자동 부여
  useEffect(() => {
    const users = getStoredUsers();
    let updated = false;
    
    users.forEach((u, index) => {
      if (u.name === '산들' && u.plan !== 'pro') {
        users[index].plan = 'pro';
        updated = true;
      }
    });
    
    if (updated) {
      saveUsers(users);
      // 현재 로그인한 사용자가 산들이면 상태 업데이트
      if (user && user.name === '산들' && user.plan !== 'pro') {
        setUser({ ...user, plan: 'pro' });
      }
    }
  }, [user]);

  // 서비스 사용 가능 여부
  const canUseService = useCallback(() => {
    if (!user) return false;
    if (user.plan === 'pro') return true;
    
    const today = getTodayDate();
    if (usageInfo.date !== today) return true;
    
    return usageInfo.count < FREE_DAILY_LIMIT;
  }, [user, usageInfo]);

  // 사용량 증가
  const incrementUsage = useCallback(() => {
    if (!user) return;

    const today = getTodayDate();
    let newUsage: UsageInfo;

    if (usageInfo.date === today) {
      newUsage = { date: today, count: usageInfo.count + 1 };
    } else {
      newUsage = { date: today, count: 1 };
    }

    localStorage.setItem(`${STORAGE_KEYS.USAGE}_${user.id}`, JSON.stringify(newUsage));
    setUsageInfo(newUsage);
  }, [user, usageInfo]);

  // 남은 사용량
  const getRemainingUsage = useCallback(() => {
    if (!user) return 0;
    if (user.plan === 'pro') return Infinity;

    const today = getTodayDate();
    if (usageInfo.date !== today) return FREE_DAILY_LIMIT;

    return Math.max(0, FREE_DAILY_LIMIT - usageInfo.count);
  }, [user, usageInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        upgradeToPro,
        usageInfo,
        canUseService,
        incrementUsage,
        getRemainingUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
