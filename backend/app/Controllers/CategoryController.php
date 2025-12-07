<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\CategoryModel;

class CategoryController extends Controller
{
    private CategoryModel $categoryModel;

    public function __construct() {
        $this->categoryModel = new CategoryModel();
    }

    /**
     * Lấy tất cả tour categories
     * GET /categories
     */
    public function getAllCategories() {
        try {
            $categories = $this->categoryModel->getAllCategory();

            if (!$categories) {
                return $this->error('No categories found', 404);
            }

            return $this->success($categories, 'Fetched categories successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch categories', 500, $e->getMessage());
        }
    }
}
