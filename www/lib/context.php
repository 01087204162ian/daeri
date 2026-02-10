<?php
/**
 * 파트너 컨텍스트 (쿠키/쿼리 파라미터에서 파트너 코드 읽기)
 * 
 * Next.js app/api/_lib/context.ts와 동일한 로직:
 * 1. 쿠키에서 파트너 코드 확인 (우선순위)
 * 2. 쿼리 파라미터에서 확인 (?partner= 또는 ?p=)
 * 3. 기본값: 'default'
 * 
 * 사용법:
 *   require_once __DIR__ . '/lib/context.php';
 *   $ctx = get_partner_context();
 *   $partner = $ctx['partner']; // ['id' => string, 'code' => string, 'name' => string]
 *   $ip = $ctx['ip'];
 *   $userAgent = $ctx['user_agent'];
 */

/**
 * 파트너 컨텍스트 가져오기
 * 
 * @return array ['partner' => array, 'partner_code' => string, 'ip' => string|null, 'user_agent' => string|null]
 */
function get_partner_context(): array {
    require_once __DIR__ . '/db.php';
    
    // 1. 쿠키에서 파트너 코드 확인 (우선순위)
    $partnerCode = get_partner_code_from_cookie();
    
    // 2. 쿠키에 없으면 쿼리 파라미터에서 확인
    if ($partnerCode === 'default' && !empty($_GET['partner'])) {
        $partnerCode = $_GET['partner'];
    } elseif ($partnerCode === 'default' && !empty($_GET['p'])) {
        $partnerCode = $_GET['p'];
    }
    
    // 3. 기본값
    if (empty($partnerCode)) {
        $partnerCode = 'default';
    }
    
    // IP, User-Agent
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;
    if ($ip && strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
    }
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    // DB에서 파트너 조회
    $partner = db_query_one(
        "SELECT id, code, name FROM partners WHERE code = ? LIMIT 1",
        [$partnerCode]
    );
    
    if (!$partner) {
        throw new Exception("Unknown partner_code: $partnerCode");
    }
    
    return [
        'partner' => $partner,
        'partner_code' => $partnerCode,
        'ip' => $ip,
        'user_agent' => $userAgent,
    ];
}

/**
 * 쿠키에서 파트너 코드 읽기
 */
function get_partner_code_from_cookie(): string {
    if (empty($_COOKIE['partner'])) {
        return 'default';
    }
    return $_COOKIE['partner'];
}
