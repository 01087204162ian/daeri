# 보험료 업데이트 가이드

## 개요

보험료 데이터는 보험사 정책 변경에 따라 추가/수정될 수 있습니다. 기존 데이터를 삭제하지 말고 버전 관리를 통해 업데이트하시기 바랍니다.

## 보험료 테이블 구조

- `premium_rates` 테이블은 `effective_date`와 `expiry_date`로 기간별 버전 관리를 지원합니다.
- `is_active` 플래그로 활성화/비활성화 관리 가능합니다.
- 유니크 제약조건: `(insurance_type, age_group, effective_date)` 조합은 유일해야 합니다.

## 업데이트 방법

### 방법 1: 새 보험료 추가 (권장) ⭐

기존 보험료를 유지하면서 새로운 `effective_date`로 새 행을 추가합니다.

```sql
-- 1단계: 기존 보험료 만료일 설정 (선택사항)
UPDATE premium_rates 
SET expiry_date = '2026-02-01', is_active = false
WHERE effective_date = '2026-01-22'
  AND insurance_type = '대리'
  AND age_group = '31~45';

-- 2단계: 새 보험료 추가
INSERT INTO premium_rates (
  insurance_type, age_group,
  daein2, daein1_special,
  daemul_3천, daemul_5천, daemul_1억, daemul_2억,
  jason_3천, jason_5천, jason_1억,
  jacha_1천, jacha_2천, jacha_3천,
  rent_cost, legal_cost,
  effective_date, is_active
) VALUES
-- 대리 - 31~45 (새 보험료 예시)
('대리', '31~45', 280000, 265000, 220000, 231000, 236000, 250000, 10000, 13700, 24800, 180000, 206000, 229000, 55000, 43000, '2026-02-01', true);
```

**장점**:
- 기존 데이터 보존 (히스토리 관리 가능)
- 롤백 가능
- 데이터 무결성 유지

---

### 방법 2: 특정 보험료만 업데이트

특정 보험종목/나이대의 보험료만 변경하는 경우:

```sql
-- 기존 보험료 비활성화
UPDATE premium_rates 
SET is_active = false, expiry_date = '2026-02-01'
WHERE insurance_type = '대리' 
  AND age_group = '31~45'
  AND effective_date = '2026-01-22';

-- 새 보험료 추가
INSERT INTO premium_rates (
  insurance_type, age_group,
  daein2, daein1_special,
  daemul_3천, daemul_5천, daemul_1억, daemul_2억,
  jason_3천, jason_5천, jason_1억,
  jacha_1천, jacha_2천, jacha_3천,
  rent_cost, legal_cost,
  effective_date, is_active
)
VALUES ('대리', '31~45', ..., '2026-02-01', true);
```

---

### 방법 3: 전체 보험료 일괄 업데이트

모든 보험료를 한 번에 업데이트하는 경우:

```sql
-- 1단계: 기존 보험료 모두 만료 처리
UPDATE premium_rates 
SET expiry_date = '2026-02-01', is_active = false
WHERE effective_date = '2026-01-22';

-- 2단계: 새 보험료 일괄 삽입
INSERT INTO premium_rates (
  insurance_type, age_group,
  daein2, daein1_special,
  daemul_3천, daemul_5천, daemul_1억, daemul_2억,
  jason_3천, jason_5천, jason_1억,
  jacha_1천, jacha_2천, jacha_3천,
  rent_cost, legal_cost,
  effective_date, is_active
) VALUES
-- 대리 - 26~30
('대리', '26~30', ..., '2026-02-01', true),
-- 대리 - 31~45
('대리', '31~45', ..., '2026-02-01', true),
-- 대리 - 46~50
('대리', '46~50', ..., '2026-02-01', true),
-- 대리 - 51~55
('대리', '51~55', ..., '2026-02-01', true),
-- 대리 - 56~60
('대리', '56~60', ..., '2026-02-01', true),
-- 대리 - 61~
('대리', '61~', ..., '2026-02-01', true),
-- 탁송 - 26~30
('탁송', '26~30', ..., '2026-02-01', true),
-- 탁송 - 31~45
('탁송', '31~45', ..., '2026-02-01', true),
-- 탁송 - 46~50
('탁송', '46~50', ..., '2026-02-01', true),
-- 탁송 - 51~55
('탁송', '51~55', ..., '2026-02-01', true),
-- 탁송 - 56~60
('탁송', '56~60', ..., '2026-02-01', true),
-- 탁송 - 61~
('탁송', '61~', ..., '2026-02-01', true);
```

