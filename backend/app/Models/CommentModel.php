<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class CommentModel
{
    private PDO $db;
    private string $table = 'Comment';
    private string $userTable = 'User';


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
    public function getAllCommentsWithUsers(): ?array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    c.id, c.content, c.rating, c.createdAt,
                    u.fullName, u.avatarUrl, u.id as userId
                FROM {$this->table} c
                INNER JOIN {$this->userTable} u ON c.userId = u.id
                ORDER BY c.rating DESC, c.createdAt DESC
            ");

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Chuyển đổi định dạng kết quả sang cấu trúc frontend mong muốn (join User data)
            $formattedResults = [];
            foreach ($results as $row) {
                $formattedResults[] = [
                    'id' => $row['id'],
                    'content' => $row['content'],
                    'rating' => (int)$row['rating'],
                    'createdAt' => $row['createdAt'],
                    'user' => [
                        'id' => $row['userId'],
                        'fullName' => $row['fullName'],
                        'avatarUrl' => $row['avatarUrl'],
                    ]
                ];
            }

            return $formattedResults;
        } catch (PDOException $e) {
            error_log('CommentModel::getAllCommentsWithUsers error: ' . $e->getMessage());
            return null;
        }
    }
}
