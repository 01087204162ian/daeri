# www 개발 상황 — Cafe24 daeri 통합 문서

**진행 폴더**: `daeri/cafe24/`  
**계획서**: `../../docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`

이 문서 하나로 **www(Cafe24) 개발 상황**을 파악할 수 있습니다.

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
| POST /api/applications.php | ⚠️ 오류 | `field_encryption_key` 없음 → config.php에 추가 필요 |

**가입 신청(applications) 정상화**: 서버 config.php에 `field_encryption_key`(base64 32바이트) 설정. 생성 예: `openssl rand -base64 32`

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

- (이 날짜 작업 있으면 여기 기록)

---

*다음 작업 시 위처럼 날짜별로 이어서 기록*

---

## 3. Phase 0 — 사전 점검 요약

- **환경**: PHP 8.4, MariaDB 10.6, dbins.kr, /mr4989/www, cURL 사용 가능. phpinfo는 `info.php` → 확인 후 삭제.
- **API 4개**: GET premium-rates, POST calculate-premium, POST consultations, POST applications. 파트너: 쿠키/쿼리 `?partner=code`.
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

## 10. 다음 할 일 (선택)

- 보험료 산출·가입 신청까지 구현 완료 상태. 추가 시:
  - SMS(알리고) 발송·로그 확인, 암호화 키·config 점검
  - 상담 신청(consultations) 연동·테스트
  - UI·문구·유효성 검사 등 개선

---

**마지막 업데이트**: 2026-02-10 (보험료 산출·가입 신청 완료 반영)
