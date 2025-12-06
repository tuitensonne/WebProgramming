<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\PostModel;

class PostController extends Controller
{
    private PostModel $postModel;

    public function __construct()
    {
        $this->postModel = new PostModel();
    }

    /**
     * Get all posts with optional search, filter, and sort
     * Query params: search, location, sort (latest/oldest/readTime), page, limit
     */
    public function getAllPosts()
    {
        try {
            $search = $this->getQueryParam('search', null);
            $location = $this->getQueryParam('location', null);
            $sort = $this->getQueryParam('sort', 'latest');
            $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 12;
            $offset = ($page - 1) * $limit;

            $posts = $this->postModel->getAllPosts($search, $location, $sort, $limit, $offset);
            $total = $this->postModel->countPosts($search, $location);

            if ($posts === null) {
                return $this->error('Failed to fetch posts', 500);
            }

            return $this->success([
                'posts' => $posts,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ], 'Fetched posts successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch posts', 500, $e->getMessage());
        }
    }

    /**
     * Get a single post by ID
     */
    public function getPostById()
    {
        try {
            $id = $this->getQueryParam('id');

            if (!$id || !is_numeric($id)) {
                return $this->error('Invalid or missing post ID', 400);
            }

            $post = $this->postModel->getPostById((int)$id);

            if (!$post) {
                return $this->error('Post not found', 404);
            }

            return $this->success($post, 'Fetched post successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch post', 500, $e->getMessage());
        }
    }

    /**
     * Get unique locations for filter dropdown
     */
    public function getLocations()
    {
        try {
            $locations = $this->postModel->getUniqueLocations();

            if ($locations === null) {
                return $this->error('Failed to fetch locations', 500);
            }

            return $this->success($locations, 'Fetched locations successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch locations', 500, $e->getMessage());
        }
    }
}
