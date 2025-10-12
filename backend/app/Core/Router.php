<?php
namespace App\Core;

class Router {
    private $routes = [];
    private string $basePath;

    public function __construct() {
        $this->basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    }

    public function get($path, $callback) {
        $this->routes['GET'][$path] = $callback;
    }

    public function post($path, $callback) {
        $this->routes['POST'][$path] = $callback;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if (!empty($this->basePath) && str_starts_with($uri, $this->basePath)) {
            $uri = substr($uri, strlen($this->basePath));
        }

        if (empty($uri)) $uri = '/';

        error_log("METHOD: $method | URI: $uri | BASE: {$this->basePath}");

        if (isset($this->routes[$method][$uri])) {
            $callback = $this->routes[$method][$uri];

            if (is_array($callback)) {
                [$class, $methodName] = $callback;
                $controller = new $class();
                $controller->$methodName();
            } else {
                call_user_func($callback);
            }
        } else {
            Response::json([
                'error' => 'Route not found',
                'uri' => $uri,
                'method' => $method,
                'available_routes' => array_keys($this->routes[$method] ?? []),
            ], 404);
        }
    }
}
