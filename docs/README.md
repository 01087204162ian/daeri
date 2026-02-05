# daeri (개인대리운전 보험) – 운영/개발 메모

## 1) 멀티테넌시(화이트라벨)
- **방식**: 서브도메인 기반
  - 예: `kakao.daeri-site.com`, `tmap.daeri-site.com`
- **테넌트 매핑**: 요청 `Host`에서 서브도메인을 추출해 `partners.code`로 매핑
  - 구현: `lib/partner.ts`, `app/api/_lib/context.ts`

## 2) MySQL 데이터베이스
- **스키마**: `docs/mysql-schema.sql`
- **필수 테이블**
  - `partners` - 파트너(테넌트) 정보
  - `consultations` - 상담신청
  - `applications` - 가입신청 (비민감정보)
  - `application_secrets` - 가입신청 민감정보 (암호문 저장)
  - `message_logs` - 발송 로그
  - `premium_rates` - 보험료 데이터 (보험종목별, 나이대별, 담보별)
    - **보험종목**: 대리, 탁송, 확대탁송
    - **주의**: 보험료는 보험사 정책 변경에 따라 추가/수정될 수 있음
    - 버전 관리: `effective_date`와 `expiry_date`로 기간별 관리
    - 새 보험료 적용 시 기존 데이터 삭제하지 말고 새 행 추가 권장

### MySQL 설정
- **연결 라이브러리**: `lib/mysql.ts`
- **환경변수**:
  - `MYSQL_HOST` - MySQL 호스트 (기본값: localhost)
  - `MYSQL_PORT` - MySQL 포트 (기본값: 3306)
  - `MYSQL_USER` - MySQL 사용자명
  - `MYSQL_PASSWORD` - MySQL 비밀번호
  - `MYSQL_DATABASE` - 데이터베이스명 (기본값: daeri_db)

### 데이터베이스 초기화
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 스키마 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql
```

## 3) 민감정보 저장(주민번호/계좌/카드)
- **저장 전제**: PG 연동 없이 “접수”만 받고, 결제는 당사 직원이 보험사 전산에서 처리
- **저장 방식**: 서버에서 필드 단위 암호화(AES-256-GCM) 후 DB 저장
  - 구현: `lib/crypto.ts`
  - 키: `FIELD_ENCRYPTION_KEY` (32바이트 base64)

## 4) 알림(알리고)
웹 문서 확인 권한이 없는 환경에서도 동작하도록, **알리고 엔드포인트/파라미터는 환경변수로 분리**합니다.

**방식 1: AWS Lambda 프록시 사용 (권장)**
- Lambda 프록시를 통해 알리고 API 호출 (보안 강화)
- 환경변수: `ALIGO_LAMBDA_URL` 설정
- JSON 형식으로 요청 (`receiver`, `msg`, `testmode_yn`)
- 구현: `lib/aligo.ts` → `aligoSendSms()` (자동으로 Lambda 프록시 사용)

**방식 2: 직접 알리고 API 호출**
- 문자(SMS): `ALIGO_SMS_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendSms()`
- 카카오(알림톡/친구톡): `ALIGO_KAKAO_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendKakao()`

> `ALIGO_LAMBDA_URL`이 설정되어 있으면 Lambda 프록시 방식을 우선 사용합니다.
> 운영 계정 스펙에 따라 파라미터명이 다를 수 있어, 필요 시 `lib/aligo.ts`에서 매핑을 조정합니다.

## 5) API 엔드포인트(Next.js)
- `POST /api/consultations`
  - 저장: `consultations`
  - 알림: `OPERATOR_PHONE`로 SMS 발송(설정 시)
  - 로그: `message_logs`
- `POST /api/applications`
  - 저장: `applications` + `application_secrets`
  - 알림/로그 동일

## 6) 환경변수
### MySQL
- `MYSQL_HOST` (기본값: localhost)
- `MYSQL_PORT` (기본값: 3306)
- `MYSQL_USER` (필수)
- `MYSQL_PASSWORD` (필수)
- `MYSQL_DATABASE` (기본값: daeri_db)

### 암호화
- `FIELD_ENCRYPTION_KEY` (base64 32 bytes)

### 알리고
**방식 1: AWS Lambda 프록시 사용 (권장)**
- `ALIGO_LAMBDA_URL` - Lambda 프록시 URL (예: `https://j7rqfprgb5.execute-api.ap-northeast-2.amazonaws.com/default/aligo-5962`)
  - Lambda 프록시가 설정되어 있으면 이 방식 사용 (JSON 형식, 보안 강화)
  - `ALIGO_LAMBDA_URL`이 설정되어 있으면 아래 환경변수 불필요

