<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\FaqModel;
use App\Middleware\Auth; 


class FaqController extends Controller
{
    private FaqModel $faqModel;

    public function __construct() 
    {
        $this->faqModel = new FaqModel(); 
    }

    /**
     * API Endpoint: GET /api/faqs
     * Lấy danh sách FAQ có phân trang, lọc theo danh mục.
     */
    public function getFaqs()
    {
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 20); 
        $categoryId = (int)($_GET['categoryId'] ?? 0);
        $includeHidden = isset($_GET['includeHidden']) && $_GET['includeHidden'] === 'true'; 

        $offset = ($page - 1) * $limit;
        
        try {
            $faqs = $this->faqModel->getAllFaqs($limit, $offset, $categoryId, $includeHidden);
            $total = $this->faqModel->countAllFaqs($categoryId, $includeHidden); 

            if ($faqs === null) {
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

    public function __adminConstruct() 
    {
        Auth::requireRole(['admin']);
        $this->faqModel = new FaqModel(); 
    }

    /**
     * API Endpoint: POST /api/admin/faq (Thêm mới)
     */
    public function createFaq()
    {
        $this-> __adminConstruct();
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
        $this-> __adminConstruct(); 
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
        $this-> __adminConstruct(); 
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
        $data = $this->getJsonBody(); 
        
        if (empty($data['categoryName'])) {
            return $this->error('Category Name is required', 400);
        }

        try {
            $newId = $this->faqModel->createFaqCategory($data); 
            
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
        $data = $this->getJsonBody(); 
        
        if (empty($data['categoryName'])) {
            return $this->error('Category Name is required', 400);
        }
        
        try {
            $success = $this->faqModel->updateFaqCategory((int)$id, $data); 
            
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
            $success = $this->faqModel->deleteFaqCategory((int)$id); 
            
            if (!$success) {
                 return $this->error('Failed to delete category or category not found', 404);
            }
            
            return $this->success(null, 'Category deleted successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to delete category', 500, $e->getMessage());
        }
    }
}