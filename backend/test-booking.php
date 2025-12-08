<?php
/**
 * Test script to check booking functionality
 * Run this from command line: php test-booking.php
 */

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/app/Core/Autoloader.php';

use App\Core\Database;
use App\Models\BookingModel;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Ensure fallback loader sets env (some CLI contexts may not load Dotenv properly)
require_once __DIR__ . '/app/config/env.php';
loadEnv(__DIR__ . '/.env');
echo "Loaded env from: " . __DIR__ . '/.env' . "\n";

try {
    echo "Testing Booking Model...\n\n";
    
    // Test database connection
    $db = Database::getInstance();
    echo "✓ Database connection successful\n";
    
    // Test BookingModel
    $bookingModel = new BookingModel();
    echo "✓ BookingModel initialized\n\n";
    
    // Test data
    $testBookingData = [
        'userId' => 1, // Change this to a valid user ID
        'tourId' => 1, // Change this to a valid tour ID
        'totalCost' => 1000000,
        'numberOfChild' => 0,
        'numberOfAdult' => 2,
        'status' => 'pending'
    ];
    
    echo "Attempting to create booking with data:\n";
    print_r($testBookingData);
    echo "\n";
    
    // Try to create booking
    $result = $bookingModel->createBooking($testBookingData);
    
    if ($result) {
        echo "✓ Booking created successfully\n";
        
        // Try to retrieve it
        $booking = $bookingModel->getBookingById($testBookingData['userId'], $testBookingData['tourId']);
        
        if ($booking) {
            echo "✓ Booking retrieved successfully\n";
            echo "Booking data:\n";
            print_r($booking);
        } else {
            echo "✗ Booking created but cannot be retrieved\n";
        }
    } else {
        echo "✗ Failed to create booking\n";
    }
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

