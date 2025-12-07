<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
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
        $this->secretKey = getenv('key');
        $this->issuer    = getenv('issuer');
        $this->audience  = getenv('audience');
        $this->expire    = getenv('expire');
    }

    public static function getInstance(): JwtService
    {
        if (self::$instance === null) {
            self::$instance = new JwtService();
        }
        return self::$instance;
    }

    public function generateToken(int|string $userId): string
    {
        $issuedAt = time();
        $expire   = $issuedAt + $this->expire;

        $payload = [
            'iss'     => $this->issuer,
            'aud'     => $this->audience,
            'iat'     => $issuedAt,
            'exp'     => $expire,
            'user_id' => $userId
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function verifyToken(?string $authHeader)
    {
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return false;
        }

        $token = substr($authHeader, 7); 

        try {
            return JWT::decode($token, new Key($this->secretKey, 'HS256'));
        } catch (Exception $e) {
            error_log("JWT Error: " . $e->getMessage());
            return false;
        }
    }

    public function getUserId(?string $authHeader)
    {
        $decoded = $this->verifyToken($authHeader);

        return $decoded ? ($decoded->user_id ?? false) : false;
    }
}
