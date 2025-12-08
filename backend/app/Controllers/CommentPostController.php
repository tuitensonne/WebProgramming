<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\CommentPostModel;

class CommentPostController extends Controller
{
    private CommentPostModel $commentPostModel;

    public function __construct()
    {
        $this->commentPostModel = new CommentPostModel();
    }

    /**
     * GET /posts/{postId}/comments
     * Lấy tất cả comment của một post
     */
    public function getCommentsByPost($postId)
    {
        try {
            $comments = $this->commentPostModel->getCommentsByPostId((int)$postId);
            if ($comments === null) {
                return $this->error('Failed to fetch comments', 500);
            }
            return $this->success($comments, 'Fetched comments successfully');
        } catch (\Exception $e) {
            return $this->error('Error fetching comments', 500, $e->getMessage());
        }
    }

    /**
     * POST /posts/{postId}/comments
     * Thêm comment mới cho post
     * Body JSON: { userId, content }
     */
    public function addComment($postId)
    {
        try {
            $data = $this->getJsonBody();
            $userId = $data['userId'] ?? null;
            $content = trim($data['content'] ?? '');

            if (!$userId) {
                return $this->error('Bạn phải đăng nhập để bình luận', 401);
            }

            if (!$content) {
                return $this->error('Nội dung bình luận không được để trống', 400);
            }

            $success = $this->commentPostModel->addComment((int)$postId, $userId, $content);
            if ($success) {
                return $this->success(null, 'Đã thêm bình luận thành công', 201);
            } else {
                return $this->error('Không thể thêm bình luận', 500);
            }
        } catch (\Exception $e) {
            return $this->error('Lỗi khi bình luận', 500, $e->getMessage());
        }
    }

    /**
     * PATCH /comments/{id}/like
     * Tăng like cho comment
     */
    public function likeComment($commentId)
    {
        try {
            $success = $this->commentPostModel->incrementLike((int)$commentId);
            if ($success) {
                return $this->success(null, 'Liked comment');
            } else {
                return $this->error('Failed to like comment', 500);
            }
        } catch (\Exception $e) {
            return $this->error('Error liking comment', 500, $e->getMessage());
        }
    }

    /**
     * DELETE /admin/posts/{postId}/comments/{commentId}
     * Xóa comment của người dùng (admin only)
     */
    public function deleteComment($postId, $commentId)
    {
        try {
            $success = $this->commentPostModel->deleteComment((int)$commentId);
            if ($success) {
                return $this->success(null, 'Comment deleted successfully');
            } else {
                return $this->error('Failed to delete comment', 500);
            }
        } catch (\Exception $e) {
            return $this->error('Error deleting comment', 500, $e->getMessage());
        }
    }
}
