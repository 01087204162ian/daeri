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

## 2026-02-02 (알리고 Lambda 프록시 방식 적용)

### 작업 내용: pci0327 알리고 SMS Lambda 프록시 방식 적용

#### 완료된 작업

1. **알리고 SMS 전송 방식 개선**
   - AWS Lambda 프록시 방식 추가 (pci0327 프로젝트 방식 적용)
   - 기존 직접 호출 방식 유지 (하위 호환성 보장)
   - `ALIGO_LAMBDA_URL` 환경변수 설정 시 자동으로 Lambda 프록시 사용
   - JSON 형식으로 요청 (보안 강화)
   - `testmode` 옵션 추가

2. **코드 변경**
   - `lib/aligo.ts`:
     - `postJson()` 함수 추가 (Lambda 프록시용 JSON 요청)
     - `aligoSendSms()` 함수 수정:
       - `ALIGO_LAMBDA_URL` 환경변수 확인
       - Lambda 프록시 사용 시: JSON 형식 (`receiver`, `msg`, `testmode_yn`)
       - 직접 호출 시: 기존 Form data 형식 유지
     - `testmode` 파라미터 추가

3. **문서 업데이트**
   - `docs/README.md`:
     - 알리고 섹션에 Lambda 프록시 방식 설명 추가
     - 환경변수 섹션에 `ALIGO_LAMBDA_URL` 추가
     - Vercel 배포 가이드에 Lambda 프록시 환경변수 추가
   - `docs/LOCAL_SETUP_GUIDE.md`:
     - 환경변수 설정 가이드에 Lambda 프록시 방식 추가
     - pci0327 Lambda URL 예시 추가

#### Lambda 프록시 방식의 장점

1. **보안 강화**
   - API 키가 Lambda에만 저장되어 노출 위험 감소
   - 클라이언트 코드에 API 키 불필요

2. **간단한 인터페이스**
   - JSON 형식으로 요청
   - 파라미터: `receiver`, `msg`, `testmode_yn`만 필요

3. **테스트 모드 지원**
   - `testmode: true` 옵션으로 테스트 전송 가능

#### 사용 방법

**방식 1: Lambda 프록시 사용 (권장)**
```env
ALIGO_LAMBDA_URL=https://j7rqfprgb5.execute-api.ap-northeast-2.amazonaws.com/default/aligo-5962
```

**방식 2: 직접 알리고 API 호출**
```env
ALIGO_USER_ID=...
ALIGO_API_KEY=...
ALIGO_SENDER=...
ALIGO_SMS_URL=...
```

#### 동작 방식

- `ALIGO_LAMBDA_URL`이 설정되어 있으면 → Lambda 프록시 사용
- `ALIGO_LAMBDA_URL`이 없으면 → 기존 직접 호출 방식 사용
- 기존 코드 수정 없이 자동으로 적절한 방식 선택

#### 수정된 파일

- `lib/aligo.ts` (수정)
- `docs/README.md` (수정)
- `docs/LOCAL_SETUP_GUIDE.md` (수정)

#### 참고사항

- pci0327 프로젝트의 Lambda 프록시 URL 사용 가능
- 기존 코드와 완전히 호환됨 (하위 호환성 보장)
- Lambda 프록시 사용 시 기존 알리고 환경변수 불필요

---

## 2026-02-02 (가입신청 폼 UI/UX 개선)

### 작업 내용: 가입신청 폼 사용자 경험 개선 및 기능 구현

#### 완료된 작업

