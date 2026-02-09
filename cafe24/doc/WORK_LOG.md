# Cafe24 마이그레이션 작업 로그

**진행 폴더**: `daeri/cafe24/`  
**계획서**: `../docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`

---

## 2026-02-09

### Phase 0 사전 점검
- **PHASE0_CHECKLIST.md** 정리: 3.1 Cafe24 환경, 3.2 API·페이지 목록, 3.3 MariaDB 스키마 호환성
- 서버에서 **PHP·MariaDB 확인 방법** 문서화: `info.php` (phpinfo), `php -v`, `mysql` 접속 후 `SHOW VARIABLES`
- 사용자 환경 확인 반영:
  - **PHP**: 8.4.10p1
  - **MariaDB**: 10.6.17 (DB/사용자 mr4989)
  - **도메인**: dbins.kr, DOCUMENT_ROOT `/mr4989/www`
  - cURL·mysqli·PDO MySQL 사용 가능, default_charset UTF-8

### Phase 1 DB·스키마
- **schema-mariadb-10.6.sql** 작성 (MariaDB 10.6 호환):
  - `DEFAULT (UUID())` 제거 → INSERT 시 `UUID()` 또는 PHP에서 생성
  - 한글 컬럼명(`daemul_3천` 등) → ASCII(`daemul_3k`, `daemul_1eok` 등)로 변경 (인코딩 1064 오류 방지)
- **PHASE1_DB_APPLY.md**: 스키마 업로드·적용·확인 절차
- 스키마 적용 중 **ERROR 1064** 발생 → 원인: 한글 컬럼명 터미널/파일 인코딩 이슈 → ASCII 컬럼명으로 수정 후 재적용
- 적용 결과: 테이블 6개(partners, consultations, applications, application_secrets, message_logs, premium_rates), partners 1행, premium_rates 18행

### 서버 설정 (config / .env)
- **config.sample.php**: DB 접속·기본 파트너·알리고 SMS/Lambda 설정 예시
- **env.sample**: 변수 목록 참고용 (Next.js .env와 동일 이름)
- **SERVER_CONFIG.md**: 서버에 config.php 만드는 방법, 위치(웹루트 상위 권장), www 내 둘 때 .htaccess로 차단
- PHP에서는 .env 자동 로드 없음 → config.php 로 설정 관리 권장

### 문서·참조
- PHASE0_CHECKLIST에 3.3 한글→ASCII 컬럼 매핑·Phase 1 링크 반영
- PHASE1_DB_APPLY에 “적용 후” SERVER_CONFIG·Phase 2 순서 명시

---

*다음 작업 시 이 파일에 날짜별로 이어서 기록*
