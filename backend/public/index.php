<?php
// ======= CORS CONFIG =======
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ======= END CORS CONFIG =======

require_once dirname(__DIR__) . '/app/Core/Autoloader.php';
require __DIR__ . '/../vendor/autoload.php';
require_once dirname(__DIR__) . '/app/config/env.php';
loadEnv(dirname(__DIR__) . '/.env');
require_once dirname(__DIR__) . '/app/Core/Router.php';

use App\Core\Router;
use App\Controllers\BannerController;
use App\Controllers\SectionController;
use App\Controllers\FooterController;
use App\Controllers\TourController;
use App\Controllers\ContactController;
use App\Controllers\AdminUserController;
use App\Controllers\CommentController;
use App\Controllers\FaqController;
use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\FilterController;

$router = new Router();

// ======= ROUTES =======

/**
 * Banner routes
 */
$router->post('/banners', [BannerController::class, 'create']);
$router->get('/banners', [BannerController::class, 'list']);
$router->delete('/banners/{id}', [BannerController::class, 'delete']);

/**
 * Footer routes
 */
$router->get('/footers', [FooterController::class, 'getFooter']);
$router->put('/footers/{id}', [FooterController::class, 'updateGeneralInfoOfCompany']);
$router->get('/footers/places', [FooterController::class, 'getAllPlacesPagination']);
$router->put('/footers/{id}/places', [FooterController::class, 'updatePlaces']);
/**
 * Section routes
 */
// $router->get('/sections', [SectionController::class, 'index']);            
// $router->get('/sections/{id}', [SectionController::class, 'show']);      
$router->post('/sections', [SectionController::class, 'create']);           
$router->put('/sections/{id}', [SectionController::class, 'update']);         
$router->delete('/sections/{id}', [SectionController::class, 'delete']);         
$router->get('/pages/{pageId}/sections', [SectionController::class, 'getByPage']); 
$router->put('/sections/reorder', [SectionController::class, 'reorder'] );
/**
 * Comment routes
 */
$router->get('/comments', [CommentController::class, 'getAllComments']);

/**
 * Tour routes
 */
$router->get('/tours/representative', [TourController::class, 'getRepresentativeTours']);
$router->get('/tours/top', [TourController::class, 'getTopToursByCategory']);
$router->get('/tours/categories', [TourController::class, 'getAllTourCategory']);
$router->get('/tours', [TourController::class, 'getAllTours']);
$router->get('/tours/{id}', [TourController::class, 'getTourById']);

/**
 * Filter routes
 */
$router->get('/filters', [FilterController::class, 'getFilterOptions']);

/**
 * Contact routes
 */
$router->get('/contacts', [ContactController::class, 'getAllContacts']);
$router->delete('/contacts/{id}', [ContactController::class, 'delete']);
$router->put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);
$router->post('/contacts/{id}/replyMail', [ContactController::class, 'replyMail']);
$router->post('/contacts', [ContactController::class, 'create']);

/**
 * Auth routes
 */
$router->post('/auth/signup', [AuthController::class, 'signup']);
$router->post('/auth/login', [AuthController::class, 'login']);

/**
 * User routes
 */
$router->get('/users/profile', [UserController::class, 'getProfile']);
$router->get('/users/{id}', [UserController::class, 'getById']);
$router->put('/users/{id}', [UserController::class, 'update']);
$router->put('/users/{id}/profile', [UserController::class, 'updateProfile']);
$router->post('/users/{id}/avatar', [UserController::class, 'uploadAvatar']);
$router->get('/users/{id}/payment', [UserController::class, 'getPaymentInfo']);
$router->put('/users/{id}/payment', [UserController::class, 'updatePaymentInfo']);
$router->put('/users/{id}/password', [UserController::class, 'changePassword']);
$router->put('/users/{id}/change-password', [UserController::class, 'changePasswordFixed']);
$router->delete('/users/{id}', [UserController::class, 'delete']);
$router->get('/users', [UserController::class, 'list']);
$router->post('/users/saved-tours', [UserController::class, 'saveTour']);
$router->delete('/users/saved-tours/{tourId}', [UserController::class, 'unsaveTour']);
$router->get('/users/saved-tours', [UserController::class, 'getSavedTours']);


/**
 * Admin User Management routes (Yêu cầu quyền 'admin')
 */
$router->get('/admin/users', [AdminUserController::class, 'index']);
$router->put('/admin/users/{id}', [AdminUserController::class, 'updateUserInfo']);
$router->put('/admin/users/{id}/status', [AdminUserController::class, 'toggleStatus']);
$router->put('/admin/users/{id}/reset-password', [AdminUserController::class, 'resetPassword']);

/**
 * FAQ Routes (Công khai)
 */
$router->get('/faqs', [FaqController::class, 'getFaqs']);
$router->get('/faqs/categories', [FaqController::class, 'getFaqCategories']);


/**
 * FAQ Admin Routes (Yêu cầu quyền 'admin')
 */
$router->post('/admin/faq', [FaqController::class, 'createFaq']);
$router->put('/admin/faq/{id}', [FaqController::class, 'updateFaq']);
$router->delete('/admin/faq/{id}', [FaqController::class, 'deleteFaq']);

$router->post('/admin/faq/categories', [FaqController::class, 'createFaqCategory']);
$router->put('/admin/faq/categories/{id}', [FaqController::class, 'updateFaqCategory']);
$router->delete('/admin/faq/categories/{id}', [FaqController::class, 'deleteFaqCategory']);
// ======= END ROUTES =======

// Serve static files from Storage directory
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Handle both /Storage/ and paths with /backend/public/Storage/
if (strpos($uri, '/Storage/') !== false) {
    // Extract the Storage path
    $storagePath = substr($uri, strpos($uri, '/Storage/'));
    $filePath = dirname(__DIR__) . $storagePath;
    if (file_exists($filePath) && is_file($filePath)) {
        $mimeType = mime_content_type($filePath);
        if (!$mimeType) {
            $ext = pathinfo($filePath, PATHINFO_EXTENSION);
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'pdf' => 'application/pdf',
            ];
            $mimeType = $mimeTypes[strtolower($ext)] ?? 'application/octet-stream';
        }
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }
}

// Backwards-compatible aliases for servers that include index.php in the path
$router->get('/index.php/footers', [FooterController::class, 'getFooter']);
$router->get('/index.php/footers/places', [FooterController::class, 'getAllPlacesPagination']);
$router->get('/index.php/users/profile', [UserController::class, 'getProfile']);
$router->get('/index.php/users/{id}', [UserController::class, 'getById']);
$router->get('/index.php/tours', [TourController::class, 'getAllTours']);
$router->get('/index.php/tours/{id}', [TourController::class, 'getTourById']);

$router->dispatch();
