<?php
/**
 * 가입신청 목록 조회 API (운영용)
 *
 * GET /api/admin-applications.php
 *
 * - 대상: disk-cms-react (보험상품 > 대리운전 > DB개인대리운전) 페이지
 * - 역할: applications 테이블의 비민감 정보(기본 컬럼)를 조회하여 리스트로 반환
 * - 민감정보(application_secrets 테이블의 암호문)는 이 API에서 노출하지 않음
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/context.php';

// GET만 허용
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 파트너 컨텍스트
    $ctx = get_partner_context();
    $partner = $ctx['partner'];

    // 향후 필터(날짜/이름/전화/유형 등)는 쿼리스트링으로 확장 예정

    $rows = db_query(
        "SELECT
            id,
            insurance_type,
            name,
            phone,
            yearly_premium,
            first_premium,
            address,
            address_detail,
            is_same_person,
            contractor_name,
            contractor_phone,
            bank_name,
            consent_privacy,
            ip,
            user_agent,
            created_at
         FROM applications
         WHERE partner_id = ?
         ORDER BY created_at DESC",
        [$partner['id']]
    );

    echo json_encode([
        'ok' => true,
        'data' => $rows,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'SERVER_ERROR',
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}

