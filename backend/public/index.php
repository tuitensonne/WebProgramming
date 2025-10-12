<?php 

require_once dirname(__DIR__) . '/app/config/env.php'; 
loadEnv(dirname(__DIR__) . '/.env'); 

require_once dirname(__DIR__) . '/app/Core/Router.php'; 

use App\Core\Router; 

$router = new Router(); 
$router->dispatch();