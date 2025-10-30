<?php
namespace App\Middleware;

class Auth {
    public static function requireRole($roles = []) {
        session_start();

        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }

        $userRole = $_SESSION['user']['role'];

        if (!in_array($userRole, $roles)) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden - Access denied"]);
            exit;
        }
    }
}
