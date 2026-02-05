# 백엔드 작동 방식 설명 (초보자용)

## 📋 백엔드란?

**백엔드** = 사용자가 보지 못하는 서버 쪽 코드
- 프론트엔드(화면)에서 요청을 받아서 처리
- 데이터베이스에서 데이터를 가져오거나 저장
- 결과를 프론트엔드로 전달

---

## 🏗️ 우리 프로젝트의 백엔드 구조

### Next.js API Routes 사용

```
프론트엔드 (화면)
    ↓ 요청
Next.js API Routes (백엔드)
    ↓ 쿼리
MySQL 데이터베이스
    ↓ 결과
Next.js API Routes
    ↓ 응답
프론트엔드 (화면)
```

**특징**: 별도의 Express 서버 없이 Next.js 안에 백엔드가 포함되어 있습니다.

---

## 📁 백엔드 파일 구조

```
daeri/
├── app/
│   └── api/                    ← 백엔드 코드가 있는 곳
│       ├── premium-rates/
│       │   └── route.ts       ← 보험료 데이터 조회 API
│       ├── consultations/
│       │   └── route.ts       ← 상담신청 API
│       └── applications/
│           └── route.ts       ← 가입신청 API
└── lib/
    └── mysql.ts                ← MySQL 연결 코드
```

---

## 1단계: API 엔드포인트란?

### API 엔드포인트 = 특정 주소로 요청을 보내면 데이터를 받을 수 있는 곳

예시:
- `GET /api/premium-rates` → 보험료 데이터 가져오기
- `POST /api/consultations` → 상담신청 저장하기
- `POST /api/applications` → 가입신청 저장하기

### 파일 경로와 URL의 관계

```
파일 경로: app/api/premium-rates/route.ts
    ↓
URL: http://localhost:3000/api/premium-rates
```

**규칙**: `app/api/폴더명/route.ts` 파일이 있으면 `/api/폴더명` URL이 됩니다.

---

## 2단계: 요청이 들어오면 어떻게 처리되나요?

### 예시: 보험료 데이터 조회 (`GET /api/premium-rates`)

#### 2-1. 프론트엔드에서 요청 보내기
```javascript
// 프론트엔드 코드 (premium-calculator.tsx)
const response = await fetch("/api/premium-rates");
```

**의미**: "서버야, 보험료 데이터를 보내줘!"

#### 2-2. 백엔드에서 요청 받기
```typescript
// app/api/premium-rates/route.ts
export async function GET() {
  // 이 함수가 실행됩니다
}
```

**의미**: "요청을 받았어! 이제 처리할게!"

#### 2-3. MySQL에서 데이터 조회
```typescript
const rows = await query(
  `SELECT * FROM premium_rates WHERE is_active = true`
);
```

**의미**: "데이터베이스에서 보험료 데이터를 가져올게!"

#### 2-4. 결과를 프론트엔드로 전달
```typescript
return NextResponse.json({ ok: true, data: rows });
```

**의미**: "데이터를 JSON 형식으로 보내줄게!"

#### 2-5. 프론트엔드에서 결과 받기
```javascript
const result = await response.json();
// result = { ok: true, data: [...] }
```

**의미**: "데이터를 받았어! 이제 화면에 표시할게!"

---

## 3단계: MySQL 연결은 어떻게 되나요?

### MySQL 연결 풀 (Connection Pool)

**연결 풀이란?**: 데이터베이스와의 연결을 미리 만들어두고 재사용하는 것

#### 3-1. 연결 풀 생성 (`lib/mysql.ts`)

```typescript
// 처음 한 번만 실행됨
const pool = mysql.createPool({
  host: "localhost",        // MySQL 서버 주소
  port: 3306,              // MySQL 포트
  user: "daeri_user",      // 사용자명
  password: "비밀번호",     // 비밀번호
  database: "daeri_db",    // 데이터베이스명
  connectionLimit: 10,     // 최대 10개 연결
});
```

**의미**: "MySQL과 연결할 준비를 했어!"

#### 3-2. 쿼리 실행 함수

```typescript
export async function query(sql: string, params?: any[]) {
  const connection = await pool.getConnection();  // 연결 가져오기
  try {
    const [rows] = await connection.execute(sql, params);  // 쿼리 실행
    return rows;  // 결과 반환
  } finally {
    connection.release();  // 연결 반환 (다른 요청이 사용할 수 있도록)
  }
}
```

**의미**: 
1. 연결 풀에서 연결 하나를 가져옵니다
2. SQL 쿼리를 실행합니다
3. 결과를 반환합니다
4. 연결을 다시 풀에 반환합니다 (재사용을 위해)

---

## 4단계: 각 API 엔드포인트 작동 방식

### API 1: 보험료 데이터 조회 (`GET /api/premium-rates`)

