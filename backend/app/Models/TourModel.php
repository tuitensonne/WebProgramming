<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class TourModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Lấy 4 tour thuộc một category có nhiều booking nhất
     *
     * @param int $categoryId ID của danh mục tour
     * @return array|null Danh sách tour hoặc null nếu lỗi
     */
    public function getTop4ToursByCategory(int $categoryId): ?array
    {
        try {
            $query = "
                SELECT 
                    t.id,
                    t.name,
                    t.shortDescription,
                    t.thumbnailUrl,
                    t.tourType,
                    t.availableSeat,
                    t.durationDays,
                    t.durationNights,
                    c.tourCategoryName AS categoryName,
                    COUNT(b.tourId) AS totalBookings
                FROM Tour t
                INNER JOIN TourCategory c ON t.categoryId = c.id
                LEFT JOIN Booking b ON t.id = b.tourId
                WHERE t.categoryId = :categoryId
                GROUP BY t.id
                ORDER BY totalBookings DESC
                LIMIT 4
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':categoryId', $categoryId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy top 4 tour theo category: " . $e->getMessage());
            return null;
        }
    }
}
