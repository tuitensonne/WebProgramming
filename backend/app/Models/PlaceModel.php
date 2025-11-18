<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class PlaceModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getPlacesPagination(int $offset, int $limit)
    {
        $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM Place");
        $countStmt->execute();
        $totalRecords = (int) $countStmt->fetch(PDO::FETCH_ASSOC)["total"];

        $totalPages = ceil($totalRecords / $limit);

        $stmt = $this->db->prepare("
            SELECT * FROM Place
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $places = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "items" => $places,
            "total_pages" => $totalPages,
            "total_items" => $totalRecords,
        ];
    }

    public function updatePlacesCompanyId(int $companyId, array $placeIds)
    {
        try {
            $this->db->beginTransaction();

            $clearStmt = $this->db->prepare("
            UPDATE Place
            SET companyInfoId = NULL
            WHERE companyInfoId = :cid
        ");
            $clearStmt->execute([":cid" => $companyId]);

            if (!empty($placeIds)) {
                $updateStmt = $this->db->prepare("
                UPDATE Place
                SET companyInfoId = :cid
                WHERE id = :pid
            ");

                foreach ($placeIds as $pid) {
                    $updateStmt->execute([
                        ":cid" => $companyId,
                        ":pid" => $pid,
                    ]);
                }
            }

            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
