<?php
namespace App\Controllers;

use App\Core\Controller; 
use App\Models\UserModel;
use App\Middleware\Auth; 

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
            $this->error('Mật khẩu không hợp lệ (tối thiểu 6 ký tự).', 400);
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $success = $this->userModel->updatePassword($userId, $hashedPassword);

        if ($success) {
            $this->success(null, 'Đặt lại mật khẩu thành công.');
        } else {
            $this->error('Đặt lại mật khẩu thất bại.', 400);
        }
    }
    // PUT /api/admin/users/{id} 
    public function updateUserInfo($userId) {
        $data = $this->getJsonBody(); 
        
        // Kiểm tra dữ liệu bắt buộc (ví dụ: fullName, email)
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