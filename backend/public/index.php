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

// Normalize REQUEST_URI for setups that include index.php in path (e.g. when mod_rewrite isn't active)
if (isset($_SERVER['REQUEST_URI'])) {
    error_log("BEFORE_REQUEST_URI: " . $_SERVER['REQUEST_URI']);
    if (strpos($_SERVER['REQUEST_URI'], '/index.php/') !== false) {
        $_SERVER['REQUEST_URI'] = str_replace('/index.php', '', $_SERVER['REQUEST_URI']);
    }
    error_log("AFTER_REQUEST_URI: " . $_SERVER['REQUEST_URI']);
}

use App\Core\Router;
use App\Controllers\BannerController;
use App\Controllers\SectionController;
use App\Controllers\FooterController;
use App\Controllers\TourController;
use App\Controllers\ContactController;
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
$router->post('/comments', [CommentController::class, 'create']);

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

// ======= END ROUTES =======

// Backwards-compatible aliases for servers that include index.php in the path
$router->get('/index.php/footers', [FooterController::class, 'getFooter']);
$router->get('/index.php/footers/places', [FooterController::class, 'getAllPlacesPagination']);
$router->get('/index.php/users/profile', [UserController::class, 'getProfile']);
$router->get('/index.php/users/{id}', [UserController::class, 'getById']);
$router->get('/index.php/tours', [TourController::class, 'getAllTours']);
$router->get('/index.php/tours/{id}', [TourController::class, 'getTourById']);

$router->dispatch();
