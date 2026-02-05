# Supabase → MySQL 마이그레이션 완료 요약

## ✅ 변경 완료 사항

### 1. 데이터베이스 변경
- ❌ **이전**: Supabase (PostgreSQL)
- ✅ **현재**: MySQL

### 2. 구조 변경
- ✅ **1개 포트만 사용** (포트 3000)
- ✅ **Next.js API Routes 유지** (별도 Express 서버 불필요)
- ✅ **프론트엔드 코드 변경 없음**

### 3. 파일 변경 내역

#### 새로 생성된 파일
- `docs/mysql-schema.sql` - MySQL 스키마
- `lib/mysql.ts` - MySQL 연결 라이브러리
- `docs/DEPLOYMENT_GUIDE.md` - EC2 배포 가이드
- `deploy.sh` - 배포 스크립트

#### 수정된 파일
- `app/api/_lib/context.ts` - Supabase → MySQL
- `app/api/consultations/route.ts` - Supabase → MySQL
- `app/api/applications/route.ts` - Supabase → MySQL
- `lib/premium-data.ts` - 확대탁송 타입 추가
- `package.json` - mysql2 패키지 추가
- `docs/README.md` - MySQL 정보로 업데이트

#### 삭제/비활성화 가능한 파일
- `lib/supabase-server.ts` - 더 이상 사용 안 함 (삭제 가능)

---

## 📋 보험료 데이터 변경사항

### 보험종목 추가
- ✅ **확대탁송** 추가 (6개 나이대)

### 탁송 자차 보험료 변경
- 기존 값 → 새 값으로 업데이트됨

### 보험료 계산 방식
- **계산식**: 대인보험료 + 대물보험료 + 자손보험료 + 자차보험료 + 법률비용보험료
- **책임초과무한** = 대인2
- **책임포함무한** = 대인2 + 대인1특약

---

## 🚀 배포 방법

### 로컬 개발
```bash
# 1. MySQL 설치 및 데이터베이스 생성
mysql -u root -p
CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 스키마 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql

# 3. 환경변수 설정 (.env.local)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=비밀번호
MYSQL_DATABASE=daeri_db
FIELD_ENCRYPTION_KEY=32바이트_base64_키
# ... 기타 환경변수

# 4. 의존성 설치
npm install

# 5. 개발 서버 실행
npm run dev
```

### EC2 배포
```bash
# 1. EC2 서버 준비 (Node.js 20, MySQL, PM2 설치)
# 2. 프로젝트 클론
git clone https://github.com/your-username/daeri.git
cd daeri

# 3. 환경변수 설정 (.env.production)
# 4. 스키마 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql

# 5. 빌드 및 실행
npm install
npm run build
pm2 start npm --name "daeri" -- start

# 6. Nginx 설정 (리버스 프록시)
# 7. SSL 인증서 설정
```

자세한 내용은 `docs/DEPLOYMENT_GUIDE.md` 참고

---

## 🔄 GitHub → EC2 자동 배포

### 방법 1: GitHub Actions (권장)
- `.github/workflows/deploy.yml` 파일 생성
- GitHub Secrets 설정
- `main` 브랜치 push 시 자동 배포

### 방법 2: 수동 배포
```bash
# EC2에 SSH 접속 후
cd /home/ubuntu/daeri
./deploy.sh
```

---

## 📝 환경변수 체크리스트

### 필수 환경변수
- [ ] `MYSQL_HOST`
- [ ] `MYSQL_PORT`
- [ ] `MYSQL_USER`
- [ ] `MYSQL_PASSWORD`
- [ ] `MYSQL_DATABASE`
- [ ] `FIELD_ENCRYPTION_KEY`
- [ ] `ALIGO_USER_ID`
- [ ] `ALIGO_API_KEY`
- [ ] `ALIGO_SENDER`
- [ ] `ALIGO_SMS_URL`
- [ ] `OPERATOR_PHONE` (선택사항)

---

## ⚠️ 주의사항

1. **Supabase 환경변수 제거**: 더 이상 필요 없음
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **MySQL 연결**: 로컬 개발 시 MySQL이 실행 중이어야 함

3. **보험료 데이터**: MySQL에 초기 데이터가 삽입되어 있어야 함

4. **암호화 키**: 기존 Supabase에서 사용하던 키와 동일하게 유지 권장

---

## 🎯 다음 단계

1. 로컬에서 MySQL 설정 및 테스트
2. EC2 서버 준비
3. 배포 및 기능 테스트
4. GitHub Actions 설정 (선택사항)

---

**작성일**: 2026-02-02  
**마이그레이션 완료**: Supabase → MySQL
