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
    public function create()
    {
        // Kiểm tra file upload
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return $this->error('Missing or invalid image file', 400);
        }

        try {
            $file = $_FILES['image'];

            // Gọi S3Service Singleton
            $s3Service = S3Service::getInstance();
            $uploadResult = $s3Service->upload($file, 'banners/');

            if (!$uploadResult['success']) {
                return $this->error('Failed to upload to S3', 500, $uploadResult['error'] ?? '');
            }

            $s3Url = $uploadResult['url'];

            // Lưu thông tin banner vào DB
            $bannerModel = new BannerModel();
            $bannerId = $bannerModel->create([
                'url' => $s3Url,
                'dayStart' => date('Y-m-d'),
                'dayEnd' => date('Y-m-d', strtotime('+30 days')), 
            ]);

            // Trả về kết quả
            return $this->success([
                'id' => $bannerId,
                'url' => $s3Url
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
    public function delete()
    {
        $id = $this->getPathParam(2);

        if (!$id) {
            return $this->error('Missing banner ID', 400);
        }

        try {
            $bannerModel = new BannerModel();
            $banner = $bannerModel->findById($id);

            if (!$banner) {
                return $this->error('Banner not found', 404);
            }

            // Xóa file trên S3
            $s3Service = S3Service::getInstance();
            $s3Service->deleteByUrl($banner['url']);

            // Xóa bản ghi DB
            $bannerModel->delete($id);

            return $this->success(null, 'Banner deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete banner', 500, $e->getMessage());
        }
    }
}
