<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\BookingModel;
use App\Models\UserModel;

class BookingController extends Controller {
    private $bookingModel;
    private $userModel;

    public function __construct() {
        $this->bookingModel = new BookingModel();
        $this->userModel = new UserModel();
    }

    public function createBooking() {
        try {
            // Check authentication
            $userId = $this->getUserIdFromToken();
            
            error_log('BookingController::createBooking - userId from token: ' . ($userId ? $userId : 'null'));
            
            if (!$userId) {
                error_log('BookingController::createBooking - User not authenticated');
                return $this->error('User not authenticated', 401);
            }

            // Get request data
            $rawInput = file_get_contents('php://input');
            error_log('BookingController::createBooking - Raw input: ' . $rawInput);
            $data = json_decode($rawInput, true);
            error_log('BookingController::createBooking - Parsed data: ' . json_encode($data));

            // Validate required fields
            $required = ['tourId', 'numberOfAdult'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return $this->error("Missing required field: $field", 400);
                }
            }

            // Validate userId exists
            $userModel = new \App\Models\UserModel();
            $user = $userModel->findById($userId);
            if (!$user) {
                error_log('User not found: ' . $userId);
                return $this->error('User not found', 404);
            }
            error_log('User found: ' . json_encode(['id' => $user['id'], 'email' => $user['email'] ?? 'N/A']));

            // Calculate total cost
            $tourModel = new \App\Models\TourModel();
            $tour = $tourModel->getTourById((int)$data['tourId']);
            
            if (!$tour) {
                error_log('Tour not found: ' . $data['tourId']);
                return $this->error('Tour not found', 404);
            }
            error_log('Tour found: ' . json_encode(['id' => $tour['id'], 'name' => $tour['name'] ?? 'N/A', 'price' => $tour['price'] ?? 'N/A']));

            $numberOfAdult = (int)($data['numberOfAdult'] ?? 0);
            $numberOfChild = (int)($data['numberOfChild'] ?? 0);
            
            if ($numberOfAdult <= 0) {
                return $this->error('Number of adults must be greater than 0', 400);
            }
            
            // Price calculation: adult 100%, child 50%
            $tourPrice = (float)$tour['price'];
            $totalCost = ($numberOfAdult * $tourPrice) + ($numberOfChild * $tourPrice * 0.5);
            
            error_log('Calculated totalCost: ' . $totalCost);

            // Create booking
            $bookingData = [
                'userId' => $userId,
                'tourId' => (int)$data['tourId'],
                'numberOfAdult' => $numberOfAdult,
                'numberOfChild' => $numberOfChild,
                'totalCost' => $totalCost,
                'status' => $data['status'] ?? 'pending'
            ];

            // Log booking data before creating
            error_log('Creating booking with data: ' . json_encode($bookingData));

            try {
                $result = $this->bookingModel->createBooking($bookingData);
                
                // Log result
                error_log('Booking creation result: ' . ($result ? 'success' : 'failed'));
                
                if (!$result) {
                    return $this->error('Failed to create booking', 500);
                }
            } catch (\Exception $e) {
                error_log('Exception during createBooking: ' . $e->getMessage());
                return $this->error('Failed to create booking: ' . $e->getMessage(), 500);
            }
            
            // Get created booking and verify persistence
            $booking = $this->bookingModel->getBookingById($userId, (int)$data['tourId']);
            error_log('Fetched booking after create: ' . json_encode($booking));

            // If the booking cannot be found after creation, return an explicit error
            if (!$booking) {
                error_log('Booking not found after creation - persistence verification failed');
                return $this->error('Booking could not be verified in the database after creation', 500);
            }

            return $this->success($booking, 'Booking created successfully', 201);
        } catch (\Exception $e) {
            error_log('Booking error: ' . $e->getMessage());
            error_log('Booking error trace: ' . $e->getTraceAsString());
            return $this->error($e->getMessage(), 500);
        }
    }

    public function getUserBookings() {
        try {
            $userId = $this->getUserIdFromToken();
            
            if (!$userId) {
                return $this->error('User not authenticated', 401);
            }

            $bookings = $this->bookingModel->getUserBookings($userId);
            return $this->success($bookings, 'User bookings fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function getBookingById($userId = null, $tourId = null) {
        try {
            $authUserId = $this->getUserIdFromToken();
            
            // If route params not provided, get from request
            if (!$userId || !$tourId) {
                parse_str($_SERVER['QUERY_STRING'], $queryParams);
                $userId = $queryParams['userId'] ?? $userId;
                $tourId = $queryParams['tourId'] ?? $tourId;
            }

            if (!$userId || !$tourId) {
                return $this->error('User ID and Tour ID required', 400);
            }

            $booking = $this->bookingModel->getBookingById((int)$userId, (int)$tourId);

            if (!$booking) {
                return $this->error('Booking not found', 404);
            }

            // Check authorization - user can only view their own bookings
            if ($authUserId && $booking['userId'] != $authUserId) {
                // Check if user is admin
                $user = $this->userModel->findById($authUserId);
                if (!$user || ($user['role'] ?? '') !== 'admin') {
                    return $this->error('Unauthorized', 403);
                }
            }

            return $this->success($booking, 'Booking fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function updateBooking($userId = null, $tourId = null) {
        try {
            $authUserId = $this->getUserIdFromToken();
            
            if (!$authUserId) {
                return $this->error('User not authenticated', 401);
            }

            // Get params
            if (!$userId || !$tourId) {
                parse_str($_SERVER['QUERY_STRING'], $queryParams);
                $userId = $queryParams['userId'] ?? $userId;
                $tourId = $queryParams['tourId'] ?? $tourId;
            }

            if (!$userId || !$tourId) {
                return $this->error('User ID and Tour ID required', 400);
            }

            $booking = $this->bookingModel->getBookingById((int)$userId, (int)$tourId);
            
            if (!$booking) {
                return $this->error('Booking not found', 404);
            }

            // Check authorization
            if ($booking['userId'] != $authUserId) {
                // Check if user is admin
                $user = $this->userModel->findById($authUserId);
                if (!$user || ($user['role'] ?? '') !== 'admin') {
                    return $this->error('Unauthorized', 403);
                }
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            // Update only allowed fields
            if (isset($data['status'])) {
                $this->bookingModel->updateBookingStatus((int)$userId, (int)$tourId, $data['status']);
            }

            $updatedBooking = $this->bookingModel->getBookingById((int)$userId, (int)$tourId);
            return $this->success($updatedBooking, 'Booking updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function deleteBooking($userId = null, $tourId = null) {
        try {
            $authUserId = $this->getUserIdFromToken();
            
            if (!$authUserId) {
                return $this->error('User not authenticated', 401);
            }

            // Get params
            if (!$userId || !$tourId) {
                parse_str($_SERVER['QUERY_STRING'], $queryParams);
                $userId = $queryParams['userId'] ?? $userId;
                $tourId = $queryParams['tourId'] ?? $tourId;
            }

            if (!$userId || !$tourId) {
                return $this->error('User ID and Tour ID required', 400);
            }

            $booking = $this->bookingModel->getBookingById((int)$userId, (int)$tourId);
            
            if (!$booking) {
                return $this->error('Booking not found', 404);
            }

            // Check authorization - only user who created booking or admin can delete
            if ($booking['userId'] != $authUserId) {
                $user = $this->userModel->findById($authUserId);
                if (!$user || ($user['role'] ?? '') !== 'admin') {
                    return $this->error('Unauthorized', 403);
                }
            }

            // Can only delete pending bookings
            if ($booking['status'] !== 'pending') {
                return $this->error('Can only cancel pending bookings', 400);
            }

            $this->bookingModel->deleteBooking((int)$userId, (int)$tourId);
            return $this->success(null, 'Booking deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function getAllBookings() {
        try {
            $userId = $this->getUserIdFromToken();
            
            // Check if user is admin
            if ($userId) {
                $user = $this->userModel->findById($userId);
                if (!$user || ($user['role'] ?? '') !== 'admin') {
                    return $this->error('Unauthorized - Admin only', 403);
                }
            } else {
                return $this->error('User not authenticated', 401);
            }

            $filters = [];
            if (!empty($_GET['status'])) {
                $filters['status'] = $_GET['status'];
            }
            if (!empty($_GET['tourId'])) {
                $filters['tourId'] = $_GET['tourId'];
            }

            $bookings = $this->bookingModel->getAllBookings($filters);
            return $this->success($bookings, 'All bookings fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    private function getUserIdFromToken() {
        $headers = getallheaders();
        error_log('All headers: ' . json_encode($headers));
        $token = $headers['Authorization'] ?? null;

        if (!$token) {
            error_log('No Authorization header found');
            return null;
        }

        // Remove 'Bearer ' prefix
        $token = str_replace('Bearer ', '', $token);
        error_log('Token (first 20 chars): ' . substr($token, 0, 20) . '...');

        try {
            // Use JwtService singleton to decode/verify token
            $jwtService = \App\Services\JwtService::getInstance();
            $userId = $jwtService->getUserId($token);
            error_log('Decoded userId: ' . ($userId ? $userId : 'null'));
            return $userId ?: null;
        } catch (\Exception $e) {
            error_log('Error decoding token: ' . $e->getMessage());
            return null;
        }
    }
}
