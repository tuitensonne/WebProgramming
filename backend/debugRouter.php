<?php
// Test router pattern matching

$uri = "/posts/1/comments";
$path = "/posts/{postId}/comments";

// Simulate Router conversion
$pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $path);
echo "Original path: $path\n";
echo "Converted pattern: $pattern\n";
echo "Testing URI: $uri\n";

$fullPattern = "#^{$pattern}$#";
echo "Full regex pattern: $fullPattern\n";

if (preg_match($fullPattern, $uri, $matches)) {
    echo "✓ MATCH!\n";
    echo "Matches: " . json_encode($matches) . "\n";
} else {
    echo "✗ NO MATCH\n";
}

// Also test the basePath stripping
$_SERVER['REQUEST_URI'] = "/btl_LTWeb/project/backend/public/index.php/posts/1/comments";
$_SERVER['SCRIPT_NAME'] = "/btl_LTWeb/project/backend/public/index.php";

$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
echo "\nbasePath: $basePath\n";
echo "Original REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";

$fullUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
echo "After parse_url: $fullUri\n";

if (!empty($basePath) && str_starts_with($fullUri, $basePath)) {
    $fullUri = substr($fullUri, strlen($basePath));
    echo "After stripping basePath: $fullUri\n";
}
?>
