<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class UserModel extends Database 
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByEmail(string $email): ?array
    {
        try {
            $query = "SELECT * FROM User WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            error_log("Lỗi findByEmail: " . $e->getMessage());
            return null;
        }
    }

    public function findById(int $id): ?array
    {
        try {
            $query = "SELECT * FROM User WHERE id = :id LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            error_log("Lỗi findById: " . $e->getMessage());
            return null;
        }
    }

    public function create(array $data): ?int
    {
        try {
            $query = "
                INSERT INTO User (role, fullName, avatarUrl, email, phone, password)
                VALUES (:role, :fullName, :avatarUrl, :email, :phone, :password)
            ";

            $stmt = $this->db->prepare($query);

            $stmt->bindParam(':role',      $data['role']);
            $stmt->bindParam(':fullName',  $data['fullName']);
            $stmt->bindParam(':avatarUrl', $data['avatarUrl']);
            $stmt->bindParam(':email',     $data['email']);
            $stmt->bindParam(':phone',     $data['phone']);
            $stmt->bindParam(':password',  $data['password']);

            if ($stmt->execute()) {
                return (int) $this->db->lastInsertId();
            }

            return null;

        } catch (PDOException $e) {
            error_log("Lỗi create user: " . $e->getMessage());
            return null;
        }
    }

    public function updateUserInfo(int $id, array $data): bool
    {
        try {
            $sql = "
                UPDATE User
                SET fullName = :fullName,
                    avatarUrl = :avatarUrl,
                    email = :email,
                    phone = :phone,
                    updatedAt = NOW()
                WHERE id = :id AND role = 'user'
            ";

            $stmt = $this->db->prepare($sql);

            // Bind tham số
            $stmt->bindParam(':fullName',   $data['fullName']);
            $stmt->bindParam(':avatarUrl',  $data['avatarUrl']);
            $stmt->bindParam(':email',      $data['email']);
            $stmt->bindParam(':phone',      $data['phone']);
            $stmt->bindParam(':id',         $id, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log("Lỗi updateUserInfo: " . $e->getMessage());
            return false;
        }
    }

    public function getFilteredUsers($params) {
        $offset = ($params['page'] - 1) * $params['limit'];
        $sortableColumns = ['id', 'fullName', 'email', 'createdAt', 'updatedAt', 'isActive'];

        $sortKey = in_array($params['sortKey'], $sortableColumns) ? $params['sortKey'] : 'id';
        $sortDirection = (strtoupper($params['sortDirection']) === 'DESC') ? 'DESC' : 'ASC';

        $sql = "SELECT id, fullName, email, phone, isActive, createdAt, updatedAt, avatarUrl 
                FROM User 
                WHERE role = 'user'"; 
        $conditions = [];
        $executeParams = []; // Mảng tham số sử dụng dấu : làm key

        // Lọc trạng thái
        if ($params['activeFilter'] !== 'all') {
            $conditions[] = "isActive = :isActiveStatus";
            $executeParams[':isActiveStatus'] = ($params['activeFilter'] === 'active' ? 1 : 0);
        }

        // Logic Tìm kiếm nâng cao (Đa từ khóa và Case-Insensitive)
        if (!empty($params['search'])) {
            $searchTerms = explode(' ', strtolower(trim($params['search'])));
            $searchConditions = [];
            $searchIndex = 0;

            foreach ($searchTerms as $term) {
                if (empty($term)) continue;

                $paramKey = ':search' . $searchIndex; 
                $searchPattern = '%' . $term . '%';
                $executeParams[$paramKey] = $searchPattern; 

                // Sử dụng tên tham số CÓ DẤU : trong chuỗi SQL
                $searchConditions[] = "(
                    LOWER(fullName) LIKE $paramKey OR 
                    LOWER(email) LIKE $paramKey OR 
                    phone LIKE $paramKey 
                )";
                $searchIndex++;
            }
            
            if (!empty($searchConditions)) {
                 $conditions[] = "(" . implode(" AND ", $searchConditions) . ")";
            }
        }
        
        if (!empty($conditions)) {
            $sql .= " AND " . implode(" AND ", $conditions);
        }

        // 1. TÍNH TỔNG SỐ BẢN GHI
        $countSql = "SELECT COUNT(*) FROM User WHERE role = 'user'" . (empty($conditions) ? "" : " AND " . implode(" AND ", $conditions));
        
        $countStmt = $this->db->prepare($countSql);
       
        $countStmt->execute($executeParams); 
        $totalCount = $countStmt->fetchColumn(); 

        // 2. LẤY DỮ LIỆU CHÍNH
        $sql .= " ORDER BY $sortKey $sortDirection LIMIT :limit OFFSET :offset";
        
        
        $executeParams[':limit'] = (int)$params['limit'];
        $executeParams[':offset'] = (int)$offset;

        $stmt = $this->db->prepare($sql);
        
        
        $stmt->execute($executeParams); 
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'items' => $items,
            'totalCount' => $totalCount,
            'totalPages' => ceil($params['limit'] > 0 ? $totalCount / $params['limit'] : 1),
            'currentPage' => $params['page']
        ];
    }
    

    // Cập nhật trạng thái người dùng
    public function updateUserStatus($userId, $status) {
        try {
             $sql = "UPDATE User SET isActive = :status, updatedAt = NOW() WHERE id = :id AND role = 'user'";
             $stmt = $this->db->prepare($sql);
             $stmt->bindParam(':status', $status, PDO::PARAM_INT);
             $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
             
             return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Lỗi updateUserStatus: " . $e->getMessage());
            return false;
        }
    }

    // Cập nhật mật khẩu người dùng
    public function updatePassword($userId, $hashedPassword) {
        try {
            $sql = "UPDATE User SET password = :password, updatedAt = NOW() WHERE id = :id AND role = 'user'";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Lỗi updatePassword: " . $e->getMessage());
            return false;
        }
    }
}
