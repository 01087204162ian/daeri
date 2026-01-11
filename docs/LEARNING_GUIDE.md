# 작업 시작 전 학습 문서 가이드

> **목적**: 모든 작업을 시작하기 전에 AI Assistant가 학습해야 할 문서를 체계적으로 정리  
> **원칙**: 작업 유형별로 필요한 문서만 선별하여 효율적으로 학습

---

## 📋 학습 문서 분류

### 1️⃣ 전체 프로젝트 구조 파악 (필수)

**언제**: 새 세션이 시작되거나, 프로젝트 전체 구조를 이해해야 할 때

**학습 문서**:
1. **`development/docs/README.md`** (최우선)
   - Development 루트의 전체 구조
   - 각 서비스별 역할과 관계
   - 아키텍처 흐름 (프론트엔드 → 프록시 → PHP 백엔드 → DB)
   - 서비스별 매핑 규칙 (프로덕션 URL ↔ 로컬 경로)

**학습 내용**:
- ✅ 전체 프로젝트 구조 이해
- ✅ 각 폴더의 역할과 관계
- ✅ API 호출 흐름 (disk-cms ↔ 하위 서비스)
- ✅ 작업 시 주의사항 (어디서 작업해야 하는지)

---

### 2️⃣ 특정 프로젝트 작업 (필수)

**언제**: 특정 프로젝트(disk-cms, disk-cms-react, kdrive 등)에서 작업할 때

**학습 문서** (프로젝트별):

#### 2-1. disk-cms-react 작업 시
1. **`disk-cms-react/docs/work-log.md`** (최우선)
   - 최신 작업 내역 및 진행 상황
   - 완료된 기능 목록
   - 해결한 이슈 및 기술적 결정사항
   - 다음 작업 계획

2. **`disk-cms-react/MIGRATION_PLAN.md`** (필요 시)
   - 전체 마이그레이션 계획
   - Phase별 작업 목록
   - 우선순위 및 예상 시간

3. **`disk-cms-react/docs/REACT_MIGRATION_STATUS_AND_PLAN.md`** (필요 시)
   - 현재 진행 현황 요약
   - 남은 작업 목록
   - 작업 순서 옵션

4. **`disk-cms-react/docs/UI_STANDARDS.md`** (UI 작업 시)
   - UI 표준 및 컴포넌트 가이드
   - 스타일링 규칙
   - 공통 컴포넌트 사용법

#### 2-2. disk-cms 작업 시
1. **`disk-cms/docs/PROJECT_GUIDE.md`** (있는 경우)
2. **`disk-cms/docs/README.md`** (있는 경우)
3. 해당 모듈별 문서 (pharmacy, staff, kj 등)

#### 2-3. kdrive 작업 시
1. **`kdrive/docs/README.md`**
2. **`kdrive/docs/00-system-overview.md`**
3. 관련 작업 문서들

#### 2-4. 기타 프로젝트
- 각 프로젝트의 `docs/README.md` 또는 관련 가이드 문서

---

### 3️⃣ 특정 기능/모듈 작업 (선택)

**언제**: 특정 기능(약국배상책임보험, 직원 관리 등)을 작업할 때

**학습 문서** (모듈별):

#### 3-1. 약국배상책임보험 (pharmacy) 작업 시
1. **`disk-cms-react/docs/pharmacy/README.md`**
   - 약국배상책임보험 모듈 전체 구조
   - 테이블 구조 및 관계
   - API 엔드포인트
   - 비즈니스 로직 설명

2. **`disk-cms-react/docs/pharmacy/WORK_LOG.md`** (있는 경우)
   - 해당 모듈의 작업 이력

3. **`disk-cms/docs/pharmacy/README.md`** (기존 버전 참고 시)
   - 기존 바닐라JS 버전의 구조

#### 3-2. 직원 관리 (staff) 작업 시
1. **`disk-cms/docs/staff/README.md`**
2. **`disk-cms/docs/staff/STAFF_LEARNING_GUIDE.md`** (있는 경우)

#### 3-3. KJ 대리운전 (insurance/kj) 작업 시
1. **`disk-cms/docs/kj/README.md`**
2. 관련 작업 문서들

---

### 4️⃣ UI/UX 작업 (선택)

**언제**: UI 컴포넌트 개발, 스타일링, 디자인 시스템 작업 시

**학습 문서**:
1. **`development/docs/memo-figma-brief.md`**
   - 디자인 시스템 참고 문서
   - 디자인 토큰 및 컴포넌트 스펙

2. **`disk-cms-react/docs/UI_STANDARDS.md`**
   - UI 표준 및 컴포넌트 가이드
   - 공통 컴포넌트 사용법
   - 스타일링 규칙

---

### 5️⃣ 새 기능 개발 (선택)

**언제**: 새로운 기능을 처음 개발할 때

**학습 문서**:
1. 해당 프로젝트의 `work-log.md` 또는 `README.md`
2. 관련 모듈 문서
3. 기존 유사 기능의 코드 및 문서 (참고)

---

### 6️⃣ 버그 수정/이슈 해결 (선택)

**언제**: 버그 수정이나 이슈 해결 작업 시

**학습 문서**:
1. 해당 프로젝트의 `work-log.md`
   - 이전에 유사한 이슈를 해결한 기록이 있는지 확인
2. 관련 모듈 문서
3. 에러 메시지 및 로그 분석

