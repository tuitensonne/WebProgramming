<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\Response;
use App\Models\CommentModel;

class CommentController extends Controller {
    private $commentModel;

    public function __construct() {
        $this->commentModel = new CommentModel();
    }

    // Create a new comment (authenticated)
    public function create() {
        try {
            $userId = $this->getUserIdFromToken();
            if (!$userId) return $this->error('Unauthorized', 401);

            $body = json_decode(file_get_contents('php://input'), true);
            $tourId = $body['tourId'] ?? null;
            $content = $body['content'] ?? '';
            $rating = isset($body['rating']) ? (int)$body['rating'] : null;

            if (!$tourId || !$content) return $this->error('Missing fields', 400);

            $insertId = $this->commentModel->createComment($userId, $tourId, $content, $rating);
            return $this->success(['id' => $insertId], 'Comment created', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    // GET /comments?tourId= - if tourId present, return comments for that tour; otherwise return all comments
    public function list() {
        try {
            $tourId = $_GET['tourId'] ?? null;
            if ($tourId) {
                $comments = $this->commentModel->getCommentsByTour($tourId);
                return $this->success($comments, 'Comments fetched for tour');
            }

            $comments = $this->commentModel->getAllCommentsWithUsers();
            return $this->success($comments ?: [], 'All comments fetched');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    // Optional: GET top 3 highest rated comments
    public function topRated() {
        try {
            $comments = $this->commentModel->getCommentWithHighestRating();
            return $this->success($comments ?: [], 'Top rated comments fetched');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Extract user ID from JWT token in Authorization header
     */
    private function getUserIdFromToken() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7);
        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($_ENV['JWT_SECRET'] ?? 'test-secret', 'HS256'));
            return $decoded->userId ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
}