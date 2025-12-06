<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\CommentModel;

class PostCommentController extends Controller
{
    private CommentModel $commentModel;

    public function __construct()
    {
        $this->commentModel = new CommentModel();
    }

    /**
     * Get comments for a specific post
     * Query param: postId
     */
    public function getCommentsByPost()
    {
        try {
            $postId = $this->getQueryParam('postId');

            if (!$postId || !is_numeric($postId)) {
                return $this->error('Invalid or missing postId', 400);
            }

            $comments = $this->commentModel->getCommentsByPostId((int)$postId);

            if ($comments === null) {
                return $this->error('Failed to fetch comments', 500);
            }

            return $this->success($comments, 'Fetched comments successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch comments', 500, $e->getMessage());
        }
    }

    /**
     * Create a new comment on a post
     * Body: postId, userId, content, rating (1-5)
     */
    public function createComment()
    {
        try {
            $data = $this->getJsonBody();

            if (!$data || !isset($data['postId'], $data['userId'], $data['content'])) {
                return $this->error('Missing required fields', 400);
            }

            $commentId = $this->commentModel->createForPost([
                'postId' => $data['postId'],
                'userId' => $data['userId'],
                'content' => $data['content'],
                'rating' => $data['rating'] ?? null
            ]);

            if ($commentId === null) {
                return $this->error('Failed to create comment', 500);
            }

            return $this->success(['id' => $commentId], 'Comment created successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to create comment', 500, $e->getMessage());
        }
    }
}
