# 대리운전 개인보험 시스템

대리운전 개인보험 청약 및 관리 시스템입니다.

## 🚀 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI 기반)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
daeri/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── application-form.tsx    # 청약서 작성 폼
│   ├── premium-calculator.tsx  # 보험료 계산기
│   ├── product-cards.tsx       # 상품 카드
│   ├── service-type-section.tsx # 서비스 유형 섹션
│   ├── hero-section.tsx        # 히어로 섹션
│   ├── consultation-cta.tsx   # 상담 CTA
│   ├── header.tsx              # 헤더
│   └── footer.tsx              # 푸터
├── docs/                  # 문서
│   └── work-log.md        # 작업일지
├── hooks/                # Custom Hooks
├── lib/                  # 유틸리티 함수
└── public/               # 정적 파일
```

## 📚 문서

- [작업일지](./docs/work-log.md) - 프로젝트 개발 작업 내역

## 🎯 주요 기능

### 1. 보험료 계산기 (Premium Calculator)
- 연령대별 보험료 계산
- 보장금액별 보험료 비교
- 실시간 보험료 조회

### 2. 청약서 작성 (Application Form)
- 개인정보 입력
- 보험료 정보 입력
- 계약자 정보 입력
- 결제 정보 입력
- 폼 유효성 검증

### 3. 상품 소개
- 상품 카드 표시
- 서비스 유형 안내
- 보장 내용 설명

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 20.9.0 이상 (Next.js 16 요구사항)
- npm (기본) 또는 pnpm (권장)

### Node.js 버전 확인 및 전환

현재 Node.js 버전을 확인하세요:

```bash
node --version
```

**Node.js 20이 필요합니다.** nvm을 사용하는 경우:

```bash
# Node.js 20 LTS 설치 (아직 설치되지 않은 경우)
nvm install 20

# Node.js 20으로 전환
nvm use 20

# 또는 특정 버전 사용
nvm use 20.19.6

# 기본 버전으로 설정 (선택사항)
nvm alias default 20
```

### pnpm 설치 (선택사항)

pnpm을 사용하려면 다음 명령어로 설치하세요:

```bash
# npm을 통해 pnpm 설치
npm install -g pnpm

# 또는 Homebrew (macOS)
brew install pnpm
```

### 설치 및 실행

**npm 사용 시:**
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 실행
npm run lint
```

**pnpm 사용 시:**
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 실행
pnpm lint
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📦 주요 패키지

- `next`: Next.js 프레임워크
- `react`, `react-dom`: React 라이브러리
- `@radix-ui/*`: UI 컴포넌트 프리미티브
- `tailwindcss`: CSS 프레임워크
- `react-hook-form`: 폼 관리
- `zod`: 스키마 검증
- `lucide-react`: 아이콘 라이브러리

## 🎨 UI 컴포넌트

이 프로젝트는 [shadcn/ui](https://ui.shadcn.com/)를 사용합니다. 컴포넌트는 `components/ui/` 디렉토리에 있습니다.

새로운 UI 컴포넌트를 추가하려면:
```bash
npx shadcn@latest add [component-name]
```

## 🔧 환경 변수

`.env.local` 파일을 생성하여 환경 변수를 설정하세요:

```env
# 예시 (실제 값은 프로젝트에 맞게 설정)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📝 개발 가이드

### 컴포넌트 작성 규칙
- 컴포넌트는 `components/` 디렉토리에 작성
- UI 컴포넌트는 `components/ui/` 디렉토리 사용
- TypeScript 타입 정의 필수
- Props 인터페이스 명시

### 스타일링 규칙
- Tailwind CSS 사용
- 반응형 디자인 고려 (mobile-first)
- 다크 모드 지원 (next-themes)

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 푸시
2. Vercel에서 프로젝트 연결
3. 자동 배포

### 기타 플랫폼
- Netlify
- AWS Amplify
- 기타 Node.js 호스팅 서비스

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 👥 기여자

- 개발팀

---

**최종 업데이트**: 2026년 1월 24일
