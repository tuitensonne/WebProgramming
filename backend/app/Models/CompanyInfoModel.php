<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class CompanyInfoModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getCompanyInfo()
    {
        try {
            $query = "
                SELECT f.id, f.company_name, f.slogan, f.logo_url, f.address,
                    f.email, f.hotline, f.facebook_link, f.instagram_link
                FROM CompanyInfo AS f
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $companyInfo = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$companyInfo) {
                return null;
            }

            $placeQuery = "
                SELECT id, city, province, country
                FROM Place
                WHERE companyInfoId = :companyInfoId
            ";
            $placeStmt = $this->db->prepare($placeQuery);
            $placeStmt->bindParam(':companyInfoId', $companyInfo['id'], PDO::PARAM_INT);
            $placeStmt->execute();
            $places = $placeStmt->fetchAll(PDO::FETCH_ASSOC);

            $companyInfo['places'] = $places;

            return $companyInfo;

        } catch (PDOException $e) {
            error_log('Lỗi khi lấy footer: ' . $e->getMessage());
            return null;
        }
    }

    public function updateCompanyInfo(int $id, array $data): bool
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

        $sql = "UPDATE CompanyInfo SET " . implode(', ', $fields) . " WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

}