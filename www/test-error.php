<?php
/**
 * 에러 확인용 테스트 파일
 * 브라우저에서: http://dbins.kr/test-error.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>에러 확인 테스트</h1>";

echo "<h2>1. 파일 경로 확인</h2>";
echo "현재 파일: " . __FILE__ . "<br>";
echo "현재 디렉터리: " . __DIR__ . "<br>";

echo "<h2>2. lib/db.php 경로 확인</h2>";
$libPath = __DIR__ . '/lib/db.php';
echo "경로: $libPath<br>";
echo "존재: " . (file_exists($libPath) ? "✅ 있음" : "❌ 없음") . "<br>";

echo "<h2>3. config.php 경로 확인</h2>";
$configPath = __DIR__ . '/../config.php';
echo "경로: $configPath<br>";
echo "존재: " . (file_exists($configPath) ? "✅ 있음" : "❌ 없음") . "<br>";

echo "<h2>4. lib/db.php 로드 테스트</h2>";
try {
    require_once __DIR__ . '/lib/db.php';
    echo "✅ lib/db.php 로드 성공<br>";
} catch (Exception $e) {
    echo "❌ lib/db.php 로드 실패: " . $e->getMessage() . "<br>";
}

echo "<h2>5. DB 연결 테스트</h2>";
try {
    $rows = db_query("SELECT COUNT(*) as cnt FROM partners");
    echo "✅ DB 연결 성공: " . print_r($rows, true) . "<br>";
} catch (Exception $e) {
    echo "❌ DB 연결 실패: " . $e->getMessage() . "<br>";
}

echo "<h2>6. premium-rates 쿼리 테스트</h2>";
try {
    $rows = db_query(
        "SELECT insurance_type, age_group, daein2, daemul_3k 
         FROM premium_rates 
         WHERE is_active = true 
         LIMIT 3"
    );
    echo "✅ 쿼리 성공: " . count($rows) . "행<br>";
    echo "<pre>" . print_r($rows, true) . "</pre>";
} catch (Exception $e) {
    echo "❌ 쿼리 실패: " . $e->getMessage() . "<br>";
}
