# daeri 배포 가이드 (GitHub → EC2)

## 📋 개요

- **프로젝트**: Next.js (프론트엔드 + API Routes)
- **데이터베이스**: MySQL
- **배포 방식**: GitHub → EC2 자동 배포
- **포트**: 1개 (3000)

---

## 1단계: MySQL 데이터베이스 준비

### 1-1. MySQL 설치 (EC2 또는 로컬)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server -y

# MySQL 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 보안 설정
sudo mysql_secure_installation
```

### 1-2. 데이터베이스 생성

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE daeri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 (선택사항)
CREATE USER 'daeri_user'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON daeri_db.* TO 'daeri_user'@'localhost';
FLUSH PRIVILEGES;
```

### 1-3. 스키마 실행

```bash
# 스키마 파일 실행
mysql -u root -p daeri_db < docs/mysql-schema.sql
```

---

## 2단계: EC2 서버 준비

### 2-1. Node.js 설치 (Node.js 20 이상 필요)

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Node.js 20 설치
nvm install 20
nvm use 20
nvm alias default 20

# 확인
node --version  # v20.x.x 이상이어야 함
```

### 2-2. PM2 설치 (프로세스 관리)

```bash
npm install -g pm2
```

### 2-3. Git 설치

```bash
sudo apt install git -y
```

---

## 3단계: 프로젝트 배포

### 3-1. 프로젝트 클론

```bash
cd /home/ubuntu  # 또는 원하는 경로
git clone https://github.com/your-username/daeri.git
cd daeri
```

### 3-2. 환경변수 설정

```bash
# .env.production 파일 생성
nano .env.production
```

다음 내용 입력:

```env
# MySQL 설정
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=daeri_user
MYSQL_PASSWORD=비밀번호
MYSQL_DATABASE=daeri_db

# 암호화 키 (32바이트 base64)
FIELD_ENCRYPTION_KEY=여기에_32바이트_base64_키_입력

# 알리고 설정
ALIGO_USER_ID=알리고_사용자ID
ALIGO_API_KEY=알리고_API키
ALIGO_SENDER=발신번호
ALIGO_SMS_URL=https://apis.aligo.in/send/
ALIGO_KAKAO_URL=https://apis.aligo.in/akv10/friend/1/1/

# 운영 수신처
OPERATOR_PHONE=담당자_수신번호

# Next.js 설정
NODE_ENV=production
PORT=3000
```

### 3-3. 의존성 설치 및 빌드

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

### 3-4. PM2로 서버 실행

```bash
# PM2로 서버 시작
pm2 start npm --name "daeri" -- start

# PM2 설정 저장 (재부팅 시 자동 시작)
pm2 save
pm2 startup
```

---

## 4단계: Nginx 설정 (리버스 프록시)

### 4-1. Nginx 설치

```bash
sudo apt install nginx -y
```

### 4-2. Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/daeri
```

다음 내용 입력:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4-3. 심볼릭 링크 생성 및 Nginx 재시작

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/daeri /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 4-4. SSL 인증서 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx -y

# SSL 인증서 발급
sudo certbot --nginx -d daeri-site.com -d *.daeri-site.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

---

## 5단계: GitHub Actions 자동 배포 설정

### 5-1. GitHub Actions 워크플로우 파일 생성

프로젝트 루트에 `.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/daeri
            git pull origin main
            npm install
            npm run build
            pm2 restart daeri
```

### 5-2. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 추가:

- `EC2_HOST`: EC2 퍼블릭 IP 또는 도메인
- `EC2_USER`: ubuntu (또는 사용자명)
- `EC2_SSH_KEY`: EC2 접속용 SSH 개인키 전체 내용

---

## 6단계: 배포 확인

### 6-1. 서버 상태 확인

```bash
# PM2 상태 확인
pm2 status

# PM2 로그 확인
pm2 logs daeri

# Nginx 상태 확인
sudo systemctl status nginx
```

### 6-2. 기능 테스트

1. 웹사이트 접속: `http://daeri-site.com`
2. 상담신청 제출 테스트
3. 가입신청 제출 테스트
4. MySQL 데이터 확인

---

## 7단계: 유지보수

### 7-1. 수동 배포 (GitHub Actions 없이)

```bash
# EC2에 SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 프로젝트 폴더로 이동
cd /home/ubuntu/daeri

# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트 (필요시)
npm install

# 빌드
npm run build

# 서버 재시작
pm2 restart daeri
```

### 7-2. 로그 확인

```bash
# PM2 로그
pm2 logs daeri

# Nginx 로그
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 7-3. 서버 재시작

```bash
# PM2 재시작
pm2 restart daeri

# PM2 중지
pm2 stop daeri

# PM2 시작
pm2 start daeri
```

---

## 🔧 문제 해결

### MySQL 연결 오류

```bash
# MySQL 상태 확인
sudo systemctl status mysql

# MySQL 재시작
sudo systemctl restart mysql

# MySQL 접속 테스트
mysql -u daeri_user -p daeri_db
```

### 포트 충돌

```bash
# 포트 사용 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 [PID]
```

### PM2 문제

```bash
# PM2 재설정
pm2 delete daeri
pm2 start npm --name "daeri" -- start
pm2 save
```

---

## 📝 체크리스트

- [ ] MySQL 설치 및 데이터베이스 생성
- [ ] 스키마 실행 완료
- [ ] Node.js 20 설치 완료
- [ ] PM2 설치 완료
- [ ] 프로젝트 클론 완료
- [ ] 환경변수 설정 완료
- [ ] 빌드 성공
- [ ] PM2 서버 실행 성공
- [ ] Nginx 설정 완료
- [ ] SSL 인증서 발급 완료
- [ ] GitHub Actions 설정 완료 (선택사항)
- [ ] 기능 테스트 완료

---

**작성일**: 2026-02-02  
**목적**: GitHub → EC2 자동 배포 가이드
