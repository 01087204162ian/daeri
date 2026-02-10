# daeri — Cafe24 www (dbins.kr)

이 레포지토리는 **DB손해보험 대리운전 보험(dbins.kr)** 의 Cafe24 전용(www) 버전입니다.  
Next.js 버전은 정리 완료되었고, 현재는 `www/` + PHP API만 사용합니다.

## 문서

- **문서 인덱스**: [doc/README.md](doc/README.md)  
- **www 개발 상황 (통합 문서)**: [doc/WWW_개발_상황.md](doc/WWW_개발_상황.md)

## 코드·설정

- **정적 사이트·PHP API**: `www/`  
- **DB 스키마**: [schema-mariadb-10.6.sql](schema-mariadb-10.6.sql)  
- **설정 예시**: [config.sample.php](config.sample.php), [env.sample](env.sample)

기본 진행 순서: Phase 0(사전 점검) → Phase 1(DB 적용) → 서버 config → Phase 2(PHP API·페이지). 자세한 내용은 `doc/WWW_개발_상황.md` 참고.
