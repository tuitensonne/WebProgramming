<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class FooterModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getFooter()
    {
        try {
            $query = "
                SELECT f.id, f.company_name, f.slogan, f.logo_url, f.address,
                    f.email, f.hotline, f.facebook_link, f.instagram_link
                FROM Footer AS f
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $footer = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$footer) {
                return null;
            }

            $placeQuery = "
                SELECT id, city, province, country
                FROM Place
                WHERE footerId = :footerId
            ";
            $placeStmt = $this->db->prepare($placeQuery);
            $placeStmt->bindParam(':footerId', $footer['id'], PDO::PARAM_INT);
            $placeStmt->execute();
            $places = $placeStmt->fetchAll(PDO::FETCH_ASSOC);

            $footer['places'] = $places;

            return $footer;

        } catch (PDOException $e) {
            error_log('Lỗi khi lấy footer: ' . $e->getMessage());
            return null;
        }
    }

    public function updateFooter(int $id, array $data): bool
    {
        $allowedFields = [
            'company_name', 'slogan', 'logo_url', 'address', 
            'email', 'hotline', 'facebook_link', 'instagram_link'
        ];

        $fields = [];
        $params = [':id' => $id];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE Footer SET " . implode(', ', $fields) . " WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

}