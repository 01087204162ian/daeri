# Phase 2: PHP API 테스트 방법

**대상**: `api/premium-rates.php`, `api/consultations.php`, `api/applications.php`  
**목적**: PHP API가 정상 동작하는지 확인

---

## 1. 사전 확인

### 1-1. 파일 위치 확인
```bash
# 서버에서 확인
ls -la /home/mr4989/www/api/
# 예상: premium-rates.php, consultations.php, applications.php

ls -la /home/mr4989/lib/
# 예상: db.php, crypto.php, aligo.php, context.php
```

### 1-2. config.php 확인
```bash
# config.php에 필수 값이 있는지 확인 (비밀번호는 보이지 않게)
php -r "require '/home/mr4989/config.php'; \$c = require '/home/mr4989/config.php'; echo 'DB: ' . \$c['db']['database'] . PHP_EOL; echo '암호화 키: ' . (empty(\$c['field_encryption_key']) ? '없음' : '있음') . PHP_EOL;"
```

---

## 2. 테스트 1: premium-rates.php (GET)

### 2-1. 브라우저에서 테스트
```
http://dbins.kr/api/premium-rates.php
```

**예상 결과**: JSON 응답
```json
{
  "ok": true,
  "data": [
    {
      "insurance_type": "대리",
      "age_group": "26~30",
      "daein2": 362700,
      "daemul_3천": 283460,
      ...
    },
    ...
  ]
}
```

### 2-2. curl로 테스트
```bash
curl -X GET "http://dbins.kr/api/premium-rates.php" \
  -H "Content-Type: application/json"
```

### 2-3. 서버에서 직접 테스트
```bash
cd /home/mr4989/www/api
php premium-rates.php
```

**확인 포인트**:
- [ ] JSON 응답이 나옴 (`{"ok":true,"data":[...]}`)
- [ ] `data` 배열에 보험료 데이터가 있음 (18행)
- [ ] 한글 키가 정상 (`daemul_3천`, `jason_3천` 등)
- [ ] 오류 없음 (500 에러, PHP 에러 메시지 없음)

---

## 3. 테스트 2: consultations.php (POST)

### 3-1. curl로 테스트
```bash
curl -X POST "http://dbins.kr/api/consultations.php" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트",
    "phone": "010-1234-5678",
    "serviceType": "대리운전",
    "message": "상담 신청 테스트",
    "consentPrivacy": true
  }'
```

**예상 결과**:
```json
{
  "ok": true,
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3-2. DB에서 확인
```bash
mysql -u mr4989 -p mr4989 -e "
  SELECT id, name, phone, service_type, message, created_at 
  FROM consultations 
  ORDER BY created_at DESC 
  LIMIT 1;
"
```

**확인 포인트**:
- [ ] 응답: `{"ok":true,"id":"..."}`
- [ ] DB에 consultations 행이 추가됨
- [ ] SMS 발송 로그가 message_logs에 저장됨 (알리고 설정이 있으면)
- [ ] 오류 없음

### 3-3. 유효성 검사 테스트 (오류 케이스)
```bash
# consentPrivacy 없음 → 오류
curl -X POST "http://dbins.kr/api/consultations.php" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","phone":"010-1234-5678"}'

# 예상: {"ok":false,"error":"CONSENT_REQUIRED"}
```

---

## 4. 테스트 3: applications.php (POST)

### 4-1. curl로 테스트 (계약자=대리기사 동일)
```bash
curl -X POST "http://dbins.kr/api/applications.php" \
  -H "Content-Type: application/json" \
  -d '{
    "insuranceType": "대리",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "residentNumber1": "900101",
    "residentNumber2": "1234567",
    "yearlyPremium": "500000",
    "firstPremium": "50000",
    "address": "서울시 강남구",
    "addressDetail": "테헤란로 123",
    "isSamePerson": true,
    "bankName": "국민은행",
    "accountNumber": "123-456-789012",
    "consentPrivacy": true
  }'
