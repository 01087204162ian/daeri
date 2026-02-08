# daeri (개인대리운전 보험) – 운영/개발 메모

## 빠른 시작

1. **로컬 개발**: [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md) 참고
2. **배포**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 또는 아래 "배포 방법" 섹션 참고
3. **문서 인덱스**: 아래 "문서 인덱스" 섹션 참고

---

## 핵심 구조

### 멀티테넌시(화이트라벨)
- **URL 파라미터 기반** (CMS에서 발행 예정)
  - 초기 접속: `?partner=kakao` 또는 `?p=kakao`
  - 미들웨어에서 쿠키로 자동 변환 후 URL에서 파라미터 제거
  - 이후 요청은 쿠키에서 파트너 코드 읽기 (외부에 노출되지 않음)
- 구현: `middleware.ts`, `lib/partner.ts`, `app/api/_lib/context.ts`
- 보안: `httpOnly` 쿠키 사용 (클라이언트에서 접근 불가)

### 데이터베이스
- **MySQL** 사용 (스키마: `docs/mysql-schema.sql`)
- **주요 테이블**:
  - `partners` - 파트너(테넌트) 정보
  - `consultations` - 상담신청
  - `applications` - 가입신청 (비민감정보)
  - `application_secrets` - 가입신청 민감정보 (암호화 저장)
  - `message_logs` - 발송 로그
  - `premium_rates` - 보험료 데이터

### 민감정보 저장
- AES-256-GCM 암호화 후 저장 (`lib/crypto.ts`)
- 키: `FIELD_ENCRYPTION_KEY` (32바이트 base64)

### 알림(알리고)
- **권장**: AWS Lambda 프록시 (`ALIGO_LAMBDA_URL`)
- **대안**: 직접 알리고 API 호출 (`ALIGO_USER_ID`, `ALIGO_API_KEY` 등)
- 구현: `lib/aligo.ts`

### API 엔드포인트
- `POST /api/consultations` - 상담신청
- `POST /api/applications` - 가입신청
- `GET /api/premium-rates` - 보험료 조회

---

## 환경변수

### 필수
```bash
# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=daeri_db

# 암호화
FIELD_ENCRYPTION_KEY=base64_32_bytes  # openssl rand -base64 32

# 알리고 (방식 1: Lambda 프록시 권장)
ALIGO_LAMBDA_URL=https://...

# 또는 알리고 (방식 2: 직접 호출)
ALIGO_USER_ID=...
ALIGO_API_KEY=...
ALIGO_SENDER=...
ALIGO_SMS_URL=...
```

### 선택
```bash
OPERATOR_PHONE=010-0000-0000  # 담당자 수신번호
```

---

## 로컬 개발

**📖 상세 가이드**: [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)

### 빠른 시작
```bash
# 1. MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 스키마 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 4. 개발 서버 실행
npm install
npm run dev
```

---

## 배포 방법

### Vercel (권장) ⭐
1. Vercel 계정 생성 및 GitHub 저장소 연결
2. 환경변수 설정 (위 "환경변수" 섹션 참고)
3. 도메인 연결 및 서브도메인 추가
4. 자동 배포 완료

**📖 상세 가이드**: 아래 "문서 인덱스" → "배포 가이드" 참고

### AWS EC2
**📖 상세 가이드**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 기타 옵션
- AWS Amplify: Git 연동 자동 배포
- AWS Lambda: 서버리스 배포
- 카페24: Node.js 미지원 (사용 불가)

---

## 문서 인덱스

### 필수 문서
- **[LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)** - 로컬 개발 환경 설정
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - EC2 배포 가이드
- **[mysql-schema.sql](./mysql-schema.sql)** - 데이터베이스 스키마

### 개발 가이드
- **[BACKEND_EXPLAINED.md](./BACKEND_EXPLAINED.md)** - 백엔드 작동 방식
- **[NEXTJS_API_ROUTES_VS_EXPRESS.md](./NEXTJS_API_ROUTES_VS_EXPRESS.md)** - Next.js API Routes 설명
- **[PREMIUM_CALCULATION_EXPLAINED.md](./PREMIUM_CALCULATION_EXPLAINED.md)** - 보험료 계산 과정

### 운영 가이드
- **[PREMIUM_UPDATE_GUIDE.md](./PREMIUM_UPDATE_GUIDE.md)** - 보험료 데이터 업데이트
- **[WORK_LOG.md](./WORK_LOG.md)** - 작업 이력 로그
- **[LOGO_GUIDE.md](./LOGO_GUIDE.md)** - 로고 가이드

### 참고 문서
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Supabase → MySQL 마이그레이션 기록
- **[MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md](./MIGRATION_PLAN_SERVER_UTF8_PHP84_MARIADB.md)** - 서버 환경 변경(UTF-8, PHP 8.4, MariaDB 10.x) 마이그레이션 계획
- **[supabase-schema.sql](./supabase-schema.sql)** - Supabase 스키마 (참고용)

---

## 주요 기능

### 보험료 산출
- DB에서 실시간 조회 (`premium_rates` 테이블)
- 나이대별, 담보별 계산
- 렌트비용, 법률비용 포함

### 가입신청
- 계약자와 대리기사 동일/다름 구분
- 민감정보 암호화 저장
- SMS 발송 (사용자 + 담당자)

### 상담신청
- 연락처 정보 표시
- 상담 신청 폼 제출
- SMS 발송 (사용자 + 담당자)

---

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript
- **백엔드**: Next.js API Routes
- **데이터베이스**: MySQL 8.0
- **배포**: Vercel (권장) 또는 AWS EC2

---

## 개발 완료 상태

✅ **모든 핵심 기능 개발 완료**

- 보험료 산출 기능 (DB 연동)
- 가입신청 기능 (암호화, SMS 발송)
- 상담신청 기능 (SMS 발송)
- 멀티테넌시 기능
- UI/UX 개선
- DB 마이그레이션 완료

**배포 준비 완료**: 환경변수 설정 후 배포 가능

---

## 주의사항

- **보험료 데이터**: `premium_rates` 테이블의 데이터는 삭제하지 말고 새 행 추가로 버전 관리
- **민감정보**: `application_secrets`에 암호화되어 저장됨
- **Node.js 버전**: 20.9.0 이상 필요
