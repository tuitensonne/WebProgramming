<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class FaqModel
{
    private PDO $db;
    private string $table = 'FAQ';
    private string $categoryTable = 'FAQCategory';

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    // =======================================================
    // QUẢN LÝ CÂU HỎI (FAQ)
    // =======================================================

    /**
     * Lấy danh sách câu hỏi FAQ có phân trang, join với danh mục.
     * @param int $limit Số lượng item trên mỗi trang
     * @param int $offset Vị trí bắt đầu
     * @param int|null $categoryId Lọc theo categoryId
     * @return array|null
     */
    public function getAllFaqs($limit, $offset, $categoryId = null): ?array
    {
        try {
            $sql = "
                SELECT 
                    f.id, f.question, f.answer, f.faqOrder, f.isPublished, f.createdAt, f.updatedAt,
                    c.id AS categoryId, c.categoryName
                FROM {$this->table} f
                LEFT JOIN {$this->categoryTable} c ON f.categoryId = c.id
            ";
            
            $params = [];
            
            if ($categoryId !== null && $categoryId > 0) {
                $sql .= " WHERE f.categoryId = :categoryId";
                $params[':categoryId'] = $categoryId;
            }
            
            $sql .= " ORDER BY f.faqOrder ASC, f.id ASC LIMIT :limit OFFSET :offset";

            $stmt = $this->db->prepare($sql);
            
            // Bind parameters
            foreach ($params as $key => &$value) {
                $stmt->bindParam($key, $value);
            }

            // Bind limit and offset using integer type for security
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            error_log('FaqModel::getAllFaqs error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Đếm tổng số câu hỏi FAQ.
     */
    public function countAllFaqs($categoryId = null): int
    {
        try {
            $sql = "SELECT COUNT(id) FROM {$this->table}";
            $params = [];
            
            if ($categoryId !== null && $categoryId > 0) {
                $sql .= " WHERE categoryId = :categoryId";
                $params[':categoryId'] = $categoryId;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return (int)$stmt->fetchColumn();
        } catch (PDOException $e) {
            error_log('FaqModel::countAllFaqs error: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Thêm câu hỏi FAQ mới.
     */
    public function createFaq(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO {$this->table} (question, answer, categoryId, faqOrder, isPublished, createdAt, updatedAt)
                VALUES (:question, :answer, :categoryId, :faqOrder, :isPublished, NOW(), NOW())
            ");
            $stmt->execute([
                ':question' => $data['question'],
                ':answer' => $data['answer'],
                ':categoryId' => $data['categoryId'] ?? null,
                ':faqOrder' => $data['faqOrder'] ?? 0,
                ':isPublished' => $data['isPublished'] ?? 1,
            ]);
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('FaqModel::createFaq error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Cập nhật câu hỏi FAQ.
     */
    public function updateFaq(int $id, array $data): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE {$this->table} SET 
                    question = :question, 
                    answer = :answer, 
                    categoryId = :categoryId, 
                    faqOrder = :faqOrder, 
                    isPublished = :isPublished,
                    updatedAt = NOW()
                WHERE id = :id
            ");
            return $stmt->execute([
                ':id' => $id,
                ':question' => $data['question'],
                ':answer' => $data['answer'],
                ':categoryId' => $data['categoryId'] ?? null,
                ':faqOrder' => $data['faqOrder'] ?? 0,
                ':isPublished' => $data['isPublished'] ?? 1,
            ]);
        } catch (PDOException $e) {
            error_log('FaqModel::updateFaq error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Xóa câu hỏi FAQ.
     */
    public function deleteFaq(int $id): bool
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            error_log('FaqModel::deleteFaq error: ' . $e->getMessage());
            return false;
        }
    }
    
    // =======================================================
    // QUẢN LÝ DANH MỤC (FAQCategory)
    // =======================================================

    /**
     * Lấy tất cả danh mục FAQ, sắp xếp theo thứ tự.
     */
    public function getAllCategories(): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->categoryTable} ORDER BY categoryOrder ASC");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('FaqModel::getAllCategories error: ' . $e->getMessage());
            return null;
        }
    }
    
    // *** THÊM MỚI: Thêm danh mục FAQ ***
    public function createFaqCategory(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO {$this->categoryTable} (categoryName, categoryOrder, createdAt)
                VALUES (:categoryName, :categoryOrder, NOW())
            ");
            $stmt->execute([
                ':categoryName' => $data['categoryName'],
                ':categoryOrder' => $data['categoryOrder'] ?? 0,
            ]);
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('FaqModel::createFaqCategory error: ' . $e->getMessage());
            return null;
        }
    }

    // *** THÊM MỚI: Cập nhật danh mục FAQ ***
    public function updateFaqCategory(int $id, array $data): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE {$this->categoryTable} SET 
                    categoryName = :categoryName, 
                    categoryOrder = :categoryOrder 
                WHERE id = :id
            ");
            return $stmt->execute([
                ':id' => $id,
                ':categoryName' => $data['categoryName'],
                ':categoryOrder' => $data['categoryOrder'] ?? 0,
            ]);
        } catch (PDOException $e) {
            error_log('FaqModel::updateFaqCategory error: ' . $e->getMessage());
            return false;
        }
    }

    // *** THÊM MỚI: Xóa danh mục FAQ ***
    public function deleteFaqCategory(int $id): bool
    {
        try {
            // Bước 1: Đặt categoryId của các FAQ liên quan về NULL hoặc một category mặc định
            $this->db->prepare("UPDATE {$this->table} SET categoryId = NULL WHERE categoryId = :id")
                     ->execute([':id' => $id]);
                     
            // Bước 2: Xóa danh mục
            $stmt = $this->db->prepare("DELETE FROM {$this->categoryTable} WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            // Lỗi có thể do khóa ngoại (nếu bước 1 thất bại)
            error_log('FaqModel::deleteFaqCategory error: ' . $e->getMessage());
            return false;
        }
    }
}