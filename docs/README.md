# daeri (개인대리운전 보험) – 운영/개발 메모

## 1) 멀티테넌시(화이트라벨)
- **방식**: 서브도메인 기반
  - 예: `kakao.daeri-site.com`, `tmap.daeri-site.com`
- **테넌트 매핑**: 요청 `Host`에서 서브도메인을 추출해 `partners.code`로 매핑
  - 구현: `lib/partner.ts`, `app/api/_lib/context.ts`

## 2) Supabase(DB)
- **스키마**: `docs/supabase-schema.sql`
- **필수 테이블**
  - `partners`
  - `consultations`
  - `applications`
  - `application_secrets` (민감정보 암호문 저장)
  - `message_logs`

## 3) 민감정보 저장(주민번호/계좌/카드)
- **저장 전제**: PG 연동 없이 “접수”만 받고, 결제는 당사 직원이 보험사 전산에서 처리
- **저장 방식**: 서버에서 필드 단위 암호화(AES-256-GCM) 후 DB 저장
  - 구현: `lib/crypto.ts`
  - 키: `FIELD_ENCRYPTION_KEY` (32바이트 base64)

## 4) 알림(알리고)
웹 문서 확인 권한이 없는 환경에서도 동작하도록, **알리고 엔드포인트/파라미터는 환경변수로 분리**합니다.

- 문자(SMS): `ALIGO_SMS_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendSms()`
- 카카오(알림톡/친구톡): `ALIGO_KAKAO_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendKakao()`

> 운영 계정 스펙에 따라 파라미터명이 다를 수 있어, 필요 시 `lib/aligo.ts`에서 매핑을 조정합니다.

## 5) API 엔드포인트(Next.js)
- `POST /api/consultations`
  - 저장: `consultations`
  - 알림: `OPERATOR_PHONE`로 SMS 발송(설정 시)
  - 로그: `message_logs`
- `POST /api/applications`
  - 저장: `applications` + `application_secrets`
  - 알림/로그 동일

## 6) 환경변수(Vercel)
### Supabase
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 암호화
- `FIELD_ENCRYPTION_KEY` (base64 32 bytes)

### 알리고
- `ALIGO_USER_ID`
- `ALIGO_API_KEY`
- `ALIGO_SENDER` (발신번호)
- `ALIGO_SMS_URL`
- `ALIGO_KAKAO_URL`

### 운영 수신처
- `OPERATOR_PHONE` (담당자 수신번호)

## 7) 한 장 요약 체크리스트 (운영/배포)
### A. Supabase 준비
- [ ] Supabase 프로젝트 생성
- [ ] SQL Editor에서 `docs/supabase-schema.sql` 실행
- [ ] `partners`에 테넌트 추가
  - [ ] `default`
  - [ ] `kakao`
  - [ ] `tmap`
  - [ ] 기타 파트너(`cnmp`, `logi` 등)

### B. Vercel 환경변수 설정
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `FIELD_ENCRYPTION_KEY` (base64 32 bytes)
- [ ] `ALIGO_USER_ID`
- [ ] `ALIGO_API_KEY`
- [ ] `ALIGO_SENDER`
- [ ] `ALIGO_SMS_URL`
- [ ] `ALIGO_KAKAO_URL` (카톡 발송 사용 시)
- [ ] `OPERATOR_PHONE`

### C. 도메인/테넌트 라우팅
- [ ] Vercel 프로젝트에 `daeri-site.com` 도메인 연결
- [ ] 필요한 서브도메인 추가
  - [ ] `kakao.daeri-site.com`
  - [ ] `tmap.daeri-site.com`
  - [ ] 파트너 추가 시: `파트너코드.daeri-site.com` ↔ `partners.code=파트너코드`

### D. 기능 동작 확인(최소)
- [ ] `kakao.daeri-site.com`에서 **상담신청** 제출 → `consultations` row 생성 확인
- [ ] `kakao.daeri-site.com`에서 **가입신청** 제출 → `applications` + `application_secrets` row 생성 확인
- [ ] `OPERATOR_PHONE` 설정 시 문자 발송 확인 + `message_logs` 기록 확인

### E. 운영 메모
- [ ] 민감정보는 `application_secrets`에 **암호문으로만** 저장됨(복호화는 서버에서만 가능)
- [ ] 카드 결제는 PG 없이 “접수”만 받고, **보험사 전산에서 당사 직원이 결제 처리**

## 8) 로컬 테스트 방법
### A. Supabase 준비
- [ ] Supabase SQL Editor에서 `docs/supabase-schema.sql` 실행
- [ ] `partners`에 최소 `default` 존재 확인 (seed 포함)
- [ ] 로컬에서 서브도메인으로 테스트할 파트너가 있으면 `partners.code`로 추가
  - 예: `kakao`, `tmap`

