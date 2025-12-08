-- Migration: create comments table
CREATE TABLE IF NOT EXISTS `Comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userId` INT(11) DEFAULT NULL,
  `tourId` INT(11) DEFAULT NULL,
  `content` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `rating` TINYINT(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_tourId` (`tourId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
