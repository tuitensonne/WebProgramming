<?php
/**
 * Test script để verify JWT authentication hoạt động đúng
 */
// Load Composer autoloader
require_once __DIR__ . '/vendor/autoload.php';

// Load and register App autoloader
require_once __DIR__ . '/app/Core/Autoloader.php';

use App\Services\JwtService;
use App\Models\UserModel;


// Test 1: Generate JWT token
echo "=== TEST JWT GENERATION ===\n";
$jwt = JwtService::getInstance();
$userId = 1; // Assume user ID 1 exists
$token = $jwt->generateToken($userId);
echo "✅ Generated token: " . substr($token, 0, 50) . "...\n";

// Test 2: Verify JWT token
echo "\n=== TEST JWT VERIFICATION ===\n";
$authHeader = "Bearer " . $token;
$decoded = $jwt->verifyToken($authHeader);
if ($decoded) {
    echo "✅ Token verified successfully\n";
    echo "   User ID: " . $decoded->user_id . "\n";
} else {
    echo "❌ Token verification failed\n";
}

// Test 3: Get user from database
echo "\n=== TEST USER FETCH ===\n";
$userModel = new UserModel();
$user = $userModel->findById(1);
if ($user) {
    echo "✅ User found:\n";
    echo "   ID: " . $user['id'] . "\n";
    echo "   Email: " . $user['email'] . "\n";
    echo "   Role: " . $user['role'] . "\n";
    echo "   Is Active: " . ($user['isActive'] ? 'Yes' : 'No') . "\n";
} else {
    echo "❌ User not found\n";
}

// Test 4: Test Auth::requireRole with valid token
echo "\n=== TEST AUTH MIDDLEWARE (Valid Token) ===\n";
$_SERVER['HTTP_AUTHORIZATION'] = $authHeader;
require_once __DIR__ . '/app/Middleware/Auth.php';
// This would normally exit if invalid

echo "\n✅ All tests completed!\n";
?>
