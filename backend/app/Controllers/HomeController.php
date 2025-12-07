<?php
namespace App\Controllers;

use App\Core\Response;

class HomeController
{
    /**
     * Xử lý yêu cầu GET / (Trang chủ)
     * Trả về một thông báo chào mừng hoặc trạng thái API.
     */
    public function index()
    {
        // Sử dụng Response::json (giả định đây là lớp trả lời JSON của bạn)
        Response::json([
            'status' => 'success',
            'message' => 'Welcome to BK-Tours API. The database connection is active.',
            'version' => '1.0'
        ]);
    }
}