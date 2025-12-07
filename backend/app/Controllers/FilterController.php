<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\FilterModel;

class FilterController extends Controller
{
    private FilterModel $filterModel;

    public function __construct() {
        $this->filterModel = new FilterModel();
    }

    /**
     * Lấy tất cả filter options
     * GET /filters?tourType={type}&categoryId={id}
     */
    public function getFilterOptions() {
        try {
            $tourType = $_GET['tourType'] ?? null;
            $categoryId = $_GET['categoryId'] ?? null;
            
            if ($categoryId && !is_numeric($categoryId)) {
                $categoryId = null;
            }
            
            $options = $this->filterModel->getAllFilterOptions($tourType, $categoryId ? (int)$categoryId : null);

            if (!$options) {
                return $this->error('Failed to fetch filter options', 500);
            }

            return $this->success($options, 'Fetched filter options successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch filter options', 500, $e->getMessage());
        }
    }
}

