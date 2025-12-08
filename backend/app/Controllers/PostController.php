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
     * Query params: search, region, sort, page, limit
     */
    public function getAllPosts()
    {
        try {
            $search = $this->getQueryParam('search', null);
            $region = $this->getQueryParam('region', 'all');
            $sort = $this->getQueryParam('sort', 'latest');
            $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 12;
            $offset = ($page - 1) * $limit;

            $posts = $this->postModel->getAllPosts($search, $region, $sort, $limit, $offset);
            $total = $this->postModel->countPosts($search, $region);

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
    public function getPostById($id)
    {
        try {
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
     * Get unique regions for filter dropdown
     */
    public function getRegions()
    {
        try {
            $regions = $this->postModel->getUniqueRegions();

            if ($regions === null) {
                return $this->error('Failed to fetch regions', 500);
            }

            return $this->success($regions, 'Fetched regions successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch regions', 500, $e->getMessage());
        }
    }

    /**
     * Create a new post (POST /admin/posts)
     */
    public function createPost()
    {
        try {
            $data = $this->getJsonBody();

            if (empty($data['title'])) {
                return $this->error('Title is required', 400);
            }

            $postId = $this->postModel->createPost($data);
            if (!$postId) {
                return $this->error('Failed to create post', 500);
            }

            $post = $this->postModel->getPostById($postId);
            return $this->success($post, 'Post created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create post', 500, $e->getMessage());
        }
    }

    /**
     * Update a post (PUT /admin/posts/{id})
     */
    public function updatePost($id)
    {
        try {
            if (!$id || !is_numeric($id)) {
                return $this->error('Invalid post ID', 400);
            }

            $post = $this->postModel->getPostById((int)$id);
            if (!$post) {
                return $this->error('Post not found', 404);
            }

            $data = $this->getJsonBody();
            if (empty($data)) {
                return $this->error('No data provided', 400);
            }

            $result = $this->postModel->updatePost((int)$id, $data);
            if (!$result) {
                return $this->error('Failed to update post', 500);
            }

            $updatedPost = $this->postModel->getPostById((int)$id);
            return $this->success($updatedPost, 'Post updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update post', 500, $e->getMessage());
        }
    }

    /**
     * Delete a post (DELETE /admin/posts/{id})
     */
    public function deletePost($id)
    {
        try {
            if (!$id || !is_numeric($id)) {
                return $this->error('Invalid post ID', 400);
            }

            $post = $this->postModel->getPostById((int)$id);
            if (!$post) {
                return $this->error('Post not found', 404);
            }

            $result = $this->postModel->deletePost((int)$id);
            if (!$result) {
                return $this->error('Failed to delete post', 500);
            }

            return $this->success(null, 'Post deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete post', 500, $e->getMessage());
        }
    }
}