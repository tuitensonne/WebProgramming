<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class ContactModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM ContactMessages WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function updateStatus($id, $status)
    {
        $sql = "UPDATE ContactMessages SET isRead = :isRead WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':isRead' => $status,
            ':id'     => $id
        ]);
    }

    public function getAllContacts(int $offset, int $limit, ?string $search = null, ?string $status = null) 
    {
        $where = [];
        $params = [];

        if (!empty($search)) {
            $where[] = "(fullName LIKE :s1 OR email LIKE :s2 OR phone LIKE :s3 OR message LIKE :s4 OR title LIKE :s5)";
            $params[':s1'] = "%$search%";
            $params[':s2'] = "%$search%";
            $params[':s3'] = "%$search%";
            $params[':s4'] = "%$search%";
            $params[':s5'] = "%$search%";
        }

        if (!empty($status) && $status !== "all") {
            $where[] = "isRead = :status";
            $params[':status'] = $status;
        }

        $whereSql = count($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countSql = "SELECT COUNT(*) as total FROM ContactMessages $whereSql";
        $countStmt = $this->db->prepare($countSql);

        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }

        $countStmt->execute();
        $totalRecords = (int) $countStmt->fetch(PDO::FETCH_ASSOC)["total"];
        $totalPages = ceil($totalRecords / $limit);

        $sql = "
            SELECT * FROM ContactMessages
            $whereSql
            ORDER BY createdAt DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $this->db->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

        $stmt->execute();

        return [
            "items" => $stmt->fetchAll(PDO::FETCH_ASSOC),
            "total_pages" => $totalPages,
            "total_items" => $totalRecords,
        ];
    }

    public function saveMail($id, $message)
    {
        $sql = "UPDATE ContactMessages 
                SET repliedMsg = :msg, isReplied = 'replied'
                WHERE id = :id";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            ':msg' => $message,
            ':id'  => $id
        ]);
    }

    public function create(array $data): ?int
    {
        try {
            $sql = "
                INSERT INTO ContactMessages 
                    (fullName, title, email, phone, message, userCreatedId, userRepliedId, repliedMsg)
                VALUES 
                    (:fullName, :title, :email, :phone, :message, :userCreatedId, :userRepliedId, :repliedMsg)
            ";

            $stmt = $this->db->prepare($sql);

            $stmt->execute([
                ':fullName'      => $data['fullName'],
                ':title'         => $data['title'],
                ':email'         => $data['email'],
                ':phone'         => $data['phone'] ?? null,
                ':message'       => $data['message'],
                ':userCreatedId' => $data['userCreatedId'] ?? null,
                ':userRepliedId' => $data['userRepliedId'] ?? null,
                ':repliedMsg'    => $data['repliedMsg'] ?? null,
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Create contact error: " . $e->getMessage());
            return null;
        }
    }

}