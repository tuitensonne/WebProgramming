<?php
namespace App\Models;

use App\Core\Database;

class CommentModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function createComment($userId, $tourId, $content, $rating) {
        $sql = "INSERT INTO Comments (userId, tourId, content, rating) VALUES (:userId, :tourId, :content, :rating)";
        <?php
        namespace App\Models;

        use App\Core\Database;

        class CommentModel {
            private $db;

            public function __construct() {
                $this->db = Database::getInstance();
            }

            public function createComment($userId, $tourId, $content, $rating = null) {
                try {
                    $stmt = $this->db->getConnection()->prepare(
                        "INSERT INTO `Comments` (userId, tourId, content, rating) VALUES (:userId, :tourId, :content, :rating)"
                    );

                    $stmt->execute([
                        ':userId' => $userId,
                        ':tourId' => $tourId,
                        ':content' => $content,
                        ':rating' => $rating
                    ]);

                    return (int)$this->db->getConnection()->lastInsertId();
                } catch (\PDOException $e) {
                    throw new \Exception('Error creating comment: ' . $e->getMessage());
                }
            }

            public function getCommentsByTour($tourId) {
                try {
                    $stmt = $this->db->getConnection()->prepare(
                        "SELECT c.id, c.content, c.rating, c.createdAt, u.id as userId, u.fullName, u.avatarUrl
                         FROM `Comments` c
                         LEFT JOIN `User` u ON u.id = c.userId
                         WHERE c.tourId = :tourId
                         ORDER BY c.createdAt DESC"
                    );
                    $stmt->execute([':tourId' => $tourId]);
                    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
                } catch (\PDOException $e) {
                    throw new \Exception('Error fetching comments: ' . $e->getMessage());
                }
            }

            public function getAllCommentsWithUsers() {
                try {
                    $stmt = $this->db->getConnection()->prepare(
                        "SELECT c.id, c.content, c.rating, c.createdAt, u.id as userId, u.fullName, u.avatarUrl
                         FROM `Comments` c
                         LEFT JOIN `User` u ON u.id = c.userId
                         ORDER BY c.rating DESC, c.createdAt DESC"
                    );
                    $stmt->execute();
                    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
                } catch (\PDOException $e) {
                    throw new \Exception('Error fetching comments: ' . $e->getMessage());
                }
            }

            public function getCommentWithHighestRating($limit = 3) {
                try {
                    $stmt = $this->db->getConnection()->prepare(
                        "SELECT c.id, c.content, c.rating, c.createdAt, u.id as userId, u.fullName, u.avatarUrl
                         FROM `Comments` c
                         LEFT JOIN `User` u ON u.id = c.userId
                         ORDER BY c.rating DESC, c.createdAt DESC
                         LIMIT :limit"
                    );
                    $stmt->bindValue(':limit', (int)$limit, \PDO::PARAM_INT);
                    $stmt->execute();
                    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
                } catch (\PDOException $e) {
                    throw new \Exception('Error fetching top comments: ' . $e->getMessage());
                }
            }
        }
        try {
