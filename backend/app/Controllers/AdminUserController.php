<?php
namespace App\Controllers;

use App\Core\Controller; 
use App\Models\UserModel;
use App\Middleware\Auth; 
use App\Services\phpMailerService; 

class AdminUserController extends Controller {
    private $userModel;

    public function __construct() {
        Auth::requireRole(['admin']);
        $this->userModel = new UserModel();
    }

    // GET /api/admin/users
    public function index() {
        $search = $_GET['search'] ?? '';
        $activeFilter = $_GET['activeFilter'] ?? 'all';
        $sortKey = $_GET['sortKey'] ?? 'id';
        $sortDirection = $_GET['sortDirection'] ?? 'asc';
        $page = (int)($this->getQueryParam('page', 1)); 
        $limit = (int)($this->getQueryParam('limit', 10)); 
        
        $result = $this->userModel->getFilteredUsers([
            'search' => $search,
            'activeFilter' => $activeFilter,
            'sortKey' => $sortKey,
            'sortDirection' => $sortDirection,
            'page' => $page,
            'limit' => $limit
        ]);
        $this->success($result); 
    }

    // PUT /api/admin/users/{id}/status
    public function toggleStatus($userId) {
        $data = $this->getJsonBody(); 
        
        $newStatus = isset($data['isActive']) ? (int)$data['isActive'] : null;

        if ($newStatus === null) {
            $this->error('Thiếu trạng thái isActive.', 400);
        }

        $success = $this->userModel->updateUserStatus($userId, $newStatus);

        if ($success) {
            $action = $newStatus ? "Mở khóa" : "Khóa";
            $this->success(null, "$action người dùng thành công");
        } else {
            $this->error('Cập nhật trạng thái thất bại.', 400);
        }
    }

    // PUT /api/admin/users/{id}/reset-password
    public function resetPassword($userId) {
        $data = $this->getJsonBody();
        $newPassword = $data['newPassword'] ?? null;
        
        if (empty($newPassword) || strlen($newPassword) < 6) {
            return $this->error('Mật khẩu không hợp lệ (tối thiểu 6 ký tự).', 400);
        }

        try {
            $user = $this->userModel->findById((int)$userId);
            if (!$user) {
                return $this->error('Người dùng không tồn tại.', 404);
            }
            
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $success = $this->userModel->updatePassword((int)$userId, $hashedPassword);

            if ($success) {
                
                $email = $user['email'];
                $fullName = $user['fullName'];
                $subject = "THÔNG BÁO: Đặt Lại Mật Khẩu Tài Khoản";
                
                $emailBody = "
                    <html>
                    <body>
                        <p>Xin chào <strong>{$fullName}</strong>,</p>
                        <p>Mật khẩu tài khoản của bạn tại hệ thống đã được Quản trị viên đặt lại thành công.</p>
                        <p>Thông tin đăng nhập mới của bạn là:</p>
                        <ul style='list-style: none; padding: 10px; border: 1px solid #ddd; background: #f9f9f9; width: fit-content;'>
                            <li><strong>Email:</strong> {$email}</li>
                            <li><strong>Mật khẩu mới:</strong> <code>{$newPassword}</code></li>
                        </ul>
                        <p style='color: red;'>Vui lòng đăng nhập và thay đổi mật khẩu ngay lập tức.</p>
                        <p>Trân trọng,<br>Đội ngũ Hỗ trợ khách hàng.</p>
                    </body>
                    </html>
                ";
                
                $mailService = phpMailerService::getInstance();
                $mailSent = $mailService->sendMail($email, $subject, $emailBody);

                if ($mailSent) {
                    return $this->success(null, 'Đặt lại mật khẩu thành công và đã gửi thông báo qua email.');
                } else {
                    return $this->success(null, 'Đặt lại mật khẩu thành công, NHƯNG gửi email thất bại (Vui lòng kiểm tra log mailer).');
                }
            } else {
                return $this->error('Đặt lại mật khẩu thất bại (Database).', 400);
            }
        } catch (\Exception $e) {
             return $this->error('Đặt lại mật khẩu thất bại', 500, $e->getMessage());
        }
    }
    // PUT /api/admin/users/{id} 
    public function updateUserInfo($userId) {
        $data = $this->getJsonBody(); 
        
        if (empty($data['fullName']) || empty($data['email'])) {
             $this->error('Thiếu thông tin bắt buộc.', 400);
        }

        $success = $this->userModel->updateUserInfo((int)$userId, $data);

        if ($success) {
            $this->success(null, "Cập nhật thông tin người dùng thành công.");
        } else {
            $this->error('Cập nhật thông tin thất bại.', 400);
        }
    }
}