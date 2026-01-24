# daeri (개인대리운전 보험) – 운영/개발 메모

## 1) 멀티테넌시(화이트라벨)
- **방식**: 서브도메인 기반
  - 예: `kakao.daeri-site.com`, `tmap.daeri-site.com`
- **테넌트 매핑**: 요청 `Host`에서 서브도메인을 추출해 `partners.code`로 매핑
  - 구현: `lib/partner.ts`, `app/api/_lib/context.ts`

## 2) Supabase(DB)
- **스키마**: `docs/supabase-schema.sql`
- **필수 테이블**
  - `partners`
  - `consultations`
  - `applications`
  - `application_secrets` (민감정보 암호문 저장)
  - `message_logs`

## 3) 민감정보 저장(주민번호/계좌/카드)
- **저장 전제**: PG 연동 없이 “접수”만 받고, 결제는 당사 직원이 보험사 전산에서 처리
- **저장 방식**: 서버에서 필드 단위 암호화(AES-256-GCM) 후 DB 저장
  - 구현: `lib/crypto.ts`
  - 키: `FIELD_ENCRYPTION_KEY` (32바이트 base64)

## 4) 알림(알리고)
웹 문서 확인 권한이 없는 환경에서도 동작하도록, **알리고 엔드포인트/파라미터는 환경변수로 분리**합니다.

- 문자(SMS): `ALIGO_SMS_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendSms()`
- 카카오(알림톡/친구톡): `ALIGO_KAKAO_URL`로 form POST
  - 구현: `lib/aligo.ts` → `aligoSendKakao()`

> 운영 계정 스펙에 따라 파라미터명이 다를 수 있어, 필요 시 `lib/aligo.ts`에서 매핑을 조정합니다.

## 5) API 엔드포인트(Next.js)
- `POST /api/consultations`
  - 저장: `consultations`
  - 알림: `OPERATOR_PHONE`로 SMS 발송(설정 시)
  - 로그: `message_logs`
- `POST /api/applications`
  - 저장: `applications` + `application_secrets`
  - 알림/로그 동일

## 6) 환경변수(Vercel)
### Supabase
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 암호화
- `FIELD_ENCRYPTION_KEY` (base64 32 bytes)

### 알리고
- `ALIGO_USER_ID`
- `ALIGO_API_KEY`
- `ALIGO_SENDER` (발신번호)
- `ALIGO_SMS_URL`
- `ALIGO_KAKAO_URL`

### 운영 수신처
- `OPERATOR_PHONE` (담당자 수신번호)

