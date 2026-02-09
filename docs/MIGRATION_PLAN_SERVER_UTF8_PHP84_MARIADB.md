# daeri(개인 대리운전) 서버 환경 변경 마이그레이션 계획

**대상**: daeri(개인 대리운전) **단일 프로젝트**  
**호스팅**: **Cafe24 전용**  
**Cafe24 서버 환경**: **UTF-8** (PHP 8.4, MariaDB 10.x)  
**앱 배포**: **Vercel·EC2 사용하지 않음** → **Cafe24에서만** 서비스  
**진행 폴더**: **`daeri/cafe24/`** — 기존 Next.js 앱(daeri 루트)은 그대로 두고, 이 폴더에서 PHP + 정적 HTML/JS 작업 진행.  
**상태**: 계획 수립 → **사용자 동의 후 작업 진행**

---

## 1. 현재 daeri 구조

| 구분 | 현재 |
|------|------|
| **앱** | Next.js 16, React 19, TypeScript (Node.js 런타임) |
| **백엔드** | Next.js API Routes (PHP 없음) |
| **DB** | MySQL (스키마: `docs/mysql-schema.sql`) |
| **문자셋** | DB·연결 모두 **utf8mb4** |

Cafe24는 **Node.js 미지원**이므로, **현재 구조 그대로는 Cafe24에서 실행 불가**합니다.

---

## 2. 목표 환경 및 전환 방향

| 항목 | 목표 | 전환 내용 |
|------|------|------------|
| **호스팅** | Cafe24 전용 | Vercel·EC2 미사용. **전체 서비스를 Cafe24에서만** 운영 |
| **UTF-8** | 전 서버·DB·앱 UTF-8 통일 | DB utf8mb4, PHP·HTML UTF-8 명시 |
| **PHP 8.4** | Cafe24 제공 PHP 8.4 사용 | **백엔드를 PHP 8.4로 재구현** (Next.js API Routes 대체) |
| **MariaDB 10.x** | Cafe24 제공 DB 사용 | 스키마·데이터 이전, 문자셋 utf8mb4 |

**실질 작업**:

1. **DB**: MariaDB 10.x 전환, utf8mb4 유지  
2. **백엔드**: Next.js API Routes → **PHP 8.4 API(또는 PHP 페이지)** 로 재구현  
3. **프론트**: Next.js 페이지 → **정적 HTML/JS + PHP API** 로 전환 (화면은 HTML/JS, 데이터·제출은 PHP API 호출)  
4. **UTF-8**: DB·PHP·HTML·폼 전 구간 검증 및 필요 시 수정  

---

## 3. Phase 0: 사전 점검

### 3.1 Cafe24 환경 확인
- [ ] Cafe24 **PHP 8.4** 제공 여부 및 설정 방법
- [ ] Cafe24 **MariaDB 10.x** 제공 여부, 버전, 접속 정보(호스트, 포트, DB명, 사용자, 비밀번호)
- [ ] Cafe24 **문자셋** 기본값(UTF-8 권장) 및 DB charset 설정 가능 여부
- [ ] Cafe24 **도메인·경로** 구조 (예: `/api/`, 웹루트)

### 3.2 현재 daeri 기능·API 정리
- [ ] **API 목록**: `GET /api/premium-rates`, `POST /api/consultations`, `POST /api/applications` 등 요청/응답 스펙 정리
- [ ] **페이지 목록**: 보험료 산출, 상담신청, 가입신청, 파트너(쿠키) 등 화면·플로우 정리
- [ ] **현재 프론트 구조**: 페이지·컴포넌트·기술 스택 목록 정리 (아래 "6.0 현재 프론트 구조" 참고 후 체크리스트화)
- [ ] **외부 연동**: 알리고(SMS) 등 — PHP에서 호출 가능한지 확인

### 3.3 MariaDB 10.x·스키마 호환성
- [ ] `docs/mysql-schema.sql` 을 MariaDB 10.x에서 실행 가능 여부 (`UUID()`, `DEFAULT (UUID())`, `JSON` 타입 등)
- [ ] 필요 시 스키마 수정안 정리 (예: UUID 앱에서 생성 후 INSERT)

---

