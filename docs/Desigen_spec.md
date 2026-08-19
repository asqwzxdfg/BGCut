# BGCut Design Specification v2.0

> MZ 감성 · 소프트 모던 · 수직 플로우 · 싱글 페이지

---

## 1. 디자인 방향 (Design Direction)

| 항목 | 내용 |
|------|------|
| **레지스터** | Soft-modern Korean SaaS — 토스, 당근, 클래스101 계열 |
| **키워드** | 따뜻함, 친근함, 세련된 귀여움, 공기감 |
| **톤** | 밝고 부드러운 — 유치하지 않은 MZ 감성 |
| **금지 요소** | 하드 보더, 다크 섹션, 글로시/3D 이펙트, 과한 일러스트 |
| **핵심 원칙** | 둥근 모서리, 필 버튼, 소프트 쉐도우, 넉넉한 여백 |

---

## 2. 컬러 시스템 (Color System)

### 2.1 기본 팔레트

| 토큰명 | Hex | RGB | 용도 |
|--------|-----|-----|------|
| `--color-bg-base` | `#FAFAF7` | 250, 250, 247 | 페이지 전체 배경 (크리미 화이트) |
| `--color-bg-card` | `#FFFFFF` | 255, 255, 255 | 카드, 헤더 배경 |
| `--color-bg-dropzone` | `#F5F3FF` | 245, 243, 255 | 업로드 영역 배경 (연라벤더) |
| `--color-bg-muted` | `#F3F4F6` | 243, 244, 246 | 비활성 영역, 썸네일 배경 |
| `--color-bg-checker-light` | `#F8FAFC` | 248, 250, 252 | 체커보드 밝은 타일 |
| `--color-bg-checker-dark` | `#E2E8F0` | 226, 232, 240 | 체커보드 어두운 타일 |

### 2.2 브랜드 & 액센트

| 토큰명 | Hex | RGB | 용도 |
|--------|-----|-----|------|
| `--color-primary` | `#7C6FF5` | 124, 111, 245 | CTA 버튼, 액센트, 프로그레스 바 |
| `--color-primary-hover` | `#6B5CE3` | 107, 92, 227 | 버튼 호버 |
| `--color-primary-light` | `#F5F3FF` | 245, 243, 255 | 뱃지, 태그 배경 |
| `--color-success` | `#10B981` | 16, 185, 129 | 완료 상태 |
| `--color-error` | `#EF4444` | 239, 68, 68 | 에러 상태 |
| `--color-warning` | `#F59E0B` | 245, 158, 11 | 경고 |

### 2.3 텍스트 컬러

| 토큰명 | Hex | 용도 |
|--------|-----|------|
| `--color-text-primary` | `#1F2232` | 헤드라인, 파일명, 본문 |
| `--color-text-secondary` | `#6B7280` | 서브텍스트, 캡션, 파일크기 |
| `--color-text-accent` | `#7C6FF5` | 액센트 라벨, 링크, 처리중 상태 |
| `--color-text-success` | `#10B981` | 완료 상태 텍스트 |
| `--color-text-inverse` | `#FFFFFF` | 버튼 내 흰색 텍스트 |

### 2.4 보더 & 디바이더

| 토큰명 | Hex | 용도 |
|--------|-----|------|
| `--color-border-subtle` | `#EEEDF2` | 헤더 하단 보더 |
| `--color-border-muted` | `#E2E8F0` | 카드 보더 (선택적) |
| `--color-progress-track` | `#9CA3AF` | 프로그레스 바 트랙 (대기) |

---

## 3. 타이포그래피 (Typography)

### 3.1 서체

