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
                WHERE id NOT IN (1, 2)
                ORDER BY id DESC
            ");

            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add icon and image mapping for categories
            $iconMap = [
                'Biển Đảo' => ['icon' => '🏖️', 'image' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop'],
                'Núi Rừng' => ['icon' => '⛰️', 'image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'],
                'Di Sản' => ['icon' => '🏛️', 'image' => 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&h=300&fit=crop'],
                'Thành Phố' => ['icon' => '🌆', 'image' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop'],
            ];
            
            foreach ($rows as &$row) {
                $row['icon'] = '🎫';
                $row['image'] = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop';
                
                // Match icon based on category name
                foreach ($iconMap as $keyword => $data) {
                    if (strpos($row['tourCategoryName'], $keyword) !== false) {
                        $row['icon'] = $data['icon'];
                        $row['image'] = $data['image'];
                        break;
                    }
                }
                
                // Rename for API consistency
                $row['location'] = $row['tourCategoryName'];
                $row['id'] = (int)$row['id'];
            }
            
            return $rows;
        } catch (PDOException $e) {
            error_log('CategoryModel::getAllCategory error: ' . $e->getMessage());
            return null;
        }
    }
}