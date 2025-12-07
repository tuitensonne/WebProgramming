<?php
// Load .env file
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim(trim($value), '"\'');
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

require_once dirname(__DIR__) . '/app/Core/Autoloader.php';
use App\Core\Database;

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $query = "CREATE TABLE IF NOT EXISTS SavedTour (
        userId INT NOT NULL,
        tourId INT NOT NULL,
        savedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (userId, tourId),
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (tourId) REFERENCES Tour(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";
    
    $pdo->exec($query);
    echo "✓ SavedTour table created successfully\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
