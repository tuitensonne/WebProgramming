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

    /**
     * Get comments for a specific post
     *
     * @param int $postId
     * @return array|null
     */
    public function getCommentsByPostId(int $postId): ?array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    c.id,
                    c.userId,
                    c.content,
                    c.rating,
                    c.createdAt,
                    u.fullName,
                    u.avatarUrl
                FROM Comment c
                LEFT JOIN User u ON c.userId = u.id
                WHERE c.postId = :postId
                ORDER BY c.createdAt DESC
            ");

            $stmt->bindParam(':postId', $postId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('CommentModel::getCommentsByPostId error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a comment for a post
     *
     * @param array $data
     * @return int|null
     */
    public function createForPost(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO Comment (postId, userId, content, rating, createdAt)
                VALUES (:postId, :userId, :content, :rating, NOW())
            ");

            $stmt->execute([
                ':postId' => $data['postId'] ?? null,
                ':userId' => $data['userId'] ?? null,
                ':content' => $data['content'] ?? null,
                ':rating' => $data['rating'] ?? null
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('CommentModel::createForPost error: ' . $e->getMessage());
            return null;
        }
    }
}
