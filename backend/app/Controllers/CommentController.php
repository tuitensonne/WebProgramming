<?php
namespace App\Controllers;

use App\Core\Controller; 
use App\Models\CommentModel;

class CommentController extends Controller
{
    private CommentModel $commentModel;

    public function __construct() {
        $this->commentModel = new CommentModel();
    }
    /**
     * API Endpoint: GET /comments
     * Lấy tất cả comments đã join với User và sắp xếp theo rating.
     */
    public function getAllComments() {
        try {
            $comments = $this->commentModel->getAllCommentsWithUsers();

            if (empty($comments)) {
                return $this->success([], 'No comments found');
            }
            return $this->success($comments, 'Fetched comments successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch comments', 500, $e->getMessage());
        }
    }
}