## 4. Phase 1: MariaDB 10.x 및 UTF-8 (DB)

### 4.1 DB 생성 및 스키마 (Cafe24 MariaDB 10.x)
- [x] Cafe24에서 DB 생성 (또는 제공되는 DB 사용), **문자셋 utf8mb4, 콜레이션 utf8mb4_unicode_ci** ✅ **완료** (2026-02-09)
- [x] `schema-mariadb-10.6.sql` 적용 (MariaDB 10.6 호환, 한글 컬럼명 → ASCII로 수정) ✅ **완료** (2026-02-09)
- [x] 기존 데이터가 있으면 dump → import (utf8mb4 유지) ✅ **완료** (partners 1행, premium_rates 18행)

### 4.2 연결 정보 확정
- [x] PHP에서 사용할 **DB 호스트, 포트, DB명, 사용자, 비밀번호** 확정 ✅ **완료** (`/home/mr4989/config.php`에 설정)
- [x] PHP PDO/MySQLi 연결 시 **charset=utf8mb4** 설정 ✅ **완료** (config.php에 charset: 'utf8mb4' 명시)

---

## 5. Phase 2: 백엔드 PHP 8.4 재구현

### 5.1 재구현 범위
| 기존 (Next.js API) | 전환 (PHP 8.4) | 상태 |
|--------------------|-----------------|------|
| `GET /api/premium-rates` | PHP: 보험료 조회 (DB 연동, JSON 응답) | ✅ 완료 |
| `POST /api/consultations` | PHP: 상담신청 저장, SMS(알리고) 호출 | ✅ 완료 |
| `POST /api/applications` | PHP: 가입신청 저장(비민감·민감 암호화), SMS 호출 | ✅ 완료 |
| `lib/mysql.ts` | PHP: PDO/MySQLi, utf8mb4 연결 | ✅ 완료 (`lib/db.php`) |
| `lib/crypto.ts` (AES-256-GCM) | PHP: OpenSSL 등 동일 방식 암복호 | ✅ 완료 (`lib/crypto.php`) |
| `lib/aligo.ts` | PHP: cURL 등으로 알리고 API 호출 | ✅ 완료 (`lib/aligo.php`) |

### 5.2 PHP 구조
- **디렉터리**: `/mr4989/www/api/` (premium-rates.php, consultations.php, applications.php) ✅
- **공통 라이브러리**: `/mr4989/www/lib/` (db.php, crypto.php, aligo.php, context.php) ✅
- **설정**: `/mr4989/config.php` (웹루트 상위) ✅
- **응답**: `Content-Type: application/json; charset=utf-8`, JSON 인코딩 시 UTF-8 ✅
- **폴더 구조 조정**: api와 lib 폴더를 www 폴더 안으로 이동 완료 (2026-02-10) ✅

### 5.3 PHP 8.4 호환
- [x] 제거/변경된 함수 사용 여부 없음 (each, create_function 등) ✅
- [x] 타입·널 처리 등 PHP 8.x 문법 준수 ✅
- [x] 알리고·암호화 등 확장(OpenSSL, cURL) Cafe24에서 사용 가능 ✅

### 5.4 테스트 결과
- [x] premium-rates.php: GET 요청 → JSON 응답 정상, 데이터 18행 ✅ (2026-02-09)
- [x] consultations.php: POST 요청 → DB 저장 성공 (3건 테스트) ✅ (2026-02-09)
- [x] applications.php: POST 요청 → DB 저장 성공, 암호화 확인 (1건 테스트) ✅ (2026-02-09)
- [x] 보험료 산출 기능: 정상 작동 확인 ✅ (2026-02-10)
- [x] 가입신청 API: 정상 작동 확인, 암호화 키 설정 완료 ✅ (2026-02-10)

---

## 6. Phase 3: 프론트엔드 전환 (Cafe24) — **정적 HTML/JS + PHP API**

### 6.0 현재 프론트 구조 (전환 검토용)

