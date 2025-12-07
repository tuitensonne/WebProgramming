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

    public function getThreeHighestRatedComments() {
        try {
            $comments = $this->commentModel->getCommentWithHighestRating();

            if (!$comments) {
                return $this->error('No comments found', 404);
            }

            return $this->success($comments, 'Fetched comments successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch comments', 500, $e->getMessage());
        }
    }
    /**
     * API Endpoint: GET /comments
     * Lấy tất cả comments đã join với User và sắp xếp theo rating.
     */
    public function getAllComments() {
        try {
            // Gọi hàm mới trong Model
            $comments = $this->commentModel->getAllCommentsWithUsers();

            if (empty($comments)) {
                // Trả về mảng rỗng thay vì 404 nếu không tìm thấy, để frontend dễ xử lý
                return $this->success([], 'No comments found');
            }

            // Trả về dữ liệu đã được format (user info nằm trong key 'user')
            return $this->success($comments, 'Fetched comments successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch comments', 500, $e->getMessage());
        }
    }
}