### B. 로컬 환경변수 준비
- `daeri/.env.local` 생성 후 아래 값 설정
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `FIELD_ENCRYPTION_KEY` (base64 32 bytes)
  - [ ] `ALIGO_USER_ID`
  - [ ] `ALIGO_API_KEY`
  - [ ] `ALIGO_SENDER`
  - [ ] `ALIGO_SMS_URL`
  - [ ] `ALIGO_KAKAO_URL` (선택)
  - [ ] `OPERATOR_PHONE` (선택: 설정 시 발송 시도)

### C. 개발 서버 실행
- `daeri` 폴더에서 실행
  - [ ] `npm install`
  - [ ] `npm run dev`
  - 기본 접속: `http://localhost:3000`

### D. 로컬에서 서브도메인(테넌트) 테스트(선택)
> 로컬에서는 `Host=localhost`면 기본적으로 `default` 테넌트로 매핑됩니다.
> 서브도메인별로 테스트하려면 hosts 파일을 사용합니다.

- Windows hosts 파일: `C:\Windows\System32\drivers\etc\hosts`
  - 예시:
    - `127.0.0.1 kakao.daeri-site.com`
    - `127.0.0.1 tmap.daeri-site.com`

- 접속 예시:
  - `http://kakao.daeri-site.com:3000`
  - `http://tmap.daeri-site.com:3000`

### E. 제출 동작 확인 포인트
- [ ] 상담신청 제출 → Supabase `consultations`에 row 생성
- [ ] 가입신청 제출 → Supabase `applications` + `application_secrets`에 row 생성
- [ ] `OPERATOR_PHONE` 설정 시 → 문자 발송 시도 + `message_logs` 기록 확인

## 9) 빌드 방법
### 프로덕션 빌드
```bash
cd daeri
npm install
npm run build
```

### 빌드 결과물 실행
```bash
npm run start
```
- 기본 접속: `http://localhost:3000`
- 프로덕션 모드로 실행되며, 최적화된 빌드 결과물을 사용합니다.

### 빌드 주의사항
- 빌드 전에 환경변수(`.env.local` 또는 Vercel 환경변수)가 올바르게 설정되어 있는지 확인
- 빌드 시 Next.js가 자동으로 최적화 및 정적 페이지 생성 수행
- 빌드 경고가 발생할 수 있으나(예: workspace root 관련), 기능에는 영향 없음

## 10) 개발 이력
### 2026-01-26 - 반응형 디자인 개선 및 UI/UX 고도화
#### 반응형 디자인 개선
- **hero-section.tsx**: 보상하는 내용 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일(`lg` 미만): 각 보상 항목을 개별 카드로 표시
  - 데스크톱(`lg` 이상): 기존 테이블 형식 유지
  - 텍스트 잘림 문제 해결 및 가독성 향상

- **product-cards.tsx**: 담보 및 보상한도 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일: 각 보상 항목을 카드 형식으로 표시
  - 데스크톱: 기존 테이블 형식 유지
  - "자기차량" 서브 항목을 들여쓰기와 왼쪽 테두리로 구분

- **premium-calculator.tsx**: 보험료 산출 결과 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일: 각 연령대를 카드로 표시, 서비스 유형별 보험료를 세로로 나열
  - 데스크톱: 기존 테이블 형식 유지
  - 가로 스크롤 제거 및 모든 정보 표시

#### 가입신청 폼 개선
- **application-form.tsx**: 레이블과 입력상자를 한 행에 표시
  - 모든 화면 크기에서 레이블과 입력상자가 가로로 배치되도록 변경
  - `flex-row` 레이아웃 적용

- **입력상자 스타일 고도화**
  - 배경색: `bg-background` 적용
  - 테두리: `border-border/60`으로 부드러운 색상
  - 그림자: `shadow-sm` 적용
  - Hover 효과: `hover:border-border hover:shadow-md`
  - Focus 효과: `focus-visible:border-primary focus-visible:shadow-md`
  - 전환 애니메이션: `transition-all duration-200`

- **폰트 크기 통일**
  - Input 컴포넌트 기본 텍스트 크기를 `text-sm`으로 통일
  - 레이블(`text-sm`)과 플레이스홀더(`text-sm`) 폰트 크기 일치
  - 모든 화면 크기에서 일관된 폰트 크기 유지

#### 수정된 파일
- `components/hero-section.tsx`
- `components/product-cards.tsx`
- `components/premium-calculator.tsx`
- `components/application-form.tsx`
- `components/ui/input.tsx`

