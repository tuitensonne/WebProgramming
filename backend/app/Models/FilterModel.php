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
     * Lấy danh sách các địa điểm (từ tour names)
     * @param string|null $tourType 'domestic' hoặc 'international', null để lấy cả hai
     */
    public function getLocations(?string $tourType = null): ?array
    {
        try {
                // Get locations from Place table via TourDestination
                $whereClause = "";
            if ($tourType) {
                    $whereClause = "WHERE t.tourType = :tourType";
            }
            
            $query = "
                SELECT DISTINCT 
                        CONCAT(p.city, ' - ', p.country) AS location
                    FROM Place p
                    INNER JOIN TourDestination td ON p.id = td.placeId
                    INNER JOIN Tour t ON td.tourId = t.id
                $whereClause
                    ORDER BY p.country, p.city
            ";

            $stmt = $this->db->prepare($query);
            if ($tourType) {
                $stmt->bindParam(':tourType', $tourType, PDO::PARAM_STR);
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
     * Lấy danh sách thời gian (từ shortDescription - format NNDNgày)
     */
    public function getDurations(): ?array
    {
        try {
            $query = "
                SELECT DISTINCT 
                    REGEXP_SUBSTR(shortDescription, '[0-9]+N[0-9]+') AS duration
                FROM Tour
                WHERE shortDescription REGEXP '[0-9]+N[0-9]+'
                ORDER BY duration
            ";

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $durations = [];
            foreach ($rows as $row) {
                if ($row['duration']) {
                    $durations[] = [
                        'value' => $row['duration'], 
                        'label' => $this->formatDurationLabel($row['duration'])
                    ];
                }
            }
            
            return $durations;
        } catch (PDOException $e) {
            error_log("Error fetching durations: " . $e->getMessage());
            return null;
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
     */
    public function getAllFilterOptions(): ?array
    {
        return [
            'locations' => $this->getLocations(),
            'durations' => $this->getDurations(),
            'categories' => $this->getCategories()
        ];
    }
}

