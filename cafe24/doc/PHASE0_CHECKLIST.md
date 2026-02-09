# Phase 0: 사전 점검 체크리스트

**작업 폴더**: `daeri/cafe24/`  
**마이그레이션 계획**: `../../docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`

---

## 3.1 Cafe24 환경 확인 (사용자·관리자 입력)

Cafe24 콘솔 또는 고객센터로 확인 후 체크·기록.

- [x] **PHP 8.4** — 확인됨: **8.4.10p1** (Cafe24)
- [x] **MariaDB 10.x** — 확인됨: **10.6.17-MariaDB** (DB명·사용자: mr4989, 웹루트: ~/www)
- [x] **DB 접속 정보**: 호스트 localhost(또는 소켓), 포트 3306, DB명 mr4989, 사용자 mr4989, 비밀번호 (별도 보관)
- [x] **문자셋**: PHP default_charset **UTF-8**. DB는 MariaDB 10.6 + utf8mb4 스키마 사용 시 호환.
- [x] **도메인·경로**: **dbins.kr**, DOCUMENT_ROOT **/mr4989/www** (REQUEST_URI 기준 `/api/...` 사용 가능)
- [x] **알리고(SMS)** 등 외부 API: **cURL enabled** (SSL, HTTPS 지원) → PHP에서 cURL로 호출 가능. (allow_url_fopen Off 이므로 file_get_contents 대신 cURL 사용)

### 서버에서 PHP·MariaDB 확인하는 방법

**1) PHP 버전·환경(phpinfo) — 브라우저로 확인**

- `www` 폴더에 `info.php` 파일을 만들고 아래 한 줄만 넣습니다.

```php
<?php phpinfo();
```

- 터미널로 만들 때:
  - `cd ~/www`
  - `echo '<?php phpinfo();' > info.php`  
  - (또는 vi/nano로 `info.php` 생성 후 `<?php phpinfo();` 입력)
- 브라우저에서 **https://본인도메인/info.php** 로 접속하면 PHP 버전, 확장 모듈(cURL, PDO, mysqli 등), 문자셋 등이 나옵니다.
- **확인 후 반드시 삭제**: `rm ~/www/info.php` (보안상 노출 금지)

**2) PHP 버전만 터미널에서 확인**

```bash
php -v
```

**3) MariaDB 버전·DB 목록 (이미 하신 것)**

```bash
mysql -u mr4989 -p
# 비밀번호 입력 후
SELECT VERSION();
SHOW DATABASES;
# 문자셋 확인
SHOW VARIABLES LIKE 'character_set%';
exit
```

- `echo phpinfo();` 는 **쉘 명령**이라 에러가 난 것입니다. `phpinfo()` 는 **PHP 코드**이므로 `.php` 파일 안에 넣고 웹으로 실행해야 합니다.

**3.1 확인 요약 (dbins.kr 기준)**  
| 항목 | 값 |
|------|-----|
| PHP | 8.4.10p1 |
| MariaDB | 10.6.17 |
| DOCUMENT_ROOT | /mr4989/www |
| 도메인 | dbins.kr |
| cURL | enabled (HTTPS 지원) |
| mysqli / PDO MySQL | enabled |
| default_charset | UTF-8 |
| date.timezone | Asia/Seoul |

- **보안**: 확인 후 서버에서 `info.php` 삭제 권장: `rm ~/www/info.php`

---

## 3.2 현재 daeri 기능·API 정리 ✅

### API 목록 (Next.js → PHP 전환 대상)

