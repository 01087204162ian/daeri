# 서버 설정 파일 (config / .env)

DB 접속 정보·알리고 API 키 등을 서버에 두는 방법입니다. **Phase 1(스키마 적용) 이후, Phase 2(PHP 구현) 전에** 만들어 두면 됩니다.

---

## 1. PHP에서는 config.php 권장

Cafe24 PHP 환경에서는 **.env**를 자동으로 읽지 않습니다.  
설정은 **config.php** 하나로 두고, PHP에서 `require` 로 불러 쓰는 방식을 권장합니다.

- **예시 파일**: `../config.sample.php`  
- **변수 참고용**: `../env.sample` (이름만 Next.js .env와 맞춰 둔 목록)

---

## 2. 서버에서 config.php 만들기

### 2-1. 올릴 내용 준비

1. 로컬의 `daeri/cafe24/config.sample.php` 를 열어 복사하거나, 서버에 업로드한 뒤 이름만 변경합니다.
2. 다음 값을 **실제 값**으로 바꿉니다.
   - `db.password`: Cafe24 DB 비밀번호
   - `aligo.user_id`, `aligo.api_key`, `aligo.sender`: 알리고 SMS 사용 시 (사용 안 하면 빈 문자열로 두어도 됨)
   - `aligo_lambda_url`: Lambda 프록시 사용 시에만 URL 입력

### 2-2. 서버에 두는 위치

**방법 A: 웹루트 상위 (권장)**  
- 경로 예: `/home/mr4989/config.php` (DOCUMENT_ROOT가 `/home/mr4989/www` 일 때)
- 웹 URL로는 접근 불가하므로 별도 보안 설정 없이 사용 가능.
- Phase 2 PHP에서 예: `require_once __DIR__ . '/../config.php';`

**방법 B: www 안에 두기**  
- 경로 예: `/home/mr4989/www/config.php`
- 반드시 **.htaccess** 로 직접 접근을 막아야 합니다 (아래 2-3 참고).

### 2-3. www 안에 둘 때 .htaccess 로 차단

`www/config.php` 를 쓰는 경우, 같은 디렉터리에 `.htaccess` 가 있다면 **맨 위에** 아래를 추가합니다. 없으면 새로 만들어도 됩니다.

```apache
<Files "config.php">
    Require all denied
</Files>
```

---

## 3. config.php 사용 예 (Phase 2 PHP에서)

```php
<?php
$config = require_once __DIR__ . '/../config.php';  // 방법 A
// $config = require_once __DIR__ . '/config.php';   // 방법 B (www 안에 둔 경우)

$db = $config['db'];
$mysqli = new mysqli(
    $db['host'],
    $db['username'],
    $db['password'],
    $db['database'],
    $db['port'] ?? 3306
);
$mysqli->set_charset($db['charset'] ?? 'utf8mb4');
```

---

## 4. .env 를 꼭 쓰고 싶을 때

- PHP는 기본으로 .env를 읽지 않습니다.
- **vlucas/phpdotenv** 같은 라이브러리를 쓰면 .env 파일을 로드할 수 있습니다 (Composer 필요).
- Cafe24 공유 호스팅에서는 **config.php** 한 파일로 처리하는 편이 단순합니다.

---

**작성일**: 2026-02-09
