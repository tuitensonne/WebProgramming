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
 * User routes
 */
// $router->get('/users', [UserController::class, 'list']);
// $router->get('/users/{id}', [UserController::class, 'getById']);
// $router->put('/users/{id}', [UserController::class, 'update']);
// $router->delete('/users/{id}', [UserController::class, 'delete']);

// ======= END ROUTES =======

$router->dispatch();