**방식 2: 직접 알리고 API 호출**
- `ALIGO_USER_ID`
- `ALIGO_API_KEY`
- `ALIGO_SENDER` (발신번호)
- `ALIGO_SMS_URL`
- `ALIGO_KAKAO_URL`

### 운영 수신처
- `OPERATOR_PHONE` (담당자 수신번호)

## 7) 한 장 요약 체크리스트 (운영/배포)

### 진행 상황 (2026-02-02)

#### ✅ 완료된 작업
- [x] **A. Supabase 준비** - 완료
  - [x] Supabase 프로젝트 생성 완료
  - [x] 프로젝트 URL 확인 완료
  - [x] Service Role Key 확인 완료
  - [x] SQL Editor에서 `docs/supabase-schema.sql` 실행 완료
  - [x] 테이블 생성 확인 완료 (partners, consultations, applications, application_secrets, message_logs, premium_rates)
  - [x] `partners` 테이블에 기본 파트너 'default' 1개 행 확인 완료
  - [x] `premium_rates` 테이블에 12개 행 확인 완료 (대리 6개 + 탁송 6개)
  - [x] `get_premium_rate()` 함수 테스트 완료 (정상 동작 확인)
  - [x] `calculate_premium_total()` 함수 테스트 완료 (정상 동작 확인, 예: 990,900원 계산 결과 확인)

#### 📋 다음 작업 (내일 진행 예정)
- [ ] **B. Vercel 환경변수 설정** - 진행 예정
  - [ ] Vercel 프로젝트 생성/연결 (GitHub 저장소 연결)
  - [ ] 환경변수 추가 (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 등)
  - [ ] 재배포
- [ ] **C. 도메인/테넌트 라우팅** - 대기 중
- [ ] **D. 기능 동작 확인** - 대기 중

#### 📝 참고사항
- Supabase 프로젝트 정보는 Settings > API에서 확인 가능
- GitHub에 daeri 프로젝트 코드가 이미 올라가 있음
- Vercel 환경변수 설정 방법은 아래 B-1 ~ B-4 섹션 참고

---

