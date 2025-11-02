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

    public function delete($path, $callback) {
        $this->routes['DELETE'][$path] = $callback;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if (!empty($this->basePath) && str_starts_with($uri, $this->basePath)) {
            $uri = substr($uri, strlen($this->basePath));
        }

        if (empty($uri)) $uri = '/';

        if (isset($this->routes[$method][$uri])) {
            $callback = $this->routes[$method][$uri];
            $this->invoke($callback);
            return;
        }

        foreach ($this->routes[$method] ?? [] as $path => $callback) {
            $pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $path);
            if (preg_match("#^{$pattern}$#", $uri, $matches)) {
                array_shift($matches); // loại bỏ toàn bộ match đầu tiên (toàn chuỗi)
                $this->invoke($callback, $matches);
                return;
            }
        }

        Response::json([
            'error' => 'Route not found',
            'uri' => $uri,
            'method' => $method,
            'available_routes' => array_keys($this->routes[$method] ?? []),
        ], 404);
    }

    private function invoke($callback, $params = []) {
        if (is_array($callback)) {
            [$class, $methodName] = $callback;
            $controller = new $class();
            $controller->$methodName(...$params);
        } else {
            call_user_func_array($callback, $params);
        }
    }
}
