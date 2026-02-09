# daeri — Cafe24 전용 버전 (마이그레이션 작업 폴더)

**목적**: 현재 daeri(Next.js)를 **Cafe24 전용** 환경으로 이전하기 위한 작업 공간.  
기존 `daeri/` 루트의 Next.js 앱은 그대로 두고, **이 폴더**에서 PHP 8.4 + 정적 HTML/JS 버전을 진행합니다.

---

## 환경

| 항목 | 내용 |
|------|------|
| **호스팅** | Cafe24 전용 (Vercel·EC2 미사용) |
| **백엔드** | PHP 8.4 (API: premium-rates, consultations, applications) |
| **DB** | MariaDB 10.x, utf8mb4 |
| **프론트** | 정적 HTML/JS + fetch로 PHP API 호출 |

---

## 폴더 구조 (예정)

- `api/` — PHP API (premium-rates.php, consultations.php, applications.php 등)
- `assets/` 또는 `css/`, `js/` — 정적 리소스
- `index.html` 등 — 정적 페이지
- (필요 시) `config/` — DB·설정 (배포 시 Cafe24에 맞게)

---

## 참고

- **마이그레이션 계획**: `../docs/MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md`
- **기존 API·스키마**: `../app/api/`, `../docs/mysql-schema.sql`
- **Phase 0** 사전 점검 후 Phase 1(DB) → 2(PHP) → 3(프론트) 순으로 진행.
