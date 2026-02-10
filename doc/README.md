# doc — Cafe24 www 문서 모음

이 디렉터리는 **Cafe24 www(dbins.kr) 버전**에 대한 문서를 모아 둔 곳입니다.  
실제 코드는 `../www/` 에 있습니다.

## 핵심 문서

- **[WWW_개발_상황.md](WWW_개발_상황.md)**  
  - 개요·작업 로그(날짜별)  
  - Phase 0~2 정리 (환경·스키마·API·config.php)  
  - 스키마 검증·트러블슈팅(500/404)  
  - www 디렉터리 구조, 테스트 계획(Chrome 리얼 테스트), 로고·이미지 가이드

## 관련 파일 (코드)

- `../www/` — Cafe24에 올릴 실제 정적 사이트
  - `index.html` — 메인 페이지 (헤더/히어로/보험료 산출/가입·상담 폼)
  - `css/style.css` — 전체 스타일
  - `js/premium-*.js` — 보험료 산출 로직
  - `js/application.js` — 가입 신청 폼
  - `js/consultation.js` — 상담 신청 폼
  - `api/*.php` — premium-rates / consultations / applications API
  - `lib/*.php` — DB/암호화/알리고/컨텍스트 유틸

- 루트(`..`)  
  - `schema-mariadb-10.6.sql` — MariaDB 10.6용 스키마  
  - `config.sample.php`, `env.sample` — 서버 설정 예시

이후 문서는 가능하면 **`WWW_개발_상황.md` 하나에 통합**하고, 개별 가이드는 필요할 때에만 새 파일을 추가하는 것을 기준으로 합니다.
