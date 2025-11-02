<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class CommentModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO Comment (post_id, user_id, content, rating)
                VALUES (:tourId, :user_id, :content, :rating)
            ");

            $stmt->execute([
                ':post_id' => $data['post_id'] ?? null,
                ':user_id' => $data['user_id'] ?? null,
                ':content' => $data['content'] ?? null,
                ':rating' => $data['rating'] ?? null,
                ':description' => $data['description'] ?? null,
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('SectionModel::create error: ' . $e->getMessage());
            return null;
        }
    }

    public function getCommentWithHighestRating(): ?array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * 
                FROM Comment
                ORDER BY rating DESC
                LIMIT 3
            ");

            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('CommentModel::getCommentWithHighestRating error: ' . $e->getMessage());
            return null;
        }
    }
}
