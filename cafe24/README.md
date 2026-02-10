# daeri — Cafe24 전용 (마이그레이션)

Next.js daeri를 **Cafe24** 환경(PHP 8.4 + MariaDB)으로 이전하는 작업 폴더입니다.

- **www 개발 상황 (통합 문서)**: [doc/WWW_개발_상황.md](doc/WWW_개발_상황.md)
- **스키마**: [schema-mariadb-10.6.sql](schema-mariadb-10.6.sql)  
- **설정 예시**: [config.sample.php](config.sample.php), [env.sample](env.sample)

진행 순서: Phase 0(사전 점검) → Phase 1(DB 적용) → 서버 config → Phase 2(PHP API·페이지).
