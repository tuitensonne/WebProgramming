<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\FooterModel;


class FooterController extends Controller
{
    private FooterModel $footerModel;

    public function __construct() {
        $this->footerModel = new FooterModel();
    }
    
    public function getFooter() {
        try {
            $footer = $this->footerModel->getFooter();

            if (!$footer) {
                return $this->error('No footer found', 404);
            }

            return $this->success($footer, 'Fetched footer successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch footer', 500, $e->getMessage());
        }
    }

    public function updateGeneralInfoOfCompany()
    {
        try {
            $data = $_POST ?: json_decode(file_get_contents('php://input'), true);

            if (empty($data)) {
                return $this->error('No data provided', 400);
            }

            $isUpdated = $this->footerModel->updateFooter(1, $data);

            if (!$isUpdated) {
                return $this->error('No field updated or footer not found', 400);
            }

            $updatedFooter = $this->footerModel->getFooter();
            return $this->success($updatedFooter, 'Footer updated successfully');

        } catch (\Exception $e) {
            return $this->error('Server error', 500, $e->getMessage());
        }
    }

}