<?php
namespace App\Core;

class Response
{
    /**
     * Gửi response JSON chuẩn hóa.
     *
     * @param mixed $data    Dữ liệu trả về (có thể là mảng, object, null)
     * @param int   $status  HTTP status code (mặc định 200)
     * @param string|null $message  Thông điệp mô tả ngắn gọn
     * @param string|null $error    Thông tin lỗi (nếu có)
     * @param int|null $code        Business code (nếu có)
     */
    public static function json($data = null, int $status = 200, ?string $message = null, ?string $error = null, ?int $code = null)
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');

        $response = [
            'success' => $status >= 200 && $status < 300,
            'code'    => $code ?? $status,
            'message' => $message ?? ($status >= 200 && $status < 300 ? 'OK' : 'Error'),
            'data'    => $data,
        ];

        if ($error !== null) {
            $response['error'] = $error;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Gửi response lỗi nhanh chóng.
     *
     * @param string $message Thông điệp lỗi
     * @param int $status HTTP status code (mặc định 400)
     * @param mixed $error Chi tiết lỗi (có thể là string hoặc mảng)
     */
    public static function error(string $message, int $status = 400, $error = null)
    {
        self::json(null, $status, $message, $error, $status);
    }

    /**
     * Gửi response thành công nhanh chóng.
     *
     * @param mixed $data Dữ liệu trả về
     * @param string $message Thông điệp (mặc định "Success")
     */
    public static function success($data = null, string $message = 'Success')
    {
        self::json($data, 200, $message);
    }
}
