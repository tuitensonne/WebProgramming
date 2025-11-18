<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\TourModel;

class TourController extends Controller
{
    private TourModel $tourModel;

    public function __construct() {
        $this->tourModel = new TourModel();
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
}
