# 로컬 개발 환경 설정 가이드

초보자를 위한 단계별 가이드입니다. 순서대로 따라하시면 됩니다.

---

## 📋 사전 준비사항

- macOS, Windows, 또는 Linux 운영체제
- 인터넷 연결
- 터미널(명령 프롬프트) 사용 가능

---

## 1단계: Node.js 설치

### macOS

#### 방법 1: Homebrew 사용 (권장)

```bash
# Homebrew가 없다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node@20

# 또는 nvm 사용 (여러 버전 관리 가능)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc  # 또는 ~/.bash_profile
nvm install 20
nvm use 20
```

#### 방법 2: 공식 사이트에서 설치

1. [Node.js 공식 사이트](https://nodejs.org/) 접속
2. LTS 버전 (20.x 이상) 다운로드
3. 설치 파일 실행하여 설치

### Windows

1. [Node.js 공식 사이트](https://nodejs.org/) 접속
2. LTS 버전 (20.x 이상) 다운로드
3. 설치 파일 실행하여 설치
4. 설치 중 "Add to PATH" 옵션 체크

### 설치 확인

터미널(명령 프롬프트)에서 실행:

```bash
node --version
# v20.x.x 이상이어야 함

npm --version
# 버전이 표시되면 정상
```

---

## 2단계: MySQL 설치

### macOS

#### 방법 1: Homebrew 사용 (권장)

```bash
# MySQL 설치
brew install mysql

# MySQL 시작
brew services start mysql

# MySQL 보안 설정 (비밀번호 설정)
mysql_secure_installation
```

#### 방법 2: MySQL 공식 사이트에서 설치

1. [MySQL 공식 사이트](https://dev.mysql.com/downloads/mysql/) 접속
2. macOS용 설치 파일 다운로드
3. 설치 파일 실행하여 설치
4. 설치 중 root 비밀번호 설정

### Windows

1. [MySQL 공식 사이트](https://dev.mysql.com/downloads/mysql/) 접속
2. Windows용 설치 파일 다운로드
3. 설치 파일 실행하여 설치
4. 설치 중 root 비밀번호 설정
5. 설치 중 "Add MySQL to PATH" 옵션 체크

### Linux (Ubuntu/Debian)

```bash
# MySQL 설치
sudo apt update
sudo apt install mysql-server -y

# MySQL 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 보안 설정
sudo mysql_secure_installation
```

### 설치 확인

터미널에서 실행:

```bash
mysql --version
# 버전이 표시되면 정상

# MySQL 접속 테스트
mysql -u root -p
# 비밀번호 입력 후 접속되면 정상
# exit 입력하여 나가기
```

---

## 3단계: 프로젝트 클론 및 이동

### GitHub에서 클론하는 경우

```bash
# 원하는 폴더로 이동 (예: ~/development)
cd ~/development

# 프로젝트 클론
git clone https://github.com/your-username/daeri.git

# 프로젝트 폴더로 이동
cd daeri
```

### 이미 로컬에 있는 경우

```bash
# 프로젝트 폴더로 이동
cd /Users/simg/development/daeri
# 또는 Windows: cd C:\development\daeri
```

---

## 4단계: MySQL 데이터베이스 생성

### 4-1. MySQL 접속

터미널에서 실행:

```bash
mysql -u root -p
```

비밀번호 입력 후 MySQL 프롬프트(`mysql>`)가 나타나면 성공입니다.

### 4-2. 데이터베이스 생성

MySQL 프롬프트에서 실행:

```sql
-- 데이터베이스 생성
CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 생성 확인
SHOW DATABASES;

-- 사용자 생성 (선택사항, root 사용해도 됨)
CREATE USER 'daeri_user'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON daeri_db.* TO 'daeri_user'@'localhost';
FLUSH PRIVILEGES;

-- MySQL 나가기
exit;
```

### 4-3. 스키마 실행

터미널에서 프로젝트 폴더로 이동한 후:

```bash
# 프로젝트 폴더에서 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql
```

비밀번호 입력 후 실행됩니다. 오류가 없으면 성공입니다.

### 4-4. 데이터 확인 (선택사항)

```bash
# MySQL 접속
mysql -u root -p daeri_db

# 테이블 확인
SHOW TABLES;

# 파트너 데이터 확인
SELECT * FROM partners;

# 보험료 데이터 확인
SELECT COUNT(*) FROM premium_rates;
-- 18개 행이 있어야 함 (대리 6개 + 탁송 6개 + 확대탁송 6개)

# 나가기
exit;
```

---

## 5단계: 환경변수 설정

### 5-1. .env.local 파일 생성

프로젝트 루트 폴더(`daeri/`)에 `.env.local` 파일을 생성합니다.

**macOS/Linux:**

```bash
cd /Users/simg/development/daeri
nano .env.local
```

**Windows:**

```bash
cd C:\development\daeri
notepad .env.local
```

### 5-2. 환경변수 입력

`.env.local` 파일에 다음 내용을 입력합니다:

```env
# MySQL 설정
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=여기에_MySQL_root_비밀번호_입력
MYSQL_DATABASE=daeri_db

# 암호화 키 (32바이트 base64)
# 아래 명령어로 생성 가능: openssl rand -base64 32
FIELD_ENCRYPTION_KEY=여기에_32바이트_base64_키_입력

# 알리고 설정
# 방식 1: AWS Lambda 프록시 사용 (권장, 보안 강화)
# Lambda 프록시 URL이 있으면 아래 ALIGO_LAMBDA_URL만 설정하면 됩니다
ALIGO_LAMBDA_URL=https://j7rqfprgb5.execute-api.ap-northeast-2.amazonaws.com/default/aligo-5962

# 방식 2: 직접 알리고 API 호출 (ALIGO_LAMBDA_URL이 없을 때 사용)
# ALIGO_LAMBDA_URL이 설정되어 있으면 아래 환경변수는 불필요합니다
# ALIGO_USER_ID=알리고_사용자ID
# ALIGO_API_KEY=알리고_API키
# ALIGO_SENDER=발신번호
# ALIGO_SMS_URL=https://apis.aligo.in/send/
# ALIGO_KAKAO_URL=https://apis.aligo.in/akv10/friend/1/1/

# 운영 수신처 (선택사항, 테스트 시에는 비워둬도 됨)
OPERATOR_PHONE=

# Next.js 설정
NODE_ENV=development
PORT=3000
```

### 5-3. 암호화 키 생성 (필수)

터미널에서 실행:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

생성된 키를 `FIELD_ENCRYPTION_KEY`에 입력합니다.

### 5-4. 파일 저장

- **nano**: `Ctrl + X`, `Y`, `Enter`
- **notepad**: `Ctrl + S`

---

## 6단계: 의존성 설치

프로젝트 폴더에서 실행:

```bash
# 프로젝트 폴더로 이동 (이미 있다면 생략)
cd /Users/simg/development/daeri

# 의존성 설치
npm install
```

설치가 완료되면 `node_modules` 폴더가 생성됩니다.

**오류 발생 시:**

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 7단계: 개발 서버 실행

### 7-1. MySQL 실행 확인

```bash
# macOS (Homebrew)
brew services list | grep mysql
# 또는
brew services start mysql

# Windows
# 서비스에서 MySQL 확인

# Linux
sudo systemctl status mysql
```

### 7-2. 개발 서버 시작

프로젝트 폴더에서 실행:

```bash
npm run dev
```

다음과 같은 메시지가 나타나면 성공:

```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### 7-3. 브라우저에서 확인

브라우저를 열고 다음 주소로 접속:

```
http://localhost:3000
```

웹사이트가 표시되면 성공입니다!

---

## 8단계: 기능 테스트

### 8-1. 상담신청 테스트

1. 웹사이트에서 "상담신청" 버튼 클릭
2. 이름, 전화번호 입력
3. 제출
4. MySQL에서 확인:

```bash
mysql -u root -p daeri_db
SELECT * FROM consultations ORDER BY created_at DESC LIMIT 1;
exit;
```

### 8-2. 가입신청 테스트

1. 웹사이트에서 "가입신청" 버튼 클릭
2. 필요한 정보 입력
3. 제출
4. MySQL에서 확인:

```bash
mysql -u root -p daeri_db
SELECT * FROM applications ORDER BY created_at DESC LIMIT 1;
SELECT * FROM application_secrets WHERE application_id = '방금_생성된_ID';
exit;
```

---

## 🔧 문제 해결

### 문제 1: Node.js 버전이 낮음

```bash
# nvm 사용 시
nvm install 20
nvm use 20

# 또는 Homebrew
brew upgrade node
```

### 문제 2: MySQL 연결 오류

**오류 메시지**: `ER_ACCESS_DENIED_ERROR` 또는 `ECONNREFUSED`

**해결 방법:**

1. MySQL이 실행 중인지 확인:

```bash
# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

2. 비밀번호 확인:

```bash
# MySQL 접속 테스트
mysql -u root -p
# 비밀번호가 맞는지 확인
```

3. `.env.local` 파일의 `MYSQL_PASSWORD` 확인

### 문제 3: 포트 3000이 이미 사용 중

**오류 메시지**: `Port 3000 is already in use`

**해결 방법:**

```bash
# macOS/Linux: 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 [PID]

# 또는 다른 포트 사용
PORT=3001 npm run dev
```

### 문제 4: npm install 오류

**해결 방법:**

```bash
# 캐시 삭제
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 문제 5: 빌드 오류

**해결 방법:**

```bash
# .next 폴더 삭제 후 재빌드
rm -rf .next
npm run build
```

---

## 📝 체크리스트

로컬 개발 환경 설정이 완료되었는지 확인하세요:

- [ ] Node.js 20.x 이상 설치 완료
- [ ] MySQL 설치 완료
- [ ] MySQL 데이터베이스 생성 완료
- [ ] 스키마 실행 완료
- [ ] `.env.local` 파일 생성 및 환경변수 설정 완료
- [ ] 암호화 키 생성 완료
- [ ] `npm install` 완료
- [ ] `npm run dev` 실행 성공
- [ ] 브라우저에서 `http://localhost:3000` 접속 성공
- [ ] 상담신청 테스트 완료
- [ ] 가입신청 테스트 완료

---

## 🎯 다음 단계

로컬 개발 환경이 준비되었습니다!

1. **코드 수정**: `app/`, `components/`, `lib/` 폴더에서 코드 수정
2. **자동 새로고침**: 파일 저장 시 자동으로 브라우저가 새로고침됨
3. **API 테스트**: `http://localhost:3000/api/consultations` 등으로 API 테스트 가능
4. **데이터베이스 확인**: MySQL에서 데이터 확인

---

## 💡 유용한 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# MySQL 접속
mysql -u root -p daeri_db

# MySQL 데이터 확인
mysql -u root -p daeri_db -e "SELECT * FROM consultations;"

# 로그 확인 (개발 서버 실행 중)
# 터미널에서 직접 확인 가능
```

---

**작성일**: 2026-02-02  
**목적**: 로컬 개발 환경 설정 가이드
