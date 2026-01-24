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

