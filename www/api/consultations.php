<?php
/**
 * 상담신청 API
 * POST /api/consultations
 * 
 * 요청: { name: string, phone: string, serviceType?: string, message?: string, consentPrivacy: boolean }
 * 응답: { ok: true, id: string } 또는 { ok: false, error: string }
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/context.php';
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
    if (empty($body['name']) || strlen($body['name']) > 50) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'name required (max 50)'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['phone'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'phone required'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // 전화번호 형식 검사 (하이픈 포함/제외 모두 허용, 10~11자리 숫자)
    $phoneDigits = preg_replace('/\D/', '', $body['phone']);
    if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 11) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'VALIDATION_ERROR', 'details' => 'Invalid phone'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (empty($body['consentPrivacy'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'CONSENT_REQUIRED'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $ctx = get_partner_context();
    $partner = $ctx['partner'];
    $ip = $ctx['ip'];
    $userAgent = $ctx['user_agent'];
    
    // UUID 생성
    $consultationId = bin2hex(random_bytes(16));
    $consultationId = substr($consultationId, 0, 8) . '-' . 
                      substr($consultationId, 8, 4) . '-' . 
                      substr($consultationId, 12, 4) . '-' . 
                      substr($consultationId, 16, 4) . '-' . 
                      substr($consultationId, 20, 12);
    
    // 상담신청 저장
    db_execute(
        "INSERT INTO consultations (id, partner_id, name, phone, service_type, message, consent_privacy, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            $consultationId,
            $partner['id'],
            $body['name'],
            $body['phone'],
            $body['serviceType'] ?? null,
            $body['message'] ?? null,
            $body['consentPrivacy'] ? 1 : 0,
            $ip,
            $userAgent,
        ]
    );
    
    // 사용자에게 SMS 발송
    $userPhone = $phoneDigits;
    if (strlen($userPhone) >= 10) {
        try {
            $userText = "[대리운전 보험] 상담신청이 완료되었습니다.\n담당자가 확인 후 곧 연락드리겠습니다.\n감사합니다.";
            $userSmsResult = aligo_send_sms(['to' => $userPhone, 'text' => $userText]);
            
            // 발송 로그 저장
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
                    'consultation',
                    $consultationId,
                    'sms',
                    $userPhone,
                    $userSmsResult['ok'] ? 'success' : 'error',
                    json_encode($userSmsResult['ok'] ? $userSmsResult['raw'] : ['error' => $userSmsResult['error'], 'raw' => $userSmsResult['raw']]),
                ]
            );
        } catch (Exception $smsError) {
            // SMS 발송 실패 시에도 로그 저장
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
                    'consultation',
                    $consultationId,
                    'sms',
                    $userPhone,
                    'error',
                    json_encode(['error' => $smsError->getMessage()]),
                ]
            );
        }
    }
    
    // 담당자에게 SMS 발송 (config.php에 operator_phone이 있으면)
    $config = require_once __DIR__ . '/../../config.php';
    $operatorPhone = $config['operator_phone'] ?? null;
    if ($operatorPhone) {
        try {
            $text = "[daeri][{$partner['code']}] 상담신청\n이름:{$body['name']}\n전화:{$body['phone']}\n유형:" . ($body['serviceType'] ?? '-') . "\n내용:" . substr($body['message'] ?? '-', 0, 1000);
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
                    'consultation',
                    $consultationId,
                    'sms',
                    $operatorPhone,
                    $smsResult['ok'] ? 'success' : 'error',
                    json_encode($smsResult['ok'] ? $smsResult['raw'] : ['error' => $smsResult['error'], 'raw' => $smsResult['raw']]),
                ]
            );
        } catch (Exception $smsError) {
            // 로그만 저장 (담당자 SMS 실패는 치명적이지 않음)
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
                    'consultation',
                    $consultationId,
                    'sms',
                    $operatorPhone,
                    'error',
                    json_encode(['error' => $smsError->getMessage()]),
                ]
            );
        }
    }
    
    echo json_encode(['ok' => true, 'id' => $consultationId], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'SERVER_ERROR',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
