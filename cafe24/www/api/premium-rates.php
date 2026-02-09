<?php
/**
 * 보험료 데이터 조회 API
 * GET /api/premium-rates
 * 
 * 응답: { ok: true, data: [...] }
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../lib/db.php';

try {
    // 활성화된 보험료 데이터 조회
    // 주의: DB 컬럼명은 ASCII (daemul_3k 등), 응답은 기존 키(daemul_3천 등)로 매핑
    $rows = db_query(
        "SELECT 
            insurance_type,
            age_group,
            daein2,
            daein1_special,
            daemul_3k as `daemul_3천`,
            daemul_5k as `daemul_5천`,
            daemul_1eok as `daemul_1억`,
            daemul_2eok as `daemul_2억`,
            jason_3k as `jason_3천`,
            jason_5k as `jason_5천`,
            jason_1eok as `jason_1억`,
            jacha_1k as `jacha_1천`,
            jacha_2k as `jacha_2천`,
            jacha_3k as `jacha_3천`,
            rent_cost,
            legal_cost
        FROM premium_rates
        WHERE is_active = true
            AND (effective_date IS NULL OR effective_date <= CURDATE())
            AND (expiry_date IS NULL OR expiry_date >= CURDATE())
        ORDER BY insurance_type, age_group"
    );

    echo json_encode(['ok' => true, 'data' => $rows], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'SERVER_ERROR',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
