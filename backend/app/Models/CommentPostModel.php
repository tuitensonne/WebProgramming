<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class CommentPostModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Lấy tất cả comment của một post theo postId
     */
    public function getCommentsByPostId(int $postId): ?array
    {
        try {
            $sql = "
              SELECT c.id, c.postId, c.userId, c.content, c.likes, c.createdAt,
                     u.fullName AS userName, u.avatarUrl AS userAvatar
              FROM CommentPost c
              LEFT JOIN User u ON c.userId = u.id
              WHERE c.postId = :postId
              ORDER BY c.createdAt DESC
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':postId', $postId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching comments for postId $postId: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Thêm comment mới cho post
     */
    public function addComment(int $postId, int $userId, string $content): bool
    {
        try {
            $sql = "INSERT INTO CommentPost (postId, userId, content) VALUES (:postId, :userId, :content)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':postId', $postId, PDO::PARAM_INT);
            $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':content', $content, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error adding comment to post $postId: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Tăng like cho comment
     */
    public function incrementLike(int $commentId): bool
    {
        try {
            $sql = "UPDATE CommentPost SET likes = likes + 1 WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id', $commentId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error incrementing like for comment $commentId: " . $e->getMessage());
            return false;
        }
    }
}
