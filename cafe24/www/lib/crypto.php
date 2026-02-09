<?php
/**
 * 필드 암호화 (AES-256-GCM)
 * 
 * Next.js lib/crypto.ts와 동일한 방식:
 * - 알고리즘: aes-256-gcm
 * - IV: 12바이트 (랜덤)
 * - Tag: 16바이트
 * - 포맷: [iv|tag|ciphertext] base64
 * 
 * 사용법:
 *   require_once __DIR__ . '/lib/crypto.php';
 *   $encrypted = encrypt_field("주민번호-1234567");
 *   $decrypted = decrypt_field($encrypted);
 */

const CRYPTO_ALGO = 'aes-256-gcm';
const CRYPTO_IV_BYTES = 12;
const CRYPTO_TAG_BYTES = 16;

/**
 * 암호화 키 가져오기 (config.php에서)
 */
function get_encryption_key(): string {
    $config = require_once __DIR__ . '/../../config.php';
    $keyB64 = $config['field_encryption_key'] ?? null;
    
    if (!$keyB64) {
        throw new Exception("Missing config: field_encryption_key (base64 32 bytes)");
    }
    
    $key = base64_decode($keyB64, true);
    if ($key === false || strlen($key) !== 32) {
        throw new Exception("field_encryption_key must be 32 bytes (base64)");
    }
    
    return $key;
}

/**
 * 필드 암호화
 */
function encrypt_field(string $plaintext): string {
    if (empty($plaintext)) {
        return '';
    }
    
    $key = get_encryption_key();
    $iv = random_bytes(CRYPTO_IV_BYTES);
    
    $ciphertext = openssl_encrypt(
        $plaintext,
        CRYPTO_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        $iv,
        $tag
    );
    
    if ($ciphertext === false) {
        throw new Exception("암호화 실패");
    }
    
    // [iv|tag|ciphertext] base64
    return base64_encode($iv . $tag . $ciphertext);
}

/**
 * 필드 복호화
 */
function decrypt_field(string $payloadB64): string {
    if (empty($payloadB64)) {
        return '';
    }
    
    $key = get_encryption_key();
    $payload = base64_decode($payloadB64, true);
    
    if ($payload === false || strlen($payload) < CRYPTO_IV_BYTES + CRYPTO_TAG_BYTES + 1) {
        throw new Exception("Invalid encrypted payload");
    }
    
    $iv = substr($payload, 0, CRYPTO_IV_BYTES);
    $tag = substr($payload, CRYPTO_IV_BYTES, CRYPTO_TAG_BYTES);
    $ciphertext = substr($payload, CRYPTO_IV_BYTES + CRYPTO_TAG_BYTES);
    
    $plaintext = openssl_decrypt(
        $ciphertext,
        CRYPTO_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        $iv,
        $tag
    );
    
    if ($plaintext === false) {
        throw new Exception("복호화 실패");
    }
    
    return $plaintext;
}
