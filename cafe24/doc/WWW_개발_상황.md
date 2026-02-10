# www 개발 상황 — Cafe24 daeri 통합 문서

**진행 폴더**: `daeri/cafe24/`  
**계획서**: `../../docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`

이 문서 하나로 **www(Cafe24) 개발 상황**을 파악할 수 있습니다.

---

## 처음 파악용 (5분 요약)

| 항목 | 내용 |
|------|------|
| **무엇** | 대리운전 보험 사이트(dbins.kr). Next.js(daeri) → Cafe24(PHP 8.4 + 정적 HTML/JS) 전용 이전. |
| **기술** | 프론트: `www/index.html` + `www/css/style.css` + `www/js/*.js`. 백엔드: `www/api/*.php`, `www/lib/*.php`. DB: MariaDB 10.6, utf8mb4. |
| **주요 흐름** | ① 보험료 산출: GET premium-rates → 클라이언트에서 담보별 합산·10회 납(×1.02) 적용. ② 상담 신청: POST consultations. ③ 가입 신청: POST applications(민감정보 암호화). |
| **로컬 실행** | `cd daeri/cafe24/www && python3 -m http.server 8080` → 브라우저에서 `http://localhost:8080`. (API는 PHP 필요, 실제 연동은 서버 또는 로컬 PHP 환경에서.) |
| **핵심 파일** | 상황 요약·작업 로그·API·스키마·트러블슈팅: 본 문서. 로고/이미지: §12. 테스트 순서: §11. |
| **섹션 번호** | 1 개요, 2 작업 로그, 3–7 Phase/스키마, 8 트러블슈팅, 9 디렉터리 구조, 10 다음 할 일, 11 테스트 계획, 12 로고·이미지. |

---

## 개발 상황 요약

| 구분 | 상태 | 비고 |
|------|------|------|
| **Phase 0** 사전 점검 | ✅ 완료 | 환경·API·스키마 정리, dbins.kr 확인 |
| **Phase 1** DB 스키마 | ✅ 완료 | 테이블 6개, partners 1, premium_rates 18 |
| **config.php** 서버 설정 | ✅ 완료 | API 동작 기준 반영 |
| **Phase 2** PHP API | ✅ 완료 | 보험료·상담·가입 API (premium-rates, consultations, applications) |
| **Phase 2** 정적 페이지 | ✅ 완료 | 보험료 산출·가입 신청까지 구현·동작 |

**현재**: 보험료 산출·가입 신청 흐름까지 구현 완료. 추가 기능·개선 시 위 Phase별 상세 참고.

### API 테스트 결과 (2026-02-10)

| API | 결과 | 비고 |
|-----|------|------|
| GET /api/premium-rates.php | ✅ 200 | `{"ok":true,"data":[...]}`, 한글 키(daemul_3천 등) 정상 |
| POST /api/consultations.php | ✅ 200 | `{"ok":true,"id":"..."}` |
| POST /api/applications.php | ✅ 적용 완료 | config.php(필드 암호화 키 포함) 어제(2/10) 서버 반영 완료 |

---

## 1. 개요·환경

| 항목 | 내용 |
|------|------|
| **목적** | daeri(Next.js)를 Cafe24 전용(PHP 8.4 + 정적 HTML/JS)으로 이전 |
| **호스팅** | Cafe24 (dbins.kr), DOCUMENT_ROOT `/mr4989/www` |
| **백엔드** | PHP 8.4 (API: premium-rates, consultations, applications) |
| **DB** | MariaDB 10.6.17, DB/사용자 mr4989, utf8mb4 |
| **프론트** | 정적 HTML/JS + fetch → PHP API |

**진행 흐름**: Phase 0(사전 점검) → Phase 1(DB 스키마) → config.php → Phase 2(PHP API·페이지)

---

## 2. 작업 로그 (날짜별)

### 2026-02-09

