<?php
namespace App\Models;

use App\Core\Database;
use PDO;

class BannerModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO BannerHomePage (url, dayStart, dayEnd)
            VALUES (:url, :dayStart, :dayEnd)
        ");

        $stmt->execute([
            ':url' => $data['url'],
            ':dayStart' => $data['dayStart'],
            ':dayEnd' => $data['dayEnd']
        ]);

        return $this->db->lastInsertId();
    }

    public function getAll()
    {
        $sql = "
            SELECT * 
            FROM BannerHomePage
            WHERE dayEnd >= CURDATE()
            ORDER BY dayStart DESC
            LIMIT 5
        ";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM BannerHomePage WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM BannerHomePage WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
