<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class CategoryModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAllCategory() {
        try {
            $stmt = $this->db->prepare("
                SELECT * 
                FROM TourCategory
            ");

            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('SectionModel::create error: ' . $e->getMessage());
            return null;
        }
    }
}