- **Phase 0**: PHASE0_CHECKLIST 정리(환경·API·스키마 호환). PHP 8.4.10p1, MariaDB 10.6.17, dbins.kr, cURL·mysqli·PDO 확인.
- **Phase 1**: schema-mariadb-10.6.sql 작성(UUID 기본값 제거, 한글 컬럼 → ASCII). 적용 중 1064 오류 → ASCII 컬럼명으로 수정 후 재적용. 테이블 6개, partners 1행, premium_rates 18행 적용 완료.
- **서버 설정**: config.sample.php, env.sample, SERVER_CONFIG 문서화. config.php 권장(웹루트 상위).

### 2026-02-10

- **config.php** 서버 적용: DB·알리고·**field_encryption_key**(민감정보 암호화) 등 설정 완료.
- 보험료 산출·가입 신청 흐름 구현·동작. API 테스트(premium-rates, consultations 정상; applications는 config 반영 후 사용).
- **로고·UI**: 헤더 로고 크기 조정, box-shadow 추가. 로고 이미지 2023 버전 PNG(db-logo.png)로 교체. 원본 픽셀(111×32) 그대로 표시하도록 CSS 변경(흐림 방지). LOGO_GUIDE.md 삭제 후 본 문서 §12로 통합.
- **보험료 산출**: (1) 일시납 → 10회 납 적용(×1.02) 반영 — premium-data.js `PREMIUM_INSTALLMENT_FACTOR`, `calculateTotalPremium` 반환값에 적용. (2) 담보(대인·대물·자손·자차·렌트·법률) 변경 시 이미 산출된 상태면 자동 재산출 — premium-calculator.js `onCoverageChange`. (3) 기본 담보 — 대인 책임초과무한, 대물 1억, 자손 3천, 자차 3천, 렌트 해제·법률 체크. 렌더 시 select/체크박스에 기본값 반영.

---

*다음 작업 시 위처럼 날짜별로 이어서 기록*

---

## 3. Phase 0 — 사전 점검 요약

- **환경**: PHP 8.4, MariaDB 10.6, dbins.kr, /mr4989/www, cURL 사용 가능. phpinfo는 `info.php` → 확인 후 삭제.
- **API**: GET premium-rates(요율 조회), POST consultations(상담), POST applications(가입). 보험료 계산은 클라이언트(JS)에서 premium-rates 데이터로 산출(별도 calculate-premium API 없음). 파트너: 쿠키/쿼리 `?partner=code`.
- **스키마**: MariaDB 10.6은 `DEFAULT (UUID())` 미지원 → PHP에서 UUID 생성. 한글 컬럼명 → ASCII(`daemul_3k` 등). JSON 응답 시 `daemul_3천` 등으로 매핑.

---

## 4. Phase 1 — DB 스키마 적용

- **스키마 파일**: `../schema-mariadb-10.6.sql` (cafe24 루트)
- **적용**: `mysql -u mr4989 -p mr4989 < schema-mariadb-10.6.sql`
- **확인**: `SHOW TABLES;` → 6개. `SELECT COUNT(*) FROM partners;` → 1. `SELECT COUNT(*) FROM premium_rates;` → 18.
- **적용 후**: config.php 작성 → Phase 2 진행.

---

## 5. 서버 설정 (config.php)

- PHP는 .env 자동 로드 없음 → **config.php** 사용. 예시: `../config.sample.php`.
- **위치**: 웹루트 상위 권장 (`/home/mr4989/config.php`). www 안에 두면 `.htaccess`로 `config.php` 접근 차단.
- **내용**: `db`(host, database, username, password), `aligo`(SMS), `default_partner_code`. 사용 예: `$config = require_once __DIR__ . '/../config.php';`

---

## 6. Phase 2 — PHP API·테스트

- **대상**: `api/premium-rates.php`, `api/consultations.php`, `api/applications.php`, `lib/`(db, crypto, aligo, context).
- **premium-rates**: GET → `{"ok":true,"data":[...]}` (18행, 한글 키 `daemul_3천` 등).
- **consultations**: POST(name, phone, serviceType?, message?, consentPrivacy) → `{"ok":true,"id":"..."}`. DB consultations·message_logs 확인.
- **applications**: POST(insuranceType, name, phone, 주민번호, 주소, 은행·계좌, consentPrivacy 등) → `{"ok":true,"id":"..."}`. applications·application_secrets·message_logs 확인.
- **테스트**: `curl` GET/POST, `php premium-rates.php` 직접 실행, DB 쿼리로 저장 여부 확인.

