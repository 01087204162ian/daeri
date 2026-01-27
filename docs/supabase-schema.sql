-- daeri MVP schema (multi-tenant, encrypted secrets)
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

-- Partners (tenants)
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 상담신청
create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id),
  name text not null,
  phone text not null,
  service_type text,
  message text,
  consent_privacy boolean not null default false,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- 가입신청 (non-secret)
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id),
  insurance_type text not null,
  name text not null,
  phone text not null,
  yearly_premium text,
  first_premium text,
  address text,
  address_detail text,
  is_same_person boolean not null default true,
  contractor_name text,
  bank_name text,
  consent_privacy boolean not null default false,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- 가입신청 민감정보(암호문 저장)
create table if not exists application_secrets (
  application_id uuid primary key references applications(id) on delete cascade,
  resident_number_enc text,
  contractor_resident_number_enc text,
  account_number_enc text,
  card_number_enc text,
  card_expiry_enc text,
  created_at timestamptz not null default now()
);

-- 발송 로그
create table if not exists message_logs (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id),
  entity_type text not null, -- 'consultation' | 'application'
  entity_id uuid not null,
  channel text not null,     -- 'sms' | 'kakao'
  to_phone text,
  template_code text,
  status text not null,      -- 'success' | 'error'
  vendor_response jsonb,
  created_at timestamptz not null default now()
);

-- Minimal RLS: default deny (admin/service role will bypass via service key)
alter table partners enable row level security;
alter table consultations enable row level security;
alter table applications enable row level security;
alter table application_secrets enable row level security;
alter table message_logs enable row level security;

-- Example seed
insert into partners (code, name) values
  ('default', '기본')
on conflict (code) do nothing;

-- ============================================
-- 보험료 데이터 스키마
-- ============================================

-- 보험료 테이블
create table if not exists premium_rates (
  id uuid primary key default gen_random_uuid(),
  insurance_type text not null, -- '대리' | '탁송'
  age_group text not null, -- '26~30' | '31~45' | '46~50' | '51~55' | '56~60' | '61~'
  
  -- 대인 담보
  daein2 integer not null default 0, -- 대인2
  daein1_special integer not null default 0, -- 대인1 특약
  
  -- 대물 담보
  daemul_3천 integer not null default 0, -- 대물 3천
  daemul_5천 integer not null default 0, -- 대물 5천
  daemul_1억 integer not null default 0, -- 대물 1억
  daemul_2억 integer not null default 0, -- 대물 2억
  
  -- 자손 담보
  jason_3천 integer not null default 0, -- 자손 3천
  jason_5천 integer not null default 0, -- 자손 5천
  jason_1억 integer not null default 0, -- 자손 1억
  
  -- 자차 담보
  jacha_1천 integer not null default 0, -- 자차 1천
  jacha_2천 integer not null default 0, -- 자차 2천
  jacha_3천 integer not null default 0, -- 자차 3천
  
  -- 기타 담보
  rent_cost integer, -- 렌트비용 (null 가능)
  legal_cost integer not null default 0, -- 법률비용
  
  -- 메타데이터
  effective_date date, -- 적용 시작일
  expiry_date date, -- 적용 종료일
  is_active boolean not null default true, -- 활성화 여부
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- 유니크 제약조건: 보험종목 + 나이대 조합은 유일해야 함
  constraint premium_rates_unique unique (insurance_type, age_group, effective_date)
);

-- 인덱스 생성
create index if not exists idx_premium_rates_insurance_type on premium_rates(insurance_type);
create index if not exists idx_premium_rates_age_group on premium_rates(age_group);
create index if not exists idx_premium_rates_active on premium_rates(is_active);
create index if not exists idx_premium_rates_effective_date on premium_rates(effective_date);

-- 업데이트 시간 자동 갱신 트리거 함수
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 업데이트 시간 자동 갱신 트리거
create trigger update_premium_rates_updated_at
  before update on premium_rates
  for each row
  execute function update_updated_at_column();

-- RLS 활성화
alter table premium_rates enable row level security;

-- 보험료 데이터 초기 삽입 (2026-01-22 기준)
insert into premium_rates (
  insurance_type, age_group,
  daein2, daein1_special,
  daemul_3천, daemul_5천, daemul_1억, daemul_2억,
  jason_3천, jason_5천, jason_1억,
  jacha_1천, jacha_2천, jacha_3천,
  rent_cost, legal_cost,
  effective_date, is_active
) values
-- 대리 - 26~30
('대리', '26~30', 362700, 342610, 283460, 298380, 305070, 323070, 12860, 17610, 32010, 232390, 265750, 296000, 50620, 39770, '2026-01-22', true),
-- 대리 - 31~45
('대리', '31~45', 278450, 263020, 217610, 229060, 234210, 248030, 9870, 13510, 24570, 178410, 204020, 227250, 54370, 42710, '2026-01-22', true),
-- 대리 - 46~50
('대리', '46~50', 301200, 284530, 235420, 247780, 253360, 268300, 10670, 14620, 26590, 193000, 220690, 245830, 45000, 35360, '2026-01-22', true),
-- 대리 - 51~55
('대리', '51~55', 371980, 351390, 290730, 306010, 312890, 331350, 13180, 18050, 32830, 238340, 272550, 303580, 45000, 35360, '2026-01-22', true),
-- 대리 - 56~60
('대리', '56~60', 414070, 391130, 323620, 340630, 348280, 368830, 14680, 20100, 36560, 265300, 303400, 337940, 45000, 35360, '2026-01-22', true),
-- 대리 - 61~
('대리', '61~', 518310, 489610, 405090, 426380, 435970, 461680, 18380, 25160, 45750, 332100, 379770, 423010, 45000, 35360, '2026-01-22', true),
-- 탁송 - 26~30
('탁송', '26~30', 391050, 375110, 615720, 648130, 662570, 697500, 18490, 25310, 46080, 462790, 529420, 589730, null, 41450, '2026-01-22', true),
-- 탁송 - 31~45
('탁송', '31~45', 253300, 243000, 398800, 419790, 429170, 451790, 11960, 16410, 29830, 299750, 342940, 381990, null, 32400, '2026-01-22', true),
-- 탁송 - 46~50
('탁송', '46~50', 299880, 287730, 472200, 497100, 508190, 534970, 14180, 19440, 35350, 354950, 406040, 452280, null, 32400, '2026-01-22', true),
-- 탁송 - 51~55
('탁송', '51~55', 314740, 301980, 495660, 521760, 533420, 561540, 14870, 20380, 37100, 372550, 426190, 474730, null, 32400, '2026-01-22', true),
-- 탁송 - 56~60
('탁송', '56~60', 352630, 338300, 555290, 584530, 597590, 629090, 16680, 22820, 41560, 417380, 477450, 531830, null, 32400, '2026-01-22', true),
-- 탁송 - 61~
('탁송', '61~', 373000, 357840, 587310, 618210, 632040, 665360, 17620, 24150, 43970, 441450, 505000, 562530, null, 32400, '2026-01-22', true)
on conflict (insurance_type, age_group, effective_date) do nothing;

