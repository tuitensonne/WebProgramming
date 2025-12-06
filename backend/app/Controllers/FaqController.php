<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\FaqModel;
use App\Middleware\Auth; // Import lớp Auth/Middleware


class FaqController extends Controller
{
    private FaqModel $faqModel;

    public function __construct() 
    {
        // Khởi tạo Model
        $this->faqModel = new FaqModel(); 
    }

    // =======================================================
    // API CÔNG KHAI (Frontend - KHÔNG cần phân quyền)
    // =======================================================

    /**
     * API Endpoint: GET /api/faqs
     * Lấy danh sách FAQ có phân trang, lọc theo danh mục.
     */
    public function getFaqs()
    {
        // Lấy tham số phân trang và lọc (từ query params)
        // Mặc định cho Public: limit cao hơn hoặc lấy tất cả nếu không có tham số limit
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 20); // Tăng limit mặc định cho public view
        $categoryId = (int)($_GET['categoryId'] ?? 0);
        
        $offset = ($page - 1) * $limit;
        
        try {
            $faqs = $this->faqModel->getAllFaqs($limit, $offset, $categoryId);
            $total = $this->faqModel->countAllFaqs($categoryId);

            if ($faqs === null) {
                // Giữ nguyên logic lỗi 500 nếu model thất bại
                return $this->error('Failed to retrieve FAQs from database', 500);
            }

            return $this->success([
                'faqs' => $faqs,
                'total' => $total,
                'page' => $page,
                'limit' => $limit
            ], 'FAQs fetched successfully');

        } catch (\Exception $e) {
            return $this->error('Internal server error', 500, $e->getMessage());
        }
    }
    
    /**
     * API Endpoint: GET /api/faq/categories
     * Lấy danh sách tất cả danh mục FAQ (Dùng cho Public và Admin).
     */
    public function getFaqCategories()
    {
        try {
            $categories = $this->faqModel->getAllCategories();
            return $this->success($categories ?? [], 'Categories fetched successfully');
        } catch (\Exception $e) {
            return $this->error('Internal server error', 500, $e->getMessage());
        }
    }

    // =======================================================
    // API QUẢN TRỊ (Admin CRUD - Yêu cầu phân quyền Admin)
    // =======================================================
    
    /**
     * Khởi tạo và kiểm tra quyền Admin cho các hàm quản trị
     */
    public function __adminConstruct() 
    {
        // *** Đảm bảo Admin role được yêu cầu cho các hành động CRUD ***
        Auth::requireRole(['admin']);
        // Khởi tạo model lần nữa trong hàm Admin Construct nếu cần, 
        // hoặc đặt logic Auth ở đầu các hàm CRUD nếu muốn tái sử dụng __construct chung.
        $this->faqModel = new FaqModel(); 
    }

    // --- QUẢN LÝ FAQ (Câu hỏi) ---

    /**
     * API Endpoint: POST /api/admin/faq (Thêm mới)
     */
    public function createFaq()
    {
        $this-> __adminConstruct(); // Kích hoạt kiểm tra quyền Admin
        
        // SỬA: Dùng $this->getJsonBody() thay vì Input::getJsonBody()
        $data = $this->getJsonBody(); 
        
        if (empty($data['question']) || empty($data['answer'])) {
            return $this->error('Question and Answer are required', 400);
        }

        try {
            $newId = $this->faqModel->createFaq($data);
            
            if ($newId === null) {
                 return $this->error('Failed to create FAQ in database', 500);
            }
            
            return $this->success(['id' => $newId], 'FAQ created successfully', 201);
            
        } catch (\Exception $e) {
            return $this->error('Failed to create FAQ', 500, $e->getMessage());
        }
    }

    /**
     * API Endpoint: PUT /api/admin/faq/{id} (Sửa)
     */
    public function updateFaq($id)
    {
        $this-> __adminConstruct(); // Kích hoạt kiểm tra quyền Admin
        
        // SỬA: Dùng $this->getJsonBody() thay vì Input::getJsonBody()
        $data = $this->getJsonBody(); 
        
        if (empty($data['question']) || empty($data['answer'])) {
            return $this->error('Question and Answer are required', 400);
        }
        
        try {
            $success = $this->faqModel->updateFaq((int)$id, $data);
            
            if (!$success) {
                 return $this->error('Failed to update FAQ or FAQ not found', 404);
            }
            
            return $this->success(null, 'FAQ updated successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to update FAQ', 500, $e->getMessage());
        }
    }

    /**
     * API Endpoint: DELETE /api/admin/faq/{id} (Xóa)
     */
    public function deleteFaq($id)
    {
        $this-> __adminConstruct(); // Kích hoạt kiểm tra quyền Admin
        
        try {
            $success = $this->faqModel->deleteFaq((int)$id);
            
            if (!$success) {
                 return $this->error('Failed to delete FAQ or FAQ not found', 404);
            }
            
            return $this->success(null, 'FAQ deleted successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to delete FAQ', 500, $e->getMessage());
        }
    }
    
    // --- QUẢN LÝ DANH MỤC FAQ (FAQCategory) ---

    /**
     * API Endpoint: POST /api/admin/faq/categories (Thêm danh mục mới)
     */
    public function createFaqCategory()
    {
        $this-> __adminConstruct();
        // SỬA: Dùng $this->getJsonBody() thay vì Input::getJsonBody()
        $data = $this->getJsonBody(); 
        
        if (empty($data['categoryName'])) {
            return $this->error('Category Name is required', 400);
        }

        try {
            $newId = $this->faqModel->createFaqCategory($data); // Hàm này cần được thêm vào FaqModel
            
            if ($newId === null) {
                 return $this->error('Failed to create category', 500);
            }
            
            return $this->success(['id' => $newId], 'Category created successfully', 201);
            
        } catch (\Exception $e) {
            return $this->error('Failed to create category', 500, $e->getMessage());
        }
    }

    /**
     * API Endpoint: PUT /api/admin/faq/categories/{id} (Sửa danh mục)
     */
    public function updateFaqCategory($id)
    {
        $this-> __adminConstruct();
        // SỬA: Dùng $this->getJsonBody() thay vì Input::getJsonBody()
        $data = $this->getJsonBody(); 
        
        if (empty($data['categoryName'])) {
            return $this->error('Category Name is required', 400);
        }
        
        try {
            $success = $this->faqModel->updateFaqCategory((int)$id, $data); // Hàm này cần được thêm vào FaqModel
            
            if (!$success) {
                 return $this->error('Failed to update category or category not found', 404);
            }
            
            return $this->success(null, 'Category updated successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to update category', 500, $e->getMessage());
        }
    }

    /**
     * API Endpoint: DELETE /api/admin/faq/categories/{id} (Xóa danh mục)
     */
    public function deleteFaqCategory($id)
    {
        $this-> __adminConstruct();
        
        try {
            // Cần thêm logic kiểm tra xem có FAQ nào đang sử dụng category này không
            $success = $this->faqModel->deleteFaqCategory((int)$id); // Hàm này cần được thêm vào FaqModel
            
            if (!$success) {
                 return $this->error('Failed to delete category or category not found', 404);
            }
            
            return $this->success(null, 'Category deleted successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to delete category', 500, $e->getMessage());
        }
    }
}