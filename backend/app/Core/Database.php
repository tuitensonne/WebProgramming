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
        error_log("Connecting to DB with host=" . getenv('DB_HOST'));
        $host = getenv('DB_HOST');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');
        $port = getenv('DB_PORT') ?: 3306;
        $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

        if (!$host || !$dbname || !$user) {
            throw new Exception("Database environment variables are missing. Please check your .env file.");
        }
        
        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";
        

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
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
