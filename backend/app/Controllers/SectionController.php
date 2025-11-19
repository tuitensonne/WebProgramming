<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\SectionModel;

class SectionController extends Controller
{
    private SectionModel $sectionModel;

    public function __construct()
    {
        $this->sectionModel = new SectionModel();
    }

    /**
     * Lấy section theo ID
     */
    public function show($id)
    {
        if (!$id || !is_numeric($id)) {
            return $this->error("Invalid section ID", 400);
        }

        try {
            $section = $this->sectionModel->findById((int) $id);

            if (!$section) {
                return $this->error("Section not found", 404);
            }

            return $this->success($section, "Fetched section successfully");
        } catch (\Exception $e) {
            return $this->error(
                "Failed to fetch section",
                500,
                $e->getMessage()
            );
        }
    }

    /**
     * Tạo mới section
     */
    // public function create()
    // {
    //     $data = $_POST ?: json_decode(file_get_contents('php://input'), true);

    //     if (empty($data['page_id']) || empty($data['name'])) {
    //         return $this->error('Missing required fields: page_id, name', 400);
    //     }

    //     try {
    //         $id = $this->sectionModel->create($data);

    //         if (!$id) {
    //             return $this->error('Failed to create section', 500);
    //         }

    //         return $this->success(['id' => $id], 'Section created successfully');
    //     } catch (\Exception $e) {
    //         return $this->error('Server error', 500, $e->getMessage());
    //     }
    // }

    /**
     * Xóa section theo ID
     */
    public function delete($id)
    {
        if (!$id || !is_numeric($id)) {
            return $this->error("Invalid section ID", 400);
        }

        try {
            $deleted = $this->sectionModel->delete((int) $id);

            if (!$deleted) {
                return $this->error(
                    "Section not found or failed to delete",
                    404
                );
            }

            return $this->success(null, "Section deleted successfully");
        } catch (\Exception $e) {
            return $this->error(
                "Failed to delete section",
                500,
                $e->getMessage()
            );
        }
    }

    /**
     * Lấy tất cả section theo page_id kèm danh sách item
     */
    public function getByPage($pageId)
    {
        if (!$pageId || !is_numeric($pageId)) {
            return $this->error("Invalid page ID", 400);
        }

        try {
            $sections = $this->sectionModel->getSectionByPage((int) $pageId);

            if (empty($sections)) {
                return $this->error("No sections found for this page", 404);
            }

            return $this->success(
                $sections,
                "Fetched sections and items successfully"
            );
        } catch (\Exception $e) {
            return $this->error(
                "Failed to fetch sections",
                500,
                $e->getMessage()
            );
        }
    }

    /**
     * Reorder lại các section
     */
    public function reorder()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data["sections"]) || !is_array($data["sections"])) {
            return $this->error('Invalid or missing "sections" data', 400);
        }
        try {
            $result = $this->sectionModel->updateOrderBatch($data["sections"]);
            if (!$result) {
                return $this->error("Failed to reorder sections", 500);
            }
            return $this->success(null, "Sections reordered successfully");
        } catch (\Exception $e) {
            return $this->error(
                "Failed to reorder sections",
                500,
                $e->getMessage()
            );
        }
    }


}
