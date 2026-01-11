# Ian Development Root

이 디렉터리는 Ian이 운영하는 모든 사업 및 서비스의 로컬 개발 루트입니다.

## 1️⃣ D:\development 의 의미 (Root 정의)

**D:\development** 👉 Ian이 운영·개발·관리하는 모든 사업 관련 서비스의 로컬 Root 디렉터리

### 목적
- 전체 사업 현황 파악
- 서비스별 소스 코드 분리
- 서버·도메인·역할을 명확히 구분

### 원칙
- ❌ 하나의 거대한 monorepo 아님
- ⭕ 서비스 단위 / 도메인 단위로 완전 분리
- ⭕ 각 폴더 = 하나의 "운영되는 서비스"

## 2️⃣ 현재 전체 구조 요약

```
D:\development
│
├─ disk-cms              (메인 CMS 서버 - 바닐라JS)
├─ disk-cms-react         (리액트 마이그레이션 폴더)
├─ pci0327               (KJ 대리운전 보험)
├─ fstudent              (현장실습보험)
├─ imet                  (약국배상책임보험)
├─ kdrive                (KDRIVE 서비스)
├─ adjustment            (배민 배달 정산 보험료 계산 시스템)
└─ simg-knowledge-lab    (내부 지식·매뉴얼 저장소)
```

## 3️⃣ 핵심: disk-cms (메인 CMS)

**URL** 👉 https://disk-cms.simg.kr/login.html

**역할** 👉 모든 보험 상품과 운영 업무를 관통하는 메인 CMS

### 기술 스택
- **Frontend**: 바닐라 JavaScript (Vanilla JS) + jQuery + AdminLTE 3.2.0
- **Backend**: Node.js + Express.js (세션 기반 인증)
- **Database**: MySQL 8.0

### 성격
- 프론트 중심
- 인증 / 권한 / 공통 UI / 운영 화면
- 실제 비즈니스 로직은 하위 서비스와 연동
- 현재 운영 중인 프로덕션 버전 (바닐라JS 기반)

### 📦 disk-cms에서 관리하는 보험 상품 범위

```
CMS 보험상품 영역
├─ 대리운전 보험
│   └─ KJ 대리운전
│       └─ 실제 소스: pci0327 (pcikorea.com)
│
├─ 근재보험
├─ 현장실습보험
│   └─ 실제 소스: fstudent
│
├─ 약국배상책임보험
│   └─ 실제 소스: imet (imet.kr)
│
├─ 홀인원보험
└─ 여행자보험
```

👉 disk-cms는 '컨트롤 타워',  
👉 각 보험 상품은 독립 서비스(하위 폴더)

## 3.5️⃣ disk-cms-react (리액트 마이그레이션)

**상태** 👉 리액트 마이그레이션 진행 중

**목적** 👉 disk-cms를 바닐라JS에서 React로 점진적 마이그레이션

### 기술 스택 (계획)
- **Frontend**: React 18.3+ + Vite + TypeScript
- **상태 관리**: Zustand
- **UI 라이브러리**: Ant Design
- **Backend**: Node.js + Express.js (기존 API 유지)
- **인증**: 세션 → JWT 전환 예정

### 마이그레이션 전략
- 점진적 마이그레이션 (Strangler Pattern)
- 모듈별 단계적 전환
- 기존 disk-cms와 병행 운영

### 폴더 구조
- `disk-cms`: 현재 운영 중인 바닐라JS 버전 (프로덕션)
- `disk-cms-react`: 리액트 마이그레이션 버전 (개발 중)

**참고**: 리액트 마이그레이션 계획은 `disk-cms/docs/REACT_MIGRATION_PLAN.md` 참고/

## 4️⃣ 하위 서비스 폴더 정리

### ① pci0327 – KJ 대리운전 보험

**도메인** 👉 pcikorea.com

**역할**
- KJ 대리운전 보험 전용 서비스
- 정책, 증권, 정산, 가입, 사고 관련 로직

**CMS와의 관계**
- disk-cms ↔ 프록시/API 연동
- 소스는 절대 disk-cms에 섞지 않음 ❗

### ② fstudent – 현장실습보험

**역할**
- 현장실습보험 전용 서비스
- 학교 / 학생 / 실습기간 / 보험 가입 관리

**CMS 역할**
- disk-cms는 운영·관리 화면 제공
- 실제 비즈니스 로직은 fstudent

### ③ imet – 약국배상책임보험

**도메인** 👉 imet.kr

**역할**
- 약국 배상책임보험
- 가입 / 증권 / 사고 관리

**특징**
- 완전히 독립된 상품
- CMS에서 "약국배상" 메뉴로만 연결

### ④ kdrive – KDRIVE (별도 서비스)

**URL** 👉 https://kdrive.simg.kr/

**성격** 👉 disk-cms와 분리된 독립 서비스

**특징**
- 자체 UI / 자체 서비스 흐름
- CMS 하위 상품이 아님
- 향후 확장 가능성 높은 서비스

👉 이건 CMS 외부 사업으로 보는 게 맞습니다.

### ⑤ adjustment – 배민 배달 정산 보험료 계산 시스템

**역할**
- 배민 배달 운행 데이터 처리
- 보험료 자동 계산
- 중복 시간 제거 및 정산

**주요 기능**
- 운행 시간 처리 및 형식 변환
- 중복 시간 병합 및 차감
- 담보별 보험료 산출 (대인1지원, 대인2, 대물)
- Streamlit 웹 인터페이스 제공
- Excel 파일 입출력

