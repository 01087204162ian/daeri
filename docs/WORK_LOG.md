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

6. **보험료 산출 기능 개선**
   - 하드코딩된 데이터 → MySQL DB에서 실제 데이터 불러오기
   - `app/api/premium-rates/route.ts` - 보험료 데이터 조회 API 생성
   - `lib/premium-data-client.ts` - 클라이언트용 보험료 계산 함수 생성
   - `components/premium-calculator.tsx` - 실제 DB 데이터 사용하도록 수정
   - 확대탁송 데이터 추가 (`lib/premium-data.ts`)

7. **보험료 산출 UI 개선**
   - 렌트비용 체크박스 추가 (대리만 가능 표시)
   - 법률비용 체크박스 추가 (선택 가능)
   - 보험료 숫자 우측 정렬로 변경
   - "원" 텍스트 제거
   - 산출 버튼 레이아웃 조정 (같은 줄에 표시)

8. **Vercel Analytics 조건부 로딩**
   - `components/vercel-analytics.tsx` 생성
   - Vercel 환경에서만 Analytics 로드
   - 로컬/EC2에서 오류 없이 동작

9. **문서 추가 작성**
   - `docs/PREMIUM_CALCULATION_EXPLAINED.md` - 보험료 계산 과정 설명
   - `docs/BACKEND_EXPLAINED.md` - 백엔드 작동 방식 설명
   - `docs/NEXTJS_API_ROUTES_VS_EXPRESS.md` - Next.js API Routes vs Express 비교

#### 다음 작업 예정

- [ ] 상담신청 기능 테스트
- [ ] 가입신청 기능 테스트
- [ ] 보험료 계산 기능 테스트 (DB 데이터 사용 확인)
- [ ] EC2 배포 준비

#### 참고사항

- Supabase 관련 코드는 제거하지 않고 유지 (향후 참고용)
- 1개 포트만 사용 (포트 3000)
- Next.js API Routes 유지 (별도 Express 서버 불필요)
- GitHub → EC2 자동 배포 가능
- 보험료 데이터는 MySQL에서 실시간으로 불러옴
- 렌트비용은 대리만 가능 (UI에 표시)

---

## 2026-02-02 (추가 작업)

### 작업 내용: 보험료 산출 기능 개선 및 UI 개선

#### 완료된 작업

1. **보험료 데이터 DB 연동**
   - `GET /api/premium-rates` API 엔드포인트 생성
   - MySQL에서 활성화된 보험료 데이터 조회
   - 클라이언트에서 API 호출하여 데이터 사용

2. **보험료 산출 기능 개선**
   - 하드코딩된 데이터 제거
   - 실제 MySQL 데이터 사용
   - 확대탁송 보험료 계산 추가
   - 렌트비용, 법률비용 선택 가능하도록 개선

3. **UI 개선**
   - 보험료 숫자 우측 정렬
   - "원" 텍스트 제거
   - 렌트비용 체크박스 추가 (대리만 가능 표시)
   - 법률비용 체크박스 추가
   - 산출 버튼 레이아웃 조정

4. **Vercel Analytics 수정**
   - 조건부 로딩으로 변경
   - 로컬/EC2에서 오류 없이 동작

#### 수정된 파일

- `app/api/premium-rates/route.ts` (신규)
- `lib/premium-data-client.ts` (신규)
- `components/premium-calculator.tsx` (수정)
- `components/vercel-analytics.tsx` (신규)
- `app/layout.tsx` (수정)
- `lib/premium-data.ts` (확대탁송 데이터 추가)

#### 현재 상태

- ✅ 로컬 개발 환경 설정 완료
- ✅ MySQL 데이터베이스 연동 완료
- ✅ 보험료 산출 기능 DB 연동 완료
- ✅ UI 개선 완료
- ✅ 빌드 성공 확인

---
