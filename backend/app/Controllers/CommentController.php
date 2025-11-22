<?php
namespace App\Controllers;

use App\Core\Controller;

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
}