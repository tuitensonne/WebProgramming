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
     * Map category ID to icon
     */
    private function getIconByCategory(?int $categoryId): string
    {
        $iconMap = [
            7 => '🏖️',   // Biển Đảo
            8 => '⛰️',   // Núi Rừng & Trekking
            9 => '🏛️',   // Di Sản & Văn Hóa
            10 => '🌆',  // Thành Phố & Giải Trí
        ];
        return $iconMap[$categoryId] ?? '🎫';
    }

    /**
     * Extract duration from shortDescription (format: "7N6Đ: Description")
     */
    private function extractDurationFromShortDescription(?string $shortDescription): string
    {
        if (!$shortDescription) {
            return '3 Ngày 2 Đêm';
        }
        
        // Match pattern like "7N6Đ" or "7N6d" at the start
        if (preg_match('/^(\d+N\d+)[Đđ]?/', $shortDescription, $matches)) {
            // Return the matched number format with "Đ" appended
            return $matches[1] . 'Đ';
        }
        
        return '3 Ngày 2 Đêm';
    }

    /**
     * Get first destination address for a tour from TourDestination table
     */
    private function getAddressForTour(int $tourId): ?string
    {
        try {
            $query = "
                SELECT p.city, p.province, p.country
                FROM TourDestination td
                LEFT JOIN Place p ON td.placeId = p.id
                WHERE td.tourId = :tourId
                ORDER BY td.order ASC
                LIMIT 1
            ";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                // Return "City, Province - Country" or just "Country" if city is null
                if (!empty($row['city'])) {
                    $result = $row['city'];
                    if (!empty($row['province']) && $row['province'] !== $row['city']) {
                        $result .= ', ' . $row['province'];
                    }
                    if (!empty($row['country'])) {
                        $result .= ' - ' . $row['country'];
                    }
                    return $result;
                } elseif (!empty($row['country'])) {
                    // If no city, return country
                    return $row['country'];
                }
            }
            
            return null;
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy địa chỉ tour: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Lấy 1 representative tour cho mỗi loại tour category (7, 8, 9, 10)
     */
    public function getRepresentativeTours(): ?array
    {
        try {
            $query = "
                SELECT 
                    t.id,
                    t.name,
                    t.shortDescription,
                    t.thumbnailUrl,
                    t.tourType,
                    t.categoryId,
                    c.tourCategoryName AS categoryName,
                    t.durationDays,
                    t.durationNights,
                    t.availableSeat,
                    ti.price AS originalPrice,
                    CASE 
                        WHEN t.availableSeat IS NOT NULL 
                        THEN CONCAT(t.availableSeat, ' Người')
                        ELSE NULL
                    END AS guests,
                    CASE 
                        WHEN t.durationDays IS NOT NULL AND t.durationNights IS NOT NULL 
                        THEN CONCAT(t.durationDays, ' Ngày ', t.durationNights, ' Đêm')
                        ELSE '3 Ngày 2 Đêm'
                    END AS duration,
                    CASE 
                        WHEN ti.departureDate IS NOT NULL 
                        THEN DATE_FORMAT(ti.departureDate, '%d/%m/%Y')
                        ELSE NULL
                    END AS departureDate
                FROM Tour t
                INNER JOIN TourCategory c ON t.categoryId = c.id
                LEFT JOIN (
                    SELECT 
                        ti1.tourId, 
                        ti1.price,
                        ti1.departureDate
                    FROM TourItinerary ti1
                    INNER JOIN (
                        SELECT tourId, MIN(departureDate) as minDate
                        FROM TourItinerary
                        GROUP BY tourId
                    ) ti2 ON ti1.tourId = ti2.tourId AND ti1.departureDate = ti2.minDate
                ) ti ON t.id = ti.tourId
                WHERE t.categoryId IN (7, 8, 9, 10) AND t.tourType = 'international'
                GROUP BY t.categoryId
                ORDER BY t.categoryId DESC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add fallback values for frontend compatibility
            foreach ($rows as &$row) {
                // Compute display price
                $row['price'] = $row['originalPrice'] ?? null;
                $row['oldPrice'] = null;

                $row['location'] = $row['name'] ?? 'Tour du lịch';
                $row['icon'] = $this->getIconByCategory($row['categoryId']);
                // Price, oldPrice, guests, duration come from DB now
                $row['rating'] = $row['rating'] ?? 0;
                $row['reviews'] = $row['reviews'] ?? 0;
                $row['departure'] = $row['departureDate'] ?? 'Hàng Ngày';
                $row['address'] = $this->getAddressForTour($row['id']) ?? 'Chưa xác định';
                $row['image'] = $row['image'] ?? ($row['thumbnailUrl'] ?? '');
                $row['liked'] = false;
            }
            
            return $rows;
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy representative tours: " . $e->getMessage());
            return null;
        }
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
                    t.categoryId,
                    c.tourCategoryName AS categoryName,
                    COUNT(b.tourId) AS totalBookings,
                    t.durationDays,
                    t.durationNights,
                    t.availableSeat,
                    ti.price AS originalPrice,
                    CASE 
                        WHEN t.availableSeat IS NOT NULL 
                        THEN CONCAT(t.availableSeat, ' Người')
                        ELSE NULL
                    END AS guests,
                    CASE 
                        WHEN t.durationDays IS NOT NULL AND t.durationNights IS NOT NULL 
                        THEN CONCAT(t.durationDays, ' Ngày ', t.durationNights, ' Đêm')
                        ELSE '3 Ngày 2 Đêm'
                    END AS duration,
                    CASE 
                        WHEN ti.departureDate IS NOT NULL 
                        THEN DATE_FORMAT(ti.departureDate, '%d/%m/%Y')
                        ELSE NULL
                    END AS departureDate
                FROM Tour t
                INNER JOIN TourCategory c ON t.categoryId = c.id
                LEFT JOIN Booking b ON t.id = b.tourId
                LEFT JOIN (
                    SELECT 
                        ti1.tourId, ti1.price, ti1.departureDate
                    FROM TourItinerary ti1
                    INNER JOIN (
                        SELECT tourId, MIN(departureDate) as minDate
                        FROM TourItinerary
                        GROUP BY tourId
                    ) ti2 ON ti1.tourId = ti2.tourId AND ti1.departureDate = ti2.minDate
                ) ti ON t.id = ti.tourId
                WHERE t.categoryId = :categoryId
                GROUP BY t.id, t.name, t.shortDescription, t.thumbnailUrl, t.tourType, t.categoryId, c.tourCategoryName, t.durationDays, t.durationNights, t.availableSeat
                ORDER BY totalBookings DESC
                LIMIT 4
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':categoryId', $categoryId, PDO::PARAM_INT);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add fallback values for frontend compatibility
            foreach ($rows as &$row) {
                // Compute display price
                $row['price'] = $row['originalPrice'] !== null && $row['originalPrice'] > 0 ? (float)$row['originalPrice'] : null;
                $row['oldPrice'] = null;

                $row['location'] = $row['name'] ?? 'Tour du lịch';
                $row['icon'] = $this->getIconByCategory($row['categoryId']);
                // Price, oldPrice, guests, duration come from DB now
                $row['rating'] = $row['rating'] ?? 0;
                $row['reviews'] = $row['reviews'] ?? 0;
                $row['departure'] = $row['departureDate'] ?? 'Hàng Ngày';
                // Guests fallback
                if (empty($row['guests'])) {
                    $row['guests'] = '10-15 Người';
                }
                // Duration fallback
                if (empty($row['duration'])) {
                    $row['duration'] = $this->extractDurationFromShortDescription($row['shortDescription']);
                }
                // Address - use try-catch to prevent errors
                try {
                    $row['address'] = $this->getAddressForTour($row['id']) ?? 'Chưa xác định';
                } catch (\Exception $e) {
                    error_log("Error getting address for tour {$row['id']}: " . $e->getMessage());
                    $row['address'] = 'Chưa xác định';
                }
                $row['image'] = $row['image'] ?? ($row['thumbnailUrl'] ?? '');
                $row['liked'] = false;
            }
            
            return $rows;
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy tất cả tour: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Lấy tất cả tour với phân trang
     *
     * @param int|null $categoryId ID của danh mục tour (optional)
     * @param int $limit Số record trên một trang
     * @param int $offset Vị trí bắt đầu
     * @param string|null $tourType Loại tour: 'domestic' hoặc 'international' (optional)
     * @param string|null $sortBy Cách sắp xếp: price-asc, price-desc, rating (optional)
     * @param string|null $location Địa điểm từ tên tour (optional)
     * @param string|null $duration Thời gian (định dạng: 7N6) từ shortDescription (optional)
     * @return array|null Danh sách tour hoặc null nếu lỗi
     */
    public function getAllTours(?int $categoryId = null, int $limit = 20, int $offset = 0, ?string $tourType = null, ?string $sortBy = null, ?string $location = null, ?string $duration = null): ?array
    {
        $query = "";
        try {
            $query = "
                SELECT 
                    t.id,
                    t.name,
                    t.shortDescription,
                    t.thumbnailUrl,
                    t.tourType,
                    t.categoryId,
                    c.tourCategoryName AS categoryName,
                    COUNT(DISTINCT b.userId) AS totalBookings,
                    t.durationDays,
                    t.durationNights,
                    t.availableSeat,
                    MAX(ti.price) AS originalPrice,
                    CASE 
                        WHEN t.availableSeat IS NOT NULL 
                        THEN CONCAT(t.availableSeat, ' Người')
                        ELSE NULL
                    END AS guests,
                    CASE 
                        WHEN t.durationDays IS NOT NULL AND t.durationNights IS NOT NULL 
                        THEN CONCAT(t.durationDays, ' Ngày ', t.durationNights, ' Đêm')
                        ELSE '3 Ngày 2 Đêm'
                    END AS duration,
                    MAX(CASE 
                        WHEN ti.departureDate IS NOT NULL 
                        THEN DATE_FORMAT(ti.departureDate, '%d/%m/%Y')
                        ELSE NULL
                    END) AS departureDate
                FROM Tour t
                INNER JOIN TourCategory c ON t.categoryId = c.id
                LEFT JOIN Booking b ON t.id = b.tourId
                LEFT JOIN (
                    SELECT 
                        ti1.tourId, 
                        ti1.price,
                        ti1.departureDate
                    FROM TourItinerary ti1
                    INNER JOIN (
                        SELECT tourId, MIN(departureDate) as minDate
                        FROM TourItinerary
                        GROUP BY tourId
                    ) ti2 ON ti1.tourId = ti2.tourId AND ti1.departureDate = ti2.minDate
                ) ti ON t.id = ti.tourId
                WHERE 1=1
            ";

            if ($categoryId) {
                $query .= " AND t.categoryId = :categoryId ";
            }

            if ($tourType) {
                $query .= " AND t.tourType = :tourType ";
            }

            // Filter by location: search in TourDestination -> Place
            if ($location) {
                $query .= " AND EXISTS (
                    SELECT 1 
                    FROM TourDestination td2
                    INNER JOIN Place p2 ON td2.placeId = p2.id
                    WHERE td2.tourId = t.id 
                    AND CONCAT(p2.city, ' - ', p2.country) = :location
                ) ";
            }

            // Filter by duration: search in durationDays and durationNights
            $durationDays = null;
            $durationNights = null;
            if ($duration) {
                // Parse duration format like "2 Ngày 1 Đêm" or "2N1"
                if (preg_match('/(\d+)\s*Ngày\s*(\d+)\s*Đêm/i', $duration, $matches)) {
                    $durationDays = (int)$matches[1];
                    $durationNights = (int)$matches[2];
                    $query .= " AND t.durationDays = :durationDays AND t.durationNights = :durationNights ";
                } elseif (preg_match('/(\d+)N(\d+)/i', $duration, $matches)) {
                    $durationDays = (int)$matches[1];
                    $durationNights = (int)$matches[2];
                    $query .= " AND t.durationDays = :durationDays AND t.durationNights = :durationNights ";
                } else {
                    // Handle "Trên 1 tuần" or similar
                    if (stripos($duration, 'tuần') !== false || stripos($duration, 'week') !== false || stripos($duration, 'Trên 1 tuần') !== false) {
                        $query .= " AND (t.durationDays >= 7 OR (t.durationDays IS NULL AND t.durationNights >= 6)) ";
                    }
                }
            }

            $query .= " GROUP BY t.id, t.name, t.shortDescription, t.thumbnailUrl, t.tourType, t.categoryId, c.tourCategoryName, t.durationDays, t.durationNights, t.availableSeat";

            // Apply sorting - support price asc/desc and rating (fallback to bookings)
            switch ($sortBy) {
                case 'price-asc':
                    // Put tours with price first, then sort ascending by price
                    $query .= " ORDER BY (MAX(ti.price) IS NULL), MAX(ti.price) ASC";
                    break;
                case 'price-desc':
                    $query .= " ORDER BY (MAX(ti.price) IS NULL), MAX(ti.price) DESC";
                    break;
                case 'rating':
                    // No rating column, fallback to bookings
                    $query .= " ORDER BY totalBookings DESC";
                    break;
                default:
                    // Default: prioritize tours with pricing (itinerary exists), then by totalBookings DESC
                    $query .= " ORDER BY (MAX(ti.price) IS NULL) ASC, totalBookings DESC, t.id DESC";
                    break;
            }

            $query .= " LIMIT :limit OFFSET :offset";

            $stmt = $this->db->prepare($query);

            if ($categoryId) {
                $stmt->bindParam(':categoryId', $categoryId, PDO::PARAM_INT);
            }

            if ($tourType) {
                $stmt->bindParam(':tourType', $tourType, PDO::PARAM_STR);
            }

            // Bind location (exact match)
            if ($location) {
                $stmt->bindParam(':location', $location, PDO::PARAM_STR);
            }

            // Bind duration parameters
            if ($duration && $durationDays !== null && $durationNights !== null) {
                $stmt->bindParam(':durationDays', $durationDays, PDO::PARAM_INT);
                $stmt->bindParam(':durationNights', $durationNights, PDO::PARAM_INT);
            }

            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add fallback values for frontend compatibility
            foreach ($rows as &$row) {
                // Compute display price
                $row['price'] = $row['originalPrice'] !== null && $row['originalPrice'] > 0 ? (float)$row['originalPrice'] : null;
                $row['oldPrice'] = null;

                $row['location'] = $row['name'] ?? 'Tour du lịch';
                $row['icon'] = $this->getIconByCategory($row['categoryId']);
                // Price, oldPrice, guests, duration come from DB now
                $row['rating'] = $row['rating'] ?? 0;
                $row['reviews'] = $row['reviews'] ?? 0;
                $row['departure'] = $row['departureDate'] ?? 'Hàng Ngày';
                // Guests fallback
                if (empty($row['guests'])) {
                    $row['guests'] = '10-15 Người';
                }
                // Duration fallback
                if (empty($row['duration'])) {
                    $row['duration'] = $this->extractDurationFromShortDescription($row['shortDescription']);
                }
                // Address - use try-catch to prevent errors
                try {
                    $row['address'] = $this->getAddressForTour($row['id']) ?? 'Chưa xác định';
                } catch (\Exception $e) {
                    error_log("Error getting address for tour {$row['id']}: " . $e->getMessage());
                    $row['address'] = 'Chưa xác định';
                }
                $row['image'] = $row['image'] ?? ($row['thumbnailUrl'] ?? '');
                $row['liked'] = false;
            }
            
            return $rows;
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy tour: " . $e->getMessage());
            error_log("Parameters: categoryId=" . ($categoryId ?? 'null') . ", tourType=" . ($tourType ?? 'null') . ", limit=" . $limit . ", offset=" . $offset);
            if (isset($stmt)) {
                $errorInfo = $stmt->errorInfo();
                error_log("SQL Error Info: " . print_r($errorInfo, true));
            }
            return [];
        } catch (\Exception $e) {
            error_log("Lỗi khi lấy tour (general): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Lấy chi tiết một tour theo ID
     *
     * @param int $tourId ID của tour
     * @return array|null Tour hoặc null nếu lỗi
     */
    public function getTourById(int $tourId): ?array
    {
        try {
            $query = "
                SELECT 
                    t.id,
                    t.name,
                    t.shortDescription,
                    t.postId,
                    t.thumbnailUrl,
                    t.tourType,
                    t.categoryId,
                    c.tourCategoryName AS categoryName,
                        COUNT(b.tourId) AS totalBookings,
                        t.durationDays,
                        t.durationNights,
                        t.availableSeat,
                        ti.price AS originalPrice,
                        CASE 
                        WHEN t.availableSeat IS NOT NULL 
                        THEN CONCAT(t.availableSeat, ' Người')
                        ELSE NULL
                    END AS guests,
                    CASE 
                        WHEN t.durationDays IS NOT NULL AND t.durationNights IS NOT NULL 
                        THEN CONCAT(t.durationDays, ' Ngày ', t.durationNights, ' Đêm')
                        ELSE '3 Ngày 2 Đêm'
                    END AS duration,
                    CASE 
                        WHEN ti.departureDate IS NOT NULL 
                        THEN DATE_FORMAT(ti.departureDate, '%d/%m/%Y')
                        ELSE NULL
                    END AS departureDate
                FROM Tour t
                INNER JOIN TourCategory c ON t.categoryId = c.id
                LEFT JOIN Booking b ON t.id = b.tourId
                LEFT JOIN (
                    SELECT 
                        ti1.tourId, ti1.price, ti1.departureDate
                    FROM TourItinerary ti1
                    INNER JOIN (
                        SELECT tourId, MIN(departureDate) as minDate
                        FROM TourItinerary
                        GROUP BY tourId
                    ) ti2 ON ti1.tourId = ti2.tourId AND ti1.departureDate = ti2.minDate
                ) ti ON t.id = ti.tourId
                WHERE t.id = :tourId
                GROUP BY t.id
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                // Compute display price
                $row['price'] = $row['originalPrice'] !== null && $row['originalPrice'] > 0 ? (float)$row['originalPrice'] : null;
                $row['oldPrice'] = null;

                // Add fallback values for frontend compatibility
                $row['location'] = $row['name'] ?? 'Tour du lịch';
                $row['icon'] = $this->getIconByCategory($row['categoryId']);
                // Price, oldPrice, guests, duration come from DB now
                $row['rating'] = $row['rating'] ?? 0;
                $row['reviews'] = $row['reviews'] ?? 0;
                $row['departure'] = $row['departureDate'] ?? 'Hàng Ngày';
                // Guests fallback
                if (empty($row['guests'])) {
                    $row['guests'] = '10-15 Người';
                }
                // Duration fallback
                if (empty($row['duration'])) {
                    $row['duration'] = $this->extractDurationFromShortDescription($row['shortDescription']);
                }
                // Address - use try-catch to prevent errors
                try {
                    $row['address'] = $this->getAddressForTour($row['id']) ?? 'Chưa xác định';
                } catch (\Exception $e) {
                    error_log("Error getting address for tour {$row['id']}: " . $e->getMessage());
                    $row['address'] = 'Chưa xác định';
                }
                $row['image'] = $row['image'] ?? ($row['thumbnailUrl'] ?? '');
                $row['liked'] = false;
            }
            
            return $row;
        } catch (PDOException $e) {
            error_log("Lỗi khi lấy tour theo ID: " . $e->getMessage());
            return null;
        }
    }
}
