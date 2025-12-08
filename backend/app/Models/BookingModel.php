<?php

namespace App\Models;

use App\Core\Database;

class BookingModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function createBooking($bookingData) {
        try {
            error_log('BookingModel::createBooking called with: ' . json_encode($bookingData));
            
            // Check if booking already exists (since PRIMARY KEY is userId, tourId)
            $existing = $this->getBookingById($bookingData['userId'], $bookingData['tourId']);
            
            error_log('Existing booking check: ' . ($existing ? 'found' : 'not found'));
            
            if ($existing) {
                // Update existing booking
                error_log('Updating existing booking');
                $stmt = $this->db->getConnection()->prepare("
                    UPDATE Booking 
                    SET totalCost = :totalCost, 
                        numberOfChild = :numberOfChild, 
                        numberOfAdult = :numberOfAdult,
                        status = :status
                    WHERE userId = :userId AND tourId = :tourId
                ");
                
                $params = [
                    ':userId' => $bookingData['userId'],
                    ':tourId' => $bookingData['tourId'],
                    ':totalCost' => $bookingData['totalCost'] ?? null,
                    ':numberOfChild' => $bookingData['numberOfChild'] ?? 0,
                    ':numberOfAdult' => $bookingData['numberOfAdult'] ?? 0,
                    ':status' => $bookingData['status'] ?? 'pending'
                ];
                
                error_log('Update params: ' . json_encode($params));
                $result = $stmt->execute($params);
                error_log('Update result: ' . ($result ? 'success' : 'failed'));
                error_log('Rows affected: ' . $stmt->rowCount());
                
                return true;
            } else {
                // Insert new booking
                error_log('Inserting new booking');
                $stmt = $this->db->getConnection()->prepare("
                    INSERT INTO Booking (
                        userId, tourId, totalCost, numberOfChild, numberOfAdult, status
                    ) VALUES (
                        :userId, :tourId, :totalCost, :numberOfChild, :numberOfAdult, :status
                    )
                ");

                $params = [
                    ':userId' => $bookingData['userId'],
                    ':tourId' => $bookingData['tourId'],
                    ':totalCost' => $bookingData['totalCost'] ?? null,
                    ':numberOfChild' => $bookingData['numberOfChild'] ?? 0,
                    ':numberOfAdult' => $bookingData['numberOfAdult'] ?? 0,
                    ':status' => $bookingData['status'] ?? 'pending'
                ];
                
                error_log('Insert params: ' . json_encode($params));
                
                // Check if params are valid
                if (empty($params[':userId']) || empty($params[':tourId'])) {
                    error_log('Invalid params: userId or tourId is empty');
                    throw new \Exception('Invalid booking data: userId or tourId is required');
                }
                
                try {
                    $result = $stmt->execute($params);
                    error_log('Insert execute result: ' . ($result ? 'success' : 'failed'));
                } catch (\PDOException $ex) {
                    error_log('PDOException during execute: ' . $ex->getMessage());
                    error_log('PDOException code: ' . $ex->getCode());
                    error_log('PDOException SQLSTATE: ' . $ex->errorInfo[0] ?? 'unknown');
                    throw $ex;
                }
                
                if (!$result) {
                    $errorInfo = $stmt->errorInfo();
                    error_log('PDO Error Info: ' . json_encode($errorInfo));
                    throw new \Exception('Failed to insert booking: ' . json_encode($errorInfo));
                }
                
                $rowsAffected = $stmt->rowCount();
                error_log('Rows affected: ' . $rowsAffected);
                
                // Verify the insert by querying the database
                $verifyBooking = $this->getBookingById($bookingData['userId'], $bookingData['tourId']);
                if (!$verifyBooking) {
                    error_log('WARNING: Booking inserted but cannot be retrieved immediately');
                } else {
                    error_log('SUCCESS: Booking verified in database: ' . json_encode($verifyBooking));
                }

                return true;
            }
        } catch (\PDOException $e) {
            error_log('PDOException in createBooking: ' . $e->getMessage());
            error_log('PDOException code: ' . $e->getCode());
            throw new \Exception('Error creating booking: ' . $e->getMessage());
        } catch (\Exception $e) {
            error_log('Exception in createBooking: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getBookingById($userId, $tourId) {
        try {
            error_log('getBookingById called with userId: ' . $userId . ', tourId: ' . $tourId);
            $stmt = $this->db->getConnection()->prepare("
                SELECT b.*, t.name as tourName 
                FROM Booking b
                LEFT JOIN Tour t ON b.tourId = t.id
                WHERE b.userId = :userId AND b.tourId = :tourId
            ");
            $stmt->execute([':userId' => $userId, ':tourId' => $tourId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            error_log('getBookingById result: ' . ($result ? json_encode($result) : 'null'));
            return $result;
        } catch (\PDOException $e) {
            error_log('PDOException in getBookingById: ' . $e->getMessage());
            throw new \Exception('Error fetching booking: ' . $e->getMessage());
        }
    }

    public function getUserBookings($userId) {
        try {
            error_log('getUserBookings called for userId: ' . $userId);
            $stmt = $this->db->getConnection()->prepare("
                SELECT 
                    b.*,
                    t.name as tourName
                FROM Booking b
                LEFT JOIN Tour t ON b.tourId = t.id
                WHERE b.userId = :userId
            ");
            $stmt->execute([':userId' => $userId]);
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            error_log('getUserBookings result count: ' . count($result));
            error_log('getUserBookings result: ' . json_encode($result));
            return $result;
        } catch (\PDOException $e) {
            error_log('PDOException in getUserBookings: ' . $e->getMessage());
            throw new \Exception('Error fetching user bookings: ' . $e->getMessage());
        }
    }

    public function updateBookingStatus($userId, $tourId, $status) {
        try {
            $stmt = $this->db->getConnection()->prepare("
                UPDATE Booking SET status = :status WHERE userId = :userId AND tourId = :tourId
            ");
            $stmt->execute([
                ':status' => $status,
                ':userId' => $userId,
                ':tourId' => $tourId
            ]);
            return true;
        } catch (\PDOException $e) {
            throw new \Exception('Error updating booking: ' . $e->getMessage());
        }
    }

    public function deleteBooking($userId, $tourId) {
        try {
            $stmt = $this->db->getConnection()->prepare("
                DELETE FROM Booking WHERE userId = :userId AND tourId = :tourId
            ");
            $stmt->execute([':userId' => $userId, ':tourId' => $tourId]);
            return true;
        } catch (\PDOException $e) {
            throw new \Exception('Error deleting booking: ' . $e->getMessage());
        }
    }

    public function getAllBookings($filters = []) {
        try {
            $query = "SELECT b.*, t.name as tourName FROM Booking b LEFT JOIN Tour t ON b.tourId = t.id WHERE 1=1";
            
            if (!empty($filters['status'])) {
                $query .= " AND b.status = :status";
            }
            
            if (!empty($filters['tourId'])) {
                $query .= " AND b.tourId = :tourId";
            }
            
            $stmt = $this->db->getConnection()->prepare($query);
            
            $params = [];
            if (!empty($filters['status'])) {
                $params[':status'] = $filters['status'];
            }
            if (!empty($filters['tourId'])) {
                $params[':tourId'] = $filters['tourId'];
            }
            
            $stmt->execute($params);
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Exception('Error fetching bookings: ' . $e->getMessage());
        }
    }
}