#### 전체 흐름
```
1. 프론트엔드: fetch("/api/premium-rates")
   ↓
2. 백엔드: GET() 함수 실행
   ↓
3. MySQL: SELECT 쿼리 실행
   ↓
4. 백엔드: 결과를 JSON으로 변환
   ↓
5. 프론트엔드: 데이터 받아서 사용
```

#### 코드 설명
```typescript
export async function GET() {
  try {
    // 1. MySQL에서 데이터 조회
    const rows = await query(
      `SELECT * FROM premium_rates WHERE is_active = true`
    );
    
    // 2. 성공 응답 반환
    return NextResponse.json({ ok: true, data: rows });
  } catch (e) {
    // 3. 오류 발생 시 오류 응답 반환
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
```

---

### API 2: 상담신청 저장 (`POST /api/consultations`)

#### 전체 흐름
```
1. 프론트엔드: 사용자가 폼 작성 후 제출
   ↓
2. 프론트엔드: fetch("/api/consultations", { method: "POST", body: {...} })
   ↓
3. 백엔드: POST() 함수 실행
   ↓
4. 백엔드: 입력값 검증 (이름, 전화번호 등)
   ↓
5. MySQL: INSERT 쿼리 실행 (데이터 저장)
   ↓
6. 백엔드: SMS 발송 (선택사항)
   ↓
7. MySQL: 발송 로그 저장
   ↓
8. 백엔드: 성공 응답 반환
   ↓
9. 프론트엔드: 성공 메시지 표시
```

#### 코드 설명 (단계별)

**1단계: 요청 데이터 받기**
```typescript
const body = await req.json();
// body = { name: "홍길동", phone: "010-1234-5678", ... }
```

**2단계: 입력값 검증**
```typescript
const parsed = ConsultationSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 400 });
}
```

**의미**: "입력값이 올바른지 확인해! 틀리면 오류를 보내줘!"

**3단계: 파트너 정보 가져오기**
```typescript
const { partner } = await getPartnerContext();
// partner = { id: "...", code: "default", name: "기본" }
```

**의미**: "어떤 파트너(테넌트)에서 요청이 왔는지 확인해!"

**4단계: 데이터베이스에 저장**
```typescript
await query(
  `INSERT INTO consultations (id, partner_id, name, phone, ...)
   VALUES (?, ?, ?, ?, ...)`,
  [consultationId, partner.id, parsed.data.name, parsed.data.phone, ...]
);
```

**의미**: "MySQL에 상담신청 데이터를 저장해!"

**5단계: SMS 발송 (선택사항)**
```typescript
if (operatorPhone) {
  const smsResult = await aligoSendSms({ to: operatorPhone, text });
  // SMS 발송 로그도 저장
}
```

**의미**: "담당자에게 문자를 보내줘!"

**6단계: 성공 응답 반환**
```typescript
return NextResponse.json({ ok: true, id: consultationId });
```

**의미**: "성공했어! 저장된 ID를 알려줄게!"

---

### API 3: 가입신청 저장 (`POST /api/applications`)

#### 상담신청과의 차이점

1. **민감정보 암호화**: 주민번호, 계좌번호, 카드번호를 암호화해서 저장
2. **두 개의 테이블에 저장**: 
   - `applications`: 비민감정보
   - `application_secrets`: 암호화된 민감정보

#### 코드 설명

**1단계: 비민감정보 저장**
```typescript
await query(
  `INSERT INTO applications (id, partner_id, name, phone, address, ...)
   VALUES (?, ?, ?, ?, ?, ...)`,
  [applicationId, partner.id, name, phone, address, ...]
);
```

**2단계: 민감정보 암호화 후 저장**
```typescript
const residentEnc = encryptField(`${residentNumber1}-${residentNumber2}`);
// 예: "123456-1234567" → "암호화된_문자열"

await query(
  `INSERT INTO application_secrets (application_id, resident_number_enc, ...)
   VALUES (?, ?, ...)`,
  [applicationId, residentEnc, ...]
);
```

**의미**: "주민번호를 암호화해서 별도 테이블에 저장해!"

---

## 5단계: 오류 처리

### 오류가 발생하면 어떻게 되나요?

#### try-catch 문 사용
```typescript
export async function POST(req: Request) {
  try {
    // 정상 처리 코드
    return NextResponse.json({ ok: true });
  } catch (e) {
    // 오류 발생 시
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", message: msg },
      { status: 500 }
    );
  }
}
```

**의미**: 
- 정상 처리되면: `{ ok: true }` 반환
- 오류 발생하면: `{ ok: false, error: "..." }` 반환

---

## 6단계: 환경변수 사용

### 환경변수란?

서버 설정 정보를 코드 밖에 저장하는 것