| 용도 | 서체 | Google Fonts | 비고 |
|------|------|-------------|------|
| 헤드라인/브랜드 | **Gabarito** | [link](https://fonts.google.com/specimen/Gabarito) | 둥글고 친근한 디스플레이 |
| 본문/UI | **Outfit** | [link](https://fonts.google.com/specimen/Outfit) | 기하학적 산세리프, 깔끔 |
| 한글 페어링 (권장) | **Pretendard** 또는 **SUIT** | CDN 배포 | 한글 본문 구현 시 |

### 3.2 타입 스케일

| 레벨 | 서체 | 크기 | Weight | Letter-spacing | Line-height | 용도 |
|------|------|------|--------|---------------|-------------|------|
| Display | Gabarito | 54px | ExtraBold (800) | -1.5px | 120% | Hero 메인 타이틀 |
| H2 | Gabarito | 28px | ExtraBold (800) | 0 | auto | 비교 섹션 타이틀 |
| H3 | Gabarito | 22px | ExtraBold (800) | 0 | auto | 결과물 섹션 타이틀, 로고 |
| H4 | Gabarito | 20px | Bold (700) | 0 | auto | 드롭존 안내 텍스트 |
| Body L | Outfit | 18px | Regular (400) | 0 | 150% | Hero 서브카피 |
| Body | Outfit | 16px | Bold (700) | 0 | auto | 결과 파일명, CTA 버튼 |
| Body S | Outfit | 15px | Bold (700) | 0 | auto | 큐 파일명, 보조 설명 |
| Label | Outfit | 14px | Bold (700) | 0 | auto | 버튼 라벨, 네비게이션 |
| Caption | Outfit | 13px | Regular (400) | 0 | auto | 파일크기, 부가 안내 |
| Micro | Outfit | 12px | Regular/Bold | 0 | auto | 상태 텍스트, 파일크기 |

### 3.3 한글 폰트 로딩 전략

```css
@import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@700;800;900&family=Outfit:wght@400;600;700&display=swap');

/* 한글 페어링 (Pretendard 예시) */
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
}

body {
  font-family: 'Outfit', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

h1, h2, h3, .brand-text {
  font-family: 'Gabarito', 'Pretendard', sans-serif;
}
```

---

## 4. 간격 시스템 (Spacing)

### 4.1 기본 단위 (4px 기반)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--space-1` | 4px | 아이콘-텍스트 미세 간격 |
| `--space-2` | 8px | 인라인 요소 간격 |
| `--space-3` | 12px | 큐 카드 간 간격 |
| `--space-4` | 16px | 결과 카드 간 간격, 카드 내부 패딩 |
| `--space-5` | 20px | 카드 내부 패딩 (넓은) |
| `--space-6` | 24px | 섹션 내부 소그룹 간격 |
| `--space-8` | 32px | 섹션 내부 중그룹 간격 |
| `--space-10` | 40px | 컴포넌트 블록 간 |
| `--space-12` | 48px | 섹션 내부 패딩 |
| `--space-16` | 64px | 섹션 간 수직 여백 (작은) |
| `--space-20` | 80px | 섹션 간 수직 여백 (기본) |
| `--space-24` | 96px | 섹션 간 수직 여백 (넓은) |

### 4.2 레이아웃 핵심 간격

| 구간 | 간격 |
|------|------|
| 헤더 높이 | 60px |
| Hero → 업로드 영역 | 80px |
| 업로드 영역 → 대기열 | 24px (연결된 느낌) |
| 대기열 → 결과물 | 64px |
| 결과물 → 비교 슬라이더 | 80px |
| 비교 슬라이더 → 푸터 | 80px |
| 콘텐츠 좌우 마진 | 120px (1440px 기준 → 콘텐츠 1200px) |

---

## 5. 모서리 반경 (Border Radius)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-sm` | 4px | 프로그레스 바 트랙 |
| `--radius-md` | 8px | 작은 뱃지, 태그 |
| `--radius-lg` | 12px | 큐 카드, 결과 카드 |
| `--radius-xl` | 16px | 드롭존 영역 |
| `--radius-2xl` | 20px | Hero 이미지 카드 |
| `--radius-3xl` | 24px | 비교 슬라이더 컨테이너 |
| `--radius-full` | 99px / 9999px | 필(pill) 버튼, 뱃지 |

---

## 6. 그림자 시스템 (Shadows)

| 토큰 | CSS | 용도 |
|------|-----|------|
| `--shadow-xs` | `0 4px 12px rgba(31,34,50,0.02)` | 큐 카드 기본 |
| `--shadow-sm` | `0 8px 16px rgba(124,111,245,0.05)` | 드롭존 영역 |
| `--shadow-md` | `0 16px 40px rgba(106,96,137,0.06)` | Hero 이미지 카드 |
| `--shadow-hover` | `0 8px 24px rgba(124,111,245,0.10)` | 카드 호버 시 |

> **원칙:** 그림자는 항상 매우 연하게. 라벤더 틴트가 들어간 그림자로 브랜드 톤 유지.

---

## 7. 섹션별 상세 스펙 (Section Specs)

### 7.1 Header

| 항목 | 스펙 |
|------|------|
| 높이 | 60px |
| 배경 | `#FFFFFF` (backdrop-filter: blur(20px) 적용 권장) |
| 위치 | `position: sticky; top: 0; z-index: 100` |
| 하단 보더 | 1px solid `#EEEDF2` |
| 좌측 로고 | "✂️ BGCut" — Gabarito Black 22px, `#1F2232`, letter-spacing -0.5px |
| 우측 네비 | "소개" / "요금제" — Outfit SemiBold 14px, `#6B7280` |
| 우측 CTA | "지금 시작하기" — 필 버튼, `#7C6FF5` 배경 |

```css
.header {
  position: sticky;
  top: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid #EEEDF2;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 120px;
}
```

### 7.2 Hero Section

| 항목 | 스펙 |
|------|------|
| 배경 | `#FAFAF7` |
| 패딩 | 상 100px, 하 80px |
| 뱃지 | "AI 배경 지우개 카트 출시 ⚡" — Outfit Bold 13px, `#7C6FF5`, 라벤더 필 배경 |
| 메인 타이틀 | Gabarito ExtraBold 54px, `#1F2232`, line-height 120%, letter-spacing -1.5px |
| 서브카피 | Outfit Regular 18px, `#6B7280`, line-height 150% |
| CTA 버튼 | "지금 시작하기" — 필 버튼, 16px Bold |
| 비주얼 | Before/After 제품 이미지 카드 — 20px 라디우스, shadow-md |

### 7.3 Upload Section (Drop Zone)

| 항목 | 스펙 |
|------|------|
| 배경 | `#F5F3FF` (연라벤더) |
| 라디우스 | 16px |
| 패딩 | 48px |
| 그림자 | `--shadow-sm` |
| 보더 | 없음 (소프트 배경으로 영역 구분) |
| 아이콘 | 클라우드 업로드 — 40px, `#7C6FF5` |
| 안내 텍스트 | Gabarito Bold 20px, `#1F2232` |
| 보조 텍스트 | Outfit Regular 13px, `#6B7280` |
| 파일 선택 버튼 | 필 버튼, `#7C6FF5`, 16px Bold |

**상태별 스타일:**

```css
/* 기본 상태 */
.dropzone {
  background: #F5F3FF;
  border: 2px dashed transparent;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 드래그 오버 */
.dropzone--dragover {
  background: #EDE9FE;
  border-color: #7C6FF5;
  transform: scale(1.01);
  box-shadow: 0 0 0 4px rgba(124, 111, 245, 0.15);
}

/* 에러 (잘못된 파일) */
.dropzone--error {
  background: #FEF2F2;
  border-color: #EF4444;
}
```

### 7.4 Processing Queue (대기열)

| 항목 | 스펙 |
|------|------|
| 상단 간격 | 업로드 영역과 24px 간격 (연결감) |
| 카드 간 간격 | 12px (수직) |
| 카드 높이 | auto (패딩 16px 20px) |
| 카드 배경 | `#FFFFFF` |
| 카드 라디우스 | 12px |
| 카드 그림자 | `--shadow-xs` |
| 레이아웃 | 수평: [썸네일 40px] — [파일명+크기] — [프로그레스 바 flex] — [상태 텍스트] |

**프로그레스 바:**

```css
.progress-track {
  height: 6px;
  background: #E2E8F0;
  border-radius: 99px;
  overflow: hidden;
  flex: 1;
  min-width: 120px;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 상태별 색상 */
.progress-fill--waiting { background: #9CA3AF; width: 0%; }
.progress-fill--processing { background: #7C6FF5; }
.progress-fill--complete { background: #10B981; width: 100%; }
```

**상태 텍스트:**

| 상태 | 텍스트 | 색상 | 아이콘 |
|------|--------|------|--------|
| 대기 중 | "대기 중" | `#6B7280` | — |
| 처리 중 | "처리 중..." | `#7C6FF5` | 스피너 |
| 완료 | "✓ 완료" | `#10B981` | 체크 |
| 실패 | "실패" | `#EF4444` | 재시도 아이콘 |

### 7.5 Result Section (결과물)

| 항목 | 스펙 |
|------|------|
| 섹션 타이틀 | "변환 결과물" — Gabarito ExtraBold 22px + 카운트 뱃지 |
| 카운트 뱃지 | 원형, `#7C6FF5` 텍스트, 라벤더 배경, Outfit Bold 13px |
| 카드 간 간격 | 16px (수직) |
| 카드 배경 | `#FFFFFF` |
| 카드 라디우스 | 12px |
| 카드 그림자 | `--shadow-xs` → 호버 시 `--shadow-hover` |

**결과 카드 레이아웃 (1행 = 1카드):**

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                                   │
│  │ 체커보드  │  sneaker_bgremoved.png     [원본 보기] [다운로드]  │
│  │ 미리보기  │  3.5 MB                                     [X]  │
│  └──────────┘                                                   │
└──────────────────────────────────────────────────────────────────┘
```

```css
.result-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(31, 34, 50, 0.02);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card:hover {
  box-shadow: 0 8px 24px rgba(124, 111, 245, 0.10);
  transform: translateY(-2px);
}
```

**체커보드 패턴 CSS:**

```css
.checkerboard {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-image:
    linear-gradient(45deg, #E2E8F0 25%, transparent 25%),
    linear-gradient(-45deg, #E2E8F0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #E2E8F0 75%),
    linear-gradient(-45deg, transparent 75%, #E2E8F0 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  background-color: #F8FAFC;
}
```

**전체 다운로드 & 이미지 추가:**

| 버튼 | 스타일 | 위치 |
|------|--------|------|
| "+ 이미지 추가" | Outlined pill, `#7C6FF5` 텍스트 + 보더 | 좌측 |
| "전체 다운로드 (ZIP)" | Filled pill, `#7C6FF5` 배경 | 우측 |

### 7.6 비교 슬라이더

| 항목 | 스펙 |
|------|------|
| 타이틀 | Gabarito ExtraBold 28px, `#1F2232` |
| 설명 | Outfit Regular 15px, `#6B7280` |
| 컨테이너 라디우스 | 24px |
| 슬라이더 라인 | 2px, `#FFFFFF` |
| 핸들 | 원형 40px, `#FFFFFF`, shadow |
| 라벨 | "원본" / "결과" — 필 태그, 반투명 배경 |

### 7.7 Footer

| 항목 | 스펙 |
|------|------|
| 배경 | `#FAFAF7` |
| 높이 | 80px |
| 로고 | "BGCut" — Gabarito ExtraBold 16px, `#6B7280` |
| 저작권 | Outfit Regular 13px, `#6B7280` |

---

## 8. 버튼 시스템 (Buttons)

### 8.1 버튼 타입

| 타입 | 배경 | 텍스트 | 보더 | Radius |
|------|------|--------|------|--------|
| **Primary (Filled)** | `#7C6FF5` | `#FFFFFF` | 없음 | 99px (pill) |
| **Secondary (Outlined)** | 투명 | `#7C6FF5` | 1.5px `#7C6FF5` | 99px (pill) |
| **Ghost** | 투명 | `#6B7280` | 없음 | 99px |
| **Danger** | `#EF4444` | `#FFFFFF` | 없음 | 99px |

### 8.2 버튼 크기

| 크기 | 높이 | 패딩 (수평) | 폰트 크기 |
|------|------|------------|-----------|
| Large | 48px | 28px | 16px Bold |
| Medium | 40px | 24px | 14px Bold |
| Small | 32px | 16px | 13px Bold |

### 8.3 버튼 상태

```css
.btn-primary {
  background: #7C6FF5;
  color: #FFFFFF;
  border: none;
  border-radius: 99px;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: #6B5CE3;
  box-shadow: 0 4px 16px rgba(124, 111, 245, 0.25);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: scale(0.97);
  box-shadow: none;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary--loading {
  pointer-events: none;
  position: relative;
}

.btn-primary--loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 8px;
}
```

---

## 9. 애니메이션 시스템 (Animation & Motion)

### 9.1 이징 함수 (Easing)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | 요소 등장, 확장 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 일반 전환, 호버 |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 바운스 느낌, 드롭 |
| `--ease-smooth` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | 부드러운 감속 |

### 9.2 키프레임 정의

```css
/* 페이드 인 + 슬라이드 업 (카드 등장) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 페이드 아웃 + 스케일 다운 (카드 삭제) */
@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* 체크 아이콘 팝 (처리 완료) */
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  70% {
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 스피너 회전 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 프로그레스 바 셔틀 (불확정 상태) */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 부드러운 펄스 (드래그 오버 강조) */
@keyframes softPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 111, 245, 0.2); }
  50% { box-shadow: 0 0 0 8px rgba(124, 111, 245, 0); }
}

/* 슬라이드 인 (섹션 스크롤 등장) */
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 바운스 드롭 (파일 드롭 시) */
@keyframes bounceDrop {
  0% { transform: scale(1); }
  30% { transform: scale(0.97); }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* 프로그레스 바 완료 플래시 */
@keyframes completeFlash {
  0% { background: #10B981; }
  50% { background: #34D399; }
  100% { background: #10B981; }
}
```

### 9.3 적용 가이드

| 요소 | 트리거 | 애니메이션 | Duration | Easing |
|------|--------|-----------|----------|--------|
| **큐 카드 등장** | 파일 추가 시 | `fadeInUp` | 0.35s | `--ease-out` |
| **큐 카드 삭제** | 삭제 시 | `fadeOutScale` | 0.25s | `--ease-in-out` |
| **결과 카드 등장** | 처리 완료 시 | `fadeInUp` | 0.4s | `--ease-out` |
| **결과 카드 삭제** | X 버튼 클릭 | `fadeOutScale` | 0.2s | `--ease-in-out` |
| **결과 카드 호버** | 마우스 진입 | translateY(-2px) + shadow 증가 | 0.25s | `--ease-in-out` |
| **파일 드롭** | 드래그 드롭 | `bounceDrop` | 0.4s | `--ease-spring` |
| **드래그 오버** | 드래그 진입 | scale(1.01) + border + `softPulse` | 0.3s | `--ease-in-out` |
| **드래그 이탈** | 드래그 벗어남 | 원복 | 0.2s | `--ease-in-out` |
| **프로그레스 바 진행** | 처리 중 | width 변화 | 0.6s | `--ease-smooth` |
| **프로그레스 불확정** | API 응답 대기 | shimmer 그라디언트 | 1.5s | linear, infinite |
| **완료 체크** | 100% 도달 | `popIn` | 0.35s | `--ease-spring` |
| **완료 바 플래시** | 100% 도달 | `completeFlash` | 0.6s | ease |
| **버튼 호버** | 마우스 진입 | translateY(-1px) + shadow | 0.2s | `--ease-in-out` |
| **버튼 클릭** | 마우스 다운 | scale(0.97) | 0.1s | ease |
| **섹션 스크롤 등장** | IntersectionObserver | `slideInFromBottom` | 0.6s | `--ease-out` |
| **토스트 알림** | 에러 발생 | slideDown + fadeIn | 0.3s | `--ease-out` |
| **토스트 닫힘** | 5초 후 / 닫기 | slideUp + fadeOut | 0.25s | `--ease-in-out` |
| **비교 슬라이더** | 드래그 | 즉시 (throttled) | — | — |

### 9.4 스크롤 등장 효과 (Intersection Observer)

```javascript
// 각 섹션에 스크롤 기반 등장 애니메이션 적용
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section-animate').forEach((el) => {
  observer.observe(el);
});
```

```css
.section-animate {
  opacity: 0;
  transform: translateY(40px);
}

.section-animate.animate-in {
  animation: slideInFromBottom 0.6s cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

/* 순차 딜레이 (큐/결과 카드에 적용) */
.section-animate.animate-in .card:nth-child(1) { animation-delay: 0s; }
.section-animate.animate-in .card:nth-child(2) { animation-delay: 0.08s; }
.section-animate.animate-in .card:nth-child(3) { animation-delay: 0.16s; }
.section-animate.animate-in .card:nth-child(4) { animation-delay: 0.24s; }
```

### 9.5 프로그레스 바 불확정 셔틀 (고급)

```css
.progress-fill--indeterminate {
  background: linear-gradient(
    90deg,
    #7C6FF5 0%,
    #A78BFA 40%,
    #7C6FF5 80%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
  width: 100% !important;
}
```

---

## 10. 반응형 디자인 (Responsive)

### 10.1 브레이크포인트

| 디바이스 | 범위 | 콘텐츠 너비 |
|----------|------|-------------|
| Desktop L | ≥ 1440px | 1200px |
| Desktop | 1024–1439px | 90% (max 1200px) |
| Tablet | 768–1023px | 90% |
| Mobile | < 768px | calc(100% - 32px) |

### 10.2 레이아웃 변화

```css
/* Tablet */
@media (max-width: 1023px) {
  .header { padding: 0 40px; }
  .hero { flex-direction: column; text-align: center; }
  .hero-title { font-size: 40px; }
  .result-card .preview { width: 100px; height: 66px; }
}

/* Mobile */
@media (max-width: 767px) {
  .header { padding: 0 16px; height: 52px; }
  .hero-title { font-size: 32px; letter-spacing: -1px; }
  .hero-subtitle { font-size: 16px; }
  .dropzone { padding: 32px 20px; }

  .result-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-card .preview {
    width: 100%;
    height: 160px;
  }

  .result-card .actions {
    width: 100%;
    display: flex;
    gap: 8px;
  }

  .result-card .actions .btn {
    flex: 1;
  }

  .comparison-slider {
    border-radius: 16px;
  }
}
```

---

## 11. 에러 & 토스트 UI

### 11.1 토스트 메시지

```css
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  padding: 14px 24px;
  border-radius: 99px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeInUp 0.3s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.toast--error {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
}

.toast--success {
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
}

.toast--info {
  background: #F5F3FF;
  color: #7C6FF5;
  border: 1px solid #DDD6FE;
}
```

### 11.2 드롭존 인라인 에러

```css
.dropzone-error {
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  background: #FEF2F2;
  color: #DC2626;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: fadeInUp 0.25s ease-out;
}
```

### 11.3 에러 메시지 목록

| 상황 | 메시지 |
|------|--------|
| 지원하지 않는 형식 | "지원하지 않는 파일 형식입니다. PNG, JPG, JPEG, WEBP 파일만 업로드 가능합니다." |
| 파일 크기 초과 | "파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요." |
| 파일 개수 초과 | "한 번에 최대 20개의 파일만 업로드할 수 있습니다." |
| 처리 실패 | "이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요." |
| 네트워크 에러 | "네트워크 연결을 확인해주세요." |

---

## 12. 접근성 (Accessibility)

### 12.1 색상 대비

| 조합 | 대비 비율 | 등급 |
|------|-----------|------|
| `#1F2232` on `#FAFAF7` | 15.2:1 | ✅ AAA |
| `#6B7280` on `#FFFFFF` | 5.0:1 | ✅ AA |
| `#7C6FF5` on `#FFFFFF` | 3.9:1 | ⚠️ Large text only |
| `#FFFFFF` on `#7C6FF5` | 3.9:1 | ⚠️ Large text / UI |

### 12.2 포커스 & 키보드

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

*:focus-visible {
  outline: 2px solid #7C6FF5;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 12.3 체크리스트

- [ ] 모든 인터랙티브 요소 `focus-visible` 아웃라인 적용
- [ ] 이미지에 의미있는 `alt` 텍스트
- [ ] 버튼에 `aria-label` (아이콘 버튼 필수)
- [ ] 처리 상태 변경 시 `aria-live="polite"` 알림
- [ ] Tab 순서 논리적 배치
- [ ] Escape로 모달 닫기
- [ ] 드롭존에 `role="button"` + `tabindex="0"` + Enter/Space 지원

---

## 13. CSS 변수 종합 (Custom Properties)

```css
:root {
  /* Colors — Base */
  --color-bg-base: #FAFAF7;
  --color-bg-card: #FFFFFF;
  --color-bg-dropzone: #F5F3FF;
  --color-bg-muted: #F3F4F6;

  /* Colors — Brand */
  --color-primary: #7C6FF5;
  --color-primary-hover: #6B5CE3;
  --color-primary-light: #F5F3FF;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;

  /* Colors — Text */
  --color-text-primary: #1F2232;
  --color-text-secondary: #6B7280;
  --color-text-accent: #7C6FF5;
  --color-text-success: #10B981;
  --color-text-inverse: #FFFFFF;

  /* Colors — Border */
  --color-border-subtle: #EEEDF2;
  --color-border-muted: #E2E8F0;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 99px;

  /* Shadows */
  --shadow-xs: 0 4px 12px rgba(31, 34, 50, 0.02);
  --shadow-sm: 0 8px 16px rgba(124, 111, 245, 0.05);
  --shadow-md: 0 16px 40px rgba(106, 96, 137, 0.06);
  --shadow-hover: 0 8px 24px rgba(124, 111, 245, 0.10);

  /* Typography */
  --font-display: 'Gabarito', sans-serif;
  --font-body: 'Outfit', 'Pretendard', sans-serif;

  /* Easing */
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Transitions */
  --transition-fast: 0.15s var(--ease-in-out);
  --transition-normal: 0.25s var(--ease-in-out);
  --transition-slow: 0.4s var(--ease-out);
}
```

---

## 14. 에셋 체크리스트

| 에셋 | 형식 | 크기 | 비고 |
|------|------|------|------|
| ✂️ 가위 이모지 (로고) | 텍스트 이모지 | — | 시스템 이모지 사용 |
| ⚡ 번개 이모지 (뱃지) | 텍스트 이모지 | — | 시스템 이모지 사용 |
| ✨ 스파클 이모지 (서브카피) | 텍스트 이모지 | — | 시스템 이모지 사용 |
| 클라우드 업로드 아이콘 | SVG | 40×40 | stroke 1.5px, `#7C6FF5` |
| 체크 아이콘 | SVG | 16×16 | `#10B981` |
| X 닫기 아이콘 | SVG | 16×16 | `#6B7280` |
| 다운로드 아이콘 | SVG | 16×16 | `#FFFFFF` (버튼 내) |
| 스피너 | CSS animation | 16×16 | `spin` 0.6s linear infinite |
| 슬라이더 핸들 | CSS/SVG | 40×40 | `#FFFFFF` + shadow |

---

*Generated from Figma design — BGCut Landing Page v2.0*
*Last updated: 2026-08-19*
