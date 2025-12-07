<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class PostModel
{
    private PDO $db;

    public function __construct()
    {
        // LẤY INSTANCE ĐÚNG – KHÔNG GỌI __construct()
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Get all posts with search, region filter, and sorting
     */
    public function getAllPosts($search = null, $region = null, $sort = 'latest', $limit = 12, $offset = 0): ?array
    {
        try {
            $query = "
                SELECT 
                    p.id,
                    p.title,
                    p.description,
                    p.thumbnailUrl,
                    p.location,
                    p.region,
                    p.readTime,
                    p.createdAt,
                    p.type,
                    COALESCE(u.fullName, 'Unknown') AS authorName
                FROM Post p
                LEFT JOIN User u ON p.userId = u.id
                WHERE 1=1
            ";

            $params = [];

            /** SEARCH CHỈ THEO TITLE */
            if (!empty($search)) {
                $query .= " AND p.title LIKE :search";
                $params[':search'] = "%$search%";
            }

            /** FILTER REGION */
            if (!empty($region) && $region !== "all") {
                $query .= " AND p.region = :region";
                $params[':region'] = $region;
            }

            /** SORTING */
            switch ($sort) {
                case 'oldest':
                    $query .= " ORDER BY p.createdAt ASC";
                    break;
                case 'readTime':
                    $query .= " ORDER BY p.readTime ASC";
                    break;
                default:
                    $query .= " ORDER BY p.createdAt DESC";
            }

            $query .= " LIMIT :limit OFFSET :offset";

            $stmt = $this->db->prepare($query);

            // Bind các params động (search, region)
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            // Limit + Offset phải bind kiểu INT
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log("Error fetching posts: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Count posts (search + region)
     */
    public function countPosts($search = null, $region = null): ?int
    {
        try {
            $query = "SELECT COUNT(*) AS total FROM Post p WHERE 1=1";
            $params = [];

            if (!empty($search)) {
                $query .= " AND p.title LIKE :search";
                $params[':search'] = "%$search%";
            }

            if (!empty($region) && $region !== "all") {
                $query .= " AND p.region = :region";
                $params[':region'] = $region;
            }

            $stmt = $this->db->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return (int)($result['total'] ?? 0);

        } catch (PDOException $e) {
            error_log("Error counting posts: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get single post by ID
     */
    public function getPostById(int $id): ?array
    {
        try {
            $query = "
                SELECT 
                    p.id,
                    p.title,
                    p.description,
                    p.content,
                    p.thumbnailUrl,
                    p.location,
                    p.region,
                    p.readTime,
                    p.createdAt,
                    p.createdAt AS updatedAt,
                    p.type,
                    COALESCE(u.fullName, 'Unknown') AS authorName,
                    COALESCE(u.avatarUrl, '') AS authorAvatar
                FROM Post p
                LEFT JOIN User u ON p.userId = u.id
                WHERE p.id = :id
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log("Error fetching post by ID: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get unique regions for filter dropdown
     */
    public function getUniqueRegions(): ?array
    {
        try {
            $query = "
                SELECT DISTINCT p.region 
                FROM Post p
                WHERE p.region IS NOT NULL AND p.region != ''
                ORDER BY p.region ASC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log("Error fetching regions: " . $e->getMessage());
            return null;
        }
    }
}