---

## 7. 스키마 검증

- 테이블 6개: partners, consultations, applications, application_secrets, message_logs, premium_rates.
- partners 1행, premium_rates 18행(대리 6, 탁송 6, 확대탁송 6).
- CHARSET=utf8mb4, ENGINE=InnoDB. premium_rates 컬럼명 ASCII(daemul_3k 등).
- `SHOW CREATE TABLE`, `DESCRIBE premium_rates`, 인덱스·외래키 확인.

---

## 8. 트러블슈팅

**500 에러**
- `cd /home/mr4989/www/api && php premium-rates.php` 로 에러 메시지 확인.
- 자주 나는 오류: `db_query()` 없음(require 경로), DB 연결 실패(config), `require_once` failed(경로). lib는 `__DIR__ . '/../lib/db.php'` 또는 `/home/mr4989/lib/db.php`, config는 `/home/mr4989/config.php`.

**404**
- 누락 가능: images/db-logo.png, js/*.js, css/style.css, api/*.php.
- 해결: 디렉터리·파일 업로드, 권한 644, 브라우저에서 URL 직접 접근 테스트.

---

## 9. www 디렉터리 구조 (목표)

**서버 배포 시**: config.php·lib/ 는 www 상위(`/home/mr4989/`). **로컬 저장소**: `daeri/cafe24/www/` 안에 lib/ 있음(서버 업로드 시 config·lib 위치만 상위로 맞추면 됨).

```
/home/mr4989/
├── config.php
├── lib/
│   ├── db.php
│   ├── crypto.php
│   ├── aligo.php
│   └── context.php
└── www/
    ├── index.html
    ├── favicon.svg
    ├── images/
    │   └── db-logo.png
    ├── js/
    │   ├── premium-data.js, resident-number.js, premium-calculator.js
    │   ├── consultation.js, application.js, main.js
    ├── css/
    │   └── style.css
    └── api/
        ├── premium-rates.php
        ├── consultations.php
        └── applications.php
```

---

## 11. Chrome 리얼 테스트 계획 (직접 수행용)

아래 순서대로 브라우저에서 진행. F12 → Network(및 Console) 탭 열어 두고 확인.

### 1단계: 메인 페이지 로드
- **URL**: `http://dbins.kr/` (또는 `https://dbins.kr/`)
- **할 일**: 접속만.
- **확인**: 페이지가 깨지지 않고 로드되는지, Console에 404/500 없음, 필요한 js·css·이미지가 200으로 로드되는지.

### 2단계: 보험료 산출
- **할 일**: 보험 종목 선택(대리/탁송/확대탁송), 생년월일(또는 나이대) 입력, 담보 선택 후 보험료 계산/표시되는지 확인.
- **확인**: Network에서 `premium-rates.php` GET 200, 응답에 `ok: true`, `data` 있는지. 산출 버튼 클릭 후 계산 결과 금액이 화면에 맞게 나오는지(10회 납 ×1.02 적용).

### 3단계: 상담 신청
- **할 일**: 상담 신청 폼에 이름·전화번호·내용 입력, 개인정보 동의 체크 후 제출.
- **확인**: Network에서 `consultations.php` POST 200, 응답 `{"ok":true,"id":"..."}`. 제출 후 안내 메시지/이동이 있는지.

### 4단계: 가입 신청
- **할 일**: 가입 신청 폼에 보험 종목·이름·전화·주민번호·주소·은행·계좌번호·동의 등 필수 입력 후 제출.
- **확인**: Network에서 `applications.php` POST 200, 응답 `{"ok":true,"id":"..."}`. 제출 후 안내 메시지/이동이 있는지. (에러 시 응답 body에 error·message 확인.)

### 5단계: 정리
- Console에 빨간 에러 없음, Network에서 API 호출이 모두 200인지 최종 확인.
- (선택) DB에서 consultations / applications 마지막 행 확인.

---

## 12. 로고·이미지 가이드 (Cafe24 www)

Cafe24는 정적 HTML + PHP 환경이므로 `<img>` 로 로고를 넣습니다.

### 로고·이미지 경로

| 용도 | HTML에서 쓰는 경로 | 로컬 파일 위치 | 서버 업로드 위치 |
|------|---------------------|-----------------|-------------------|
| 헤더 로고 | `/images/db-logo.png` | `daeri/cafe24/www/images/db-logo.png` | `~/www/images/db-logo.png` |
| Favicon | `/favicon.svg` | `daeri/cafe24/www/favicon.svg` | `~/www/favicon.svg` |

- index.html 에서 `src="/images/db-logo.png"` 로 참조. DOCUMENT_ROOT가 `/home/mr4989/www` 이면 `http://dbins.kr/images/db-logo.png` → 서버 **`/home/mr4989/www/images/db-logo.png`** 를 찾음.

### 404 (Not Found) 나올 때

- **증상:** `GET http://dbins.kr/images/db-logo.png 404`
- **원인:** 서버에 `~/www/images/` 또는 `db-logo.png` 없음.
- **해결:**
  1. 로컬: `daeri/public/images/db-logo.png` 를 `daeri/cafe24/www/images/db-logo.png` 로 복사 (또는 공식 URL에서 다운로드).
  2. 서버: FTP/SFTP로 `www/images/db-logo.png` 업로드. `mkdir -p ~/www/images` 후 업로드.
  3. 확인: 브라우저에서 `http://dbins.kr/images/db-logo.png` 접속 → 이미지 표시되면 성공.

### Favicon

- **파일:** `daeri/cafe24/www/favicon.svg`. index.html 에 `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` 반영됨.
- 서버에는 `~/www/favicon.svg` 로 업로드.

### 로고 스펙

- **권장:** 투명 배경 PNG. 공식 참고: https://dbinsure.co.kr/images/new2023_logo.png
- 헤더 크기: CSS `.logo-img` (style.css). **현재** 원본 픽셀 그대로 표시 — `width: 111px; height: 32px` (확대 없이 선명도 유지). 고해상도용은 2배 이상 PNG 또는 SVG 권장.

### 전체 분위기와 로고 맞추기

- **증상:** 로고만 작게 보이고 흰 배경에 떠 있는 느낌.
- **대응:** (1) 로고 크기 조정 — `.logo-img` 상향 (2) 헤더 구분감 — `box-shadow` 등 (3) 로고 버전 — 컬러/단색 선택 (4) 맥락 문구 — "대리운전 보험" 등.
- **적용됨:** style.css 에 header `box-shadow`, `.logo-img` 크기 반영해 둠. 추가 조정은 위 "전체 분위기와 로고 맞추기" 대응 방향 참고.

---

## 10. 다음 할 일 (선택)

- 보험료 산출·가입 신청까지 구현 완료 상태. 추가 시:
  - SMS(알리고) 발송·로그 확인, 암호화 키·config 점검
  - 상담 신청(consultations) 연동·테스트
  - UI·문구·유효성 검사 등 개선
  - 로고: 고해상도(2x) PNG 또는 SVG 적용 시 `.logo-img` 크기 재조정

---

## 작업 정리 요약 (최근)

| 구분 | 내용 |
|------|------|
| **로고** | 111×32px 원본 크기 표시, 2023 버전 PNG 사용, §12 참고 |
| **보험료** | 일시납×1.02 = 10회 납 표시, 담보 변경 시 자동 재산출, 기본 담보(대인 책임초과무한·대물 1억·자차 3천) |
| **문서** | LOGO_GUIDE.md 삭제, 로고·이미지는 본 문서 §12 |

---

**마지막 업데이트**: 2026-02-10 (로고·보험료 산출 개선 반영)