**특징**
- CLI 스크립트 및 웹 앱 지원
- 정산 기준: 배민 기준(06:00 ~ D+1 06:00) / DB 기준(00:00 ~ 24:00)
- Python 기반 자동화 도구

### ⑥ simg-knowledge-lab – 내부 지식 저장소

**역할**
- 직원 교육 자료
- 매뉴얼
- 운영 원칙
- 기획 문서

**특징**
- 코드보다 지식 중심
- GitHub Wiki / MD 파일 기반
- 조직 학습용

## 5️⃣ 구조 철학 한 줄 요약

**disk-cms는 '뇌',  
하위 폴더들은 '각각의 장기',  
development는 'Ian의 사업 인체도'**

---

## 6️⃣ 아키텍처 흐름 및 관계 이해

### 6.1 전체 아키텍처 흐름

```
프론트엔드 (disk-cms/public/pages/*)
    ↓
Node.js 프록시 (disk-cms/routes/*)
    ↓
PHP 백엔드 API (각 하위 폴더/api/*)
    ↓
MySQL 데이터베이스
```

### 6.2 구체적인 서비스별 매핑

#### 약국배상책임보험 (Pharmacy)
- **프론트엔드**: `disk-cms/public/pages/pharmacy/`
- **Node.js 프록시**: `disk-cms/routes/pharmacy.js`, `disk-cms/routes/pharmacy/*`
- **PHP 백엔드**: `imet/api/pharmacy/*`
- **프로덕션 URL**: `https://imet.kr/api/pharmacy/*`
- **로컬 개발 경로**: `d:\development\imet\api\pharmacy\*`

#### 현장실습보험 (Field Practice)
- **프론트엔드**: `disk-cms/public/pages/field-practice/`
- **Node.js 프록시**: `disk-cms/routes/field-practice/*`
- **PHP 백엔드**: `fstudent` 또는 `silbo.kr`
- **프로덕션 URL**: `https://silbo.kr/2025/api/question/*`

#### KJ 대리운전 보험 (Insurance)
- **프론트엔드**: `disk-cms/public/pages/insurance/`
- **Node.js 프록시**: `disk-cms/routes/insurance/*`
- **PHP 백엔드**: `pci0327/api/insurance/*`
- **프로덕션 URL**: `https://pcikorea.com/api/insurance/*`

### 6.3 핵심 원칙

1. **disk-cms = 통합 프론트엔드 + 프록시 서버**
   - 모든 보험 상품의 UI 제공
   - Node.js로 PHP API 프록시 역할
   - 인증/권한/공통 UI 관리

2. **하위 폴더 = 독립 백엔드 서비스**
   - 각 보험 상품의 비즈니스 로직
   - PHP로 작성된 API 서버
   - 독립 도메인으로 운영 (imet.kr, pcikorea.com 등)

3. **소스 코드 분리 원칙**
   - ❌ disk-cms에 PHP 코드를 섞지 않음
   - ❌ 하위 폴더에 disk-cms 프론트엔드 코드를 섞지 않음
   - ⭕ 각 서비스는 독립적으로 개발/배포

### 6.4 실제 코드 예시

**약국배상책임보험 프록시 예시**:
```javascript
// disk-cms/routes/pharmacy.js
const apiUrl = 'https://imet.kr/api/pharmacy/pharmacy-list.php';
// → 로컬 개발: imet/api/pharmacy/pharmacy-list.php
```

**프론트엔드에서 API 호출**:
```javascript
// disk-cms/public/js/pharmacy/pharmacy.js
fetch('/api/pharmacy/list?page=1&limit=20')
  ↓
// disk-cms/routes/pharmacy.js (Node.js 프록시)
  ↓
// imet/api/pharmacy/pharmacy-list.php (PHP 백엔드)
  ↓
// MySQL 데이터베이스
```

### 6.5 작업 시 주의사항

- **프론트엔드 작업**: `disk-cms/public/` 폴더에서 작업
- **PHP 백엔드 작업**: 각 하위 폴더(`imet/`, `pci0327/` 등)에서 작업
- **프록시 라우터 작업**: `disk-cms/routes/` 폴더에서 작업
- **문서 작업**: `disk-cms/docs/` 폴더에 각 상품별로 분리하여 기록

### 6.6 파일 경로 매핑 규칙

| 구분 | 프로덕션 URL | 로컬 개발 경로 |
|------|------------|--------------|
| **약국배상 PHP API** | `https://imet.kr/api/pharmacy/*` | `d:\development\imet\api\pharmacy\*` |
| **약국배상 프론트** | `https://disk-cms.simg.kr/pages/pharmacy/*` | `d:\development\disk-cms\public\pages\pharmacy\*` |
| **약국배상 프록시** | `https://disk-cms.simg.kr/api/pharmacy/*` | `d:\development\disk-cms\routes\pharmacy\*` |
| **대리운전 PHP API** | `https://pcikorea.com/api/insurance/*` | `d:\development\pci0327\api\insurance\*` |
| **대리운전 프론트** | `https://disk-cms.simg.kr/pages/insurance/*` | `d:\development\disk-cms\public\pages\insurance\*` |
| **대리운전 프록시** | `https://disk-cms.simg.kr/api/insurance/*` | `d:\development\disk-cms\routes\insurance\*` |

**중요**: 
- 프로덕션 URL `imet.kr` = 로컬 폴더 `imet`
- 프로덕션 URL `pcikorea.com` = 로컬 폴더 `pci0327`
- 프로덕션 URL `silbo.kr` = 로컬 폴더 `fstudent` (추정)