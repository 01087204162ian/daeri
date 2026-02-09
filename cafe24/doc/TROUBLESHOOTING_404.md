# 404 오류 해결 가이드

## 문제 상황

브라우저 콘솔에서 다음과 같은 오류가 발생할 수 있습니다:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

## 원인 분석

404 오류는 서버에서 요청한 리소스를 찾을 수 없을 때 발생합니다. 다음 리소스들이 누락되었을 수 있습니다:

### 1. 이미지 파일
- `/images/db-logo.png` - DB손해보험 로고

### 2. JavaScript 파일
- `/js/premium-data.js`
- `/js/resident-number.js`
- `/js/premium-calculator.js`
- `/js/consultation.js`
- `/js/application.js`
- `/js/main.js`

### 3. CSS 파일
- `/css/style.css`

### 4. API 엔드포인트
- `/api/premium-rates.php`
- `/api/consultations.php`
- `/api/applications.php`

## 해결 방법

### 1. 파일 업로드 확인

Cafe24 서버의 `/home/mr4989/www/` 디렉터리 구조를 확인하세요:

```
/home/mr4989/www/
├── index.html
├── images/
│   └── db-logo.png          ← 로고 파일 필요
├── js/
│   ├── premium-data.js      ← JS 파일들 필요
│   ├── resident-number.js
│   ├── premium-calculator.js
│   ├── consultation.js
│   ├── application.js
│   └── main.js
├── css/
│   └── style.css            ← CSS 파일 필요
└── api/
    ├── premium-rates.php    ← API 파일들 필요
    ├── consultations.php
    └── applications.php
```

### 2. 파일 경로 확인

브라우저 개발자 도구(F12)의 Network 탭에서:
1. 어떤 파일이 404 오류인지 확인
2. 실제 파일 경로와 요청 경로가 일치하는지 확인

### 3. 파일 권한 확인

SSH로 서버에 접속하여 파일 권한을 확인:

```bash
# 파일 존재 확인
ls -la /home/mr4989/www/images/db-logo.png
ls -la /home/mr4989/www/js/*.js
ls -la /home/mr4989/www/css/style.css

# 파일 권한 설정 (필요 시)
chmod 644 /home/mr4989/www/images/db-logo.png
chmod 644 /home/mr4989/www/js/*.js
chmod 644 /home/mr4989/www/css/style.css
```

### 4. 로고 이미지 복사

로고 파일이 없다면 `daeri/public/images/db-logo.png`를 Cafe24 서버로 복사:

```bash
# 로컬에서
scp daeri/public/images/db-logo.png mr4989@서버주소:/home/mr4989/www/images/
```

또는 FTP/SFTP 클라이언트를 사용하여 업로드

### 5. 디렉터리 생성

필요한 디렉터리가 없다면 생성:

```bash
mkdir -p /home/mr4989/www/images
mkdir -p /home/mr4989/www/js
mkdir -p /home/mr4989/www/css
mkdir -p /home/mr4989/www/api
```

## 체크리스트

업로드 전 확인사항:

- [ ] `index.html`이 `/home/mr4989/www/`에 있음
- [ ] `images/db-logo.png` 파일이 있음
- [ ] `js/` 디렉터리에 모든 JS 파일이 있음 (6개 파일)
- [ ] `css/style.css` 파일이 있음
- [ ] `api/` 디렉터리에 PHP 파일들이 있음 (3개 파일)
- [ ] 모든 파일의 권한이 644 이상임
- [ ] 브라우저에서 직접 URL 접근 시 파일이 다운로드됨

## 테스트 방법

브라우저에서 직접 접근하여 확인:

```
http://dbins.kr/images/db-logo.png
http://dbins.kr/js/premium-data.js
http://dbins.kr/css/style.css
http://dbins.kr/api/premium-rates.php
```

각 URL이 정상적으로 응답하는지 확인하세요.