```

**예상 결과**:
```json
{
  "ok": true,
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4-2. DB에서 확인
```bash
mysql -u mr4989 -p mr4989 -e "
  SELECT id, name, phone, insurance_type, is_same_person, created_at 
  FROM applications 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  SELECT application_id, 
    LENGTH(resident_number_enc) as enc_len,
    LENGTH(account_number_enc) as acc_enc_len
  FROM application_secrets 
  ORDER BY created_at DESC 
  LIMIT 1;
"
```

**확인 포인트**:
- [ ] 응답: `{"ok":true,"id":"..."}`
- [ ] DB에 applications 행이 추가됨
- [ ] application_secrets에 암호화된 데이터가 저장됨 (`enc_len` > 0)
- [ ] SMS 발송 로그가 message_logs에 저장됨
- [ ] 오류 없음

### 4-3. 계약자≠대리기사 케이스 테스트
```bash
curl -X POST "http://dbins.kr/api/applications.php" \
  -H "Content-Type: application/json" \
  -d '{
    "insuranceType": "대리",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "residentNumber1": "900101",
    "residentNumber2": "1234567",
    "address": "서울시 강남구",
    "addressDetail": "테헤란로 123",
    "isSamePerson": false,
    "contractorName": "김철수",
    "contractorPhone": "010-9876-5432",
    "contractorResidentNumber1": "850202",
    "contractorResidentNumber2": "2345678",
    "bankName": "국민은행",
    "accountNumber": "123-456-789012",
    "consentPrivacy": true
  }'
```

**확인 포인트**:
- [ ] applications에 `contractor_name`, `contractor_phone` 저장됨
- [ ] application_secrets에 `contractor_resident_number_enc` 저장됨

---

## 5. 오류 확인 방법

### 5-1. PHP 에러 로그 확인
```bash
# Cafe24 PHP 에러 로그 위치 확인 (보통)
tail -f /home/mr4989/logs/error.log
# 또는
tail -f /home/mr4989/www/logs/error.log
```

### 5-2. 직접 실행하여 에러 확인
```bash
cd /home/mr4989/www/api
php premium-rates.php
php consultations.php  # POST 요청이므로 직접 실행 시 오류 가능 (정상)
```

### 5-3. DB 연결 테스트
```bash
php -r "
require '/home/mr4989/lib/db.php';
\$rows = db_query('SELECT COUNT(*) as cnt FROM partners');
print_r(\$rows);
"
```

---

## 6. 빠른 테스트 스크립트 (서버에서 실행)

`/home/mr4989/www/test-api.php` 파일 생성:

```php
<?php
/**
 * API 테스트 스크립트
 * 브라우저에서: http://dbins.kr/test-api.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h1>daeri API 테스트</h1>";

// 1. premium-rates 테스트
echo "<h2>1. premium-rates.php (GET)</h2>";
$ch = curl_init('http://dbins.kr/api/premium-rates.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<p>HTTP Code: $httpCode</p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

// 2. consultations 테스트 (POST)
echo "<h2>2. consultations.php (POST)</h2>";
$data = json_encode([
    'name' => '테스트',
    'phone' => '010-1234-5678',
    'serviceType' => '대리운전',
    'message' => '상담 신청 테스트',
    'consentPrivacy' => true,
]);

$ch = curl_init('http://dbins.kr/api/consultations.php');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $data,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<p>HTTP Code: $httpCode</p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

echo "<p><strong>테스트 완료</strong></p>";
```

브라우저에서 `http://dbins.kr/test-api.php` 접속하면 결과 확인 가능.

---

## 7. 체크리스트

- [ ] **premium-rates.php**: GET 요청 → JSON 응답, 데이터 18행
- [ ] **consultations.php**: POST 요청 → `{"ok":true,"id":"..."}`, DB 저장 확인
- [ ] **applications.php**: POST 요청 → `{"ok":true,"id":"..."}`, DB 저장, 암호화 확인
- [ ] **SMS 발송**: 알리고 설정이 있으면 message_logs에 로그 저장 확인
- [ ] **오류 처리**: 잘못된 요청 시 적절한 오류 응답 (400, 500 등)
- [ ] **UTF-8**: 한글 데이터가 깨지지 않음

---

**작성일**: 2026-02-09
