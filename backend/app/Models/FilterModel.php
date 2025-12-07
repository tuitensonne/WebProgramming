<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class FilterModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Convert duration format from "7N6" to "7 ngày 6 đêm"
     */
    private function formatDurationLabel(string $duration): string
    {
        // Match pattern like "7N6" and convert to "7 ngày 6 đêm"
        if (preg_match('/^(\d+)N(\d+)$/', $duration, $matches)) {
            $nights = $matches[1];
            $days = $matches[2];
            return "$nights ngày $days đêm";
        }
        return $duration;
    }

    /**
     * Lấy danh sách các địa điểm từ TourDestination -> Place
     * @param string|null $tourType 'domestic' hoặc 'international', null để lấy cả hai
     * @param int|null $categoryId ID của category để filter theo các tour trong page
     */
    public function getLocations(?string $tourType = null, ?int $categoryId = null): ?array
    {
        try {
            // Get locations from Place table via TourDestination
            $whereConditions = [];
            $query = "
                SELECT DISTINCT 
                    CONCAT(p.city, ' - ', p.country) AS location
                FROM Place p
                INNER JOIN TourDestination td ON p.id = td.placeId
                INNER JOIN Tour t ON td.tourId = t.id
            ";

            if ($tourType) {
                $whereConditions[] = "t.tourType = :tourType";
            }
            
            if ($categoryId) {
                $whereConditions[] = "t.categoryId = :categoryId";
            }
            
            if (!empty($whereConditions)) {
                $query .= " WHERE " . implode(" AND ", $whereConditions);
            }
            
            $query .= " ORDER BY p.country, p.city";

            $stmt = $this->db->prepare($query);
            if ($tourType) {
                $stmt->bindParam(':tourType', $tourType, PDO::PARAM_STR);
            }
            if ($categoryId) {
                $stmt->bindParam(':categoryId', $categoryId, PDO::PARAM_INT);
            }
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format with both value and label
            $locations = [];
            foreach ($rows as $row) {
                if ($row['location']) {
                    $locations[] = ['value' => $row['location'], 'label' => $row['location']];
                }
            }
            
            return $locations;
        } catch (PDOException $e) {
            error_log("Error fetching locations: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Lấy danh sách thời gian từ durationDays và durationNights
     * Trả về các giá trị mặc định: 2 ngày 1 đêm, đến trên 1 tuần
     */
    public function getDurations(): ?array
    {
        try {
            // Get distinct durations from Tour table
            $query = "
                SELECT DISTINCT 
                    t.durationDays,
                    t.durationNights,
                    CONCAT(t.durationDays, ' Ngày ', t.durationNights, ' Đêm') AS durationLabel
                FROM Tour t
                WHERE t.durationDays IS NOT NULL AND t.durationNights IS NOT NULL
                ORDER BY t.durationDays ASC, t.durationNights ASC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $durations = [];
            
            // Add default options
            $durations[] = [
                'value' => '2 Ngày 1 Đêm',
                'label' => '2 Ngày 1 Đêm'
            ];
            
            // Add unique durations from database
            $seenDurations = ['2 Ngày 1 Đêm'];
            foreach ($rows as $row) {
                $label = $row['durationLabel'];
                if (!in_array($label, $seenDurations)) {
                    $durations[] = [
                        'value' => $label,
                        'label' => $label
                    ];
                    $seenDurations[] = $label;
                }
            }
            
            // Add "Trên 1 tuần" option at the end
            $durations[] = [
                'value' => 'Trên 1 tuần',
                'label' => 'Trên 1 tuần'
            ];
            
            return $durations;
        } catch (PDOException $e) {
            error_log("Error fetching durations: " . $e->getMessage());
            // Return default options even on error
            return [
                ['value' => '2 Ngày 1 Đêm', 'label' => '2 Ngày 1 Đêm'],
                ['value' => 'Trên 1 tuần', 'label' => 'Trên 1 tuần']
            ];
        }
    }

    /**
     * Lấy danh sách categories (chỉ có data)
     */
    public function getCategories(): ?array
    {
        try {
            $query = "
                SELECT DISTINCT tc.id, tc.tourCategoryName
                FROM TourCategory tc
                INNER JOIN Tour t ON tc.id = t.categoryId
                WHERE tc.id IN (7, 8, 9, 10)
                ORDER BY tc.id DESC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $rows ?? [];
        } catch (PDOException $e) {
            error_log("Error fetching categories: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Lấy tất cả filter options
     * @param string|null $tourType 'domestic' hoặc 'international', null để lấy cả hai
     * @param int|null $categoryId ID của category để filter theo các tour trong page
     */
    public function getAllFilterOptions(?string $tourType = null, ?int $categoryId = null): ?array
    {
        return [
            'locations' => $this->getLocations($tourType, $categoryId),
            'durations' => $this->getDurations(),
            'categories' => $this->getCategories()
        ];
    }
}

