<?php
/**
 * daeri Cafe24 설정 예시
 * 서버에 복사 후 config.php 로 저장하고 값을 채운 뒤, 웹에서 직접 접근되지 않게 하세요.
 *
 * 권장 위치 (Cafe24):
 * - 방법 A: DOCUMENT_ROOT 상위에 두기 (예: /home/mr4989/config.php)
 *   → PHP에서: require_once __DIR__ . '/../config.php';
 * - 방법 B: www/config.php 에 두고 .htaccess 로 config.php 접근 차단
 */

return [
    // DB (MariaDB)
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'mr4989',
        'username' => 'mr4989',
        'password' => '여기에_DB비밀번호',
        'charset'  => 'utf8mb4',
    ],

    // 파트너 기본값 (URL/쿠키에 partner 없을 때)
    'default_partner_code' => 'default',

    // 알리고 SMS (직접 API 호출 시)
    'aligo' => [
        'sms_url'   => 'https://apis.aligo.in/send/',
        'user_id'   => '',
        'api_key'   => '',
        'sender'    => '',
    ],

    // 알리고 Lambda 프록시 사용 시 (SMS 키를 서버에 두고 싶지 않을 때)
    // 'aligo_lambda_url' => 'https://xxx.lambda-url.ap-northeast-2.on.aws/',
];
