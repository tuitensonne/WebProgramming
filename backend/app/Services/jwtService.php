<?php

namespace App\Services;

use Exception;

class JwtService
{
    private static ?JwtService $instance = null;

    private string $secretKey;
    private string $issuer;
    private string $audience;
    private int $expire;

    private function __construct()
    {
        $this->secretKey = getenv('key') ?: 'dev-secret-key';
        $this->issuer    = getenv('issuer') ?: 'bk-tours';
        $this->audience  = getenv('audience') ?: 'bk-tours-client';
        $this->expire    = (int) (getenv('expire') ?: 3600); // 1h mặc định
    }

    public static function getInstance(): JwtService
    {
        if (self::$instance === null) {
            self::$instance = new JwtService();
        }
        return self::$instance;
    }

    /**
     * Tạo "JWT" đơn giản không phụ thuộc thư viện bên ngoài
     * dạng header.payload.signature (base64url + HMAC-SHA256).
     */
    public function generateToken(int|string $userId): string
    {
        $issuedAt = time();
        $expire   = $issuedAt + $this->expire;

        $payload = [
            'iss'    => $this->issuer,
            'aud'    => $this->audience,
            'iat'    => $issuedAt,
            'exp'    => $expire,
            'id'     => $userId,
            'userId' => $userId,
        ];

        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        $headerB64  = $this->base64UrlEncode(json_encode($header));
        $payloadB64 = $this->base64UrlEncode(json_encode($payload));

        $signature  = hash_hmac('sha256', $headerB64 . '.' . $payloadB64, $this->secretKey, true);
        $signatureB64 = $this->base64UrlEncode($signature);

        return $headerB64 . '.' . $payloadB64 . '.' . $signatureB64;
    }

    public function verifyToken(?string $authHeader)
    {
        if (!$authHeader) {
            return false;
        }

        // Accept either the full 'Authorization' header string ("Bearer <token>")
        // or the raw token value. Normalize to token string.
        $token = $authHeader;
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }

        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return false;
            }

            [$headerB64, $payloadB64, $signatureB64] = $parts;

            $expectedSig = hash_hmac('sha256', $headerB64 . '.' . $payloadB64, $this->secretKey, true);
            $expectedSigB64 = $this->base64UrlEncode($expectedSig);

            if (!hash_equals($expectedSigB64, $signatureB64)) {
                return false;
            }

            $payloadJson = $this->base64UrlDecode($payloadB64);
            $payload = json_decode($payloadJson);

            if (!$payload || !isset($payload->exp) || $payload->exp < time()) {
                return false;
            }

            return $payload;
        } catch (Exception $e) {
            error_log("Simple JWT Error: " . $e->getMessage());
            return false;
        }
    }

    public function getUserId(?string $authHeader)
    {
        $decoded = $this->verifyToken($authHeader);

        return $decoded ? ($decoded->id ?? $decoded->userId ?? false) : false;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
}
