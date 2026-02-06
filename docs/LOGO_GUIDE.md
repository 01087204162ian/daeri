# DB손보 로고 가이드

## 현재 적용 상태

- **로고 파일**: `/public/images/db-logo.svg` (SVG 버전)
- **컴포넌트**: `components/header.tsx`
- **최적화**: Next.js Image 컴포넌트 사용
- **크기**: 모바일 h-9, 태블릿 h-10, 데스크톱 h-12
- **장점**: 확대 시 깨짐 없음, 파일 크기 작음, 다크 모드 대응 용이

## 적용 방법

### 1. Next.js Image 컴포넌트 사용 (현재 적용됨)

**장점:**
- 자동 이미지 최적화 (WebP 변환, 리사이징)
- 지연 로딩 (Lazy Loading)
- 반응형 이미지 자동 생성
- 성능 향상 및 대역폭 절감

**현재 구현:**
```tsx
import Image from "next/image"

<Image
  src="/images/new2023_logo (1).png"
  alt="DB손해보험"
  width={140}
  height={56}
  className="h-9 sm:h-10 md:h-12 w-auto object-contain"
  priority
  quality={100}
  style={{
    imageRendering: 'crisp-edges',
    filter: 'contrast(1.1) saturate(1.05)',
  }}
/>
```

### 2. 외부 URL 사용 (선택사항)

**방법:**
1. `next.config.mjs`에 외부 도메인 추가:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'dbinsure.co.kr',
      pathname: '/images/**',
    },
  ],
}
```

2. 헤더 컴포넌트에서 외부 URL 사용:
```tsx
<Image
  src="https://dbinsure.co.kr/images/new2023_logo.png"
  alt="DB손해보험"
  width={140}
  height={56}
  className="h-9 sm:h-10 md:h-12 w-auto"
  priority
/>
```

### 3. 투명 배경 로고 사용 (권장)

**장점:**
- 모든 배경에서 잘 보임
- 다크/라이트 모드 모두 대응 가능

**준비 방법:**
1. DB손보 웹사이트에서 투명 배경 PNG 다운로드
2. 또는 이미지 편집 도구(remove.bg 등)로 배경 제거
3. `/public/images/db-logo.png`에 저장
4. 헤더 컴포넌트에서 경로 변경

### 4. SVG 로고 사용 (최고 품질)

**장점:**
- 확대 시 깨짐 없음 (벡터 그래픽)
- 파일 크기 작음
- CSS로 색상 변경 가능
- 다크 모드 대응 용이

**구현:**
```tsx
<Image
  src="/images/db-logo.svg"
  alt="DB손해보험"
  width={140}
  height={56}
  className="h-9 sm:h-10 md:h-12 w-auto"
  priority
/>
```

## 선명도 개선

현재 적용된 최적화:
- `quality={100}`: 최고 품질 렌더링
- `imageRendering: 'crisp-edges'`: 선명한 가장자리 렌더링
- `filter: 'contrast(1.1) saturate(1.05)'`: 대비와 채도 증가

## 크기 조정

현재 크기:
- 모바일: `h-9` (36px)
- 태블릿: `h-10` (40px)
- 데스크톱: `h-12` (48px)

크기 변경 시 `width`와 `height` 속성도 함께 조정하세요.

## 호버 효과

현재 적용된 효과:
- `hover:scale-105`: 마우스 오버 시 약간 확대
- `active:scale-95`: 클릭 시 약간 축소

## 다크 모드 대응

투명 배경 로고는 다크 모드에서도 잘 보이지만, 필요시:

```tsx
<Image
  src="/images/db-logo.png"
  className="h-9 sm:h-10 md:h-12 w-auto dark:invert"
  ...
/>
```

또는 다크 모드용 별도 로고 사용:

```tsx
{/* 라이트 모드 */}
<Image
  src="/images/db-logo.png"
  className="h-9 sm:h-10 md:h-12 w-auto dark:hidden"
  ...
/>

{/* 다크 모드 */}
<Image
  src="/images/db-logo-white.png"
  className="h-9 sm:h-10 md:h-12 w-auto hidden dark:block"
  ...
/>
```

## 공식 로고 URL

- **이미지 URL**: https://dbinsure.co.kr/images/new2023_logo.png
- **확인된 정보**: 2023년 버전의 공식 로고 (PNG 형식)

## 참고사항

- 로고는 헤더에 `priority` 속성으로 우선 로딩됩니다
- Next.js가 자동으로 WebP 변환 및 리사이징을 수행합니다
- 고해상도 디스플레이(Retina)에서도 선명하게 표시됩니다
