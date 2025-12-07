<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\UserModel;
use App\Services\JwtService;

class AuthController extends Controller
{
    public function signup()
    {
        try {
            $input = json_decode(file_get_contents("php://input"), true);

            $fullName = trim($input['fullName'] ?? '');
            $email    = trim($input['email'] ?? '');
            $phone    = trim($input['phone'] ?? '');
            $password = trim($input['password'] ?? '');

            if (!$fullName || !$email || !$password) {
                return $this->error('Missing required fields', 400);
            }

            $userModel = new UserModel();

            if ($userModel->findByEmail($email)) {
                return $this->error('Email already exists', 409);
            }

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $userId = $userModel->create([
                'role'      => 'user',
                'fullName'  => $fullName,
                'avatarUrl' => null,
                'email'     => $email,
                'phone'     => $phone,
                'password'  => $hashedPassword
            ]);

            if (!$userId) {
                return $this->error('Signup failed', 500);
            }

            return $this->success(['user_id' => $userId], 'Signup successful', 201);

        } catch (\Exception $e) {
            return $this->error('Signup failed', 500, $e->getMessage());
        }
    }

    public function login()
    {
        try {
            $input = json_decode(file_get_contents("php://input"), true);

            $email    = trim($input['email'] ?? '');
            $password = trim($input['password'] ?? '');

            if (!$email || !$password) {
                return $this->error('Missing email or password', 400);
            }

            $userModel = new UserModel();
            $user = $userModel->findByEmail($email);

            if (!$user) {
                return $this->error('Email does not exist', 404);
            }

            if (!password_verify($password, $user['password'])) {
                return $this->error('Wrong password', 401);
            }

            if (!$user['isActive']) {
                return $this->error('Account is inactive', 403);
            }

            $jwt = JwtService::getInstance();
            $token = $jwt->generateToken($user['id']);

            $response = [
                'token' => $token,
                'user' => [
                    'id'        => $user['id'],
                    'role'      => $user['role'],
                    'fullName'  => $user['fullName'],
                    'avatarUrl' => $user['avatarUrl'],
                    'email'     => $user['email'],
                    'phone'     => $user['phone'],
                    'isActive'  => $user['isActive'],
                ]
            ];

            return $this->success($response, 'Login successful');

        } catch (\Exception $e) {
            return $this->error('Login failed', 500, $e->getMessage());
        }
    }
}
