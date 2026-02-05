# daeri 작업 로그

## 2026-02-02

### 작업 내용: Supabase → MySQL 마이그레이션 및 로컬 개발 환경 설정

#### 완료된 작업

1. **데이터베이스 마이그레이션**
   - Supabase (PostgreSQL) → MySQL로 변경
   - MySQL 스키마 생성: `docs/mysql-schema.sql`
   - UUID → VARCHAR(36) 변환
   - PostgreSQL 함수 → MySQL 쿼리로 변환

2. **코드 변경**
   - `lib/mysql.ts` 생성 (MySQL 연결 라이브러리)
   - `app/api/_lib/context.ts` - Supabase → MySQL 변경
   - `app/api/consultations/route.ts` - Supabase → MySQL 변경
   - `app/api/applications/route.ts` - Supabase → MySQL 변경
   - `package.json` - mysql2 패키지 추가

3. **보험료 데이터 업데이트**
   - 확대탁송 보험종목 추가
   - 탁송 자차 보험료 업데이트
   - 보험료 계산 방식 명확화
     - 책임초과무한 = 대인2
     - 책임포함무한 = 대인2 + 대인1특약

4. **문서 작성**
   - `docs/mysql-schema.sql` - MySQL 스키마
   - `docs/DEPLOYMENT_GUIDE.md` - EC2 배포 가이드
   - `docs/LOCAL_SETUP_GUIDE.md` - 로컬 개발 환경 설정 가이드
   - `docs/MIGRATION_SUMMARY.md` - 마이그레이션 요약
   - `docs/README.md` - MySQL 정보로 업데이트
   - `deploy.sh` - 배포 스크립트

5. **로컬 개발 환경 설정 완료**
   - Node.js 20 설치
   - MySQL 설치 및 데이터베이스 생성
   - `daeri_db` 데이터베이스 생성
   - `daeri_user` 사용자 생성
   - 스키마 실행 완료
   - 환경변수 설정 (`.env.local`)
   - 의존성 설치 (`npm install`)
   - 개발 서버 실행 성공 (`npm run dev`)
   - `http://localhost:3000` 접속 성공 ✅

#### 환경 설정 정보

- **데이터베이스**: MySQL
- **데이터베이스명**: `daeri_db`
- **사용자**: `daeri_user`
- **포트**: 3000 (Next.js 개발 서버)
- **Node.js 버전**: 20.x

#### 다음 작업 예정

- [ ] 상담신청 기능 테스트
- [ ] 가입신청 기능 테스트
- [ ] 보험료 계산 기능 테스트
- [ ] EC2 배포 준비

#### 참고사항

- Supabase 관련 코드는 제거하지 않고 유지 (향후 참고용)
- 1개 포트만 사용 (포트 3000)
- Next.js API Routes 유지 (별도 Express 서버 불필요)
- GitHub → EC2 자동 배포 가능

---
