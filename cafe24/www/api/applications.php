<?php
/**
 * 가입신청 API
 * POST /api/applications
 * 
 * 요청: ApplicationSchema (insuranceType, name, phone, residentNumber1/2, address, ...)
 * 응답: { ok: true, id: string } 또는 { ok: false, error: string }
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/context.php';
require_once __DIR__ . '/../lib/crypto.php';
require_once __DIR__ . '/../lib/aligo.php';

// POST만 허용
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $body = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'INVALID_JSON'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // 유효성 검사
    if (empty($body['insuranceType']) || strlen($body['insuranceType']) > 30) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'insuranceType required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['name']) || strlen($body['name']) > 50) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'name required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['phone'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'phone required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $phoneDigits = preg_replace('/\D/', '', $body['phone']);
    if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 11) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'Invalid phone'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['residentNumber1']) || !preg_match('/^\d{6}$/', $body['residentNumber1'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'residentNumber1 must be 6 digits'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['residentNumber2']) || !preg_match('/^\d{7}$/', $body['residentNumber2'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'residentNumber2 must be 7 digits'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['address']) || strlen($body['address']) > 200) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'address required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['bankName']) || strlen($body['bankName']) > 50) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'bankName required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['accountNumber']) || strlen($body['accountNumber']) > 50) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'accountNumber required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['consentPrivacy'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'CONSENT_REQUIRED'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // 계약자와 대리기사가 다른 경우 검증
    $isSamePerson = !empty($body['isSamePerson']);
    if (!$isSamePerson) {
        if (empty($body['contractorName'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'CONTRACTOR_NAME_REQUIRED'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (empty($body['contractorPhone'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'CONTRACTOR_PHONE_REQUIRED'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (empty($body['contractorResidentNumber1']) || empty($body['contractorResidentNumber2'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'CONTRACTOR_RN_REQUIRED'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    
    $ctx = get_partner_context();
    $partner = $ctx['partner'];
    $ip = $ctx['ip'];
    $userAgent = $ctx['user_agent'];
    
    // UUID 생성
    $applicationId = bin2hex(random_bytes(16));
    $applicationId = substr($applicationId, 0, 8) . '-' . 
                     substr($applicationId, 8, 4) . '-' . 
                     substr($applicationId, 12, 4) . '-' . 
                     substr($applicationId, 16, 4) . '-' . 
                     substr($applicationId, 20, 12);
    
    // 가입신청 저장 (비민감정보)
    db_execute(
        "INSERT INTO applications (id, partner_id, insurance_type, name, phone, yearly_premium, first_premium, address, address_detail, is_same_person, contractor_name, contractor_phone, bank_name, consent_privacy, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            $applicationId,
            $partner['id'],
            $body['insuranceType'],
            $body['name'],
            $body['phone'],
            $body['yearlyPremium'] ?? null,
            $body['firstPremium'] ?? null,
            $body['address'],
            $body['addressDetail'] ?? null,
            $isSamePerson ? 1 : 0,
            $isSamePerson ? null : ($body['contractorName'] ?? null),
            $isSamePerson ? null : ($body['contractorPhone'] ?? null),
            $body['bankName'],
            $body['consentPrivacy'] ? 1 : 0,
            $ip,
            $userAgent,
        ]
    );
    
    // 민감정보 암호화 저장
    $residentEnc = encrypt_field("{$body['residentNumber1']}-{$body['residentNumber2']}");
    $contractorResidentEnc = null;
    if (!$isSamePerson && !empty($body['contractorResidentNumber1']) && !empty($body['contractorResidentNumber2'])) {
        $contractorResidentEnc = encrypt_field("{$body['contractorResidentNumber1']}-{$body['contractorResidentNumber2']}");
    }
    
    db_execute(
        "INSERT INTO application_secrets (application_id, resident_number_enc, contractor_resident_number_enc, account_number_enc, card_number_enc, card_expiry_enc)
         VALUES (?, ?, ?, ?, ?, ?)",
        [
            $applicationId,
            $residentEnc,
            $contractorResidentEnc,
            encrypt_field($body['accountNumber'] ?? ''),
            encrypt_field($body['cardNumber'] ?? ''),
            encrypt_field($body['cardExpiry'] ?? ''),
        ]
    );
    
    // 사용자에게 SMS 발송
    $userPhone = $phoneDigits;
    if (strlen($userPhone) >= 10) {
        try {
            $userText = "[대리운전 보험] 가입신청이 완료되었습니다.\n심사 결과는 담당자가 확인 후 문자로 안내드리겠습니다.\n감사합니다.";
            $userSmsResult = aligo_send_sms(['to' => $userPhone, 'text' => $userText]);
            
            $logId = bin2hex(random_bytes(16));
            $logId = substr($logId, 0, 8) . '-' . substr($logId, 8, 4) . '-' . 
                     substr($logId, 12, 4) . '-' . substr($logId, 16, 4) . '-' . 
                     substr($logId, 20, 12);
            
            db_execute(
                "INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $logId,
                    $partner['id'],
                    'application',
                    $applicationId,
                    'sms',
                    $userPhone,
                    $userSmsResult['ok'] ? 'success' : 'error',
                    json_encode($userSmsResult['ok'] ? $userSmsResult['raw'] : ['error' => $userSmsResult['error'], 'raw' => $userSmsResult['raw']]),
                ]
            );
        } catch (Exception $smsError) {
            $logId = bin2hex(random_bytes(16));
            $logId = substr($logId, 0, 8) . '-' . substr($logId, 8, 4) . '-' . 
                     substr($logId, 12, 4) . '-' . substr($logId, 16, 4) . '-' . 
                     substr($logId, 20, 12);
            
            db_execute(
                "INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $logId,
                    $partner['id'],
                    'application',
                    $applicationId,
                    'sms',
                    $userPhone,
                    'error',
                    json_encode(['error' => $smsError->getMessage()]),
                ]
            );
        }
    }
    
    // 담당자에게 SMS 발송
    $config = require_once __DIR__ . '/../../config.php';
    $operatorPhone = $config['operator_phone'] ?? null;
    if ($operatorPhone) {
        try {
            $text = "[daeri][{$partner['code']}] 가입신청\n이름:{$body['name']}\n전화:{$body['phone']}\n유형:{$body['insuranceType']}\n주소:{$body['address']} " . ($body['addressDetail'] ?? '') . "\n보험료:" . ($body['yearlyPremium'] ?? '-') . " / 1회:" . ($body['firstPremium'] ?? '-');
            $smsResult = aligo_send_sms(['to' => $operatorPhone, 'text' => $text]);
            
            $logId = bin2hex(random_bytes(16));
            $logId = substr($logId, 0, 8) . '-' . substr($logId, 8, 4) . '-' . 
                     substr($logId, 12, 4) . '-' . substr($logId, 16, 4) . '-' . 
                     substr($logId, 20, 12);
            
            db_execute(
                "INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $logId,
                    $partner['id'],
                    'application',
                    $applicationId,
                    'sms',
                    $operatorPhone,
                    $smsResult['ok'] ? 'success' : 'error',
                    json_encode($smsResult['ok'] ? $smsResult['raw'] : ['error' => $smsResult['error'], 'raw' => $smsResult['raw']]),
                ]
            );
        } catch (Exception $smsError) {
            $logId = bin2hex(random_bytes(16));
            $logId = substr($logId, 0, 8) . '-' . substr($logId, 8, 4) . '-' . 
                     substr($logId, 12, 4) . '-' . substr($logId, 16, 4) . '-' . 
                     substr($logId, 20, 12);
            
            db_execute(
                "INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $logId,
                    $partner['id'],
                    'application',
                    $applicationId,
                    'sms',
                    $operatorPhone,
                    'error',
                    json_encode(['error' => $smsError->getMessage()]),
                ]
            );
        }
    }
    
    echo json_encode(['ok' => true, 'id' => $applicationId], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'SERVER_ERROR',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'FATAL_ERROR',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
