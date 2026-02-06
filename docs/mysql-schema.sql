-- daeri MySQL 스키마
-- 보험종목: 대리, 탁송, 확대탁송

-- Partners (테넌트)
CREATE TABLE IF NOT EXISTS partners (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 상담신청
CREATE TABLE IF NOT EXISTS consultations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  partner_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service_type VARCHAR(50),
  message TEXT,
  consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
  INDEX idx_partner_id (partner_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 가입신청 (비민감정보)
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  partner_id VARCHAR(36) NOT NULL,
  insurance_type VARCHAR(20) NOT NULL, -- '대리' | '탁송' | '확대탁송'
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  yearly_premium VARCHAR(50),
  first_premium VARCHAR(50),
  address VARCHAR(200),
  address_detail VARCHAR(200),
  is_same_person BOOLEAN NOT NULL DEFAULT TRUE,
  contractor_name VARCHAR(100),
  contractor_phone VARCHAR(20),
  bank_name VARCHAR(50),
  consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
  INDEX idx_partner_id (partner_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 가입신청 민감정보(암호문 저장)
CREATE TABLE IF NOT EXISTS application_secrets (
  application_id VARCHAR(36) PRIMARY KEY,
  resident_number_enc TEXT,
  contractor_resident_number_enc TEXT,
  account_number_enc TEXT,
  card_number_enc TEXT,
  card_expiry_enc TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 발송 로그
CREATE TABLE IF NOT EXISTS message_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  partner_id VARCHAR(36),
  entity_type VARCHAR(20) NOT NULL, -- 'consultation' | 'application'
  entity_id VARCHAR(36) NOT NULL,
  channel VARCHAR(20) NOT NULL, -- 'sms' | 'kakao'
  to_phone VARCHAR(20),
  template_code VARCHAR(50),
  status VARCHAR(20) NOT NULL, -- 'success' | 'error'
  vendor_response JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL,
  INDEX idx_partner_id (partner_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 보험료 테이블
CREATE TABLE IF NOT EXISTS premium_rates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  insurance_type VARCHAR(20) NOT NULL, -- '대리' | '탁송' | '확대탁송'
  age_group VARCHAR(10) NOT NULL, -- '26~30' | '31~45' | '46~50' | '51~55' | '56~60' | '61~'
  
  -- 대인 담보
  daein2 INT NOT NULL DEFAULT 0, -- 대인2 (책임초과무한)
  daein1_special INT NOT NULL DEFAULT 0, -- 대인1 특약 (책임포함무한 = 대인2 + 대인1특약)
  
  -- 대물 담보
  daemul_3천 INT NOT NULL DEFAULT 0,
  daemul_5천 INT NOT NULL DEFAULT 0,
  daemul_1억 INT NOT NULL DEFAULT 0,
  daemul_2억 INT NOT NULL DEFAULT 0,
  
  -- 자손 담보
  jason_3천 INT NOT NULL DEFAULT 0,
  jason_5천 INT NOT NULL DEFAULT 0,
  jason_1억 INT NOT NULL DEFAULT 0,
  
  -- 자차 담보
  jacha_1천 INT NOT NULL DEFAULT 0,
  jacha_2천 INT NOT NULL DEFAULT 0,
  jacha_3천 INT NOT NULL DEFAULT 0,
  
  -- 기타 담보
  rent_cost INT, -- 렌트비용 (null 가능)
  legal_cost INT NOT NULL DEFAULT 0, -- 법률비용
  
  -- 메타데이터
  effective_date DATE, -- 적용 시작일
  expiry_date DATE, -- 적용 종료일
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 유니크 제약조건
  UNIQUE KEY unique_premium (insurance_type, age_group, effective_date),
  INDEX idx_insurance_type (insurance_type),
  INDEX idx_age_group (age_group),
  INDEX idx_active (is_active),
  INDEX idx_effective_date (effective_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 파트너 데이터
INSERT INTO partners (id, code, name) VALUES
  (UUID(), 'default', '기본')
ON DUPLICATE KEY UPDATE name=name;

-- 보험료 데이터 초기 삽입 (2026-01-26 기준, 보험기간 1년)
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
('대리', '26~30', 362700, 342610, 283460, 298380, 305070, 323070, 12860, 17610, 32010, 232390, 265750, 296000, 50620, 39770, '2026-01-26', TRUE),
-- 대리 - 31~45
('대리', '31~45', 278450, 263020, 217610, 229060, 234210, 248030, 9870, 13510, 24570, 178410, 204020, 227250, 54370, 42710, '2026-01-26', TRUE),
-- 대리 - 46~50
('대리', '46~50', 301200, 284530, 235420, 247780, 253360, 268300, 10670, 14620, 26590, 193000, 220690, 245830, 45000, 35360, '2026-01-26', TRUE),
-- 대리 - 51~55
('대리', '51~55', 371980, 351390, 290730, 306010, 312890, 331350, 13180, 18050, 32830, 238340, 272550, 303580, 45000, 35360, '2026-01-26', TRUE),
-- 대리 - 56~60
('대리', '56~60', 414070, 391130, 323620, 340630, 348280, 368830, 14680, 20100, 36560, 265300, 303400, 337940, 45000, 35360, '2026-01-26', TRUE),
-- 대리 - 61~
('대리', '61~', 518310, 489610, 405090, 426380, 435970, 461680, 18380, 25160, 45750, 332100, 379770, 423010, 45000, 35360, '2026-01-26', TRUE),
-- 탁송 - 26~30 (자차 보험료 변경됨)
('탁송', '26~30', 391050, 375110, 615720, 648130, 662570, 697500, 18490, 25310, 46080, 234550, 268290, 298900, NULL, 41450, '2026-01-26', TRUE),
-- 탁송 - 31~45 (자차 보험료 변경됨)
('탁송', '31~45', 253300, 243000, 398800, 419790, 429170, 451790, 11960, 16410, 29830, 151920, 173810, 193610, NULL, 32400, '2026-01-26', TRUE),
-- 탁송 - 46~50 (자차 보험료 변경됨)
('탁송', '46~50', 299880, 287730, 472200, 497100, 508190, 534970, 14180, 19440, 35350, 179890, 205770, 229220, NULL, 32400, '2026-01-26', TRUE),
-- 탁송 - 51~55 (자차 보험료 변경됨)
('탁송', '51~55', 314740, 301980, 495660, 521760, 533420, 561540, 14870, 20380, 37100, 188830, 215960, 240650, NULL, 32400, '2026-01-26', TRUE),
-- 탁송 - 56~60 (자차 보험료 변경됨)
('탁송', '56~60', 352630, 338300, 555290, 584530, 597590, 629090, 16680, 22820, 41560, 211530, 241960, 269580, NULL, 32400, '2026-01-26', TRUE),
-- 탁송 - 61~ (자차 보험료 변경됨)
('탁송', '61~', 373000, 357840, 587310, 618210, 632040, 665360, 17620, 24150, 43970, 223750, 255940, 285130, NULL, 32400, '2026-01-26', TRUE),
-- 확대탁송 - 26~30 (신규)
('확대탁송', '26~30', 516970, 495900, 813980, 856830, 875920, 922100, 24440, 33460, 60920, 310080, 354680, 395150, NULL, 54800, '2026-01-26', TRUE),
-- 확대탁송 - 31~45 (신규)
('확대탁송', '31~45', 334860, 321250, 527210, 554960, 567360, 597270, 15810, 21690, 39440, 200840, 229780, 255950, NULL, 42830, '2026-01-26', TRUE),
-- 확대탁송 - 46~50 (신규)
('확대탁송', '46~50', 396440, 380380, 624250, 657170, 671830, 707230, 18750, 25700, 46730, 237810, 272030, 303030, NULL, 42830, '2026-01-26', TRUE),
-- 확대탁송 - 51~55 (신규)
('확대탁송', '51~55', 416090, 399220, 655260, 689770, 705180, 742360, 19660, 26940, 49050, 249630, 285500, 318140, NULL, 42830, '2026-01-26', TRUE),
-- 확대탁송 - 56~60 (신규)
('확대탁송', '56~60', 466180, 447230, 734090, 772750, 790010, 831660, 22050, 30170, 54940, 279640, 319870, 356380, NULL, 42830, '2026-01-26', TRUE),
-- 확대탁송 - 61~ (신규)
('확대탁송', '61~', 493110, 473060, 776420, 817270, 835560, 879610, 23290, 31930, 58130, 295800, 338350, 376940, NULL, 42830, '2026-01-26', TRUE)
ON DUPLICATE KEY UPDATE
  daein2=VALUES(daein2),
  daein1_special=VALUES(daein1_special),
  daemul_3천=VALUES(daemul_3천),
  daemul_5천=VALUES(daemul_5천),
  daemul_1억=VALUES(daemul_1억),
  daemul_2억=VALUES(daemul_2억),
  jason_3천=VALUES(jason_3천),
  jason_5천=VALUES(jason_5천),
  jason_1억=VALUES(jason_1억),
  jacha_1천=VALUES(jacha_1천),
  jacha_2천=VALUES(jacha_2천),
  jacha_3천=VALUES(jacha_3천),
  rent_cost=VALUES(rent_cost),
  legal_cost=VALUES(legal_cost),
  updated_at=CURRENT_TIMESTAMP;
