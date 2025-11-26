<?php
namespace App\Middleware;

// class Auth {
//     public static function requireRole($roles = []) {
//         session_start();

//         if (!isset($_SESSION['user'])) {
//             http_response_code(401);
//             echo json_encode(["error" => "Unauthorized"]);
//             exit;
//         }

//         $userRole = $_SESSION['user']['role'];

//         if (!in_array($userRole, $roles)) {
//             http_response_code(403);
//             echo json_encode(["error" => "Forbidden - Access denied"]);
//             exit;
//         }
//     }
// }
class Auth {
    public static function requireRole($roles = []) {
        session_start();

        // ======= START: PHẦN TẠM THỜI BỎ QUA XÁC THỰC CHO MỤC ĐÍCH TEST =======
        // Gán role 'admin' giả lập vào session để Controller có thể chạy
        if (!isset($_SESSION['user']) || !isset($_SESSION['user']['role']) || $_SESSION['user']['role'] !== 'admin') {
             $_SESSION['user'] = [
                'id' => 999,
                'role' => 'admin', 
                'email' => 'temp_admin@test.com'
            ];
        }
        // ======= END: PHẦN TẠM THỜI BỎ QUA XÁC THỰC CHO MỤC ĐÍCH TEST =======
        
        $userRole = $_SESSION['user']['role'];

        if (!in_array($userRole, $roles)) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden - Access denied"]);
            exit;
        }
    }
}