| 메서드 | 경로 | 역할 | 요청/응답 요약 |
|--------|------|------|----------------|
| **GET** | `/api/premium-rates` | 보험료 마스터 조회 | 응답: `{ ok, data: [{ insurance_type, age_group, daein2, ... }] }` |
| **POST** | `/api/calculate-premium` | 나이대·담보별 보험료 계산 | 요청: `{ residentNumber1, residentNumber2, insuranceType }` → 응답: `{ ok, data: { ageGroup, premium, breakdown } }` |
| **POST** | `/api/consultations` | 상담신청 저장 + SMS | 요청: `{ name, phone, serviceType?, message?, consentPrivacy }` → 응답: `{ ok }` 또는 `{ ok: false, error }` |
| **POST** | `/api/applications` | 가입신청 저장(비민감+민감 암호화) + SMS | 요청: ApplicationSchema 필드 (insuranceType, name, phone, 주민번호, 주소, 계약자/청약자, 은행·계좌·카드, consentPrivacy) → 응답: `{ ok }` 또는 `{ ok: false, error }` |

**공통**  
- **파트너(테넌트)**: `getPartnerContext(req)` — 쿠키 또는 쿼리 `?partner=code` 로 파트너 식별. PHP에서는 `$_COOKIE` / `$_GET['partner']` 로 동일 로직.
- **응답**: JSON, `Content-Type: application/json; charset=utf-8`. 에러 시 `{ ok: false, error: "CODE", message?: "..." }`.

### 페이지·화면 (정적 HTML/JS 전환 대상)

- **단일 페이지** (스크롤): Header → HeroSection → PremiumCalculator → ProductCards → ServiceTypeSection → ApplicationForm → ConsultationCTA → Footer.
- **PremiumCalculator**: GET premium-rates → 나이대·담보 선택 → 클라이언트 계산 또는 POST calculate-premium 호출.
- **ApplicationForm**: POST applications (유효성: 휴대폰, 주민번호, 동의 체크).
- **ConsultationCTA**: POST consultations 연동.

### 외부 연동

- **알리고(SMS)**: `lib/aligo.ts` — API 키·발신번호·템플릿. PHP에서는 cURL로 동일 REST API 호출 가능.

---

## 3.3 MariaDB 10.x·스키마 호환성 ✅

**현재 스키마** (`../../docs/mysql-schema.sql`):

| 항목 | 내용 | MariaDB 10.x 호환 |
|------|------|-------------------|
| **UUID()** | `DEFAULT (UUID())` | 확인된 **10.6.17** 에서는 미지원 → **PHP에서 UUID 생성** 후 INSERT 필요. |
| **JSON** | `message_logs.vendor_response JSON` | MariaDB **10.2.7+** 지원. ✅ |
| **한글 컬럼명** | \`daemul_3천\`, \`jason_3천\` 등 | 백틱으로 사용 가능. ✅ |
| **ENGINE=InnoDB, CHARSET=utf8mb4** | 전 테이블 | ✅ |
| **ON DUPLICATE KEY UPDATE**, **VALUES()** | premium_rates INSERT | ✅ |

**권장**  
- Cafe24 MariaDB가 **10.7 미만**이면: 스키마에서 `DEFAULT (UUID())` 제거하고, PHP에서 `uuid` 생성 후 각 INSERT에 값으로 넣기.
- **한글 컬럼명**(`daemul_3천` 등): 터미널/업로드 인코딩 문제로 1064 발생 가능 → Cafe24용 스키마(`../schema-mariadb-10.6.sql`)에서는 **ASCII 컬럼명** 사용: `daemul_3k`, `daemul_5k`, `daemul_1eok`, `daemul_2eok`, `jason_3k`, `jason_5k`, `jason_1eok`, `jacha_1k`, `jacha_2k`, `jacha_3k`. PHP API 응답 시 기존 프론트와 맞추려면 이 컬럼을 `daemul_3천` 등으로 매핑해 JSON 내려주면 됨.

---

## Phase 0 완료 후

- 3.1 체크 완료·연결 정보 확정됨 → **Phase 1** 진행 가능.
- **Phase 1**: [PHASE1_DB_APPLY.md](PHASE1_DB_APPLY.md) 참고. `../schema-mariadb-10.6.sql` 업로드 후 `mysql -u mr4989 -p mr4989 < schema-mariadb-10.6.sql` 로 적용.
- Phase 2(PHP 재구현) 시 PHASE0 체크리스트를 스펙으로 사용.

**작성일**: 2026-02-08