1. **Windows 환경 로컬 개발 설정**
   - Windows 환경에서 `.env.local` 파일 생성 및 설정
   - MySQL 연결 정보 설정 (MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
   - 암호화 키 생성 및 설정 (FIELD_ENCRYPTION_KEY)
   - 알리고 API 설정 템플릿 추가
   - MySQL 데이터베이스에 `default` 파트너 추가 완료

2. **전화번호 입력 개선**
   - 전화번호 입력 시 자동 하이픈 추가 기능 구현
   - `formatPhoneNumber` 함수 추가 (`components/application-form.tsx`)
   - 입력 형식: `010-8720-4162` (자동 포맷팅)
   - 서버 전송 시 하이픈 포함하여 전송 (제거하지 않음)
   - `lib/validators.ts`의 `phoneDigits` 검증 로직 수정 (하이픈 허용)

3. **주민번호 유효성 검사 구현**
   - 프론트엔드 주민번호 유효성 검사 기능 구현
   - `lib/resident-number.ts` 파일 생성:
     - `validateResidentNumber()` 함수: 주민번호 검증, 나이 계산, 나이대 그룹 반환
     - 체크섬 검증 로직 포함
     - 나이대 그룹: "26~30", "31~45", "46~50", "51~55", "56~60", "61~"
   - 신청자 주민번호 검증 적용
   - 계약자 주민번호 검증 적용

4. **보험료 자동 계산 기능**
   - 주민번호 검증 후 서버와 통신하여 보험료 자동 계산
   - `app/api/calculate-premium/route.ts` API 엔드포인트 생성:
     - 주민번호와 보험 유형을 받아 나이대 계산
     - MySQL에서 해당 나이대의 보험료 조회
     - 복합 보험 유형(대리+탁송, 대리+확대탁송) 처리:
       - 개별 보험료를 조회하여 합산
     - 단일 보험 유형(대리, 탁송, 확대탁송) 처리
   - `components/application-form.tsx`에 `calculatePremium` 함수 추가
   - 주민번호 입력 완료 시 자동으로 보험료 계산 및 표시
   - 보험 유형 변경 시 주민번호가 입력된 상태라면 보험료 자동 재계산

5. **UI/UX 개선**
   - 보험료 표시 필드 우측 정렬 적용 (`text-right` CSS 클래스)
   - 주민번호 앞 6자리 입력 시 자동으로 뒷자리로 포커스 이동
     - `residentNumber2Ref`, `contractorResidentNumber2Ref` ref 사용
     - `handleResidentNumberChange`, `handleContractorResidentNumberChange` 함수 구현
   - 주민번호 검증 오류 메시지 표시
   - 보험료 계산 중 로딩 상태 표시 (`isCalculatingPremium` 상태)

6. **복합 보험 유형 보험료 계산 수정**
   - "대리+탁송" 보험료 계산 로직 수정:
     - "대리" 보험료 + "탁송" 보험료 합산
   - "대리+확대탁송" 보험료 계산 로직 수정:
     - "대리" 보험료 + "확대탁송" 보험료 합산
   - 각 보험 유형별 개별 보험료를 DB에서 조회하여 합산하도록 수정

7. **가입신청 API 연동 확인**
   - 가입신청하기 버튼이 `/api/applications` API와 정상 연동 확인
   - 가입신청 테스트 성공:
     - 응답: `{"ok":true,"id":"1346bbd8-a6eb-43cc-a6db-7001befd398c"}`
     - `applications` 테이블에 데이터 저장 확인
     - `application_secrets` 테이블에 암호화된 민감정보 저장 확인

#### 수정된 파일

- `components/application-form.tsx` (대폭 수정)
  - 전화번호 포맷팅 함수 추가
  - 주민번호 검증 및 보험료 계산 로직 추가
  - 자동 포커스 이동 기능 추가
  - 보험료 우측 정렬 적용
- `lib/resident-number.ts` (신규 생성)
  - 주민번호 검증, 나이 계산, 나이대 그룹 반환 함수
- `lib/validators.ts` (수정)
  - 전화번호 검증 로직 수정 (하이픈 허용)
- `app/api/calculate-premium/route.ts` (신규 생성)
  - 보험료 계산 API 엔드포인트
  - 복합 보험 유형 처리 로직 포함
- `.env.local` (신규 생성)
  - Windows 환경에서 로컬 개발 설정 파일 생성

#### 해결된 문제

1. **"Unknown partner_code: default" 오류**
   - 원인: MySQL 데이터베이스에 `default` 파트너가 없음
   - 해결: `partners` 테이블에 `default` 파트너 추가
   - SQL: `INSERT INTO partners (id, code, name) VALUES (UUID(), 'default', '기본')`

2. **Next.js 개발 서버 중복 실행 오류**
   - 원인: 이전 프로세스가 포트 3000을 점유
   - 해결: `taskkill /F /PID [PID]` 명령어로 프로세스 종료 후 재시작

#### 현재 상태

- ✅ 로컬 개발 환경 설정 완료 (Windows)
- ✅ MySQL 데이터베이스 연동 완료
- ✅ 가입신청 폼 UI/UX 개선 완료
- ✅ 주민번호 유효성 검사 구현 완료
- ✅ 보험료 자동 계산 기능 구현 완료
- ✅ 가입신청 API 테스트 성공

#### 다음 작업 예정

- [ ] Vercel 환경변수 설정
- [ ] 운영 환경 배포 후 전체 기능 테스트
- [ ] 상담신청 기능 테스트

---
