<?php
/**
 * DB 연결 및 쿼리 헬퍼
 * 
 * 사용법:
 *   require_once __DIR__ . '/lib/db.php';
 *   $rows = db_query("SELECT * FROM partners WHERE code = ?", ['default']);
 *   $row = db_query_one("SELECT * FROM partners WHERE id = ?", [$id]);
 */

$GLOBALS['_db_connection'] = null;

/**
 * DB 연결 (싱글톤)
 */
function db_connect() {
    if ($GLOBALS['_db_connection'] !== null) {
        return $GLOBALS['_db_connection'];
    }

    // config.php는 홈 디렉터리(/mr4989/config.php)에 있음
    // www/lib/db.php → www → 상위 → config.php
    $config = require_once __DIR__ . '/../../config.php';
    $db = $config['db'];

    $mysqli = new mysqli(
        $db['host'],
        $db['username'],
        $db['password'],
        $db['database'],
        $db['port'] ?? 3306
    );

    if ($mysqli->connect_error) {
        throw new Exception("DB 연결 실패: " . $mysqli->connect_error);
    }

    $mysqli->set_charset($db['charset'] ?? 'utf8mb4');
    $mysqli->query("SET time_zone = '+09:00'"); // 한국 시간

    $GLOBALS['_db_connection'] = $mysqli;
    return $mysqli;
}

/**
 * 쿼리 실행 (여러 행 반환)
 */
function db_query(string $sql, ?array $params = null): array {
    $mysqli = db_connect();
    $stmt = $mysqli->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("쿼리 준비 실패: " . $mysqli->error);
    }

    if ($params && count($params) > 0) {
        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } else {
                $types .= 's';
            }
        }
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        $error = $stmt->error;
        $stmt->close();
        throw new Exception("쿼리 실행 실패: " . $error);
    }

    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

/**
 * 쿼리 실행 (단일 행 반환)
 */
function db_query_one(string $sql, ?array $params = null): ?array {
    $rows = db_query($sql, $params);
    return $rows[0] ?? null;
}

/**
 * INSERT/UPDATE/DELETE 실행 (영향받은 행 수 반환)
 */
function db_execute(string $sql, ?array $params = null): int {
    $mysqli = db_connect();
    $stmt = $mysqli->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("쿼리 준비 실패: " . $mysqli->error);
    }

    if ($params && count($params) > 0) {
        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } else {
                $types .= 's';
            }
        }
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        $error = $stmt->error;
        $stmt->close();
        throw new Exception("쿼리 실행 실패: " . $error);
    }

    $affected = $mysqli->affected_rows;
    $stmt->close();
    return $affected;
}