- **페이지**: **단일 페이지** (`app/page.tsx`) — 스크롤 시 아래 순서로 노출
- **섹션·컴포넌트**:
  | 순서 | 컴포넌트 | 역할 | API/기능 |
  |------|----------|------|----------|
  | 1 | Header | 상단 네비·로고 | — |
  | 2 | HeroSection | 메인 비주얼·카피 | — |
  | 3 | PremiumCalculator | 보험료 산출 | GET /api/premium-rates, 나이대·담보 선택, 계산 로직 |
  | 4 | ProductCards | 상품 카드 | — |
  | 5 | ServiceTypeSection | 서비스 유형 안내 | — |
  | 6 | ApplicationForm | 가입신청 폼 | POST /api/applications, 폼 유효성·주민번호 검증 |
  | 7 | ConsultationCTA | 상담 신청 CTA | POST /api/consultations 연동 가능 |
  | 8 | Footer | 하단 | — |
- **기술 스택**: Next.js 16, React 19, TypeScript, **Tailwind CSS**, **Radix UI**(shadcn/ui 스타일), **lucide-react** 아이콘, **sonner** 토스트, **@hookform/resolvers**
- **클라이언트 로직**: 보험료 계산(나이대별·담보별 합산), 주민번호 유효성 검사(`lib/resident-number`), 폼 제출·에러·로딩 상태, 파트너 쿠키(쿼리 `?partner=`)

→ **정적 HTML/JS 전환 시** 위 섹션·로직·스타일을 HTML/CSS/JS로 재구현하거나 단순화할 범위를 사전에 정해야 함.

### 6.1 전환 방식 (채택)
- **정적 HTML/JS + PHP API** 사용.
- 화면: **정적 HTML + JavaScript** (Cafe24 웹루트에 업로드).
- 데이터·제출: **fetch** 로 **PHP API** (`api/*.php`) 호출 (JSON 요청/응답).

### 6.2 페이지별 전환
- [x] **보험료 산출**: 정적 HTML/JS 페이지 → 산출 시 `GET api/premium-rates.php` 호출 후 화면에 표시 ✅
- [x] **상담신청**: 정적 HTML 폼 → JS에서 `POST api/consultations.php` 로 전송 (JSON) ✅
- [x] **가입신청**: 정적 HTML 폼 → JS에서 `POST api/applications.php` 로 전송 ✅
- [ ] **파트너(멀티테넌시)**: `?partner=kakao` 진입 시 쿠키 설정이 필요하면 **PHP 진입 페이지 1개** (예: `partner.php?p=kakao` → 쿠키 설정 후 정적 페이지로 리다이렉트) 또는 JS에서 쿠키 설정 후 라우팅

### 6.3 UTF-8 (프론트)
- [x] 모든 **정적 HTML** 에 `<meta charset="UTF-8">` 명시 ✅
- [x] HTML·JS 파일 저장 시 **UTF-8** 인코딩 ✅
- [x] fetch 요청/응답은 UTF-8 (PHP API는 `Content-Type: application/json; charset=utf-8` 응답) ✅
- [x] 폼이 HTML form submit이면 `accept-charset="UTF-8"` 명시; **JS fetch 사용 시** body를 UTF-8로 전송 ✅

### 6.5 Phase 3 완료 (2026-02-10)
- [x] **index.html**: 기본 HTML 구조 (Header, Hero, Footer 포함) ✅
- [x] **premium-calculator.js**: 보험료 산출기 로직 (나이대별 계산, 담보 선택, 테이블/카드 표시) ✅
- [x] **consultation.js**: 상담신청 폼 (전화번호 포맷팅, 유효성 검사, API 연동) ✅
- [x] **application.js**: 가입신청 폼 (주민번호 검증, 보험료 자동 계산, 계약자 정보, 계좌/카드) ✅
- [x] **premium-data.js**: 보험료 데이터 fetch 및 계산 함수 ✅
- [x] **resident-number.js**: 주민번호 유효성 검사 및 나이대 계산 ✅
- [x] **main.js**: 메인 JavaScript (모바일 메뉴, 부드러운 스크롤) ✅
- [x] **스타일링**: Tailwind CDN 제거, 순수 CSS (style.css) 사용 ✅
- [x] **UI/UX**: 기본 레이아웃 및 핵심 기능 구현 완료 ✅
- [x] **디버깅 및 수정**: 함수 이름 충돌 해결 (calculatePremium → calculatePremiumForTable) ✅
- [x] **디버깅 코드 제거**: 운영 환경에 적합하도록 콘솔 로그 제거 완료 ✅