-- 보험료 조회 뷰 (활성화된 데이터만)
create or replace view premium_rates_active as
select *
from premium_rates
where is_active = true
  and (effective_date is null or effective_date <= current_date)
  and (expiry_date is null or expiry_date >= current_date);

-- 보험료 조회 함수
create or replace function get_premium_rate(
  p_insurance_type text,
  p_age_group text,
  p_effective_date date default current_date
)
returns table (
  id uuid,
  insurance_type text,
  age_group text,
  daein2 integer,
  daein1_special integer,
  daemul_3천 integer,
  daemul_5천 integer,
  daemul_1억 integer,
  daemul_2억 integer,
  jason_3천 integer,
  jason_5천 integer,
  jason_1억 integer,
  jacha_1천 integer,
  jacha_2천 integer,
  jacha_3천 integer,
  rent_cost integer,
  legal_cost integer
) as $$
begin
  return query
  select
    pr.id,
    pr.insurance_type,
    pr.age_group,
    pr.daein2,
    pr.daein1_special,
    pr.daemul_3천,
    pr.daemul_5천,
    pr.daemul_1억,
    pr.daemul_2억,
    pr.jason_3천,
    pr.jason_5천,
    pr.jason_1억,
    pr.jacha_1천,
    pr.jacha_2천,
    pr.jacha_3천,
    pr.rent_cost,
    pr.legal_cost
  from premium_rates pr
  where pr.insurance_type = p_insurance_type
    and pr.age_group = p_age_group
    and pr.is_active = true
    and (pr.effective_date is null or pr.effective_date <= p_effective_date)
    and (pr.expiry_date is null or pr.expiry_date >= p_effective_date)
  order by pr.effective_date desc
  limit 1;
end;
$$ language plpgsql;

-- 보험료 계산 함수 (담보 조합별 총액 계산)
create or replace function calculate_premium_total(
  p_insurance_type text,
  p_age_group text,
  p_daein text default null, -- '대인2' | '대인1특약'
  p_daemul text default null, -- '3천' | '5천' | '1억' | '2억'
  p_jason text default null, -- '3천' | '5천' | '1억'
  p_jacha text default null, -- '1천' | '2천' | '3천'
  p_include_rent boolean default false,
  p_include_legal boolean default false,
  p_effective_date date default current_date
)
returns integer as $$
declare
  v_rate record;
  v_total integer := 0;
begin
  -- 보험료 조회
  select * into v_rate
  from get_premium_rate(p_insurance_type, p_age_group, p_effective_date)
  limit 1;
  
  if v_rate is null then
    return null;
  end if;
  
  -- 대인 담보 추가
  if p_daein = '대인2' then
    v_total := v_total + v_rate.daein2;
  elsif p_daein = '대인1특약' then
    v_total := v_total + v_rate.daein1_special;
  end if;
  
  -- 대물 담보 추가
  if p_daemul = '3천' then
    v_total := v_total + v_rate.daemul_3천;
  elsif p_daemul = '5천' then
    v_total := v_total + v_rate.daemul_5천;
  elsif p_daemul = '1억' then
    v_total := v_total + v_rate.daemul_1억;
  elsif p_daemul = '2억' then
    v_total := v_total + v_rate.daemul_2억;
  end if;
  
  -- 자손 담보 추가
  if p_jason = '3천' then
    v_total := v_total + v_rate.jason_3천;
  elsif p_jason = '5천' then
    v_total := v_total + v_rate.jason_5천;
  elsif p_jason = '1억' then
    v_total := v_total + v_rate.jason_1억;
  end if;
  
  -- 자차 담보 추가
  if p_jacha = '1천' then
    v_total := v_total + v_rate.jacha_1천;
  elsif p_jacha = '2천' then
    v_total := v_total + v_rate.jacha_2천;
  elsif p_jacha = '3천' then
    v_total := v_total + v_rate.jacha_3천;
  end if;
  
  -- 렌트비용 추가
  if p_include_rent and v_rate.rent_cost is not null then
    v_total := v_total + v_rate.rent_cost;
  end if;
  
  -- 법률비용 추가
  if p_include_legal then
    v_total := v_total + v_rate.legal_cost;
  end if;
  
  return v_total;
end;
$$ language plpgsql;