#### 사용 예시
```typescript
// .env.local 파일에 저장된 값
MYSQL_HOST=localhost
MYSQL_USER=daeri_user
MYSQL_PASSWORD=비밀번호

// 코드에서 사용
const host = process.env.MYSQL_HOST || "localhost";
const user = process.env.MYSQL_USER || "root";
```

**의미**: "비밀번호 같은 중요한 정보는 코드에 직접 쓰지 않고 환경변수로 관리해!"

---

## 📊 전체 백엔드 작동 흐름 (한눈에 보기)

```
[사용자]
  ↓ 화면에서 버튼 클릭
  ↓
[프론트엔드]
  ↓ fetch("/api/...") 요청
  ↓
[Next.js API Route]
  ↓ 요청 받기
  ↓ 입력값 검증
  ↓ MySQL 연결 풀에서 연결 가져오기
  ↓ SQL 쿼리 실행
  ↓ MySQL에서 결과 받기
  ↓ 연결 반환
  ↓ 추가 작업 (SMS 발송 등)
  ↓ JSON 응답 생성
  ↓
[프론트엔드]
  ↓ 응답 받기
  ↓ 화면 업데이트
  ↓
[사용자]
  ↓ 결과 확인
```

---

## 🔍 주요 개념 정리

### 1. API Route란?
**답**: Next.js에서 제공하는 백엔드 기능. `app/api/폴더명/route.ts` 파일이 API 엔드포인트가 됩니다.

### 2. GET과 POST의 차이는?
**답**: 
- **GET**: 데이터를 가져올 때 사용 (예: 보험료 조회)
- **POST**: 데이터를 저장할 때 사용 (예: 상담신청, 가입신청)

### 3. MySQL 연결 풀은 왜 사용하나요?
**답**: 
- 매번 새로 연결하면 느려짐
- 미리 연결을 만들어두고 재사용하면 빠름
- 여러 요청을 동시에 처리할 수 있음

### 4. 왜 환경변수를 사용하나요?
**답**: 
- 비밀번호 같은 중요한 정보를 코드에 직접 쓰면 안 됨
- 환경변수로 관리하면 보안이 좋음
- 개발/운영 환경별로 다른 값 사용 가능

### 5. 오류 처리는 왜 필요한가요?
**답**: 
- 데이터베이스 연결 실패, 잘못된 입력값 등 오류가 발생할 수 있음
- 오류를 적절히 처리하지 않으면 서버가 멈출 수 있음
- 사용자에게 오류 메시지를 보여줄 수 있음

---

## 💡 실제 동작 예시

### 예시 1: 보험료 데이터 조회

**1. 사용자**: 페이지를 열면 자동으로 보험료 데이터를 불러옵니다

**2. 프론트엔드**:
```javascript
const data = await fetch("/api/premium-rates");
```

**3. 백엔드** (`app/api/premium-rates/route.ts`):
```typescript
// MySQL 쿼리 실행
const rows = await query("SELECT * FROM premium_rates WHERE is_active = true");
// rows = [{ insurance_type: "대리", age_group: "31~45", ... }, ...]

// 응답 반환
return NextResponse.json({ ok: true, data: rows });
```

**4. 프론트엔드**: 받은 데이터를 화면에 표시

---

### 예시 2: 상담신청 저장

**1. 사용자**: 이름, 전화번호 입력 후 "제출" 버튼 클릭

**2. 프론트엔드**:
```javascript
await fetch("/api/consultations", {
  method: "POST",
  body: JSON.stringify({ name: "홍길동", phone: "010-1234-5678", ... })
});
```

**3. 백엔드** (`app/api/consultations/route.ts`):
```typescript
// 1. 입력값 검증
const parsed = ConsultationSchema.safeParse(body);

// 2. MySQL에 저장
await query(
  "INSERT INTO consultations (id, name, phone, ...) VALUES (?, ?, ?, ...)",
  [id, parsed.data.name, parsed.data.phone, ...]
);

// 3. SMS 발송 (선택사항)
await aligoSendSms({ to: operatorPhone, text: "..." });

// 4. 성공 응답
return NextResponse.json({ ok: true, id: consultationId });
```

**4. 프론트엔드**: "상담신청이 완료되었습니다" 메시지 표시

---

## 🛠️ 디버깅 팁

### 백엔드가 작동하지 않을 때

1. **MySQL 연결 확인**
   ```bash
   mysql -u daeri_user -p daeri_db
   ```
   - 접속이 안 되면 환경변수 확인

2. **API 엔드포인트 확인**
   - 브라우저 개발자 도구 → Network 탭
   - 요청이 실패하는지 확인
   - 응답 내용 확인

3. **서버 로그 확인**
   - 터미널에서 오류 메시지 확인
   - `npm run dev` 실행 중인지 확인

---

**작성일**: 2026-02-02  
**목적**: 백엔드 작동 방식 초보자용 설명
