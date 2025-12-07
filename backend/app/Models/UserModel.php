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
                FROM `User`
                WHERE role = 'user'";

        $conditions = [];
        $executeParams = [];

        // 1. Filter active
        if ($params['activeFilter'] !== 'all') {
            $conditions[] = "isActive = :isActiveStatus";
            $executeParams[':isActiveStatus'] = ($params['activeFilter'] === 'active' ? 1 : 0);
        }

        // 2. Advanced Search Fix
        if (!empty($params['search'])) {
            $searchTerms = explode(' ', strtolower(trim($params['search'])));
            $searchConditions = [];
            $i = 0;

            foreach ($searchTerms as $term) {
                if (empty($term)) continue;

                // Tạo key UNIQUE riêng cho từng field
                $fullNameKey = ":fullName$i";
                $emailKey    = ":email$i";
                $phoneKey    = ":phone$i";

                // Bind từng param
                $executeParams[$fullNameKey] = "%$term%";
                $executeParams[$emailKey]    = "%$term%";
                $executeParams[$phoneKey]    = "%$term%";

                $searchConditions[] = "(
                    LOWER(fullName) LIKE $fullNameKey OR
                    LOWER(email) LIKE $emailKey OR
                    phone LIKE $phoneKey
                )";

                $i++;
            }

            if (!empty($searchConditions)) {
                $conditions[] = "(" . implode(" OR ", $searchConditions) . ")";
            }
        }

        // merge conditions
        if (!empty($conditions)) {
            $sql .= " AND " . implode(" AND ", $conditions);
        }

        // COUNT
        $countSql = "SELECT COUNT(*) FROM `User` WHERE role = 'user'";
        if (!empty($conditions)) {
            $countSql .= " AND " . implode(" AND ", $conditions);
        }

        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($executeParams);
        $totalCount = $countStmt->fetchColumn();

        // MAIN query
        $sql .= " ORDER BY $sortKey $sortDirection LIMIT :limit OFFSET :offset";

        // Add limit + offset AFTER count
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

    /**
     * Get payment info for user
     * Returns decoded JSON payment data or null
     */
    public function getPaymentInfo(int $id): ?array
    {
        try {
            $query = "SELECT paymentInfo FROM User WHERE id = :id LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$result || !$result['paymentInfo']) {
                return null;
            }

            return json_decode($result['paymentInfo'], true);
        } catch (PDOException $e) {
            error_log("Lỗi getPaymentInfo: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update payment info for user (card, bank, etc.)
     * Stores as JSON in paymentInfo column
     */
    public function updatePaymentInfo(int $id, array $paymentData): bool
    {
        try {
            $paymentJson = json_encode($paymentData);
            $query = "UPDATE User SET paymentInfo = :paymentInfo WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':paymentInfo', $paymentJson, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Lỗi updatePaymentInfo: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update user profile (name, email, phone, dateOfBirth, avatar)
     */
    public function updateProfile(int $id, array $data): bool
    {
        try {
            $allowedFields = ['fullName', 'email', 'phone', 'avatarUrl', 'dateOfBirth'];
            $fields = [];
            $params = [':id' => $id];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $data[$field];
                }
            }

            if (empty($fields)) {
                return true; // No fields to update
            }

            $query = "UPDATE User SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($query);

            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Lỗi updateProfile: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Change user password
     */
    public function changePassword(int $id, string $newPassword): bool
    {
        try {
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $query = "UPDATE User SET password = :password WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Lỗi changePassword: " . $e->getMessage());
            return false;
        }
    }
}
