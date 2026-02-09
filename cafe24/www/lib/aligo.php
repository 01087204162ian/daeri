<?php
/**
 * 알리고 SMS 전송
 * 
 * Next.js lib/aligo.ts와 동일한 방식:
 * 1. AWS Lambda 프록시 (권장): JSON 형식
 * 2. 직접 알리고 API 호출: Form data 형식
 * 
 * 사용법:
 *   require_once __DIR__ . '/lib/aligo.php';
 *   $result = aligo_send_sms(['to' => '01012345678', 'text' => '메시지']);
 *   if ($result['ok']) { ... }
 */

/**
 * 알리고 SMS 전송
 * 
 * @param array $args ['to' => string, 'text' => string, 'testmode' => bool]
 * @return array ['ok' => bool, 'raw' => mixed, 'error' => string|null]
 */
function aligo_send_sms(array $args): array {
    $config = require_once __DIR__ . '/../../config.php';
    
    // 1. AWS Lambda 프록시 방식 (권장)
    if (!empty($config['aligo_lambda_url'])) {
        return aligo_send_via_lambda($config['aligo_lambda_url'], $args);
    }
    
    // 2. 직접 알리고 API 호출
    if (empty($config['aligo'])) {
        return ['ok' => false, 'error' => '알리고 설정 없음', 'raw' => null];
    }
    
    $aligo = $config['aligo'];
    if (empty($aligo['user_id']) || empty($aligo['api_key']) || empty($aligo['sender'])) {
        return ['ok' => false, 'error' => '알리고 설정 불완전', 'raw' => null];
    }
    
    return aligo_send_direct($aligo, $args);
}

/**
 * Lambda 프록시를 통한 SMS 전송 (JSON)
 */
function aligo_send_via_lambda(string $lambdaUrl, array $args): array {
    $data = [
        'receiver' => $args['to'],
        'msg' => $args['text'],
        'testmode_yn' => !empty($args['testmode']) ? 'Y' : 'N',
    ];
    
    $ch = curl_init($lambdaUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($data),
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return ['ok' => false, 'error' => "HTTP $httpCode", 'raw' => $response];
    }
    
    $parsed = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $parsed = $response; // JSON이 아니면 원문 그대로
    }
    
    // 알리고 API 응답 확인: result_code가 0이 아니면 실패
    if (is_array($parsed) && isset($parsed['result_code'])) {
        $resultCode = $parsed['result_code'];
        if ($resultCode !== 0 && $resultCode !== '0') {
            $message = $parsed['message'] ?? "result_code: $resultCode";
            return ['ok' => false, 'error' => $message, 'raw' => $parsed];
        }
    }
    
    return ['ok' => true, 'raw' => $parsed, 'error' => null];
}

/**
 * 직접 알리고 API 호출 (Form data)
 */
function aligo_send_direct(array $aligo, array $args): array {
    $params = [
        'user_id' => $aligo['user_id'],
        'key' => $aligo['api_key'],
        'sender' => $aligo['sender'],
        'receiver' => $args['to'],
        'msg' => $args['text'],
    ];
    
    if (!empty($args['title'])) {
        $params['title'] = $args['title'];
    }
    
    $ch = curl_init($aligo['sms_url']);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded;charset=UTF-8'],
        CURLOPT_POSTFIELDS => http_build_query($params),
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return ['ok' => false, 'error' => "HTTP $httpCode", 'raw' => $response];
    }
    
    $parsed = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $parsed = $response;
    }
    
    // 알리고 API 응답 확인
    if (is_array($parsed) && isset($parsed['result_code'])) {
        $resultCode = $parsed['result_code'];
        if ($resultCode !== 0 && $resultCode !== '0') {
            $message = $parsed['message'] ?? "result_code: $resultCode";
            return ['ok' => false, 'error' => $message, 'raw' => $parsed];
        }
    }
    
    return ['ok' => true, 'raw' => $parsed, 'error' => null];
}
