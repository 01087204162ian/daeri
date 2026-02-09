# 스키마 적용 확인 방법

**대상**: Cafe24 MariaDB 10.6 (DB: mr4989)  
**확인 목적**: `schema-mariadb-10.6.sql` 이 제대로 적용되었는지 검증

---

## 1. 기본 확인 (테이블 목록 및 데이터 개수)

### 1-1. mysql 클라이언트로 한 번에 확인

```bash
mysql -u mr4989 -p mr4989 -e "
  SHOW TABLES;
  SELECT COUNT(*) AS partners FROM partners;
  SELECT COUNT(*) AS premium_rates FROM premium_rates;
"
```

**예상 결과**:
```
+----------------------------+
| Tables_in_mr4989           |
+----------------------------+
| application_secrets         |
| applications               |
| consultations              |
| message_logs              |
| partners                   |
| premium_rates              |
+----------------------------+
6 rows in set

+----------+
| partners |
+----------+
|        1 |
+----------+

+---------------+
| premium_rates |
+---------------+
|            18 |
+---------------+
```

### 1-2. mysql 접속 후 확인

```bash
mysql -u mr4989 -p mr4989
```

접속 후:

```sql
-- 테이블 목록 확인
SHOW TABLES;

-- 초기 데이터 확인
SELECT COUNT(*) AS partners FROM partners;
SELECT COUNT(*) AS premium_rates FROM premium_rates;

-- partners 데이터 확인
SELECT * FROM partners;

-- premium_rates 샘플 확인 (대리 26~30세)
SELECT insurance_type, age_group, daein2, daemul_3k, jacha_1k 
FROM premium_rates 
WHERE insurance_type = '대리' AND age_group = '26~30';

exit
```

---

## 2. 테이블 구조 확인 (문자셋·엔진·컬럼)

### 2-1. 각 테이블의 문자셋·엔진 확인

```sql
SHOW CREATE TABLE partners;
SHOW CREATE TABLE consultations;
SHOW CREATE TABLE applications;
SHOW CREATE TABLE application_secrets;
SHOW CREATE TABLE message_logs;
SHOW CREATE TABLE premium_rates;
```

**확인 포인트**:
- `DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci` 포함 여부
- `ENGINE=InnoDB` 포함 여부

### 2-2. 특정 테이블 구조만 간단히 확인

```sql
-- 테이블 정보 요약
SHOW TABLE STATUS LIKE 'partners';
SHOW TABLE STATUS LIKE 'premium_rates';

-- 또는
SELECT 
  TABLE_NAME,
  ENGINE,
  TABLE_COLLATION,
  TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mr4989';
```

**확인 포인트**:
- `Engine`: InnoDB
- `Collation`: utf8mb4_unicode_ci

---

## 3. 컬럼 구조 확인 (특히 premium_rates의 ASCII 컬럼명)

### 3-1. premium_rates 컬럼 확인

```sql
DESCRIBE premium_rates;
-- 또는
SHOW COLUMNS FROM premium_rates;
```

**확인 포인트**:
- 한글 컬럼명이 **ASCII로 변경**되었는지 확인:
  - ✅ `daemul_3k` (O)
  - ❌ `daemul_3천` (X - 한글 컬럼명이면 오류 가능)
- `daein2`, `daein1_special`, `jacha_1k`, `jacha_2k`, `jacha_3k` 등

### 3-2. 모든 테이블의 컬럼 목록 확인

```sql
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  CHARACTER_SET_NAME,
  COLLATION_NAME
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'mr4989'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

---

## 4. 인덱스·외래키 확인

### 4-1. 인덱스 확인

```sql
SHOW INDEX FROM consultations;
SHOW INDEX FROM applications;
SHOW INDEX FROM premium_rates;
```

**확인 포인트**:
- `consultations`: `idx_partner_id`, `idx_created_at`
- `applications`: `idx_partner_id`, `idx_created_at`
- `premium_rates`: `unique_premium`, `idx_insurance_type`, `idx_age_group` 등

### 4-2. 외래키 확인

```sql
SELECT 
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'mr4989'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

**확인 포인트**:
- `consultations.partner_id` → `partners.id`
- `applications.partner_id` → `partners.id`
- `application_secrets.application_id` → `applications.id`

---

## 5. 초기 데이터 상세 확인

### 5-1. partners 데이터

```sql
SELECT * FROM partners;
```

**예상 결과**:
- `id`: UUID 형식 (예: `550e8400-e29b-41d4-a716-446655440000`)
- `code`: `'default'`
- `name`: `'기본'` 또는 설정한 이름
- `status`: `'active'`

### 5-2. premium_rates 데이터 (보험종목별 개수)

```sql
SELECT insurance_type, COUNT(*) AS count
FROM premium_rates
GROUP BY insurance_type;
```

**예상 결과**:
```
+----------------+-------+
| insurance_type | count |
+----------------+-------+
| 대리           |     6 |
| 탁송           |     6 |
| 확대탁송       |     6 |
+----------------+-------+
```

### 5-3. premium_rates 샘플 데이터 확인

```sql
SELECT 
  insurance_type,
  age_group,
  daein2,
  daemul_3k,
  daemul_1eok,
  jacha_1k,
  legal_cost
FROM premium_rates
WHERE insurance_type = '대리' AND age_group = '26~30';
```

**확인 포인트**:
- 숫자 값이 정상적으로 들어가 있는지
- `rent_cost`는 탁송/확대탁송만 NULL 가능

---

## 6. DB·서버 문자셋 확인

### 6-1. DB 문자셋 확인

```sql
SHOW CREATE DATABASE mr4989;
```

**확인 포인트**:
- `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`

### 6-2. 서버 기본 문자셋 확인

```sql
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

---

## 7. 빠른 확인 스크립트 (한 번에 실행)

```bash
mysql -u mr4989 -p mr4989 <<EOF
-- 테이블 목록
SHOW TABLES;

-- 데이터 개수
SELECT 'partners' AS table_name, COUNT(*) AS count FROM partners
UNION ALL
SELECT 'premium_rates', COUNT(*) FROM premium_rates
UNION ALL
SELECT 'consultations', COUNT(*) FROM consultations
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;

-- premium_rates 샘플
SELECT insurance_type, age_group, daein2, daemul_3k 
FROM premium_rates 
LIMIT 3;

-- 문자셋 확인
SELECT TABLE_NAME, TABLE_COLLATION 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'mr4989';
EOF
```

---

## 8. 확인 체크리스트

- [ ] 테이블 6개 모두 존재 (partners, consultations, applications, application_secrets, message_logs, premium_rates)
- [ ] partners: 1행
- [ ] premium_rates: 18행 (대리 6, 탁송 6, 확대탁송 6)
- [ ] 모든 테이블: `CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
- [ ] 모든 테이블: `ENGINE=InnoDB`
- [ ] premium_rates 컬럼명: ASCII (`daemul_3k`, `daemul_1eok` 등, 한글 없음)
- [ ] 인덱스: consultations/applications에 `idx_partner_id`, `idx_created_at` 존재
- [ ] 외래키: consultations/applications → partners, application_secrets → applications
- [ ] premium_rates: `unique_premium` (insurance_type, age_group, effective_date) 유니크 제약

---

**작성일**: 2026-02-09