---

## 보험료 조회 시 주의사항

### 자동 조회 동작

- `get_premium_rate()` 함수는 자동으로:
  - 활성화된 보험료 중 (`is_active = true`)
  - 현재 날짜 기준 유효한 보험료 (`effective_date <= 현재날짜`, `expiry_date >= 현재날짜`)
  - 가장 최신 `effective_date`를 가진 데이터를 반환합니다.

### 특정 날짜 보험료 조회

특정 날짜의 보험료를 조회하려면:

```sql
-- 2026-01-22 기준 보험료 조회
SELECT * FROM get_premium_rate('대리', '31~45', '2026-01-22');

-- 2026-02-01 기준 보험료 조회
SELECT * FROM get_premium_rate('대리', '31~45', '2026-02-01');
```

### 활성화된 보험료만 조회

```sql
-- premium_rates_active 뷰 사용
SELECT * FROM premium_rates_active
WHERE insurance_type = '대리' AND age_group = '31~45';
```

---

## 보험료 업데이트 체크리스트

### 업데이트 전
- [ ] 기존 보험료 데이터 백업 (선택사항)
- [ ] 새 보험료 데이터 준비 및 검증
- [ ] 업데이트 계획 수립 (전체/부분 업데이트)

### 업데이트 실행
- [ ] 기존 보험료 만료일 설정 (`expiry_date`, `is_active = false`)
- [ ] 새 보험료 삽입 (`effective_date`, `is_active = true`)
- [ ] 트랜잭션으로 실행 (오류 시 롤백 가능)

### 업데이트 후 확인
- [ ] 보험료 조회 함수로 새 데이터 확인
  ```sql
  SELECT * FROM get_premium_rate('대리', '31~45');
  ```
- [ ] 보험료 계산 함수로 총액 확인
  ```sql
  SELECT calculate_premium_total('대리', '31~45', '대인2', '3천', '3천', '1천', false, true);
  ```
- [ ] 프론트엔드에서 보험료 계산 테스트
- [ ] 기존 보험료가 비활성화되었는지 확인
  ```sql
  SELECT * FROM premium_rates 
  WHERE effective_date = '2026-01-22' AND is_active = false;
  ```

---

## 주의사항

1. **기존 데이터 삭제 금지**: 기존 보험료 데이터를 삭제하지 마세요. 버전 관리가 불가능해집니다.
2. **effective_date 중복 주의**: 같은 `effective_date`로 중복 삽입 시 유니크 제약조건 위반 오류 발생
3. **expiry_date 설정**: 기존 보험료의 `expiry_date`를 설정하여 새 보험료와 겹치지 않도록 관리
4. **is_active 플래그**: 새 보험료는 반드시 `is_active = true`로 설정
5. **트랜잭션 사용**: 여러 행을 업데이트할 때는 트랜잭션으로 묶어서 실행 권장

---

## 예시: 보험료 변경 시나리오

### 시나리오: 2026년 2월 1일부터 보험료 인상

```sql
BEGIN;

-- 1. 기존 보험료 만료 처리
UPDATE premium_rates 
SET expiry_date = '2026-01-31', is_active = false
WHERE effective_date = '2026-01-22';

-- 2. 새 보험료 추가 (인상된 금액)
INSERT INTO premium_rates (
  insurance_type, age_group,
  daein2, daein1_special,
  daemul_3천, daemul_5천, daemul_1억, daemul_2억,
  jason_3천, jason_5천, jason_1억,
  jacha_1천, jacha_2천, jacha_3천,
  rent_cost, legal_cost,
  effective_date, is_active
) VALUES
-- 대리 - 31~45 (인상된 보험료)
('대리', '31~45', 285000, 270000, 225000, 235000, 240000, 255000, 10500, 14000, 25000, 182000, 208000, 231000, 55000, 43000, '2026-02-01', true);

COMMIT;

-- 3. 확인
SELECT * FROM get_premium_rate('대리', '31~45');
```

---

**작성일**: 2026-01-26  
**목적**: 보험료 데이터 업데이트 방법 가이드
