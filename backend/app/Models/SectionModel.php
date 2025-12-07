<?php
namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

class SectionModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): ?int
    {
        try {
            $this->db->beginTransaction();

            $orderStmt = $this->db->prepare("
                SELECT IFNULL(MAX(`order`), 0) AS max_order
                FROM Section
                WHERE page_id = :page_id
            ");
            $orderStmt->execute([':page_id' => $data['page_id']]);
            $maxOrder = (int)$orderStmt->fetchColumn();
            $nextOrder = $maxOrder + 1;

            $stmt = $this->db->prepare("
                INSERT INTO Section 
                    (page_id, type, title, subtitle, description, background_color, image_url, `order`, category_id)
                VALUES 
                    (:page_id, :type, :title, :subtitle, :description, :background_color, :image_url, :order, :category_id)
            ");

            $stmt->execute([
                ':page_id'          => $data['page_id'],
                ':type'             => $data['type'] ?? null,
                ':title'            => $data['title'] ?? null,
                ':subtitle'         => $data['subtitle'] ?? null,
                ':description'      => $data['description'] ?? null,
                ':background_color' => $data['background_color'] ?? null,
                ':image_url'        => $data['image_url'] ?? null,
                ':order'            => $nextOrder,
                ':category_id'      => $data['category_id'] ?? null,
            ]);

            $sectionId = (int)$this->db->lastInsertId();

            if (!empty($data['items']) && is_array($data['items'])) {
                $itemStmt = $this->db->prepare("
                    INSERT INTO Item 
                        (section_id, icon, title, subtitle, imageUrl, `desc`, buttonText, buttonPageId, color)
                    VALUES 
                        (:section_id, :icon, :title, :subtitle, :imageUrl, :desc, :buttonText, :buttonPageId, :color)
                ");

                foreach ($data['items'] as $item) {
                    $itemStmt->execute([
                        ':section_id'   => $sectionId,
                        ':icon'         => $item['icon'] ?? null,
                        ':title'        => $item['title'] ?? null,
                        ':subtitle'     => $item['subtitle'] ?? null,
                        ':imageUrl'     => $item['imageUrl'] ?? null,
                        ':desc'         => $item['desc'] ?? null,
                        ':buttonText'   => $item['buttonText'] ?? null,
                        ':buttonPageId' => $item['buttonPageId'] ?? null,
                        ':color'        => $item['color'] ?? null,
                    ]);
                }
            }

            $this->db->commit();

            return $sectionId;

        } catch (PDOException $e) {
            $this->db->rollBack();
            error_log("SectionModel::create TRANSACTION FAILED: " . $e->getMessage());
            return null;
        }
    }

    public function update(int $id, array $data): bool
{
    try {
        $this->db->beginTransaction();

        // ==== 1. UPDATE SECTION ====
        $stmt = $this->db->prepare("
            UPDATE Section
            SET 
                page_id = :page_id,
                type = :type,
                title = :title,
                subtitle = :subtitle,
                description = :description,
                background_color = :background_color,
                image_url = :image_url,
                category_id = :category_id
            WHERE id = :id
        ");

        $stmt->execute([
            ':id'               => $id,
            ':page_id'          => $data['page_id'],
            ':type'             => $data['type'] ?? null,
            ':title'            => $data['title'] ?? null,
            ':subtitle'         => $data['subtitle'] ?? null,
            ':description'      => $data['description'] ?? null,
            ':background_color' => $data['background_color'] ?? null,
            ':image_url'        => $data['image_url'] ?? null,
            ':category_id'      => $data['category_id'] ?? null,
        ]);

        // ==== 2. UPDATE ITEMS ====
        if (!empty($data['items']) && is_array($data['items'])) {

            // Lấy list item_id được gửi từ FE
            $incomingIds = array_filter(array_column($data['items'], 'id'));

            // Xoá item nào không nằm trong danh sách gửi lên
            if (!empty($incomingIds)) {
                $deleteStmt = $this->db->prepare("
                    DELETE FROM Item 
                    WHERE section_id = :section_id 
                    AND id NOT IN (" . implode(",", array_map('intval', $incomingIds)) . ")
                ");
                $deleteStmt->execute([':section_id' => $id]);
            } else {
                // Nếu FE không gửi id item nào → xoá hết
                $deleteAll = $this->db->prepare("
                    DELETE FROM Item WHERE section_id = :section_id
                ");
                $deleteAll->execute([':section_id' => $id]);
            }

            // Insert hoặc update từng item
            foreach ($data['items'] as $item) {
                if (!empty($item['id'])) {
                    // --- UPDATE ITEM ---
                    $itemUpdate = $this->db->prepare("
                        UPDATE Item
                        SET 
                            icon = :icon,
                            title = :title,
                            subtitle = :subtitle,
                            imageUrl = :imageUrl,
                            `desc` = :desc,
                            buttonText = :buttonText,
                            buttonPageId = :buttonPageId,
                            color = :color
                        WHERE id = :id AND section_id = :section_id
                    ");

                    $itemUpdate->execute([
                        ':id'           => $item['id'],
                        ':section_id'   => $id,
                        ':icon'         => $item['icon'] ?? null,
                        ':title'        => $item['title'] ?? null,
                        ':subtitle'     => $item['subtitle'] ?? null,
                        ':imageUrl'     => $item['imageUrl'] ?? null,
                        ':desc'         => $item['desc'] ?? null,
                        ':buttonText'   => $item['buttonText'] ?? null,
                        ':buttonPageId' => $item['buttonPageId'] ?? null,
                        ':color'        => $item['color'] ?? null,
                    ]);

                } else {
                    // --- INSERT ITEM MỚI ---
                    $itemInsert = $this->db->prepare("
                        INSERT INTO Item 
                            (section_id, icon, title, subtitle, imageUrl, `desc`, buttonText, buttonPageId, color)
                        VALUES 
                            (:section_id, :icon, :title, :subtitle, :imageUrl, :desc, :buttonText, :buttonPageId, :color)
                    ");

                    $itemInsert->execute([
                        ':section_id'   => $id,
                        ':icon'         => $item['icon'] ?? null,
                        ':title'        => $item['title'] ?? null,
                        ':subtitle'     => $item['subtitle'] ?? null,
                        ':imageUrl'     => $item['imageUrl'] ?? null,
                        ':desc'         => $item['desc'] ?? null,
                        ':buttonText'   => $item['buttonText'] ?? null,
                        ':buttonPageId' => $item['buttonPageId'] ?? null,
                        ':color'        => $item['color'] ?? null,
                    ]);
                }
            }
        }

        $this->db->commit();
        return true;

    } catch (PDOException $e) {
        $this->db->rollBack();
        error_log("SectionModel::update TRANSACTION FAILED: " . $e->getMessage());
        return false;
    }
}


    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM Section ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM Section WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM Section WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Lấy tất cả section theo page_id, kèm theo danh sách item trong từng section.
     */
    public function getSectionByPage(int $pageId): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                -- Section fields
                s.id AS section_id,
                s.page_id,
                s.type AS section_type,
                s.`order` AS section_order,
                s.title AS section_title,
                s.subtitle AS section_subtitle,
                s.description AS section_description,
                s.background_color AS section_background_color,
                s.image_url AS section_image_url,
                s.created_at AS section_created_at,
                s.updated_at AS section_updated_at,
                s.category_id AS section_category_id,

                -- Item fields
                i.id AS item_id,
                i.icon,
                i.title AS item_title,
                i.subtitle AS item_subtitle,
                i.`desc` AS item_desc,
                i.imageUrl AS item_image_url,
                i.buttonText AS item_button_text,
                i.buttonPageId AS item_button_page_id,
                i.color AS item_color
            FROM Section s
            LEFT JOIN Item i ON s.id = i.section_id
            WHERE s.page_id = :page_id
            ORDER BY s.`order`, i.id
        ");

        $stmt->execute([':page_id' => $pageId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $sections = [];

        foreach ($rows as $row) {
            $sectionId = $row['section_id'];

            if (!isset($sections[$sectionId])) {
                $sections[$sectionId] = [
                    'id' => $sectionId,
                    'page_id' => $row['page_id'],
                    'type' => $row['section_type'],
                    'order' => $row['section_order'],
                    'title' => $row['section_title'],
                    'subtitle' => $row['section_subtitle'],
                    'description' => $row['section_description'],
                    'background_color' => $row['section_background_color'],
                    'image_url' => $row['section_image_url'],
                    'created_at' => $row['section_created_at'],
                    'updated_at' => $row['section_updated_at'],
                    'category_id' => $row['section_category_id'],
                    'items' => [],
                ];
            }

            if (!empty($row['item_id'])) {
                $sections[$sectionId]['items'][] = [
                    'id' => $row['item_id'],
                    'icon' => $row['icon'],
                    'title' => $row['item_title'],
                    'subtitle' => $row['item_subtitle'],
                    'desc' => $row['item_desc'],
                    'imageUrl' => $row['item_image_url'],
                    'buttonText' => $row['item_button_text'],
                    'buttonPageId' => $row['item_button_page_id'],
                    'color' => $row['item_color'],
                ];
            }
        }

        return array_values($sections);
    }

    public function updateOrderBatch(array $sections): bool
    {
        $this->db->beginTransaction();

        try {
            foreach ($sections as $section) {
                $stmt = $this->db->prepare("UPDATE Section SET `order` = :temp WHERE id = :id");
                $stmt->execute([
                    ':temp' => $section['order'] + 1000, 
                    ':id'   => $section['id']
                ]);
            }

            foreach ($sections as $section) {
                $stmt = $this->db->prepare("UPDATE Section SET `order` = :order WHERE id = :id");
                $stmt->execute([
                    ':order' => $section['order'],
                    ':id'    => $section['id']
                ]);
            }

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("updateOrderBatch error: " . $e->getMessage());
            return false;
        }
    }

}
