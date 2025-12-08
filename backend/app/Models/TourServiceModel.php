<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class TourServiceModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Get all services for a tour (included and excluded)
     */
    public function getServicesByTourId(int $tourId): ?array
    {
        try {
            $query = "
                SELECT id, item, type, isImportant
                FROM TourService
                WHERE tourId = :tourId
                ORDER BY type ASC, isImportant DESC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching tour services: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get included services for a tour
     */
    public function getIncludedServices(int $tourId): ?array
    {
        try {
            $query = "
                SELECT id, item, isImportant
                FROM TourService
                WHERE tourId = :tourId AND type = 'included'
                ORDER BY isImportant DESC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching included services: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get excluded services for a tour
     */
    public function getExcludedServices(int $tourId): ?array
    {
        try {
            $query = "
                SELECT id, item, isImportant
                FROM TourService
                WHERE tourId = :tourId AND type = 'excluded'
                ORDER BY isImportant DESC
            ";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tourId', $tourId, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching excluded services: " . $e->getMessage());
            return null;
        }
    }
}
