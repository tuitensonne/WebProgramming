<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class UserModel
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

    public function update(int $id, array $data): bool
    {
        try {
            $query = "
                UPDATE User
                SET role = :role,
                    fullName = :fullName,
                    avatarUrl = :avatarUrl,
                    email = :email,
                    phone = :phone,
                    isActive = :isActive
                WHERE id = :id
            ";

            $stmt = $this->db->prepare($query);

            $stmt->bindParam(':role',      $data['role']);
            $stmt->bindParam(':fullName',  $data['fullName']);
            $stmt->bindParam(':avatarUrl', $data['avatarUrl']);
            $stmt->bindParam(':email',     $data['email']);
            $stmt->bindParam(':phone',     $data['phone']);
            $stmt->bindParam(':isActive',  $data['isActive'], PDO::PARAM_BOOL);
            $stmt->bindParam(':id',        $id, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log("Lỗi update user: " . $e->getMessage());
            return false;
        }
    }

    public function delete(int $id): bool
    {
        try {
            $query = "DELETE FROM User WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Lỗi delete user: " . $e->getMessage());
            return false;
        }
    }
}
