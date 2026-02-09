# 트러블슈팅 가이드

**500 Internal Server Error** 발생 시 확인 방법

---

## 1. PHP 에러 메시지 확인

### 1-1. 서버에서 직접 실행 (가장 빠름)

```bash
cd /home/mr4989/www/api
php premium-rates.php
```

**에러 메시지가 바로 나옵니다.** 예:
- `Fatal error: Uncaught Error: Call to undefined function db_query()`
- `Warning: require_once(/home/mr4989/lib/db.php): failed to open stream`
- `DB 연결 실패: Access denied for user...`

### 1-2. PHP 에러 로그 확인

```bash
# Cafe24 일반적인 에러 로그 위치
tail -f /home/mr4989/logs/error.log
# 또는
tail -f /home/mr4989/www/logs/error.log
# 또는
tail -f /var/log/httpd/error_log
```

### 1-3. 브라우저에서 에러 표시 (개발 중에만)

`premium-rates.php` 파일 맨 위에 추가:

```php
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// ... 기존 코드
```

**주의**: 운영 환경에서는 보안상 `display_errors`를 끄는 것이 좋습니다.

---

## 2. 흔한 오류 및 해결

### 2-1. "Call to undefined function db_query()"

**원인**: `lib/db.php` 파일을 찾지 못함

**확인**:
```bash
ls -la /home/mr4989/www/lib/db.php
# 또는
ls -la /home/mr4989/lib/db.php
```

**해결**:
- 파일이 `www/lib/`에 있으면: `require_once __DIR__ . '/../lib/db.php';` (현재 코드)
- 파일이 `/home/mr4989/lib/`에 있으면: `require_once '/home/mr4989/lib/db.php';`

### 2-2. "DB 연결 실패" 또는 "Access denied"

**원인**: config.php의 DB 접속 정보 오류

**확인**:
```bash
php -r "
\$config = require '/home/mr4989/config.php';
echo 'DB: ' . \$config['db']['database'] . PHP_EOL;
echo 'User: ' . \$config['db']['username'] . PHP_EOL;
"
```

**해결**:
- `/home/mr4989/config.php` 파일 확인
- DB 비밀번호, 사용자명, DB명이 올바른지 확인
- MySQL 접속 테스트: `mysql -u mr4989 -p mr4989`

### 2-3. "require_once: failed to open stream"

**원인**: 파일 경로가 잘못됨

**확인**:
```bash
# premium-rates.php가 어디에 있는지 확인
pwd
# 예: /home/mr4989/www/api

# lib/db.php가 어디에 있는지 확인
ls -la /home/mr4989/www/lib/db.php
ls -la /home/mr4989/lib/db.php

# config.php가 어디에 있는지 확인
ls -la /home/mr4989/config.php
```

**해결**: 파일 위치에 맞게 경로 수정

---

## 3. 경로 확인 스크립트

`/home/mr4989/www/test-path.php` 파일 생성:

```php
<?php
echo "<h1>경로 확인</h1>";

echo "<h2>현재 파일 위치</h2>";
echo __FILE__ . "<br>";
echo __DIR__ . "<br>";

echo "<h2>lib/db.php 경로 확인</h2>";
$paths = [
    __DIR__ . '/lib/db.php',
    __DIR__ . '/../lib/db.php',
    '/home/mr4989/lib/db.php',
    '/home/mr4989/www/lib/db.php',
];

foreach ($paths as $path) {
    $exists = file_exists($path);
    echo "$path: " . ($exists ? "✅ 존재" : "❌ 없음") . "<br>";
}

echo "<h2>config.php 경로 확인</h2>";
$configPaths = [
    __DIR__ . '/../config.php',
    '/home/mr4989/config.php',
    '/home/mr4989/www/config.php',
];

foreach ($configPaths as $path) {
    $exists = file_exists($path);
    echo "$path: " . ($exists ? "✅ 존재" : "❌ 없음") . "<br>";
}

echo "<h2>DB 연결 테스트</h2>";
try {
    require_once '/home/mr4989/lib/db.php'; // 또는 실제 경로
    $rows = db_query("SELECT COUNT(*) as cnt FROM partners");
    echo "✅ DB 연결 성공: " . print_r($rows, true);
} catch (Exception $e) {
    echo "❌ DB 연결 실패: " . $e->getMessage();
}
```

브라우저에서 `http://dbins.kr/test-path.php` 접속하면 경로 확인 가능.

---

## 4. 단계별 디버깅

### Step 1: 파일 존재 확인
```bash
ls -la /home/mr4989/www/api/premium-rates.php
ls -la /home/mr4989/www/lib/db.php  # 또는 /home/mr4989/lib/db.php
ls -la /home/mr4989/config.php
```

### Step 2: PHP 문법 확인
```bash
php -l /home/mr4989/www/api/premium-rates.php
php -l /home/mr4989/www/lib/db.php
```

### Step 3: 직접 실행
```bash
cd /home/mr4989/www/api
php premium-rates.php
```

### Step 4: config.php 로드 테스트
```bash
php -r "require '/home/mr4989/config.php'; \$c = require '/home/mr4989/config.php'; print_r(\$c['db']);"
```

### Step 5: DB 연결 테스트
```bash
php -r "
require '/home/mr4989/lib/db.php';
\$rows = db_query('SELECT COUNT(*) as cnt FROM partners');
print_r(\$rows);
"
```

---

## 5. 빠른 수정 (경로 문제일 때)

만약 파일 구조가 다음과 같다면:

```
/home/mr4989/
├── config.php
├── lib/
│   ├── db.php
│   ├── crypto.php
│   ├── aligo.php
│   └── context.php
└── www/
    └── api/
        ├── premium-rates.php
        ├── consultations.php
        └── applications.php
```

**premium-rates.php**에서:
```php
require_once __DIR__ . '/../../lib/db.php';  // www/api → www → lib
```

또는 절대 경로:
```php
require_once '/home/mr4989/lib/db.php';
```

**lib/db.php**에서:
```php
$config = require_once '/home/mr4989/config.php';  // 절대 경로
```

---

**작성일**: 2026-02-09
