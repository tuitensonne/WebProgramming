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


require_once dirname(__DIR__) . '/app/config/env.php';
loadEnv(dirname(__DIR__) . '/.env');
require_once dirname(__DIR__) . '/app/Core/Autoloader.php';
require_once dirname(__DIR__) . '/app/Core/Router.php';

use App\Core\Router;
use App\Controllers\BannerController;

$router = new Router();

// ======= ROUTES =======

/**
 * Banner routes
 */
$router->post('/banners/create', [BannerController::class, 'create']);
$router->get('/banners/list', [BannerController::class, 'list']);
$router->post('/banners/delete', [BannerController::class, 'delete']); 

// ======= END ROUTES =======


$router->dispatch();
