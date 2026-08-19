export const ko = {
  // Header
  header: {
    pricing: '요금제',
    login: '로그인',
    logout: '로그아웃',
  },
  // Hero
  hero: {
    badge: '배경 지우개 정식 출시 ⚡',
    title: '이미지 배경을 제거해줄게요',
    subtitle: '드래그 앤 드롭으로 간편하게, 여러 이미지도 한 번에 처리해요 ✨',
    cta: '지금 시작하기',
    before: '원본 이미지',
    after: '배경 제거 완료 ✨',
  },
  // DropZone
  dropzone: {
    dragText: '이미지를 여기에 드래그하거나',
    dropText: '여기에 놓으세요',
    selectButton: '파일 선택',
    fileTypes: 'PNG, JPG, JPEG, WEBP (최대 10MB)',
    loginRequired: '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
    limitReached: '오늘 무료 사용량을 모두 소진했습니다. Pro 플랜으로 업그레이드 하시겠습니까?',
  },
  // Usage
  usage: {
    remaining: '오늘 남은 횟수:',
    unlimited: '무제한',
    times: '회',
    upgrade: 'Pro로 업그레이드',
  },
  // Processing
  processing: {
    waiting: '대기 중',
    processing: '처리 중...',
    complete: '완료',
    failed: '실패',
    retry: '재시도',
  },
  // Results
  results: {
    title: '변환 결과물',
    addMore: '+ 이미지 추가',
    downloadAll: '전체 다운로드 (ZIP)',
    viewOriginal: '원본 보기',
    download: '다운로드',
  },
  // Comparison
  comparison: {
    title: '정교한 컷아웃 기술을 직접 비교해보세요',
    subtitle: '머리카락 한 올 한 올까지 정밀하게 감지하여 깔끔한 누끼 결과물을 약속합니다.',
    original: '원본',
    result: '결과',
  },
  // Background Customizer
  background: {
    title: '배경 커스텀',
    transparent: '투명',
    color: '색상',
    image: '이미지',
    customColor: '직접 입력',
    selectImage: '배경 이미지 선택',
    imageSelected: '이미지가 선택되었습니다',
  },
  // Footer
  footer: {
    copyright: '© 2026 Sandeul. All rights reserved.',
  },
  // Login
  login: {
    title: '로그인',
    register: '회원가입',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    name: '이름',
    namePlaceholder: '홍길동',
    emailPlaceholder: 'hello@example.com',
    passwordPlaceholder: '8자 이상, 영문+숫자',
    confirmPlaceholder: '비밀번호를 다시 입력하세요',
    loginButton: '로그인',
    registerButton: '가입하기',
    noAccount: '아직 계정이 없으신가요?',
    hasAccount: '이미 계정이 있으신가요?',
    terms: '가입 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.',
  },
  // Pricing
  pricing: {
    badge: '요금제',
    title: '나에게 맞는 플랜을 선택하세요',
    subtitle: '무료로 시작하고, 더 많은 기능이 필요하면 언제든 업그레이드하세요',
    popular: '인기',
    free: {
      name: 'Free',
      price: '0',
      description: '가볍게 시작하기 좋은 무료 플랜',
      button: '무료로 시작하기',
      buttonLoggedOut: '가입하고 시작하기',
    },
    pro: {
      name: 'Pro',
      description: '전문가를 위한 무제한 플랜',
      button: 'Pro 시작하기',
      currentPlan: '현재 플랜',
    },
    features: {
      dailyLimit: '하루 {count}회 배경 제거',
      unlimited: '무제한 배경 제거',
      transparent: '투명 배경 PNG 다운로드',
      maxSize: '최대 10MB 이미지',
      colorChange: '배경 색상 자유 변경',
      customImage: '커스텀 배경 이미지 합성',
    },
    faq: {
      title: '자주 묻는 질문',
      q1: '무료 플랜으로 충분한가요?',
      a1: '개인적인 용도로 가끔 사용한다면 하루 3회면 충분합니다. 쇼핑몰 운영이나 대량 작업이 필요하다면 Pro 플랜을 추천드려요.',
      q2: 'Pro 플랜은 언제든 취소할 수 있나요?',
      a2: '네, 언제든 취소할 수 있습니다. 취소 후에도 결제 기간이 끝날 때까지 Pro 기능을 사용할 수 있어요.',
      q3: '배경 커스텀 기능이란?',
      a3: 'Pro 플랜에서는 투명 배경 외에도 원하는 색상으로 배경을 채우거나, 다른 이미지를 배경으로 합성할 수 있습니다.',
    },
    upgradeConfirm: 'Pro 플랜으로 업그레이드 하시겠습니까?\n(데모 버전에서는 무료로 업그레이드됩니다)',
    upgradeSuccess: 'Pro 플랜으로 업그레이드 되었습니다!',
  },
  // Errors
  errors: {
    invalidFileType: '지원하지 않는 파일 형식입니다: {filename}',
    fileTooLarge: '파일 크기가 10MB를 초과합니다: {filename}',
    tooManyFiles: '한 번에 최대 {max}개의 파일만 업로드할 수 있습니다.',
    processingFailed: '이미지 처리 중 오류가 발생했습니다.',
    invalidEmail: '올바른 이메일 형식이 아닙니다.',
    passwordMismatch: '비밀번호가 일치하지 않습니다.',
    emailExists: '이미 등록된 이메일입니다.',
    loginFailed: '로그인에 실패했습니다.',
  },
};

export default ko;
