<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\TourModel;
use App\Models\TourServiceModel;
use App\Models\CategoryModel;

class TourController extends Controller
{
    private TourModel $tourModel;
    private TourServiceModel $tourServiceModel;
    private CategoryModel $categoryModel;

    public function __construct() {
        $this->tourModel = new TourModel();
        $this->tourServiceModel = new TourServiceModel();
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

    /**
     * Lấy 1 representative tour cho mỗi loại tour category
     * GET /tours/representative
     */
    public function getRepresentativeTours() {
        try {
            $tours = $this->tourModel->getRepresentativeTours();

            if (!$tours) {
                return $this->error('No tours found', 404);
            }

            return $this->success($tours, 'Fetched representative tours successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch representative tours', 500, $e->getMessage());
        }
    }

    /**
     * Lấy tất cả tour hoặc filter theo category/tourType/location/duration
     * GET /tours?categoryId={id}&tourType={type}&sortBy={sortBy}&location={location}&duration={duration}&limit={limit}&offset={offset}
     * Also accepts 'category' as alias for 'categoryId'
     */
    public function getAllTours() {
        try {
            $categoryId = $_GET['categoryId'] ?? $_GET['category'] ?? null;
            $tourType = $_GET['tourType'] ?? null;
            $sortBy = $_GET['sortBy'] ?? null;
            $location = $_GET['location'] ?? null;
            $duration = $_GET['duration'] ?? null;
            $price = $_GET['price'] ?? null;
            $limit = (int)($_GET['limit'] ?? 20);
            $offset = (int)($_GET['offset'] ?? 0);

            $tours = $this->tourModel->getAllTours($categoryId, $limit, $offset, $tourType, $sortBy, $location, $duration, $price);

            // Return empty array instead of error if no tours found
            if ($tours === null) {
                return $this->success([], 'No tours found');
            }

            return $this->success($tours, 'Fetched tours successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch tours', 500, $e->getMessage());
        }
    }

    /**
     * Lấy chi tiết một tour theo ID
     * GET /tours/{id}
     */
    public function getTourById($id) {
        try {
            if (!$id || !is_numeric($id)) {
                return $this->error('Invalid tour ID', 400);
            }

            $tour = $this->tourModel->getTourById((int)$id);

            if (!$tour) {
                return $this->error('Tour not found', 404);
            }

            // Fetch tour services (included/excluded)
            $services = $this->tourServiceModel->getServicesByTourId((int)$id);
            $tour['services'] = $services ?? [];
            
            // Separate included and excluded services for easier frontend usage
            $tour['includedServices'] = array_values(array_filter($services ?? [], fn($s) => $s['type'] === 'included'));
            $tour['excludedServices'] = array_values(array_filter($services ?? [], fn($s) => $s['type'] === 'excluded'));

            return $this->success($tour, 'Fetched tour successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch tour', 500, $e->getMessage());
        }
    }
}
