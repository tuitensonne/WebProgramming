<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\UserModel;
use App\Services\JwtService;
use App\Services\S3Service;
use PDO;

class UserController extends Controller
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * Get user profile by JWT token
     * GET /users/profile
     * Headers: Authorization: Bearer {token}
     */
    public function getProfile()
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);

            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;
            $user = $this->userModel->findById($userId);

            if (!$user) {
                return $this->error('User not found', 404);
            }

            // Remove password from response
            unset($user['password']);

            return $this->success($user, 'Profile retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to get profile', 500, $e->getMessage());
        }
    }

    /**
     * Get user by ID (admin or self)
     * GET /users/{id}
     */
    public function getById($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // Allow user to view their own profile or admin to view any profile
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $user = $this->userModel->findById($id);

            if (!$user) {
                return $this->error('User not found', 404);
            }

            unset($user['password']);

            return $this->success($user, 'User retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to get user', 500, $e->getMessage());
        }
    }

    /**
     * Update user profile (legacy endpoint - uses old update method)
     * PUT /users/{id}
     * Headers: Authorization: Bearer {token}
     * Body: { fullName, email, phone, avatarUrl, dateOfBirth }
     */
    public function update($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // Allow user to update their own profile or admin to update any profile
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $input = json_decode(file_get_contents("php://input"), true);

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            // Prepare update data
            $updateData = [
                'role'       => $user['role'],
                'fullName'   => $input['fullName'] ?? $user['fullName'],
                'avatarUrl'  => $input['avatarUrl'] ?? $user['avatarUrl'],
                'email'      => $input['email'] ?? $user['email'],
                'phone'      => $input['phone'] ?? $user['phone'],
                'isActive'   => $input['isActive'] ?? $user['isActive']
            ];

            // Check if new email is already taken by another user
            if ($input['email'] && $input['email'] !== $user['email']) {
                $existingUser = $this->userModel->findByEmail($input['email']);
                if ($existingUser) {
                    return $this->error('Email already exists', 409);
                }
            }

            $updated = $this->userModel->update($id, $updateData);

            if (!$updated) {
                return $this->error('Failed to update profile', 500);
            }

            // Fetch and return updated user
            $updatedUser = $this->userModel->findById($id);
            unset($updatedUser['password']);

            return $this->success($updatedUser, 'Profile updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update profile', 500, $e->getMessage());
        }
    }

    /**
     * Update user profile (name, email, phone, dateOfBirth)
     * PUT /users/{id}/profile
     * Headers: Authorization: Bearer {token}
     * Body: { fullName?, email?, phone?, dateOfBirth? }
     */
    public function updateProfile($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // User can only update their own profile
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $input = json_decode(file_get_contents("php://input"), true) ?? [];

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            // Basic email validation
            if (isset($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->error('Invalid email format', 400);
            }

            // Basic phone validation (digits, +, space)
            if (isset($input['phone'])) {
                $phone = preg_replace('/\s+/', '', $input['phone']);
                if (!preg_match('/^\+?[0-9]{8,15}$/', $phone)) {
                    return $this->error('Invalid phone number', 400);
                }
                $input['phone'] = $phone;
            }

            // Check if new email is already taken
            if (isset($input['email']) && $input['email'] !== $user['email']) {
                $existingUser = $this->userModel->findByEmail($input['email']);
                if ($existingUser) {
                    return $this->error('Email already exists', 409);
                }
            }

            // Update profile using new updateProfile method
            $updated = $this->userModel->updateProfile($id, $input);

            if (!$updated) {
                return $this->error('Failed to update profile', 500);
            }

            $updatedUser = $this->userModel->findById($id);
            unset($updatedUser['password']);

            return $this->success($updatedUser, 'Profile updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update profile', 500, $e->getMessage());
        }
    }

    /**
     * Upload user avatar
     * POST /users/{id}/avatar
     * Headers: Authorization: Bearer {token}
     * Form: multipart/form-data with 'avatar' file field
     */
    public function uploadAvatar($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // User can only upload their own avatar
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            if (!isset($_FILES['avatar'])) {
                return $this->error('No file uploaded', 400);
            }

            $file = $_FILES['avatar'];

            // Validate file
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $maxSize = 5 * 1024 * 1024; // 5MB

            if (!in_array($file['type'], $allowedTypes)) {
                return $this->error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP', 400);
            }

            if ($file['size'] > $maxSize) {
                return $this->error('File too large. Max size: 5MB', 400);
            }

            if ($file['error'] !== UPLOAD_ERR_OK) {
                return $this->error('Upload error: ' . $file['error'], 400);
            }

            $avatarUrl = null;

            // Try to upload to S3 first
            $s3Service = S3Service::getInstance();
            if ($s3Service->isConfigured()) {
                $uploadResult = $s3Service->upload($file, 'avatars/');
                
                if ($uploadResult['success']) {
                    $avatarUrl = $uploadResult['url'];
                } else {
                    // Log S3 error but continue with local fallback
                    error_log('S3 upload failed: ' . ($uploadResult['error'] ?? 'Unknown error'));
                }
            }

            // Fallback to local storage if S3 is not configured or failed
            if (!$avatarUrl) {
            // Create storage directory if not exists
            $uploadDir = dirname(__DIR__) . '/../Storage/uploads/avatars/';
            if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0755, true)) {
                        return $this->error('Failed to create upload directory', 500);
                    }
            }

            // Generate unique filename
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'avatar_' . $id . '_' . time() . '.' . $ext;
            $filepath = $uploadDir . $filename;

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                return $this->error('Failed to save file', 500);
                }

                // Build full URL for local storage
                // Get the base URL from the request
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
                $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
                
                // Get the base path from REQUEST_URI or SCRIPT_NAME
                // Remove /backend/public from the path
                $requestUri = $_SERVER['REQUEST_URI'] ?? '';
                $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
                
                // Extract base path - typically /ltweb/btl/WebProgramming/backend/public
                // We want to keep only up to /backend/public
                $basePath = dirname($scriptName);
                $basePath = rtrim(str_replace('\\', '/', $basePath), '/');
                
                // Construct URL - the Storage route will be handled by index.php
                $avatarUrl = "{$protocol}://{$host}{$basePath}/Storage/uploads/avatars/{$filename}";
            }

            // Update user avatar URL in database
            $updated = $this->userModel->updateProfile($id, ['avatarUrl' => $avatarUrl]);

            if (!$updated) {
                // Clean up uploaded file if database update failed
                if (strpos($avatarUrl, 'http://') === 0 || strpos($avatarUrl, 'https://') === 0) {
                    // Check if it's S3 URL or local storage URL
                    if (strpos($avatarUrl, '.s3.') !== false || strpos($avatarUrl, 'amazonaws.com') !== false) {
                        // S3 file - try to delete
                        try {
                            $s3Service->deleteByUrl($avatarUrl);
                        } catch (\Exception $e) {
                            // Log but don't fail
                            error_log('Failed to delete S3 file: ' . $e->getMessage());
                        }
                    } else {
                        // Local storage URL - extract file path
                        $parsedUrl = parse_url($avatarUrl);
                        if (isset($parsedUrl['path']) && strpos($parsedUrl['path'], '/Storage/') !== false) {
                            $localPath = dirname(__DIR__) . '/..' . $parsedUrl['path'];
                            if (file_exists($localPath)) {
                                unlink($localPath);
                            }
                        }
                    }
                } else if (strpos($avatarUrl, '/Storage/') === 0) {
                    // Relative path local file
                    $localPath = dirname(__DIR__) . '/..' . $avatarUrl;
                    if (file_exists($localPath)) {
                        unlink($localPath);
                    }
                }
                return $this->error('Failed to update avatar', 500);
            }

            $user = $this->userModel->findById($id);
            unset($user['password']);

            return $this->success($user, 'Avatar uploaded successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to upload avatar', 500, $e->getMessage());
        }
    }

    /**
     * Get payment info
     * GET /users/{id}/payment
     * Headers: Authorization: Bearer {token}
     */
    public function getPaymentInfo($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // User can only view their own payment info
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            $paymentInfo = $this->userModel->getPaymentInfo($id);

            return $this->success($paymentInfo ?? (object)[], 'Payment info retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to get payment info', 500, $e->getMessage());
        }
    }

    /**
     * Update payment info (card, bank, etc.)
     * PUT /users/{id}/payment
     * Headers: Authorization: Bearer {token}
     * Body: { paymentMethod, cardNumber?, cardHolder?, expiryDate?, cvv?, bankName?, bankAccount?, bankAccountHolder? }
     * Note: Sensitive data like cardNumber, cvv should be encrypted in production
     */
    public function updatePaymentInfo($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // User can only update their own payment info
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $input = json_decode(file_get_contents("php://input"), true) ?? [];

            if (!isset($input['paymentMethod'])) {
                return $this->error('Payment method is required', 400);
            }

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            // Validate payment method
            $validMethods = ['card', 'bank', 'e-wallet'];
            if (!in_array($input['paymentMethod'], $validMethods)) {
                return $this->error('Invalid payment method. Allowed: card, bank, e-wallet', 400);
            }

            // Additional validation for card method
            if ($input['paymentMethod'] === 'card') {
                $cardNumber = preg_replace('/\s+/', '', $input['cardNumber'] ?? '');
                $cardHolder = trim($input['cardHolder'] ?? '');
                $expiry     = trim($input['expiryDate'] ?? '');
                $cvv        = trim($input['cvv'] ?? '');

                if ($cardNumber === '' || !preg_match('/^[0-9]{13,19}$/', $cardNumber)) {
                    return $this->error('Invalid card number', 400);
                }

                if ($cardHolder === '') {
                    return $this->error('Card holder name is required', 400);
                }

                // expiry format MM/YY, valid month 1-12 and not in the past
                if (!preg_match('/^(0[1-9]|1[0-2])\/([0-9]{2})$/', $expiry)) {
                    return $this->error('Invalid expiry date format. Use MM/YY', 400);
                }

                [$mm, $yy] = explode('/', $expiry);
                $month = (int) $mm;
                $year  = (int) $yy + 2000;

                $nowYear  = (int) date('Y');
                $nowMonth = (int) date('m');

                if ($year < $nowYear || ($year === $nowYear && $month < $nowMonth)) {
                    return $this->error('Card has expired', 400);
                }

                if ($cvv === '' || !preg_match('/^[0-9]{3,4}$/', $cvv)) {
                    return $this->error('Invalid CVV', 400);
                }

                // Chuẩn hóa lại dữ liệu card lưu vào DB
                $input = [
                    'paymentMethod' => 'card',
                    'card' => [
                        'cardNumber' => $cardNumber,
                        'cardHolder' => $cardHolder,
                        'expiryDate' => $expiry,
                    ],
                ];
            }

            // In production, encrypt sensitive fields before storing
            // For now, store as-is (not recommended for real payment data)
            $updated = $this->userModel->updatePaymentInfo($id, $input);

            if (!$updated) {
                return $this->error('Failed to update payment info', 500);
            }

            $paymentInfo = $this->userModel->getPaymentInfo($id);

            return $this->success($paymentInfo, 'Payment info updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update payment info', 500, $e->getMessage());
        }
    }

    /**
     * Change user password (fixed version)
     * PUT /users/{id}/change-password
     * Headers: Authorization: Bearer {token}
     * Body: { currentPassword, newPassword }
     */
    public function changePasswordFixed($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // User can only change their own password
            if ($userId != $id) {
                return $this->error('Unauthorized', 403);
            }

            $input = json_decode(file_get_contents("php://input"), true);

            if (!isset($input['currentPassword']) || !isset($input['newPassword'])) {
                return $this->error('Missing current or new password', 400);
            }

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            // Verify current password
            if (!password_verify($input['currentPassword'], $user['password'])) {
                return $this->error('Current password is incorrect', 401);
            }

            // Validate new password strength (at least 6 characters)
            if (strlen($input['newPassword']) < 6) {
                return $this->error('New password must be at least 6 characters', 400);
            }

            // Update password using the new changePassword method
            $updated = $this->userModel->changePassword($id, $input['newPassword']);

            if (!$updated) {
                return $this->error('Failed to change password', 500);
            }

            return $this->success(null, 'Password changed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to change password', 500, $e->getMessage());
        }
    }

    /**
     * Legacy changePassword method (kept for backwards compatibility)
     * PUT /users/{id}/password
     * Headers: Authorization: Bearer {token}
     * Body: { currentPassword, newPassword }
     */
    public function changePassword($id)
    {
        // Redirect to new fixed version
        return $this->changePasswordFixed($id);
    }

    /**
     * List all users (admin only)
     * GET /users
     */
    public function list()
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded || $decoded->role !== 'admin') {
                return $this->error('Admin access required', 403);
            }

            // This would require a getAllUsers method in UserModel
            // For now, returning a placeholder message
            return $this->error('Not implemented', 501);
        } catch (\Exception $e) {
            return $this->error('Failed to list users', 500, $e->getMessage());
        }
    }

    /**
     * Delete user (admin or self)
     * DELETE /users/{id}
     */
    public function delete($id)
    {
        try {
            $jwt = JwtService::getInstance();
            $token = $this->getBearerToken();

            if (!$token) {
                return $this->error('No token provided', 401);
            }

            $decoded = $jwt->verifyToken($token);
            if (!$decoded) {
                return $this->error('Invalid or expired token', 401);
            }

            $userId = $decoded->id ?? $decoded->userId;

            // Allow user to delete their own account or admin to delete any account
            if ($userId != $id && $decoded->role !== 'admin') {
                return $this->error('Unauthorized', 403);
            }

            $user = $this->userModel->findById($id);
            if (!$user) {
                return $this->error('User not found', 404);
            }

            $deleted = $this->userModel->delete($id);

            if (!$deleted) {
                return $this->error('Failed to delete user', 500);
            }

            return $this->success(null, 'User deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete user', 500, $e->getMessage());
        }
    }

    /**
     * Helper to extract bearer token from Authorization header
     */
    private function getBearerToken(): ?string
    {
        // Try several common places where the Authorization header may be available
        $authHeader = null;

        // 1. Standard PHP server variable
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }

        // 2. Apache may put it in REDIRECT_HTTP_AUTHORIZATION
        if (empty($authHeader) && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        // 3. Try to getallheaders() (works for most SAPIs)
        if (empty($authHeader) && function_exists('getallheaders')) {
            $headers = getallheaders();
            // Header keys may have different casing
            foreach (['Authorization', 'authorization'] as $key) {
                if (!empty($headers[$key])) {
                    $authHeader = $headers[$key];
                    break;
                }
            }
        }

        if ($authHeader && preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

        /**
         * Save tour to user's saved list
         * POST /users/saved-tours
         * Headers: Authorization: Bearer {token}
         * Body: { tourId }
         */
        public function saveTour()
        {
            try {
                $jwt = JwtService::getInstance();
                $token = $this->getBearerToken();

                if (!$token) {
                    return $this->error('No token provided', 401);
                }

                $decoded = $jwt->verifyToken($token);
                if (!$decoded) {
                    return $this->error('Invalid or expired token', 401);
                }

                $userId = $decoded->id ?? $decoded->userId;
                $body = json_decode(file_get_contents('php://input'), true);
                $tourId = $body['tourId'] ?? null;

                if (!$tourId) {
                    return $this->error('tourId is required', 400);
                }

                // Insert into SavedTour table
                $db = \App\Core\Database::getInstance()->getConnection();
                $query = "INSERT IGNORE INTO SavedTour (userId, tourId, savedAt) VALUES (:userId, :tourId, NOW())";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
                $result = $stmt->execute();

                if ($result) {
                    return $this->success(['tourId' => $tourId], 'Tour saved successfully');
                }
                return $this->error('Failed to save tour', 500);
            } catch (\Exception $e) {
                return $this->error('Failed to save tour', 500, $e->getMessage());
            }
        }

        /**
         * Remove tour from user's saved list
         * DELETE /users/saved-tours/{tourId}
         * Headers: Authorization: Bearer {token}
         */
        public function unsaveTour($tourId)
        {
            try {
                $jwt = JwtService::getInstance();
                $token = $this->getBearerToken();

                if (!$token) {
                    return $this->error('No token provided', 401);
                }

                $decoded = $jwt->verifyToken($token);
                if (!$decoded) {
                    return $this->error('Invalid or expired token', 401);
                }

                $userId = $decoded->id ?? $decoded->userId;

                // Delete from SavedTour table
                $db = \App\Core\Database::getInstance()->getConnection();
                $query = "DELETE FROM SavedTour WHERE userId = :userId AND tourId = :tourId";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
                $result = $stmt->execute();

                if ($result) {
                    return $this->success(['tourId' => $tourId], 'Tour removed from saved list');
                }
                return $this->error('Failed to remove tour', 500);
            } catch (\Exception $e) {
                return $this->error('Failed to remove tour', 500, $e->getMessage());
            }
        }

        /**
         * Get all saved tours for user
         * GET /users/saved-tours
         * Headers: Authorization: Bearer {token}
         */
        public function getSavedTours()
        {
            try {
                $jwt = JwtService::getInstance();
                $token = $this->getBearerToken();

                if (!$token) {
                    return $this->error('No token provided', 401);
                }

                $decoded = $jwt->verifyToken($token);
                if (!$decoded) {
                    return $this->error('Invalid or expired token', 401);
                }

                $userId = $decoded->id ?? $decoded->userId;

                $db = \App\Core\Database::getInstance()->getConnection();
                $query = "
                    SELECT 
                        t.id, 
                        t.name,
                        t.shortDescription,
                        t.thumbnailUrl,
                        MAX(ti.price) AS originalPrice
                    FROM SavedTour st
                    INNER JOIN Tour t ON st.tourId = t.id
                    LEFT JOIN (
                        SELECT 
                            ti1.tourId, 
                            ti1.price
                        FROM TourItinerary ti1
                        INNER JOIN (
                            SELECT tourId, MIN(departureDate) as minDate
                            FROM TourItinerary
                            GROUP BY tourId
                        ) ti2 ON ti1.tourId = ti2.tourId AND ti1.departureDate = ti2.minDate
                    ) ti ON t.id = ti.tourId
                    WHERE st.userId = :userId
                    GROUP BY t.id, t.name, t.shortDescription, t.thumbnailUrl
                    ORDER BY st.savedAt DESC
                ";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $stmt->execute();
                $savedTours = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Process tours to add price field
                foreach ($savedTours as &$tour) {
                    $tour['price'] = $tour['originalPrice'] !== null && $tour['originalPrice'] > 0 ? (float)$tour['originalPrice'] : null;
                    $tour['oldPrice'] = null;
                }

                return $this->success($savedTours, 'Saved tours retrieved successfully');
            } catch (\Exception $e) {
                return $this->error('Failed to get saved tours', 500, $e->getMessage());
            }
        }
}

