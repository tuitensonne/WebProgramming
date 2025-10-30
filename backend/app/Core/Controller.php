<?php
namespace App\Core;

class Controller
{
    /**
     * Gửi phản hồi JSON thành công.
     */
    protected function success($data = null, string $message = 'Success')
    {
        Response::success($data, $message);
    }

    /**
     * Gửi phản hồi JSON lỗi.
     */
    protected function error(string $message = 'Error', int $status = 400, $details = null)
    {
        Response::error($message, $status, $details);
    }

    /**
     * Lấy dữ liệu JSON từ body (thường dùng cho POST, PUT).
     */
    protected function getJsonBody(): ?array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : null;
    }

    /**
     * Lấy query param từ URL (?page=2&limit=10).
     */
    protected function getQueryParam(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Lấy dữ liệu từ form-data hoặc x-www-form-urlencoded.
     */
    protected function getPostParam(string $key, $default = null)
    {
        return $_POST[$key] ?? $default;
    }

    /**
     * Lấy tất cả query params.
     */
    protected function getAllQuery(): array
    {
        return $_GET;
    }

    /**
     * Lấy tất cả dữ liệu POST (body form).
     */
    protected function getAllPost(): array
    {
        return $_POST;
    }

    /**
     * Gửi phản hồi tuỳ chỉnh.
     */
    protected function respond($data = null, int $status = 200, ?string $message = null, ?string $error = null)
    {
        Response::json($data, $status, $message, $error);
    }
    
    /**
     * Lấy toàn bộ path (VD: /api/banners/123)
     */
    protected function getPath(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        return strtok($uri, '?'); // bỏ query string nếu có
    }

    /**
     * Lấy danh sách segment trong path (VD: ['api', 'banners', '123'])
     */
    protected function getPathSegments(): array
    {
        $path = trim($this->getPath(), '/');
        return $path === '' ? [] : explode('/', $path);
    }

    /**
     * Lấy param theo vị trí trong endpoint.
     * Ví dụ: /api/banners/123 → getPathParam(2) = 123
     */
    protected function getPathParam(int $index, $default = null)
    {
        $segments = $this->getPathSegments();
        return $segments[$index] ?? $default;
    }
}