### 6.4 프론트 개발 검토 항목

전환 시 **프론트 개발**에서 반드시 검토·결정할 항목입니다.

| 구분 | 검토 항목 | 비고 |
|------|-----------|------|
| **UI/UX 동등성** | 현재 화면(헤더·히어로·보험료 산출·상품 카드·가입 폼·상담 CTA·푸터)과 동일한 레이아웃·흐름을 유지할지, 단순화할지 결정 | 동일 유지 시 작업량·일정 재산정 |
| **스타일링** | Tailwind → 정적 환경에서 **Tailwind 빌드 산출물(CSS)** 사용 vs **순수 CSS** 재작성 vs **Tailwind CDN** | Cafe24 업로드 제한·캐시 고려 |
| **폰트·아이콘** | Geist 폰트, lucide 아이콘 → 웹폰트/CDN 또는 시스템 폰트·이미지/SVG로 대체 | 로딩·저작권 확인 |
| **클라이언트 로직** | 보험료 계산(나이대·담보별 합산), 주민번호 유효성 검사 → **JS로 그대로 이식** (로직 문서화 후 구현) | `lib/premium-data-client`, `lib/resident-number` 참고 |
| **폼 유효성·에러·로딩** | 필수값, 형식(휴대폰·주민번호), 동의 체크 — **JS 검증** + API 오류 시 **메시지 표시** (토스트 대신 alert 또는 인라인 메시지) | sonner 대체 방식 결정 |
| **반응형·접근성** | 모바일/데스크톱 대응, 포커스·라벨·aria 등 — 정적 HTML/JS에서 유지할 수준 정의 | 미대응 시 범위 명시 |
| **메타·SEO** | title, description, og 태그 — 정적 HTML `<head>` 또는 PHP 진입 페이지에서 출력 | layout.tsx metadata 이식 |
| **로고·이미지** | icon, apple-icon, 로고 이미지 — 경로·파일 업로드 위치 (Cafe24 웹루트 기준) | LOGO_GUIDE.md 참고 |

- **Phase 0 또는 Phase 3 시작 전** 위 항목을 결정해 두면, 정적 HTML/JS 구현 범위와 일정이 명확해집니다.

---

## 7. Phase 4: UTF-8 검증 (전 구간)

- [ ] DB: `SHOW CREATE DATABASE/TABLE` → utf8mb4 확인
- [ ] PHP–DB: 한글 입력/저장/조회 정상 여부
- [ ] PHP API: JSON 응답 한글 깨짐 없음
- [ ] 정적 HTML/JS 페이지: 화면 한글·특수문자 정상 표시
- [ ] 폼 제출: POST 데이터 UTF-8로 수신 확인

---

## 8. Phase 5: 통합 테스트

- [x] 보험료 산출: DB 데이터 정상 노출, 산출 결과 일치 ✅ (2026-02-10)
- [ ] 상담신청: 저장, SMS 발송, DB/로그 확인
- [x] 가입신청: 비민감·민감 저장, 암호화, SMS 발송 ✅ (2026-02-10)
- [ ] 파트너(쿠키) 동작
- [x] 에러 로그 없음 (PHP, DB, 알리고) ✅ (2026-02-10)

---

## 9. Phase 6: 전환 및 모니터링

- **전환**: Cafe24에 PHP·DB 반영 완료 후 도메인/경로 전환
- **모니터링**: 에러 로그, 접속·API 응답, SMS 발송 여부
- **롤백**: 기존 Next.js 서비스가 있다면 URL/트래픽만 되돌리기; **Cafe24 전용이면** 롤백은 DB/파일 백업 복구 기준으로 사전 정의

---

## 10. 일정(안)

| Phase | 내용 | 예상 |
|-------|------|------|
| 0 | 사전 점검 (Cafe24 환경, API·페이지 정리, 스키마 호환) | 1~2일 |
| 1 | MariaDB 10.x DB 생성·스키마·데이터·UTF-8 | 1~2일 |
| 2 | **백엔드 PHP 8.4 재구현** (API 3종 + DB/암호화/알리고) | 3~5일 |
| 3 | **프론트 전환** (정적 HTML/JS + PHP API) | 3~5일 |
| 4 | UTF-8 검증 (DB·PHP·HTML·폼) | 0.5~1일 |
| 5 | 통합 테스트 | 1~2일 |
| 6 | 전환·모니터링 | 1일 + 사후 확인 |

