<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Services\S3Service;
use App\Models\BannerModel;

class BannerController extends Controller
{
    /**
     * Upload ảnh banner --> lưu S3 --> lưu DB --> trả URL
     */
    /**
     * Thiếu middleware để check quyền
     */
    public function create()
    {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return $this->error('Missing or invalid image file', 400);
        }

        try {
            $file = $_FILES['image'];

            $s3Service = S3Service::getInstance();
            $uploadResult = $s3Service->upload($file, 'banners/');

            if (!$uploadResult['success']) {
                return $this->error('Failed to upload to S3', 500, $uploadResult['error'] ?? '');
            }

            $s3Url = $uploadResult['url'];

            $dayStart = $_POST['dayStart'] ?? date('Y-m-d');
            $dayEnd = $_POST['dayEnd'] ?? date('Y-m-d', strtotime('+30 days'));

            $bannerModel = new BannerModel();
            $bannerId = $bannerModel->create([
                'url' => $s3Url,
                'dayStart' => $dayStart,
                'dayEnd' => $dayEnd,
            ]);

            return $this->success([
                'id' => $bannerId,
                'url' => $s3Url,
                'dayStart' => $dayStart,
                'dayEnd' => $dayEnd
            ], 'Banner created successfully');

        } catch (\Exception $e) {
            return $this->error('Server error', 500, $e->getMessage());
        }
    }

    /**
     * Lấy danh sách banner
     */
    public function list()
    {
        try {
            $bannerModel = new BannerModel();
            $banners = $bannerModel->getAll();

            return $this->success($banners, 'Fetched banners successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch banners', 500, $e->getMessage());
        }
    }

    /**
     * Xóa banner (và file trên S3)
     */
    /**
     * Thiếu middleware để check quyền
     */
    public function delete($id)
    {
        if (!$id || !is_numeric($id)) {
            return $this->error('Invalid banner ID', 400);
        }

        try {
            $bannerModel = new BannerModel();
            $banner = $bannerModel->findById($id);

            if (!$banner) {
                return $this->error('Banner not found', 404);
            }

            // Xóa file khỏi S3
            $s3Service = S3Service::getInstance();
            $deleted = $s3Service->deleteByUrl($banner['url']);

            if (!$deleted) {
                return $this->error('Failed to delete file from S3', 500);
            }

            // Xóa record trong DB
            $bannerModel->delete($id);

            return $this->success(null, 'Banner deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete banner', 500, $e->getMessage());
        }
    }
}
