-- Drop existing Booking table if exists
DROP TABLE IF EXISTS Booking;

-- Create Booking table with new simplified schema
CREATE TABLE Booking (
    userId INT NOT NULL,
    tourId INT NOT NULL,
    totalCost DECIMAL(10,2),
    numberOfChild INT DEFAULT 0,
    numberOfAdult INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    PRIMARY KEY (userId, tourId),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (tourId) REFERENCES Tour(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

