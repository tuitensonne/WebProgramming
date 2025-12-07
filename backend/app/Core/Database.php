<?php
namespace App\Core;

use PDO;
use Exception;

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        $host = getenv('DB_HOST');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');
        $port = getenv('DB_PORT') ?: 3307;
        $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

        // Ghi lại các giá trị đang được sử dụng để debug
        // error_log("DB_DEBUG: Attempting connection with DBNAME=" . $dbname . ", HOST=" . $host . ", PORT=" . $port . ", USER=" . $user);

        if (!$host || !$dbname || !$user) {
            // Thêm thông tin cụ thể vào lỗi này
            throw new Exception("Database environment variables are missing. Check your .env file. DBNAME: " . ($dbname ?: 'NULL'));
        }
        
        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";
        

        $options = [
            PDO::ATTR_ERRMODE              => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES     => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            // Thêm DSN vào thông báo lỗi để kiểm tra chuỗi kết nối
            $errorMessage = "Database connection failed: " . $e->getMessage() . ". DSN Attempted: " . $dsn;
            throw new Exception($errorMessage);
        }
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->pdo;
    }
}