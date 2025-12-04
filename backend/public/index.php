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
$router->get('/tours/top', [TourController::class, 'getTopToursByCategory']);
$router->get('/tours/categories', [TourController::class, 'getAllTourCategory']);

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
 * Admin User Management routes (Yêu cầu quyền 'admin')
 */
$router->get('/admin/users', [AdminUserController::class, 'index']);
$router->put('/admin/users/{id}', [AdminUserController::class, 'updateUserInfo']);
$router->put('/admin/users/{id}/status', [AdminUserController::class, 'toggleStatus']);
$router->put('/admin/users/{id}/reset-password', [AdminUserController::class, 'resetPassword']);
// ======= END ROUTES =======

$router->dispatch();
