<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\TourModel;
use App\Models\CategoryModel;

class TourController extends Controller
{
    private TourModel $tourModel;

    public function __construct() {
        $this->tourModel = new TourModel();
        $this->categoryModel = new CategoryModel();
    }

    /**
     * Lấy 4 tour có nhiều booking nhất trong 1 category
     */
    public function getTopToursByCategory() {
        try {
            $categoryId = $_GET['categoryId'] ?? null;

            if (!$categoryId || !is_numeric($categoryId)) {
                return $this->error('Invalid or missing categoryId', 400);
            }

            $tours = $this->tourModel->getTop4ToursByCategory((int)$categoryId);

            if (!$tours || count($tours) === 0) {
                return $this->error('No tours found for this category', 404);
            }

            return $this->success($tours, 'Fetched top 4 tours successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch tours', 500, $e->getMessage());
        }
    }

    /**
     * Lấy những tour category cho section
     */
    public function getAllTourCategory() {
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