### A. Supabase 준비
- [x] Supabase 프로젝트 생성
  - [x] [Supabase Dashboard](https://app.supabase.com)에서 새 프로젝트 생성
  - [x] 프로젝트 URL 확인: Settings > API > Project URL (`https://[프로젝트ID].supabase.co`)
  - [x] Service Role Key 확인: Settings > API > Project API keys > `service_role` (secret)
- [x] SQL Editor에서 `docs/supabase-schema.sql` 실행
  - [x] 기본 테이블 생성 (partners, consultations, applications, application_secrets, message_logs)
  - [x] 보험료 데이터 테이블 생성 (`premium_rates`)
  - [x] 보험료 데이터 초기 삽입 (대리/탁송, 6개 나이대별, 12개 담보별)
  - [x] 보험료 조회 함수 및 계산 함수 생성
- [ ] `partners`에 테넌트 추가
  - [x] `default` (스키마 실행 시 자동 생성됨)
  - [ ] `kakao`
  - [ ] `tmap`
  - [ ] 기타 파트너(`cnmp`, `logi` 등)
- [x] 보험료 데이터 확인
  - [x] `premium_rates` 테이블에 12개 행 삽입 확인 (대리 6개 + 탁송 6개)
  - [x] `get_premium_rate()` 함수 동작 확인
  - [x] `calculate_premium_total()` 함수 동작 확인

### B. Vercel 환경변수 설정

#### B-1. Vercel 프로젝트 준비
- [ ] Vercel 계정 확인/생성: https://vercel.com
- [ ] GitHub 저장소 연결 확인 (daeri 프로젝트가 GitHub에 있어야 함)
- [ ] Vercel에 프로젝트 추가: "Add New..." → "Project" → GitHub 저장소 선택 → "Deploy"

#### B-2. 환경변수 설정 화면 열기
1. Vercel 프로젝트 페이지에서 "Settings" 클릭
2. 왼쪽 메뉴에서 "Environment Variables" 클릭

#### B-3. 환경변수 추가하기
각 환경변수를 하나씩 추가합니다:
- "Add New" 버튼 클릭
- Key와 Value 입력
- Environments 선택 (Production, Preview, Development 모두 체크 권장)
- "Save" 클릭

필수 환경변수:
- [ ] `SUPABASE_URL` (예: `https://[프로젝트ID].supabase.co`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Settings > API > service_role key)
- [ ] `FIELD_ENCRYPTION_KEY` (base64 32 bytes) - 생성 필요
  - [ ] `ALIGO_LAMBDA_URL` (AWS Lambda 프록시 URL, 권장) 또는
  - [ ] `ALIGO_USER_ID` (알리고 계정 정보, 직접 호출 시)
  - [ ] `ALIGO_API_KEY` (알리고 계정 정보, 직접 호출 시)
  - [ ] `ALIGO_SENDER` (발신번호, 직접 호출 시)
  - [ ] `ALIGO_SMS_URL` (알리고 SMS 엔드포인트, 직접 호출 시)
  - [ ] `ALIGO_KAKAO_URL` (카톡 발송 사용 시, 알리고 카카오톡 엔드포인트)
- [ ] `OPERATOR_PHONE` (담당자 수신번호)

#### B-4. 환경변수 추가 후 재배포
- [ ] "Deployments" 탭 클릭
- [ ] 가장 최근 배포의 "..." 메뉴 → "Redeploy" 클릭
- [ ] 재배포 완료 대기

### C. 도메인/테넌트 라우팅
- [ ] Vercel 프로젝트에 `daeri-site.com` 도메인 연결
- [ ] 필요한 서브도메인 추가
  - [ ] `kakao.daeri-site.com`
  - [ ] `tmap.daeri-site.com`
  - [ ] 파트너 추가 시: `파트너코드.daeri-site.com` ↔ `partners.code=파트너코드`

### D. 기능 동작 확인(최소)
- [ ] `kakao.daeri-site.com`에서 **상담신청** 제출 → `consultations` row 생성 확인
- [ ] `kakao.daeri-site.com`에서 **가입신청** 제출 → `applications` + `application_secrets` row 생성 확인
- [ ] `OPERATOR_PHONE` 설정 시 문자 발송 확인 + `message_logs` 기록 확인

### E. 운영 메모
- [ ] 민감정보는 `application_secrets`에 **암호문으로만** 저장됨(복호화는 서버에서만 가능)
- [ ] 카드 결제는 PG 없이 “접수”만 받고, **보험사 전산에서 당사 직원이 결제 처리**

## 8) 로컬 테스트 방법

**📖 상세 가이드**: `docs/LOCAL_SETUP_GUIDE.md` 참고

### A. MySQL 준비
- [ ] MySQL 설치 완료
- [ ] 데이터베이스 생성: `CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- [ ] 스키마 실행: `mysql -u root -p daeri_db < docs/mysql-schema.sql`
- [ ] `partners`에 최소 `default` 존재 확인 (seed 포함)
- [ ] 로컬에서 서브도메인으로 테스트할 파트너가 있으면 `partners.code`로 추가
  - 예: `kakao`, `tmap`

### B. 로컬 환경변수 준비
- `daeri/.env.local` 생성 후 아래 값 설정
  - [ ] `MYSQL_HOST` (기본값: localhost)
  - [ ] `MYSQL_PORT` (기본값: 3306)
  - [ ] `MYSQL_USER` (예: root)
  - [ ] `MYSQL_PASSWORD` (MySQL root 비밀번호)
  - [ ] `MYSQL_DATABASE` (기본값: daeri_db)
  - [ ] `FIELD_ENCRYPTION_KEY` (base64 32 bytes) - `openssl rand -base64 32`로 생성
  - [ ] `ALIGO_LAMBDA_URL` (AWS Lambda 프록시 URL, 권장) 또는
  - [ ] `ALIGO_USER_ID` (알리고 계정 정보, 직접 호출 시)
  - [ ] `ALIGO_API_KEY` (알리고 계정 정보, 직접 호출 시)
  - [ ] `ALIGO_SENDER` (발신번호, 직접 호출 시)
  - [ ] `ALIGO_SMS_URL` (알리고 SMS 엔드포인트, 직접 호출 시)
  - [ ] `ALIGO_KAKAO_URL` (카톡 발송 사용 시, 선택)
  - [ ] `OPERATOR_PHONE` (선택: 설정 시 발송 시도)

### C. 개발 서버 실행
- `daeri` 폴더에서 실행
  - [ ] **Node.js 버전 확인 및 변경** (필수)
    - Next.js는 Node.js 20.9.0 이상이 필요합니다
    - 현재 버전 확인: `node --version`
    - nvm이 설치되어 있다면:
      ```bash
      # 설치된 Node.js 버전 확인
      nvm ls
      
      # Node.js 20 이상 버전이 설치되어 있지 않다면 설치
      nvm install 20
      
      # Node.js 20 사용
      nvm use 20
      
      # 버전 확인
      node --version  # v20.x.x 이상이어야 함
      ```
    - nvm이 없다면: [Node.js 공식 사이트](https://nodejs.org/)에서 20.x LTS 버전 설치
    - **참고**: 프로젝트별로 Node.js 버전을 고정하려면 `.nvmrc` 파일 생성
      ```bash
      echo "20" > .nvmrc
      nvm use  # 자동으로 .nvmrc의 버전 사용
      ```
  - [ ] `npm install` (의존성 설치)
  - [ ] `npm run dev` (개발 서버 실행)
  - 기본 접속: `http://localhost:3000`

### D. 로컬에서 서브도메인(테넌트) 테스트(선택)
> 로컬에서는 `Host=localhost`면 기본적으로 `default` 테넌트로 매핑됩니다.
> 서브도메인별로 테스트하려면 hosts 파일을 사용합니다.

- Windows hosts 파일: `C:\Windows\System32\drivers\etc\hosts`
  - 예시:
    - `127.0.0.1 kakao.daeri-site.com`
    - `127.0.0.1 tmap.daeri-site.com`

- 접속 예시:
  - `http://kakao.daeri-site.com:3000`
  - `http://tmap.daeri-site.com:3000`

### E. 제출 동작 확인 포인트
- [ ] 상담신청 제출 → MySQL `consultations`에 row 생성
- [ ] 가입신청 제출 → MySQL `applications` + `application_secrets`에 row 생성
- [ ] `OPERATOR_PHONE` 설정 시 → 문자 발송 시도 + `message_logs` 기록 확인

## 9) 빌드 방법
### 프로덕션 빌드
```bash
cd daeri

# Node.js 버전 확인 (Next.js는 20.9.0 이상 필요)
node --version  # v20.x.x 이상이어야 함

# nvm 사용 시 Node.js 20으로 전환
nvm use 20

# 의존성 설치
npm install

# 빌드 실행
npm run build
```

### 빌드 결과물 실행
```bash
npm run start
```
- 기본 접속: `http://localhost:3000`
- 프로덕션 모드로 실행되며, 최적화된 빌드 결과물을 사용합니다.

### 빌드 주의사항
- 빌드 전에 환경변수(`.env.local` 또는 Vercel 환경변수)가 올바르게 설정되어 있는지 확인
- 빌드 시 Next.js가 자동으로 최적화 및 정적 페이지 생성 수행
- 빌드 경고가 발생할 수 있으나(예: workspace root 관련), 기능에는 영향 없음

## 10) 배포 방법

### A. Vercel 배포 (권장) ⭐

#### 장점
- Next.js 최적화 및 자동 스케일링
- 무료 플랜 제공 (개인/소규모 프로젝트)
- Git 연동 자동 배포
- 환경변수 관리 용이
- 서버리스 함수 지원
- SSL 인증서 자동 설정
- 글로벌 CDN 제공

#### 배포 절차

1. **Vercel 계정 생성 및 프로젝트 연결**
   ```bash
   # Vercel CLI 설치 (선택사항)
   npm i -g vercel
   
   # 프로젝트 배포
   cd daeri
   vercel
   ```
   
   또는 Vercel 웹 대시보드에서:
   - [vercel.com](https://vercel.com) 접속
   - "Add New Project" 클릭
   - GitHub/GitLab/Bitbucket 저장소 연결
   - 프로젝트 선택 후 "Deploy"

2. **환경변수 설정**
   - Vercel 대시보드 → Project Settings → Environment Variables
   - 다음 환경변수 추가:
     ```
     SUPABASE_URL
     SUPABASE_SERVICE_ROLE_KEY
     FIELD_ENCRYPTION_KEY
     ALIGO_USER_ID
     ALIGO_API_KEY
     ALIGO_SENDER
     ALIGO_SMS_URL
     ALIGO_KAKAO_URL (선택)
     OPERATOR_PHONE (선택)
     ```

3. **도메인 설정**
   - Vercel 대시보드 → Project Settings → Domains
   - 도메인 추가: `daeri-site.com`
   - 서브도메인 추가:
     - `kakao.daeri-site.com`
     - `tmap.daeri-site.com`
     - 기타 파트너 서브도메인

4. **배포 확인**
   - 자동 배포: Git push 시 자동 배포
   - 수동 배포: Vercel CLI 또는 대시보드에서 "Redeploy"

#### Vercel 배포 체크리스트
- [ ] Vercel 계정 생성 및 프로젝트 연결
- [ ] 모든 환경변수 설정 완료
- [ ] 도메인 연결 완료
- [ ] 서브도메인 추가 완료
- [ ] 배포 성공 확인
- [ ] 상담신청/가입신청 기능 테스트

---

### B. AWS 배포

#### 옵션 1: AWS Amplify (권장) ⭐

**장점**
- Next.js 자동 감지 및 최적화
- Git 연동 자동 배포
- 환경변수 관리 용이
- 무료 플랜 제공 (12개월)
- CDN 자동 설정

**배포 절차**

1. **AWS Amplify 콘솔 접속**
   - [AWS Amplify Console](https://console.aws.amazon.com/amplify) 접속
   - "New app" → "Host web app" 선택

2. **저장소 연결**
   - GitHub/GitLab/Bitbucket 선택
   - 저장소 및 브랜치 선택
   - "Next.js" 프레임워크 자동 감지

3. **빌드 설정**
   - 빌드 명령어: `npm run build`
   - 출력 디렉토리: `.next` (자동 감지)

4. **환경변수 설정**
   - App settings → Environment variables
   - 모든 환경변수 추가

5. **도메인 설정**
   - App settings → Domain management
   - 도메인 추가 및 서브도메인 설정

**비용**
- 무료 플랜: 12개월 (월 1,000 빌드 분, 15GB 전송)
- 유료: 사용량 기반 과금

---

#### 옵션 2: AWS EC2 (서버 관리 필요)

**장점**
- 완전한 서버 제어
- 커스텀 설정 가능
- 여러 서비스 통합 가능

**단점**
- 서버 관리 필요
- 비용 증가 가능
- 자동 스케일링 설정 필요

**배포 절차**

1. **EC2 인스턴스 생성**
   ```bash
   # Ubuntu 22.04 LTS 권장
   # 인스턴스 타입: t3.small 이상 (2GB RAM 이상)
   ```

2. **서버 초기 설정**
   ```bash
   # SSH 접속
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Node.js 20 설치
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # PM2 설치 (프로세스 매니저)
   sudo npm install -g pm2
   
   # Nginx 설치 (리버스 프록시)
   sudo apt-get install -y nginx
   ```

3. **프로젝트 배포**
   ```bash
   # 프로젝트 클론
   git clone your-repo-url
   cd daeri
   
   # 의존성 설치
   npm install
   
   # 환경변수 설정
   nano .env.production
   # 모든 환경변수 입력 후 저장
   
   # 빌드
   npm run build
   
   # PM2로 서버 실행
   pm2 start npm --name "daeri" -- start
   pm2 save
   pm2 startup  # 시스템 재시작 시 자동 실행
   ```

4. **Nginx 설정**
   ```bash
   sudo nano /etc/nginx/sites-available/daeri
   ```
   
   ```nginx
   server {
       listen 80;
       server_name daeri-site.com *.daeri-site.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   # 심볼릭 링크 생성
   sudo ln -s /etc/nginx/sites-available/daeri /etc/nginx/sites-enabled/
   
   # Nginx 재시작
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL 인증서 설정 (Let's Encrypt)**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d daeri-site.com -d *.daeri-site.com
   ```

**비용**
- EC2 t3.small: 약 $15/월
- 데이터 전송: 사용량 기반
- 도메인: 별도 구매 필요

---

#### 옵션 3: AWS Lambda + CloudFront (서버리스)

**장점**
- 서버 관리 불필요
- 사용량 기반 과금
- 자동 스케일링

**단점**
- 설정 복잡도 높음
- Cold start 지연 가능
- Next.js 서버리스 어댑터 필요

**배포 절차**

1. **Next.js 서버리스 어댑터 설정**
   ```bash
   npm install @sls-next/lambda-at-edge
   ```

2. **Serverless Framework 또는 AWS SAM 사용**
   - 복잡한 설정 필요
   - 자세한 내용은 [Next.js AWS 배포 문서](https://nextjs.org/docs/deployment#aws) 참고

**비용**
- Lambda: 요청 수 및 실행 시간 기반
- CloudFront: 데이터 전송 기반
- 일반적으로 EC2보다 저렴 (트래픽 적을 때)

---

### C. 기타 호스팅 서비스

#### 카페24 일반 호스팅
- **서비스 불가**: Node.js 런타임 미지원
- Next.js API Routes 실행 불가
- PHP, MySQL만 지원

#### 카페24 클라우드/VPS
- **가능할 수 있음**: Node.js 설치 가능 여부 확인 필요
- 서버 관리 권한 필요
- EC2와 유사한 설정 필요
- **권장하지 않음**: Vercel 또는 AWS가 더 적합

---

### 배포 옵션 비교

| 항목 | Vercel | AWS Amplify | AWS EC2 | AWS Lambda |
|------|--------|-------------|---------|------------|
| **설정 난이도** | ⭐ 매우 쉬움 | ⭐⭐ 쉬움 | ⭐⭐⭐⭐ 어려움 | ⭐⭐⭐⭐⭐ 매우 어려움 |
| **비용** | 무료~저렴 | 무료~저렴 | 중간~비쌈 | 저렴~중간 |
| **서버 관리** | 불필요 | 불필요 | 필요 | 불필요 |
| **자동 배포** | ✅ | ✅ | 설정 필요 | 설정 필요 |
| **스케일링** | 자동 | 자동 | 수동 설정 | 자동 |
| **커스터마이징** | 제한적 | 제한적 | 완전 | 제한적 |

---

### 권장사항

1. **소규모 프로젝트 / 빠른 시작**: **Vercel** ⭐
   - 설정이 가장 간단
   - 무료 플랜 제공
   - Next.js 최적화

2. **AWS 생태계 통합 필요**: **AWS Amplify**
   - AWS 서비스와 통합 용이
   - 무료 플랜 제공

3. **완전한 제어 필요**: **AWS EC2**
   - 서버 관리 가능
   - 커스터마이징 자유도 높음

4. **서버리스 선호**: **AWS Lambda**
   - 서버 관리 불필요
   - 사용량 기반 과금

---

## 11) 개발 이력
### 2026-01-26 - Node.js 버전 요구사항 문서화 및 개발 환경 설정 가이드 추가
#### Node.js 버전 요구사항
- **문제**: Next.js는 Node.js 20.9.0 이상이 필요하나, 기본 Node.js 버전이 18.20.8인 경우 발생
- **해결**: nvm을 사용하여 Node.js 20.x 버전으로 전환
- **문서화**: 
  - 로컬 테스트 방법 섹션에 Node.js 버전 확인 및 변경 절차 추가
  - 빌드 방법 섹션에 Node.js 버전 확인 단계 추가
  - `.nvmrc` 파일을 통한 프로젝트별 Node.js 버전 고정 방법 추가

#### 관련 명령어
```bash
# Node.js 버전 확인
node --version

# nvm으로 설치된 버전 확인
nvm ls

# Node.js 20 사용
nvm use 20

# 프로젝트별 버전 고정 (.nvmrc 파일 생성)
echo "20" > .nvmrc
nvm use
```

---

### 2026-01-26 - 반응형 디자인 개선 및 UI/UX 고도화
#### 반응형 디자인 개선
- **hero-section.tsx**: 보상하는 내용 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일(`lg` 미만): 각 보상 항목을 개별 카드로 표시
  - 데스크톱(`lg` 이상): 기존 테이블 형식 유지
  - 텍스트 잘림 문제 해결 및 가독성 향상

- **product-cards.tsx**: 담보 및 보상한도 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일: 각 보상 항목을 카드 형식으로 표시
  - 데스크톱: 기존 테이블 형식 유지
  - "자기차량" 서브 항목을 들여쓰기와 왼쪽 테두리로 구분

- **premium-calculator.tsx**: 보험료 산출 결과 테이블을 모바일에서 카드 형식으로 재구성
  - 모바일: 각 연령대를 카드로 표시, 서비스 유형별 보험료를 세로로 나열
  - 데스크톱: 기존 테이블 형식 유지
  - 가로 스크롤 제거 및 모든 정보 표시

#### 가입신청 폼 개선
- **application-form.tsx**: 레이블과 입력상자를 한 행에 표시
  - 모든 화면 크기에서 레이블과 입력상자가 가로로 배치되도록 변경
  - `flex-row` 레이아웃 적용

- **입력상자 스타일 고도화**
  - 배경색: `bg-background` 적용
  - 테두리: `border-border/60`으로 부드러운 색상
  - 그림자: `shadow-sm` 적용
  - Hover 효과: `hover:border-border hover:shadow-md`
  - Focus 효과: `focus-visible:border-primary focus-visible:shadow-md`
  - 전환 애니메이션: `transition-all duration-200`

- **폰트 크기 통일**
  - Input 컴포넌트 기본 텍스트 크기를 `text-sm`으로 통일
  - 레이블(`text-sm`)과 플레이스홀더(`text-sm`) 폰트 크기 일치
  - 모든 화면 크기에서 일관된 폰트 크기 유지

#### 수정된 파일
- `components/hero-section.tsx`
- `components/product-cards.tsx`
- `components/premium-calculator.tsx`
- `components/application-form.tsx`
- `components/ui/input.tsx`

---

### 2026-01-26 - 보험료 데이터 스키마 추가 및 배포 가이드 작성
#### 보험료 데이터 스키마
- **테이블**: `premium_rates` 추가
  - 보험종목별(대리/탁송), 나이대별(6개), 담보별(14개) 보험료 저장
  - 버전 관리: `effective_date`, `expiry_date`로 기간별 관리
  - 초기 데이터: 12개 행 삽입 (대리 6개 + 탁송 6개)
- **데이터베이스 함수**:
  - `get_premium_rate()`: 보험종목, 나이대별 보험료 조회
  - `calculate_premium_total()`: 담보 조합별 총액 계산
  - `premium_rates_active` 뷰: 활성화된 보험료만 조회
- **보험료 업데이트 방법** (중요):
  - ⚠️ 보험료는 보험사 정책 변경에 따라 추가/수정될 수 있음
  - 기존 데이터 삭제하지 말고 새 `effective_date`로 행 추가
  - 기존 행의 `expiry_date` 설정하여 버전 관리
  - `is_active` 플래그로 활성화/비활성화 관리
  - 예시:
    ```sql
    -- 기존 보험료 만료일 설정
    UPDATE premium_rates 
    SET expiry_date = '2026-02-01', is_active = false
    WHERE effective_date = '2026-01-22';
    
    -- 새 보험료 추가
    INSERT INTO premium_rates (insurance_type, age_group, ..., effective_date, is_active)
    VALUES ('대리', '31~45', ..., '2026-02-01', true);
    ```

#### 배포 가이드 추가
- **Vercel 배포 가이드** (권장): 상세 절차 및 체크리스트
- **AWS 배포 가이드**: Amplify, EC2, Lambda 옵션별 가이드
- **카페24 호스팅**: 제약사항 및 대안 안내
- **배포 옵션 비교표**: 설정 난이도, 비용, 관리 복잡도 비교

#### 수정된 파일
- `docs/supabase-schema.sql`: 보험료 데이터 스키마 추가 (버전 관리 주석 포함)
- `docs/README.md`: 배포 가이드 섹션 추가, 보험료 데이터 스키마 정보 추가
