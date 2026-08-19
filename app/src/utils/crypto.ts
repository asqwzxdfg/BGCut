// 보안 관련 유틸리티 함수들

// 비밀번호 해싱 (브라우저 Web Crypto API 사용)
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const useSalt = salt || generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + useSalt);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { hash: hashHex, salt: useSalt };
}

// 랜덤 솔트 생성
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// 랜덤 ID 생성
export function generateId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// 비밀번호 검증
export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 비밀번호 강도 검사
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, message: '비밀번호에 영문자가 포함되어야 합니다.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
  }
  return { valid: true, message: '' };
}

// XSS 방지를 위한 문자열 이스케이프
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