---

## 🎯 학습 우선순위

### 우선순위 1 (항상 학습)
1. **`development/docs/README.md`** - 전체 프로젝트 구조 파악
2. **해당 프로젝트의 `work-log.md`** - 최신 작업 내역 및 진행 상황

### 우선순위 2 (작업 유형에 따라 선택)
- 작업하는 프로젝트의 관련 문서
- 작업하는 모듈/기능의 관련 문서
- UI 작업 시: `UI_STANDARDS.md`, `memo-figma-brief.md`

### 우선순위 3 (필요 시 참조)
- 특정 기술 문서
- 이전 작업 기록
- 관련 이슈 해결 기록

---

## 📝 학습 절차 (권장)

### Step 1: 전체 구조 파악 (새 세션 시작 시)
```
1. development/docs/README.md 학습
   → 전체 프로젝트 구조 이해
```

### Step 2: 작업 프로젝트 파악
```
2. 해당 프로젝트의 work-log.md 학습
   → 최신 작업 내역 및 진행 상황 파악
```

### Step 3: 작업 모듈/기능 파악 (필요 시)
```
3. 해당 모듈/기능의 README.md 또는 관련 문서 학습
   → 세부 구조 및 비즈니스 로직 이해
```

### Step 4: 관련 표준/가이드 확인 (필요 시)
```
4. UI 작업 시: UI_STANDARDS.md, memo-figma-brief.md
   마이그레이션 작업 시: MIGRATION_PLAN.md
```

---

## 🔍 문서 찾기 가이드

### development 루트 레벨
- **검토용 문서**: `development/docs/`
  - `README.md` - 전체 구조
  - `memo-figma-brief.md` - 디자인 시스템
  - `INDEX.md` - 문서 인덱스

### 각 프로젝트별 문서
- **disk-cms-react**: `disk-cms-react/docs/`
- **disk-cms**: `disk-cms/docs/`
- **kdrive**: `kdrive/docs/`
- **BD**: `BD/docs/`
- **simg-knowledge-lab**: `simg-knowledge-lab/docs/`

### 공통 패턴
- `README.md` - 프로젝트/모듈 개요
- `work-log.md` - 작업 일지 (진행 상황)
- `*_GUIDE.md` - 가이드 문서
- `*_PLAN.md` - 계획 문서

---

## ⚠️ 주의사항

1. **문서 우선순위**: 항상 우선순위 1 문서부터 학습
2. **필요한 것만**: 작업에 필요한 문서만 선별하여 학습
3. **최신성 확인**: `work-log.md`는 항상 최신 상태로 업데이트됨
4. **문서 위치**: 각 프로젝트의 문서는 해당 프로젝트 폴더 내에 있음

---

## 💡 예시: 작업 시작 시나리오

### 시나리오 1: disk-cms-react 약국배상책임보험 UI 개선 작업
```
1. development/docs/README.md 학습 (전체 구조)
2. disk-cms-react/docs/work-log.md 학습 (최신 작업 내역)
3. disk-cms-react/docs/pharmacy/README.md 학습 (약국배상 모듈 구조)
4. disk-cms-react/docs/UI_STANDARDS.md 학습 (UI 표준)
```

### 시나리오 2: disk-cms 직원 관리 버그 수정
```
1. development/docs/README.md 학습 (전체 구조)
2. disk-cms/docs/staff/README.md 학습 (직원 관리 구조)
3. 관련 코드 분석
```

### 시나리오 3: 새로운 프로젝트 작업 시작
```
1. development/docs/README.md 학습 (전체 구조)
2. 해당 프로젝트의 README.md 또는 docs/README.md 학습
3. 관련 작업 문서 확인
```

### 시나리오 4: disk-cms KJ 대리운전 작업 시작
```
1. development/docs/README.md 학습 (전체 구조)
2. disk-cms/docs/kj/kj-대리운전-시스템-개요.md 학습
3. disk-cms/docs/kj/kj-대리운전-업무플로우.md 학습
4. 관련 문서 확인 (필요 시)
```

**작업 지시문**: "kj 모듈 학습하자" 또는 "KJ 대리운전 모듈 학습하자"

---

## 🎬 작업 시작 전 지시 문장 (3줄 이내)

작업 시작 전에 사용자가 할 수 있는 간단한 지시 문장:

1. **`work-log.md 파일 학습하자`** - disk-cms-react 최신 작업 내역 학습
2. **`전체 구조 파악하자`** - development/docs/README.md 학습 (전체 프로젝트 구조)
3. **`[모듈명] 모듈 학습하자`** - 특정 모듈 문서 학습 (예: "약국배상 모듈 학습하자", "직원 관리 모듈 학습하자")

**사용 예시**:
- "work-log.md 파일 학습하자" → disk-cms-react/docs/work-log.md 학습
- "전체 구조 파악하자" → development/docs/README.md 학습
- "약국배상 모듈 학습하자" → disk-cms-react/docs/pharmacy/README.md 학습
- "kj 모듈 학습하자" 또는 "KJ 대리운전 모듈 학습하자" → disk-cms/docs/kj/ 관련 문서 학습

---

**작성일**: 2026년 1월 11일  
**최종 업데이트**: 2026년 1월 11일  
**목적**: AI Assistant 작업 효율성 향상 및 일관성 있는 문서 학습
