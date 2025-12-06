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
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Get all posts with search, location filter, and sorting
     *
     * @param string|null $search Search by title or description
     * @param string|null $location Filter by location
     * @param string $sort Sort by: 'latest', 'oldest', 'readTime'
     * @param int $limit Limit results
     * @param int $offset Pagination offset
     * @return array|null
     */
    public function getAllPosts($search = null, $location = null, $sort = 'latest', $limit = 12, $offset = 0): ?array
    {
        try {
            $query = "
                SELECT 
                    p.id,
                    p.title,
                    p.description,
                    p.thumbnailUrl,
                    p.location,
                    p.readTime,
                    p.createdAt,
                    p.type,
                    u.fullName as authorName
                FROM Post p
                LEFT JOIN User u ON p.userId = u.id
                WHERE 1=1
            ";

            $params = [];

            if ($search) {
                $query .= " AND (p.title LIKE :search OR p.description LIKE :search)";
                $params[':search'] = "%$search%";
            }

            if ($location) {
                $query .= " AND p.location LIKE :location";
                $params[':location'] = "%$location%";
            }

            // Sorting
            if ($sort === 'oldest') {
                $query .= " ORDER BY p.createdAt ASC";
            } elseif ($sort === 'readTime') {
                $query .= " ORDER BY p.readTime ASC";
            } else { // 'latest' (default)
                $query .= " ORDER BY p.createdAt DESC";
            }

            $query .= " LIMIT :limit OFFSET :offset";

            $stmt = $this->db->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
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
     * Get total count of posts with filters applied
     *
     * @param string|null $search
     * @param string|null $location
     * @return int|null
     */
    public function countPosts($search = null, $location = null): ?int
    {
        try {
            $query = "SELECT COUNT(*) as total FROM Post p WHERE 1=1";
            $params = [];

            if ($search) {
                $query .= " AND (p.title LIKE :search OR p.description LIKE :search)";
                $params[':search'] = "%$search%";
            }

            if ($location) {
                $query .= " AND p.location LIKE :location";
                $params[':location'] = "%$location%";
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
     * Get a single post by ID
     *
     * @param int $id
     * @return array|null
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
                    p.readTime,
                    p.createdAt,
                    p.updatedAt,
                    p.type,
                    u.fullName as authorName,
                    u.avatarUrl as authorAvatar
                FROM Post p
                LEFT JOIN User u ON p.userId = u.id
                WHERE p.id = :id
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching post by ID: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get unique locations from all posts
     *
     * @return array|null
     */
    public function getUniqueLocations(): ?array
    {
        try {
            $query = "
                SELECT DISTINCT location 
                FROM Post 
                WHERE location IS NOT NULL AND location != ''
                ORDER BY location ASC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching locations: " . $e->getMessage());
            return null;
        }
    }
}
