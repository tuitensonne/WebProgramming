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
     */
    public function getFilterOptions() {
        try {
            $options = $this->filterModel->getAllFilterOptions();

            if (!$options) {
                return $this->error('Failed to fetch filter options', 500);
            }

            return $this->success($options, 'Fetched filter options successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch filter options', 500, $e->getMessage());
        }
    }
}