---

## 11. 요약

- **호스팅**: **Cafe24 전용**. Vercel·EC2는 사용하지 않음.
- **전환**: Next.js 앱을 **Cafe24에서 동작하도록** **DB(MariaDB 10.x)** + **백엔드(PHP 8.4 재구현)** + **프론트(정적 HTML/JS + PHP API)** 로 이전.
- **UTF-8**: DB·PHP·HTML·폼 전 구간 utf8mb4/UTF-8 적용·검증.
- **사용자 동의 후** Phase 0부터 순서대로 진행하며, Phase 완료 시마다 공유 후 다음 단계 진행.

**동의 시**: "계획 동의합니다" 또는 "Phase 0부터 진행해 주세요" 로 회신해 주시면, 사전 점검부터 구체화·작업하겠습니다.

---

**작성일**: 2026-02-02  
**최종 수정**: 2026-02-10 (폴더 구조 조정, 보험료 산출/가입신청 기능 완료, 디버깅 코드 제거)  
**문서 위치**: `daeri/docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`

---

## 12. 작업 이력

### 2026-02-11 예정 작업

#### Phase 4: UTF-8 검증 (전 구간)
- [ ] **DB 문자셋 확인**
  - `SHOW CREATE DATABASE mr4989;` 실행하여 utf8mb4 확인
  - `SHOW CREATE TABLE` 각 테이블별 utf8mb4 확인
- [ ] **PHP–DB 한글 처리 테스트**
  - 한글 이름, 주소 등 입력 → 저장 → 조회 테스트
  - 특수문자(이모지 등) 처리 확인
- [ ] **PHP API JSON 응답 확인**
  - API 응답에서 한글이 깨지지 않는지 확인
  - `Content-Type: application/json; charset=utf-8` 헤더 확인
- [ ] **정적 HTML/JS 페이지 확인**
  - 화면에 한글, 특수문자 정상 표시 확인
  - `<meta charset="UTF-8">` 태그 확인
- [ ] **폼 제출 UTF-8 확인**
  - POST 데이터가 UTF-8로 전송되는지 확인
  - 서버에서 UTF-8로 수신되는지 확인

#### Phase 5: 통합 테스트 (나머지)
- [ ] **상담신청 기능 테스트**
  - 상담신청 폼 제출 테스트
  - DB 저장 확인 (`consultations` 테이블)
  - SMS 발송 확인 (사용자, 담당자)
  - `message_logs` 테이블 로그 확인
- [ ] **파트너 쿠키 기능**
  - `?partner=kakao` 진입 시 쿠키 설정 확인
  - 파트너별 데이터 분리 저장 확인
  - 필요 시 `partner.php` 진입 페이지 구현

#### 추가 확인 사항
- [ ] 전체 기능 종합 테스트 (보험료 산출, 상담신청, 가입신청)
- [ ] 에러 케이스 테스트 (유효성 검사, 필수값 누락 등)
- [ ] 모바일/데스크톱 반응형 확인

---

### 2026-02-10 완료 작업

### 폴더 구조 조정
- `cafe24/api/` → `cafe24/www/api/`로 이동
- `cafe24/lib/` → `cafe24/www/lib/`로 이동
- 모든 경로 참조 업데이트 완료

### 보험료 산출 기능 수정
- 함수 이름 충돌 해결: `calculatePremium()` → `calculatePremiumForTable()` (application.js의 async 함수와 충돌 방지)
- 보험료 데이터 로딩 및 계산 로직 정상 작동 확인

### 가입신청 API 수정
- 암호화 키 설정 문제 해결: `config.php`에 `field_encryption_key` 추가
- 가입신청 API 정상 작동 확인 (응답: 200 OK)

### 코드 정리
- 디버깅용 console.log 제거 (premium-calculator.js, premium-data.js, application.js)
- 에러 메시지 단순화 (applications.php, crypto.php)
- 운영 환경에 적합하도록 코드 정리 완료
