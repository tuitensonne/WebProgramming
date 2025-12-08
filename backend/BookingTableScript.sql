-- Create Booking table
CREATE TABLE IF NOT EXISTS Booking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    tourId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    adults INT DEFAULT 0,
    children INT DEFAULT 0,
    babies INT DEFAULT 0,
    totalPeople INT NOT NULL,
    totalPrice DECIMAL(12, 2) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    note TEXT,
    paymentMethod ENUM('card', 'bank', 'cash') NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (tourId) REFERENCES Tour(id) ON DELETE CASCADE,
    KEY idx_userId (userId),
    KEY idx_tourId (tourId),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
