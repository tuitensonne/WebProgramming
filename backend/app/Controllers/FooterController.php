<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\CompanyInfoModel;
use App\Models\PlaceModel;

class FooterController extends Controller
{
    private CompanyInfoModel $companyInfoModel;

    public function __construct()
    {
        $this->companyInfoModel = new CompanyInfoModel();
        $this->placeModel = new PlaceModel();
    }

    public function getFooter()
    {
        try {
            $companyInfo = $this->companyInfoModel->getCompanyInfo();

            if (!$companyInfo) {
                return $this->error("No company info found", 404);
            }

            return $this->success(
                $companyInfo,
                "Fetched company info successfully"
            );
        } catch (\Exception $e) {
            return $this->error(
                "Failed to fetch company info",
                500,
                $e->getMessage()
            );
        }
    }

    public function updateGeneralInfoOfCompany()
    {
        try {
            $data =
                $_POST ?: json_decode(file_get_contents("php://input"), true);

            if (empty($data)) {
                return $this->error("No data provided", 400);
            }

            $isUpdated = $this->companyInfoModel->updateCompanyInfo(1, $data);

            if (!$isUpdated) {
                return $this->error(
                    "No field updated or company info not found",
                    400
                );
            }

            $updatedCompanyInfo = $this->companyInfoModel->getCompanyInfo();
            return $this->success(
                $updatedCompanyInfo,
                "Company info updated successfully"
            );
        } catch (\Exception $e) {
            return $this->error("Server error", 500, $e->getMessage());
        }
    }

    public function getAllPlacesPagination()
    {
        try {
            $offset = isset($_GET["offset"]) ? (int) $_GET["offset"] : 0;
            $limit = isset($_GET["limit"]) ? (int) $_GET["limit"] : 10;

            $places = $this->placeModel->getPlacesPagination($offset, $limit);

            if (!$places) {
                return $this->error("No places found", 404);
            }

            return $this->success($places, "Fetched places successfully");
        } catch (\Exception $e) {
            return $this->error(
                "Failed to fetch places",
                500,
                $e->getMessage()
            );
        }
    }

    public function updatePlaces($id)
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!isset($data["place_ids"])) {
                return $this->error("No place_ids provided", 400);
            }

            $placeIds = $data["place_ids"];

            if (!is_array($placeIds)) {
                return $this->error("place_ids must be an array", 400);
            }

            $updated = $this->placeModel->updatePlacesCompanyId($id, $placeIds);

            if (!$updated) {
                return $this->error(
                    "Failed to update places for this company",
                    500
                );
            }

            return $this->success(
                "Updated footer places successfully"
            );
        } catch (\Exception $e) {
            return $this->error("Server error", 500, $e->getMessage());
        }
    }
}
