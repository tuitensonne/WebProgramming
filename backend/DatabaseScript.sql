-- Bảng User
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50),
    fullName VARCHAR(100),
    avatarUrl VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Page
CREATE TABLE Page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Bảng TourCategory
CREATE TABLE TourCategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tourCategoryName VARCHAR(100),
    description TEXT
);

-- Bảng CompanyInfo
CREATE TABLE CompanyInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th12 05, 2025 lúc 04:29 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bk_tours_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bannerhomepage`
--

CREATE TABLE `bannerhomepage` (
  `id` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `dayStart` date DEFAULT NULL,
  `dayEnd` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking`
--

CREATE TABLE `booking` (
  `userId` int(11) NOT NULL,
  `tourId` int(11) NOT NULL,
  `totalCost` decimal(10,2) DEFAULT NULL,
  `numberOfChild` int(11) DEFAULT NULL,
  `numberOfAdult` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `tourId` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `companyinfo`
--

CREATE TABLE `companyinfo` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `hotline` varchar(50) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `companyinfo`
--

INSERT INTO `companyinfo` (`id`, `company_name`, `slogan`, `logo_url`, `address`, `email`, `hotline`, `facebook_link`, `instagram_link`) VALUES
(1, 'Viatours', 'Khám phá thế giới cùng chúng tôi', 'https://example.com/logo.png', '123 Nguyễn Hữu Cảnh, TP.HCM', 'contact@viatours.com', '1900-1000', 'https://facebook.com/viatours', 'https://instagram.com/viatours');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contactmessages`
--

CREATE TABLE `contactmessages` (
  `id` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `title` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `userCreatedId` int(11) DEFAULT NULL,
  `userRepliedId` int(11) DEFAULT NULL,
  `repliedMsg` text DEFAULT NULL,
  `isRead` enum('unread','read') DEFAULT 'unread',
  `isReplied` enum('unreplied','replied') DEFAULT 'unreplied'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `contactmessages`
--

INSERT INTO `contactmessages` (`id`, `fullName`, `title`, `email`, `phone`, `message`, `createdAt`, `userCreatedId`, `userRepliedId`, `repliedMsg`, `isRead`, `isReplied`) VALUES
(1, 'Nguyễn Văn A', 'Hỏi về tour Đà Lạt', 'vana@example.com', '0901234567', 'Tôi muốn biết giá tour Đà Lạt 3 ngày 2 đêm.', '2025-12-02 22:13:33', NULL, NULL, NULL, 'unread', 'unreplied'),
(2, 'Trần Thị B', 'Thắc mắc thanh toán', 'thib@example.com', '0912345678', 'Tôi đã thanh toán nhưng không nhận được email xác nhận.', '2025-12-02 22:13:33', NULL, NULL, NULL, 'unread', 'unreplied'),
(3, 'Lê Minh C', 'Yêu cầu hoàn tiền', 'minhc@example.com', '0987654321', 'Tôi muốn yêu cầu hoàn tiền cho tour Nha Trang.', '2025-12-02 22:13:33', NULL, NULL, NULL, 'unread', 'unreplied');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `buttonText` varchar(255) DEFAULT NULL,
  `buttonPageId` int(11) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `desc` text DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `item`
--

INSERT INTO `item` (`id`, `section_id`, `icon`, `title`, `buttonText`, `buttonPageId`, `subtitle`, `imageUrl`, `desc`, `color`) VALUES
(1, 1, 'confirmation', 'Ultimate flexibility', NULL, NULL, NULL, NULL, 'You\'re in control...', NULL),
(2, 1, 'lightbulb', 'Memorable experiences', NULL, NULL, NULL, NULL, 'Browse and book...', NULL),
(3, 1, 'diamond', 'Quality at our core', NULL, NULL, NULL, NULL, 'High-quality standards...', NULL),
(4, 1, 'medal', 'Award-winning support', NULL, NULL, NULL, NULL, 'We\'re here to help...', NULL),
(5, 2, '📍', 'Choose Destination', NULL, NULL, NULL, NULL, 'Lorem ipsum...', '#FFB800'),
(6, 2, '📅', 'Check Availability', NULL, NULL, NULL, NULL, 'Lorem ipsum...', '#FF6B4A'),
(7, 2, '🚗', 'Let\'s Go', NULL, NULL, NULL, NULL, 'Lorem ipsum...', '#1B7B8F'),
(8, 3, NULL, 'Enjoy 5-Star Comfort', 'Explore Now', NULL, NULL, '/assets/hotel1.jpg', NULL, NULL),
(9, 3, NULL, 'Discover The Wild', 'Book Trip', NULL, NULL, '/assets/hotel2.jpg', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `page`
--

CREATE TABLE `page` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `page`
--

INSERT INTO `page` (`id`, `name`, `description`) VALUES
(1, 'LandingPage', 'Trang chủ của BK Tours');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `place`
--

CREATE TABLE `place` (
  `id` int(11) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `companyInfoId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `place`
--

INSERT INTO `place` (`id`, `city`, `province`, `country`, `companyInfoId`) VALUES
(1, 'Hà Nội', 'Hà Nội', 'Việt Nam', 1),
(2, 'TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Việt Nam', 1),
(3, 'Đà Nẵng', 'Đà Nẵng', 'Việt Nam', 1),
(4, 'Nha Trang', 'Khánh Hòa', 'Việt Nam', 1),
(5, 'Đà Lạt', 'Lâm Đồng', 'Việt Nam', 1),
(6, 'Hạ Long', 'Quảng Ninh', 'Việt Nam', 1),
(7, 'Huế', 'Thừa Thiên Huế', 'Việt Nam', 1),
(8, 'Phú Quốc', 'Kiên Giang', 'Việt Nam', 1),
(9, 'Sapa', 'Lào Cai', 'Việt Nam', 1),
(10, 'Hà Giang', 'Hà Giang', 'Việt Nam', 1),
(11, 'Quy Nhơn', 'Bình Định', 'Việt Nam', 1),
(12, 'Côn Đảo', 'Bà Rịa - Vũng Tàu', 'Việt Nam', 1),
(13, 'Cà Mau', 'Cà Mau', 'Việt Nam', 1),
(14, 'Vũng Tàu', 'Bà Rịa - Vũng Tàu', 'Việt Nam', 1),
(15, 'Ninh Bình', 'Ninh Bình', 'Việt Nam', 1),
(16, 'Đồng Hới', 'Quảng Bình', 'Việt Nam', 1),
(17, 'Buôn Ma Thuột', 'Đắk Lắk', 'Việt Nam', 1),
(18, 'Lý Sơn', 'Quảng Ngãi', 'Việt Nam', 1),
(19, 'Mộc Châu', 'Sơn La', 'Việt Nam', 1),
(20, 'Bắc Kạn', 'Bắc Kạn', 'Việt Nam', 1),
(21, 'Hải Phòng', 'Hải Phòng', 'Việt Nam', 1),
(22, 'Sa Đéc', 'Đồng Tháp', 'Việt Nam', 1),
(23, 'Bangkok', NULL, 'Thái Lan', 1),
(24, 'Singapore', NULL, 'Singapore', 1),
(25, 'Seoul', NULL, 'Hàn Quốc', 1),
(26, 'Tokyo', NULL, 'Nhật Bản', 1),
(27, 'Paris', NULL, 'Pháp', 1),
(28, 'Sydney', NULL, 'Úc', 1),
(29, 'New York', NULL, 'Hoa Kỳ', 1),
(30, 'Dubai', NULL, 'UAE', 1),
(31, 'Male', NULL, 'Maldives', 1),
(32, 'Siem Reap', NULL, 'Campuchia', 1),
(33, 'Bắc Kinh', NULL, 'Trung Quốc', 1),
(34, 'Đài Bắc', NULL, 'Đài Loan', 1),
(35, 'Paro', NULL, 'Bhutan', 1),
(36, 'Cairo', NULL, 'Ai Cập', 1),
(37, 'Vancouver', NULL, 'Canada', 1),
(38, 'Bali', NULL, 'Indonesia', 1),
(39, 'Istanbul', NULL, 'Thổ Nhĩ Kỳ', 1),
(40, 'Moscow', NULL, 'Nga', 1),
(41, 'Athens', NULL, 'Hy Lạp', 1),
(42, 'Hồng Kông', NULL, 'Hồng Kông', 1),
(43, 'Tokyo', NULL, 'Nhật Bản', 1),
(44, 'Paris', NULL, 'Pháp', 1),
(45, 'Sydney', NULL, 'Úc', 1),
(46, 'New York', NULL, 'Hoa Kỳ', 1),
(47, 'Dubai', NULL, 'UAE', 1),
(48, 'Male', NULL, 'Maldives', 1),
(49, 'Siem Reap', NULL, 'Campuchia', 1),
(50, 'Bắc Kinh', NULL, 'Trung Quốc', 1),
(51, 'Đài Bắc', NULL, 'Đài Loan', 1),
(52, 'Paro', NULL, 'Bhutan', 1),
(53, 'Cairo', NULL, 'Ai Cập', 1),
(54, 'Vancouver', NULL, 'Canada', 1),
(55, 'Bali', NULL, 'Indonesia', 1),
(56, 'Istanbul', NULL, 'Thổ Nhĩ Kỳ', 1),
(57, 'Moscow', NULL, 'Nga', 1),
(58, 'Athens', NULL, 'Hy Lạp', 1),
(59, 'Hồng Kông', NULL, 'Hồng Kông', 1),
(60, 'Phú Yên', 'Phú Yên', 'Việt Nam', 1),
(61, 'Cần Thơ', 'Cần Thơ', 'Việt Nam', 1),
(62, 'Tuy Hòa', 'Phú Yên', 'Việt Nam', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `userId`, `title`, `content`, `createdAt`, `type`) VALUES
(1, 1, 'Tour Hà Nội - Hạ Long 4 Ngày 3 Đêm', 'Khám phá thủ đô ngàn năm văn hiến và kỳ quan thiên nhiên thế giới.', '2025-12-05 10:52:03', 'tour'),
(2, 1, 'Tour Đà Nẵng - Hội An - Huế 5 Ngày 4 Đêm', 'Hành trình di sản miền Trung: Đà Nẵng năng động, Hội An cổ kính, Huế mộng mơ.', '2025-12-05 10:52:03', 'tour'),
(3, 1, 'Tour Sài Gòn - Miền Tây 3 Ngày 2 Đêm', 'Trải nghiệm cuộc sống sông nước, chợ nổi và vườn cây ăn trái ở miền Tây Nam Bộ.', '2025-12-05 10:52:03', 'tour'),
(4, 1, 'Tour Nha Trang - Đà Lạt 5 Ngày 4 Đêm', 'Hành trình \"Biển và Hoa\": Tắm biển Nha Trang và ngắm hoa, thưởng thức không khí mát mẻ tại Đà Lạt.', '2025-12-05 10:52:03', 'tour'),
(5, 1, 'Tour Phú Quốc - Đảo Ngọc 4 Ngày 3 Đêm', 'Tận hưởng bãi biển đẹp, lặn ngắm san hô và khám phá các khu vui chơi giải trí hàng đầu.', '2025-12-05 10:52:03', 'tour'),
(6, 1, 'Tour Tây Bắc - Sapa - Fansipan 4 Ngày 3 Đêm', 'Chinh phục đỉnh Fansipan, khám phá ruộng bậc thang kỳ vĩ và văn hóa dân tộc thiểu số.', '2025-12-05 10:52:03', 'tour'),
(7, 1, 'Tour Hà Giang - Cao nguyên đá 4 Ngày 3 Đêm', 'Khám phá cung đường đèo Mã Pí Lèng, Đồng Văn, Mèo Vạc hùng vĩ.', '2025-12-05 10:52:03', 'tour'),
(8, 1, 'Tour Quy Nhơn - Phú Yên 4 Ngày 3 Đêm', 'Khám phá vẻ đẹp hoang sơ của biển đảo miền Trung: Ghềnh Đá Đĩa, Eo Gió, Bãi Xép.', '2025-12-05 10:52:03', 'tour'),
(9, 1, 'Tour Côn Đảo 3 Ngày 2 Đêm', 'Tham quan di tích lịch sử và trải nghiệm du lịch tâm linh, khám phá biển đảo.', '2025-12-05 10:52:03', 'tour'),
(10, 1, 'Tour Cà Mau - Đất Mũi 4 Ngày 3 Đêm', 'Chinh phục cực nam Tổ quốc, khám phá hệ sinh thái rừng ngập mặn.', '2025-12-05 10:52:03', 'tour'),
(11, 1, 'Tour Vũng Tàu 2 Ngày 1 Đêm', 'Nghỉ dưỡng cuối tuần tại thành phố biển gần TP.HCM, tham quan Tượng Chúa Kitô.', '2025-12-05 10:52:03', 'tour'),
(12, 1, 'Tour Ninh Bình - Tràng An - Bái Đính 2 Ngày 1 Đêm', 'Khám phá \"Hạ Long trên cạn\", quần thể danh thắng Tràng An và Chùa Bái Đính.', '2025-12-05 10:52:03', 'tour'),
(13, 1, 'Tour Quảng Bình - Động Phong Nha 3 Ngày 2 Đêm', 'Khám phá hệ thống hang động kỳ vĩ, bao gồm Động Phong Nha và Tiên Sơn.', '2025-12-05 10:52:03', 'tour'),
(14, 1, 'Tour Buôn Ma Thuột - Tây Nguyên 3 Ngày 2 Đêm', 'Khám phá văn hóa cà phê, cưỡi voi, thăm Bản Đôn và thác Dray Nur.', '2025-12-05 10:52:03', 'tour'),
(15, 1, 'Tour Bình Hưng - Vịnh Vĩnh Hy 3 Ngày 2 Đêm', 'Thiên đường biển đảo hoang sơ, lặn ngắm san hô và thưởng thức hải sản tươi ngon.', '2025-12-05 10:52:03', 'tour'),
(16, 1, 'Tour Lý Sơn - Đảo Tỏi 3 Ngày 2 Đêm', 'Khám phá vẻ đẹp độc đáo của hòn đảo núi lửa, cánh đồng tỏi và cổng Tò Vò.', '2025-12-05 10:52:03', 'tour'),
(17, 1, 'Tour Mộc Châu - Sơn La 3 Ngày 2 Đêm', 'Khám phá đồi chè, thác Dải Yếm và trải nghiệm văn hóa địa phương.', '2025-12-05 10:52:03', 'tour'),
(18, 1, 'Tour Hồ Ba Bể - Bắc Kạn 3 Ngày 2 Đêm', 'Khám phá hồ nước ngọt tự nhiên lớn nhất Việt Nam và Vườn Quốc gia Ba Bể.', '2025-12-05 10:52:03', 'tour'),
(19, 1, 'Tour Cát Bà - Hải Phòng 3 Ngày 2 Đêm', 'Khám phá Vịnh Lan Hạ, Rừng Quốc gia Cát Bà và các bãi biển đẹp.', '2025-12-05 10:52:03', 'tour'),
(20, 1, 'Tour Đồng Tháp - Sa Đéc 3 Ngày 2 Đêm', 'Ngắm hoa Sa Đéc, tham quan Nhà cổ Huỳnh Thủy Lê và Làng hoa kiểng.', '2025-12-05 10:52:03', 'tour'),
(21, 1, 'Tour Phú Yên - Xứ sở Hoa vàng cỏ xanh 3 Ngày 2 Đêm', 'Khám phá Gành Đá Đĩa, Hải đăng Mũi Điện và bãi biển hoang sơ.', '2025-12-05 10:52:03', 'tour'),
(22, 1, 'Tour Sa Pa - Bản Cát Cát - Bản Tả Van 3 Ngày 2 Đêm', 'Trekking qua các bản làng dân tộc, trải nghiệm văn hóa độc đáo.', '2025-12-05 10:52:03', 'tour'),
(23, 1, 'Tour Đồng bằng Sông Cửu Long 4 Ngày 3 Đêm (Cần Thơ)', 'Trải nghiệm chợ nổi Cái Răng, nhà cổ Bình Thủy và miệt vườn.', '2025-12-05 10:52:03', 'tour'),
(24, 1, 'Tour Vịnh Hạ Long - Đảo Titop 2 Ngày 1 Đêm', 'Ngủ đêm trên du thuyền, khám phá hang động và bãi biển Titop.', '2025-12-05 10:52:03', 'tour'),
(25, 1, 'Tour Tây Nguyên - Hồ Lắk 3 Ngày 2 Đêm', 'Khám phá văn hóa cồng chiêng, hồ Lắk và thác Dray Nur.', '2025-12-05 10:52:03', 'tour'),
(26, 1, 'Tour Hà Nội City Tour 1 Ngày', 'Tham quan Lăng Bác, Văn Miếu Quốc Tử Giám, Hồ Gươm.', '2025-12-05 10:52:03', 'tour'),
(27, 1, 'Tour Ninh Bình: Cố đô Hoa Lư - Tam Cốc 2 Ngày 1 Đêm', 'Khám phá cố đô đầu tiên và du thuyền trên dòng sông Ngô Đồng.', '2025-12-05 10:52:03', 'tour'),
(28, 1, 'Tour Đà Nẵng - Bà Nà Hill - Cầu Vàng 4 Ngày 3 Đêm', 'Thành phố đáng sống, trải nghiệm Cầu Vàng trên đỉnh Bà Nà.', '2025-12-05 10:52:03', 'tour'),
(29, 1, 'Tour Hải Phòng - Cát Bà - Vịnh Lan Hạ 3 Ngày 2 Đêm', 'Khám phá quần đảo Cát Bà, chèo kayak Vịnh Lan Hạ.', '2025-12-05 10:52:03', 'tour'),
(30, 1, 'Tour Tuy Hòa - Ghềnh Đá Đĩa 3 Ngày 2 Đêm', 'Khám phá vẻ đẹp độc đáo của Ghềnh Đá Đĩa và các điểm check-in.', '2025-12-05 10:52:03', 'tour'),
(31, 1, 'Tour Thái Lan: Bangkok - Pattaya 5 Ngày 4 Đêm', 'Khám phá xứ sở Chùa Vàng: mua sắm ở Bangkok và tận hưởng bãi biển Pattaya.', '2025-12-05 10:52:03', 'tour'),
(32, 1, 'Tour Singapore - Malaysia 6 Ngày 5 Đêm', 'Hành trình khám phá hai quốc gia Đông Nam Á hiện đại và đa văn hóa.', '2025-12-05 10:52:03', 'tour'),
(33, 1, 'Tour Hàn Quốc: Seoul - Đảo Nami 5 Ngày 4 Đêm', 'Khám phá thủ đô Seoul hiện đại và vẻ đẹp lãng mạn của Đảo Nami.', '2025-12-05 10:52:03', 'tour'),
(34, 1, 'Tour Nhật Bản: Tokyo - Osaka - Kyoto 7 Ngày 6 Đêm', 'Trải nghiệm văn hóa truyền thống và công nghệ hiện đại của đất nước mặt trời mọc.', '2025-12-05 10:52:03', 'tour'),
(35, 1, 'Tour Châu Âu: Pháp - Thụy Sĩ - Ý 10 Ngày 9 Đêm', 'Khám phá các thành phố lãng mạn và di sản văn hóa vĩ đại của Châu Âu.', '2025-12-05 10:52:03', 'tour'),
(36, 1, 'Tour Úc: Sydney - Melbourne 7 Ngày 6 Đêm', 'Khám phá các biểu tượng nổi tiếng của Úc: Nhà hát Opera Sydney, Cầu cảng Sydney.', '2025-12-05 10:52:03', 'tour'),
(37, 1, 'Tour Mỹ: Bờ Đông New York - Washington D.C 8 Ngày 7 Đêm', 'Khám phá trung tâm tài chính và chính trị của Hoa Kỳ.', '2025-12-05 10:52:03', 'tour'),
(38, 1, 'Tour Dubai - Abu Dhabi 5 Ngày 4 Đêm', 'Trải nghiệm sự xa hoa, sa mạc và các công trình kiến trúc độc đáo.', '2025-12-05 10:52:03', 'tour'),
(39, 1, 'Tour Maldives 4 Ngày 3 Đêm', 'Thiên đường nghỉ dưỡng với bungalow trên mặt nước và biển xanh cát trắng.', '2025-12-05 10:52:03', 'tour'),
(40, 1, 'Tour Campuchia: Angkor Wat - Phnom Penh 4 Ngày 3 Đêm', 'Tham quan quần thể đền Angkor Wat huyền bí và Thủ đô Phnom Penh.', '2025-12-05 10:52:03', 'tour'),
(41, 1, 'Tour Trung Quốc: Bắc Kinh - Thượng Hải 7 Ngày 6 Đêm', 'Khám phá Vạn Lý Trường Thành, Tử Cấm Thành và sự phát triển đô thị.', '2025-12-05 10:52:03', 'tour'),
(42, 1, 'Tour Đài Loan 5 Ngày 4 Đêm', 'Khám phá Đài Bắc, Đài Trung và các khu chợ đêm sầm uất.', '2025-12-05 10:52:03', 'tour'),
(43, 1, 'Tour Bhutan: Vương quốc hạnh phúc 6 Ngày 5 Đêm', 'Du lịch tâm linh, khám phá văn hóa và kiến trúc độc đáo của Bhutan.', '2025-12-05 10:52:03', 'tour'),
(44, 1, 'Tour Ai Cập: Kim tự tháp Giza và Sông Nile 7 Ngày 6 Đêm', 'Khám phá nền văn minh cổ đại, các kim tự tháp và hành trình trên sông Nile.', '2025-12-05 10:52:03', 'tour'),
(45, 1, 'Tour Canada: Bờ Tây Vancouver - Banff 7 Ngày 6 Đêm', 'Khám phá vẻ đẹp thiên nhiên hùng vĩ của Canada: núi non, hồ nước và công viên quốc gia.', '2025-12-05 10:52:03', 'tour'),
(46, 1, 'Tour Bali - Indonesia 5 Ngày 4 Đêm', 'Thiên đường văn hóa, tâm linh và bãi biển nổi tiếng.', '2025-12-05 10:52:03', 'tour'),
(47, 1, 'Tour Thổ Nhĩ Kỳ: Istanbul - Cappadocia 8 Ngày 7 Đêm', 'Khám phá ngã tư Á - Âu, trải nghiệm khinh khí cầu ở Cappadocia.', '2025-12-05 10:52:03', 'tour'),
(48, 1, 'Tour Nga: Moscow - St. Petersburg 7 Ngày 6 Đêm', 'Khám phá Lăng Lenin, Điện Kremlin và Cung điện Mùa Đông.', '2025-12-05 10:52:03', 'tour'),
(49, 1, 'Tour Hy Lạp: Athens - Santorini 8 Ngày 7 Đêm', 'Khám phá cái nôi của nền văn minh phương Tây và hòn đảo Santorini lãng mạn.', '2025-12-05 10:52:03', 'tour'),
(50, 1, 'Tour Hồng Kông - Ma Cao 4 Ngày 3 Đêm', 'Trải nghiệm thành phố không ngủ Hồng Kông và Ma Cao - Las Vegas của Châu Á.', '2025-12-05 10:52:03', 'tour'),
(51, 1, 'Tour Úc: Sydney - Melbourne (2)', '7N6Đ: Khám phá xứ sở Kangaroo', '2025-12-05 10:52:03', 'tour'),
(52, 1, 'Tour Mỹ: Bờ Đông (2)', '8N7Đ: New York - Washington D.C', '2025-12-05 10:52:03', 'tour'),
(53, 1, 'Tour Dubai - Abu Dhabi (2)', '5N4Đ: Xa hoa và Sa mạc', '2025-12-05 10:52:03', 'tour'),
(54, 1, 'Tour Maldives (2)', '4N3Đ: Thiên đường nghỉ dưỡng', '2025-12-05 10:52:03', 'tour'),
(55, 1, 'Tour Campuchia: Angkor Wat (2)', '4N3Đ: Bí ẩn của Đế chế Khmer', '2025-12-05 10:52:03', 'tour');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `background_color` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `section`
--

INSERT INTO `section` (`id`, `page_id`, `category_id`, `type`, `order`, `title`, `subtitle`, `description`, `background_color`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'why_choose_us', 1, 'Tại sao nên chọn BKTours', NULL, NULL, NULL, NULL, '2025-12-02 22:13:33', '2025-12-02 22:13:33'),
(2, 1, NULL, 'content_type_one', 2, 'Get Your Favourite Resort Bookings', 'Fast & Easy', NULL, '#d0d0d042', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=800', '2025-12-02 22:13:33', '2025-12-02 22:13:33'),
(3, 1, NULL, 'content_type_two', 3, NULL, NULL, NULL, NULL, NULL, '2025-12-02 22:13:33', '2025-12-02 22:13:33'),
(4, 1, NULL, 'content_type_three', 4, 'We Provide You Best Europe Sightseeing Tours', 'PROMOTION', 'Et labore harum non nobis ipsum eum molestias...', '#ffffff', 'https://example.com/images/eiffel-tower.jpg', '2025-12-02 22:13:33', '2025-12-02 22:13:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour`
--

CREATE TABLE `tour` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `shortDescription` text DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `thumbnailUrl` varchar(255) DEFAULT NULL,
  `tourType` varchar(100) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour`
--

INSERT INTO `tour` (`id`, `name`, `shortDescription`, `postId`, `thumbnailUrl`, `tourType`, `categoryId`) VALUES
(206, 'Hà Nội - Hạ Long', '4N3Đ: Thủ đô và Kỳ quan', 1, '/assets/tour_domestic_1.jpg', 'domestic', 7),
(207, 'Đà Nẵng - Hội An - Huế', '5N4Đ: Hành trình Di sản Miền Trung', 2, '/assets/tour_domestic_2.jpg', 'domestic', 9),
(208, 'Sài Gòn - Miền Tây', '3N2Đ: Khám phá sông nước Nam Bộ', 3, '/assets/tour_domestic_3.jpg', 'domestic', 10),
(209, 'Nha Trang - Đà Lạt', '5N4Đ: Biển và Hoa', 4, '/assets/tour_domestic_4.jpg', 'domestic', 7),
(210, 'Phú Quốc', '4N3Đ: Đảo Ngọc - Thiên đường biển', 5, '/assets/tour_domestic_5.jpg', 'domestic', 7),
(211, 'Tây Bắc - Sapa', '4N3Đ: Chinh phục Fansipan', 6, '/assets/tour_domestic_6.jpg', 'domestic', 8),
(212, 'Hà Giang', '4N3Đ: Cung đường Hạnh Phúc', 7, '/assets/tour_domestic_7.jpg', 'domestic', 8),
(213, 'Quy Nhơn - Phú Yên', '4N3Đ: Xứ Nẫu hoang sơ', 8, '/assets/tour_domestic_8.jpg', 'domestic', 7),
(214, 'Côn Đảo', '3N2Đ: Lịch sử và biển đảo', 9, '/assets/tour_domestic_9.jpg', 'domestic', 7),
(215, 'Cà Mau', '4N3Đ: Đất Mũi - Cực Nam Tổ Quốc', 10, '/assets/tour_domestic_10.jpg', 'domestic', 9),
(216, 'Vũng Tàu', '2N1Đ: Nghỉ dưỡng cuối tuần', 11, '/assets/tour_domestic_11.jpg', 'domestic', 10),
(217, 'Ninh Bình', '2N1Đ: Hạ Long trên cạn', 12, '/assets/tour_domestic_12.jpg', 'domestic', 9),
(218, 'Quảng Bình', '3N2Đ: Vương quốc hang động', 13, '/assets/tour_domestic_13.jpg', 'domestic', 9),
(219, 'Buôn Ma Thuột', '3N2Đ: Cà phê và Đại Ngàn', 14, '/assets/tour_domestic_14.jpg', 'domestic', 8),
(220, 'Bình Hưng - Vĩnh Hy', '3N2Đ: Thiên đường biển ẩn mình', 15, '/assets/tour_domestic_15.jpg', 'domestic', 7),
(221, 'Lý Sơn', '3N2Đ: Đảo núi lửa độc đáo', 16, '/assets/tour_domestic_16.jpg', 'domestic', 7),
(222, 'Mộc Châu', '3N2Đ: Cao nguyên chè xanh', 17, '/assets/tour_domestic_17.jpg', 'domestic', 8),
(223, 'Hồ Ba Bể', '3N2Đ: Hồ nước ngọt kỳ vĩ', 18, '/assets/tour_domestic_18.jpg', 'domestic', 8),
(224, 'Cát Bà', '3N2Đ: Vịnh Lan Hạ - Đảo Ngọc', 19, '/assets/tour_domestic_19.jpg', 'domestic', 7),
(225, 'Đồng Tháp', '3N2Đ: Xứ sở hoa và di tích', 20, '/assets/tour_domestic_20.jpg', 'domestic', 10),
(226, 'Phú Yên', '3N2Đ: Xứ sở Hoa vàng cỏ xanh', 21, '/assets/tour_dom_21.jpg', 'domestic', 7),
(227, 'Sa Pa (2)', '3N2Đ: Trekking Bản Cát Cát', 22, '/assets/tour_dom_22.jpg', 'domestic', 8),
(228, 'Cần Thơ', '4N3Đ: Trải nghiệm chợ nổi Cái Răng', 23, '/assets/tour_dom_23.jpg', 'domestic', 9),
(229, 'Vịnh Hạ Long (2)', '2N1Đ: Ngủ đêm trên Du thuyền', 24, '/assets/tour_dom_24.jpg', 'domestic', 7),
(230, 'Tây Nguyên (2)', '3N2Đ: Văn hóa Cồng chiêng', 25, '/assets/tour_dom_25.jpg', 'domestic', 8),
(231, 'Hà Nội City (2)', '1 Ngày: Văn Miếu - Hồ Gươm', 26, '/assets/tour_dom_26.jpg', 'domestic', 10),
(232, 'Ninh Bình (2)', '2N1Đ: Hoa Lư - Tam Cốc', 27, '/assets/tour_dom_27.jpg', 'domestic', 9),
(233, 'Đà Nẵng (2)', '4N3Đ: Bà Nà Hill - Cầu Vàng', 28, '/assets/tour_dom_28.jpg', 'domestic', 10),
(234, 'Cát Bà (2)', '3N2Đ: Vịnh Lan Hạ', 29, '/assets/tour_dom_29.jpg', 'domestic', 7),
(235, 'Tuy Hòa', '3N2Đ: Ghềnh Đá Đĩa', 30, '/assets/tour_dom_30.jpg', 'domestic', 7),
(236, 'Thái Lan', '5N4Đ: Xứ sở Chùa Vàng', 31, '/assets/tour_int_1.jpg', 'international', 7),
(237, 'Singapore - Malaysia', '6N5Đ: Hai kỳ quan Đông Nam Á', 32, '/assets/tour_int_2.jpg', 'international', 10),
(238, 'Hàn Quốc', '5N4Đ: Mùa đông lãng mạn', 33, '/assets/tour_int_3.jpg', 'international', 9),
(239, 'Nhật Bản', '7N6Đ: Hiện đại và Truyền thống', 34, '/assets/tour_int_4.jpg', 'international', 9),
(240, 'Châu Âu', '10N9Đ: Di sản và Lãng mạn', 35, '/assets/tour_int_5.jpg', 'international', 9),
(241, 'Úc', '7N6Đ: Khám phá xứ sở Kangaroo', 36, '/assets/tour_int_6.jpg', 'international', 10),
(242, 'Mỹ', '8N7Đ: New York - Washington D.C', 37, '/assets/tour_int_7.jpg', 'international', 10),
(243, 'Dubai', '5N4Đ: Xa hoa và Sa mạc', 38, '/assets/tour_int_8.jpg', 'international', 10),
(244, 'Maldives', '4N3Đ: Thiên đường nghỉ dưỡng', 39, '/assets/tour_int_9.jpg', 'international', 7),
(245, 'Campuchia', '4N3Đ: Bí ẩn của Đế chế Khmer', 40, '/assets/tour_int_10.jpg', 'international', 9),
(246, 'Trung Quốc', '7N6Đ: Cổ kính và Hiện đại', 41, '/assets/tour_int_11.jpg', 'international', 9),
(247, 'Đài Loan', '5N4Đ: Khám phá hòn đảo xinh đẹp', 42, '/assets/tour_int_12.jpg', 'international', 10),
(248, 'Bhutan', '6N5Đ: Vương quốc hạnh phúc', 43, '/assets/tour_int_13.jpg', 'international', 8),
(249, 'Ai Cập', '7N6Đ: Kim tự tháp và Sông Nile', 44, '/assets/tour_int_14.jpg', 'international', 9),
(250, 'Canada', '7N6Đ: Thiên nhiên hùng vĩ', 45, '/assets/tour_int_15.jpg', 'international', 8),
(251, 'Bali', '5N4Đ: Đảo ngọc Văn hóa', 46, '/assets/tour_int_16.jpg', 'international', 7),
(252, 'Thổ Nhĩ Kỳ', '8N7Đ: Khinh khí cầu Cappadocia', 47, '/assets/tour_int_17.jpg', 'international', 9),
(253, 'Nga', '7N6Đ: Dấu ấn Sa hoàng', 48, '/assets/tour_int_18.jpg', 'international', 9),
(254, 'Hy Lạp', '8N7Đ: Thiên đường lãng mạn', 49, '/assets/tour_int_19.jpg', 'international', 7),
(255, 'Hồng Kông', '4N3Đ: Hai trung tâm giải trí', 50, '/assets/tour_int_20.jpg', 'international', 10),
(256, 'Úc (2)', '7N6Đ: Khám phá xứ sở Kangaroo', 51, '/assets/tour_int_6.jpg', 'international', 10),
(257, 'Mỹ (2)', '8N7Đ: New York - Washington D.C', 52, '/assets/tour_int_7.jpg', 'international', 10),
(258, 'Dubai (2)', '5N4Đ: Xa hoa và Sa mạc', 53, '/assets/tour_int_8.jpg', 'international', 10),
(259, 'Maldives (2)', '4N3Đ: Thiên đường nghỉ dưỡng', 54, '/assets/tour_int_9.jpg', 'international', 7),
(260, 'Campuchia (2)', '4N3Đ: Bí ẩn của Đế chế Khmer', 55, '/assets/tour_int_10.jpg', 'international', 9),
(261, 'Hà Nội - Hạ Long', '4N3Đ: Thủ đô và Kỳ quan', 1, '/assets/tour_domestic_1.jpg', 'domestic', 7),
(262, 'Đà Nẵng - Hội An - Huế', '5N4Đ: Hành trình Di sản Miền Trung', 2, '/assets/tour_domestic_2.jpg', 'domestic', 9),
(263, 'Sài Gòn - Miền Tây', '3N2Đ: Khám phá sông nước Nam Bộ', 3, '/assets/tour_domestic_3.jpg', 'domestic', 10),
(264, 'Nha Trang - Đà Lạt', '5N4Đ: Biển và Hoa', 4, '/assets/tour_domestic_4.jpg', 'domestic', 7),
(265, 'Phú Quốc', '4N3Đ: Đảo Ngọc - Thiên đường biển', 5, '/assets/tour_domestic_5.jpg', 'domestic', 7),
(266, 'Tây Bắc - Sapa', '4N3Đ: Chinh phục Fansipan', 6, '/assets/tour_domestic_6.jpg', 'domestic', 8),
(267, 'Hà Giang', '4N3Đ: Cung đường Hạnh Phúc', 7, '/assets/tour_domestic_7.jpg', 'domestic', 8),
(268, 'Quy Nhơn - Phú Yên', '4N3Đ: Xứ Nẫu hoang sơ', 8, '/assets/tour_domestic_8.jpg', 'domestic', 7),
(269, 'Côn Đảo', '3N2Đ: Lịch sử và biển đảo', 9, '/assets/tour_domestic_9.jpg', 'domestic', 7),
(270, 'Cà Mau', '4N3Đ: Đất Mũi - Cực Nam Tổ Quốc', 10, '/assets/tour_domestic_10.jpg', 'domestic', 9),
(271, 'Vũng Tàu', '2N1Đ: Nghỉ dưỡng cuối tuần', 11, '/assets/tour_domestic_11.jpg', 'domestic', 10),
(272, 'Ninh Bình', '2N1Đ: Hạ Long trên cạn', 12, '/assets/tour_domestic_12.jpg', 'domestic', 9),
(273, 'Quảng Bình', '3N2Đ: Vương quốc hang động', 13, '/assets/tour_domestic_13.jpg', 'domestic', 9),
(274, 'Buôn Ma Thuột', '3N2Đ: Cà phê và Đại Ngàn', 14, '/assets/tour_domestic_14.jpg', 'domestic', 8),
(275, 'Bình Hưng - Vĩnh Hy', '3N2Đ: Thiên đường biển ẩn mình', 15, '/assets/tour_domestic_15.jpg', 'domestic', 7),
(276, 'Lý Sơn', '3N2Đ: Đảo núi lửa độc đáo', 16, '/assets/tour_domestic_16.jpg', 'domestic', 7),
(277, 'Mộc Châu', '3N2Đ: Cao nguyên chè xanh', 17, '/assets/tour_domestic_17.jpg', 'domestic', 8),
(278, 'Hồ Ba Bể', '3N2Đ: Hồ nước ngọt kỳ vĩ', 18, '/assets/tour_domestic_18.jpg', 'domestic', 8),
(279, 'Cát Bà', '3N2Đ: Vịnh Lan Hạ - Đảo Ngọc', 19, '/assets/tour_domestic_19.jpg', 'domestic', 7),
(280, 'Đồng Tháp', '3N2Đ: Xứ sở hoa và di tích', 20, '/assets/tour_domestic_20.jpg', 'domestic', 10),
(281, 'Phú Yên', '3N2Đ: Xứ sở Hoa vàng cỏ xanh', 21, '/assets/tour_dom_21.jpg', 'domestic', 7),
(282, 'Sa Pa (2)', '3N2Đ: Trekking Bản Cát Cát', 22, '/assets/tour_dom_22.jpg', 'domestic', 8),
(283, 'Cần Thơ', '4N3Đ: Trải nghiệm chợ nổi Cái Răng', 23, '/assets/tour_dom_23.jpg', 'domestic', 9),
(284, 'Vịnh Hạ Long (2)', '2N1Đ: Ngủ đêm trên Du thuyền', 24, '/assets/tour_dom_24.jpg', 'domestic', 7),
(285, 'Tây Nguyên (2)', '3N2Đ: Văn hóa Cồng chiêng', 25, '/assets/tour_dom_25.jpg', 'domestic', 8),
(286, 'Hà Nội City (2)', '1 Ngày: Văn Miếu - Hồ Gươm', 26, '/assets/tour_dom_26.jpg', 'domestic', 10),
(287, 'Ninh Bình (2)', '2N1Đ: Hoa Lư - Tam Cốc', 27, '/assets/tour_dom_27.jpg', 'domestic', 9),
(288, 'Đà Nẵng (2)', '4N3Đ: Bà Nà Hill - Cầu Vàng', 28, '/assets/tour_dom_28.jpg', 'domestic', 10),
(289, 'Cát Bà (2)', '3N2Đ: Vịnh Lan Hạ', 29, '/assets/tour_dom_29.jpg', 'domestic', 7),
(290, 'Tuy Hòa', '3N2Đ: Ghềnh Đá Đĩa', 30, '/assets/tour_dom_30.jpg', 'domestic', 7),
(291, 'Thái Lan', '5N4Đ: Xứ sở Chùa Vàng', 31, '/assets/tour_int_1.jpg', 'international', 7),
(292, 'Singapore - Malaysia', '6N5Đ: Hai kỳ quan Đông Nam Á', 32, '/assets/tour_int_2.jpg', 'international', 10),
(293, 'Hàn Quốc', '5N4Đ: Mùa đông lãng mạn', 33, '/assets/tour_int_3.jpg', 'international', 9),
(294, 'Nhật Bản', '7N6Đ: Hiện đại và Truyền thống', 34, '/assets/tour_int_4.jpg', 'international', 9),
(295, 'Châu Âu', '10N9Đ: Di sản và Lãng mạn', 35, '/assets/tour_int_5.jpg', 'international', 9),
(296, 'Úc', '7N6Đ: Khám phá xứ sở Kangaroo', 36, '/assets/tour_int_6.jpg', 'international', 10),
(297, 'Mỹ', '8N7Đ: New York - Washington D.C', 37, '/assets/tour_int_7.jpg', 'international', 10),
(298, 'Dubai', '5N4Đ: Xa hoa và Sa mạc', 38, '/assets/tour_int_8.jpg', 'international', 10),
(299, 'Maldives', '4N3Đ: Thiên đường nghỉ dưỡng', 39, '/assets/tour_int_9.jpg', 'international', 7),
(300, 'Campuchia', '4N3Đ: Bí ẩn của Đế chế Khmer', 40, '/assets/tour_int_10.jpg', 'international', 9),
(301, 'Trung Quốc', '7N6Đ: Cổ kính và Hiện đại', 41, '/assets/tour_int_11.jpg', 'international', 9),
(302, 'Đài Loan', '5N4Đ: Khám phá hòn đảo xinh đẹp', 42, '/assets/tour_int_12.jpg', 'international', 10),
(303, 'Bhutan', '6N5Đ: Vương quốc hạnh phúc', 43, '/assets/tour_int_13.jpg', 'international', 8),
(304, 'Ai Cập', '7N6Đ: Kim tự tháp và Sông Nile', 44, '/assets/tour_int_14.jpg', 'international', 9),
(305, 'Canada', '7N6Đ: Thiên nhiên hùng vĩ', 45, '/assets/tour_int_15.jpg', 'international', 8),
(306, 'Bali', '5N4Đ: Đảo ngọc Văn hóa', 46, '/assets/tour_int_16.jpg', 'international', 7),
(307, 'Thổ Nhĩ Kỳ', '8N7Đ: Khinh khí cầu Cappadocia', 47, '/assets/tour_int_17.jpg', 'international', 9),
(308, 'Nga', '7N6Đ: Dấu ấn Sa hoàng', 48, '/assets/tour_int_18.jpg', 'international', 9),
(309, 'Hy Lạp', '8N7Đ: Thiên đường lãng mạn', 49, '/assets/tour_int_19.jpg', 'international', 7),
(310, 'Hồng Kông', '4N3Đ: Hai trung tâm giải trí', 50, '/assets/tour_int_20.jpg', 'international', 10),
(311, 'Úc (2)', '7N6Đ: Khám phá xứ sở Kangaroo', 51, '/assets/tour_int_6.jpg', 'international', 10),
(312, 'Mỹ (2)', '8N7Đ: New York - Washington D.C', 52, '/assets/tour_int_7.jpg', 'international', 10),
(313, 'Dubai (2)', '5N4Đ: Xa hoa và Sa mạc', 53, '/assets/tour_int_8.jpg', 'international', 10),
(314, 'Maldives (2)', '4N3Đ: Thiên đường nghỉ dưỡng', 54, '/assets/tour_int_9.jpg', 'international', 7),
(315, 'Campuchia (2)', '4N3Đ: Bí ẩn của Đế chế Khmer', 55, '/assets/tour_int_10.jpg', 'international', 9);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tourcategory`
--

CREATE TABLE `tourcategory` (
  `id` int(11) NOT NULL,
  `tourCategoryName` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tourcategory`
--

INSERT INTO `tourcategory` (`id`, `tourCategoryName`, `description`) VALUES
(1, 'Tour Trong Nước', 'Các chuyến du lịch khám phá vẻ đẹp Việt Nam'),
(2, 'Tour Nước Ngoài', 'Các chuyến du lịch quốc tế và khám phá thế giới'),
(7, 'Tour Biển Đảo', 'Các tour nghỉ dưỡng, khám phá các bãi biển và hải đảo nổi tiếng.'),
(8, 'Tour Núi Rừng & Trekking', 'Các tour khám phá miền núi, cao nguyên, trekking và trải nghiệm văn hóa bản địa.'),
(9, 'Tour Di Sản & Văn Hóa', 'Các tour tham quan các di sản văn hóa thế giới, di tích lịch sử và trung tâm tâm linh.'),
(10, 'Tour Thành Phố & Giải Trí', 'Các tour khám phá đô thị sầm uất, mua sắm và khu vui chơi giải trí hiện đại.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tourdestination`
--

CREATE TABLE `tourdestination` (
  `placeId` int(11) NOT NULL,
  `tourId` int(11) NOT NULL,
  `order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tourdestination`
--

INSERT INTO `tourdestination` (`placeId`, `tourId`, `order`) VALUES
(1, 206, 1),
(6, 206, 2),
(3, 207, 3),
(7, 207, 4),
(2, 208, 5),
(4, 209, 6),
(5, 209, 7),
(8, 210, 8),
(9, 211, 9),
(10, 212, 10),
(11, 213, 11),
(12, 214, 12),
(13, 215, 13),
(14, 216, 14),
(15, 217, 15),
(16, 218, 16),
(17, 219, 17),
(4, 220, 18),
(18, 221, 19),
(19, 222, 20),
(20, 223, 21),
(21, 224, 22),
(22, 225, 23),
(43, 226, 24),
(9, 227, 25),
(44, 228, 26),
(6, 229, 27),
(17, 230, 28),
(1, 231, 29),
(15, 232, 30),
(3, 233, 31),
(21, 234, 32),
(45, 235, 33),
(23, 236, 34),
(24, 237, 35),
(25, 238, 36),
(26, 239, 37),
(27, 240, 38),
(28, 241, 39),
(29, 242, 40),
(30, 243, 41),
(31, 244, 42),
(32, 245, 43),
(33, 246, 44),
(34, 247, 45),
(35, 248, 46),
(36, 249, 47),
(37, 250, 48),
(38, 251, 49),
(39, 252, 50),
(40, 253, 51),
(41, 254, 52),
(42, 255, 53),
(28, 256, 54),
(29, 257, 55),
(30, 258, 56),
(31, 259, 57),
(32, 260, 58);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `touritinerary`
--

CREATE TABLE `touritinerary` (
  `id` int(11) NOT NULL,
  `availableSeat` int(11) DEFAULT NULL,
  `departureDate` date DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `durationDays` int(11) DEFAULT NULL,
  `durationNights` int(11) DEFAULT NULL,
  `tourId` int(11) DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `touritinerary`
--

INSERT INTO `touritinerary` (`id`, `availableSeat`, `departureDate`, `price`, `durationDays`, `durationNights`, `tourId`, `discount_price`) VALUES
(1, 25, '2026-04-01', 5900000.00, 4, 3, 206, 5500000.00),
(2, 30, '2026-05-10', 4500000.00, 5, 4, 207, 4200000.00),
(3, 40, '2026-03-20', 3200000.00, 3, 2, 208, NULL),
(4, 28, '2026-06-05', 6800000.00, 5, 4, 209, 6500000.00),
(5, 35, '2026-07-01', 7500000.00, 4, 3, 210, 7200000.00),
(6, 15, '2026-10-15', 8900000.00, 4, 3, 211, NULL),
(7, 12, '2026-09-20', 7900000.00, 4, 3, 212, NULL),
(8, 22, '2026-08-01', 5200000.00, 4, 3, 213, 4950000.00),
(9, 18, '2026-05-25', 9500000.00, 3, 2, 214, 8900000.00),
(10, 10, '2026-11-05', 6100000.00, 4, 3, 215, NULL),
(11, 35, '2026-03-05', 2100000.00, 2, 1, 216, 1990000.00),
(12, 25, '2026-04-15', 3800000.00, 2, 1, 217, 3500000.00),
(13, 20, '2026-05-20', 4900000.00, 3, 2, 218, 4500000.00),
(14, 15, '2026-06-10', 5600000.00, 3, 2, 219, NULL),
(15, 28, '2026-07-01', 4100000.00, 3, 2, 220, 3850000.00),
(16, 18, '2026-08-10', 4500000.00, 3, 2, 221, NULL),
(17, 12, '2026-09-05', 3900000.00, 3, 2, 222, 3500000.00),
(18, 10, '2026-10-20', 4700000.00, 3, 2, 223, NULL),
(19, 22, '2026-11-15', 4200000.00, 3, 2, 224, 3990000.00),
(20, 30, '2026-12-01', 3500000.00, 3, 2, 225, 3150000.00),
(21, 20, '2026-05-15', 5500000.00, 3, 2, 226, 4990000.00),
(22, 15, '2026-11-01', 4200000.00, 3, 2, 227, 3900000.00),
(23, 30, '2026-06-05', 6500000.00, 4, 3, 228, 5850000.00),
(24, 10, '2026-04-20', 8900000.00, 2, 1, 229, 8000000.00),
(25, 18, '2026-12-10', 5800000.00, 3, 2, 230, 5200000.00),
(26, 40, '2026-03-01', 1200000.00, 1, 0, 231, NULL),
(27, 25, '2026-04-10', 3800000.00, 2, 1, 232, 3500000.00),
(28, 20, '2026-07-07', 7900000.00, 4, 3, 233, NULL),
(29, 15, '2026-08-20', 6800000.00, 3, 2, 234, 6200000.00),
(30, 22, '2026-05-25', 5100000.00, 3, 2, 235, 4590000.00),
(31, 15, '2026-03-01', 12500000.00, 5, 4, 236, 11900000.00),
(32, 10, '2026-04-05', 18900000.00, 6, 5, 237, NULL),
(33, 12, '2026-05-15', 25000000.00, 5, 4, 238, 23500000.00),
(34, 8, '2026-06-20', 39500000.00, 7, 6, 239, NULL),
(35, 7, '2026-07-10', 75000000.00, 10, 9, 240, 69900000.00),
(36, 12, '2026-09-01', 58000000.00, 7, 6, 241, NULL),
(37, 7, '2026-10-20', 79500000.00, 8, 7, 242, NULL),
(38, 15, '2026-03-30', 29900000.00, 5, 4, 243, 25000000.00),
(39, 20, '2026-06-10', 35500000.00, 4, 3, 244, 32000000.00),
(40, 25, '2026-04-01', 9900000.00, 4, 3, 245, NULL),
(41, 10, '2026-05-25', 28000000.00, 7, 6, 246, 25500000.00),
(42, 18, '2026-03-15', 14500000.00, 5, 4, 247, NULL),
(43, 8, '2026-11-05', 62000000.00, 6, 5, 248, 59000000.00),
(44, 10, '2026-12-01', 49000000.00, 7, 6, 249, 45000000.00),
(45, 5, '2026-07-20', 85000000.00, 7, 6, 250, NULL),
(46, 22, '2026-05-05', 16800000.00, 5, 4, 251, 15500000.00),
(47, 15, '2026-09-15', 38000000.00, 8, 7, 252, NULL),
(48, 10, '2026-10-01', 65000000.00, 7, 6, 253, 60000000.00),
(49, 12, '2026-06-25', 42000000.00, 8, 7, 254, 39500000.00),
(50, 20, '2026-04-10', 11900000.00, 4, 3, 255, 10800000.00),
(51, 10, '2026-09-01', 58000000.00, 7, 6, 256, 55000000.00),
(52, 5, '2026-10-20', 79500000.00, 8, 7, 257, 75000000.00),
(53, 12, '2026-03-30', 29900000.00, 5, 4, 258, 27500000.00),
(54, 15, '2026-06-10', 35500000.00, 4, 3, 259, 33000000.00),
(55, 20, '2026-04-01', 9900000.00, 4, 3, 260, 9500000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `paymentInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentInfo`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `role`, `fullName`, `avatarUrl`, `email`, `phone`, `dateOfBirth`, `password`, `isActive`, `createdAt`, `updatedAt`, `paymentInfo`) VALUES
(1, 'admin', 'Quản Trị Viên', NULL, 'admin@bktours.com', NULL, NULL, '$2a$10$nhWjT1Wp.l0WpYt2sX4g5uB6i/XwS0Yh9V2A5G7M4mE', 1, '2025-12-04 16:11:33', '2025-12-04 16:11:46', NULL),
(4, 'user', 'Nguyen Van B', NULL, 'test@gmail.com', '0900000000', '2004-01-01', '$2y$10$0RL3jS9IMTH7TEZ5Zto1COTvr2tr2oFQtu1/o56klLLYMcbDUBME6', 1, '2025-12-03 11:58:01', '2025-12-03 21:43:37', '{\"paymentMethod\":\"card\",\"card\":{\"cardNumber\":\"1234123412341234\",\"cardHolder\":\"nguyen van b\",\"expiryDate\":\"12\\/26\"}}');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bannerhomepage`
--
ALTER TABLE `bannerhomepage`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`userId`,`tourId`),
  ADD KEY `tourId` (`tourId`);

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `tourId` (`tourId`);

--
-- Chỉ mục cho bảng `companyinfo`
--
ALTER TABLE `companyinfo`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contactmessages`
--
ALTER TABLE `contactmessages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userCreatedId` (`userCreatedId`),
  ADD KEY `userRepliedId` (`userRepliedId`);

--
-- Chỉ mục cho bảng `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `buttonPageId` (`buttonPageId`);

--
-- Chỉ mục cho bảng `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`);

--
-- Chỉ mục cho bảng `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companyInfoId` (`companyInfoId`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Chỉ mục cho bảng `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order` (`order`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `tour`
--
ALTER TABLE `tour`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Chỉ mục cho bảng `tourcategory`
--
ALTER TABLE `tourcategory`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tourdestination`
--
ALTER TABLE `tourdestination`
  ADD PRIMARY KEY (`placeId`,`tourId`),
  ADD UNIQUE KEY `order` (`order`),
  ADD KEY `tourId` (`tourId`);

--
-- Chỉ mục cho bảng `touritinerary`
--
ALTER TABLE `touritinerary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tourId` (`tourId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bannerhomepage`
--
ALTER TABLE `bannerhomepage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `companyinfo`
--
ALTER TABLE `companyinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `contactmessages`
--
ALTER TABLE `contactmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `page`
--
ALTER TABLE `page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `place`
--
ALTER TABLE `place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT cho bảng `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tour`
--
ALTER TABLE `tour`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=316;

--
-- AUTO_INCREMENT cho bảng `tourcategory`
--
ALTER TABLE `tourcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `touritinerary`
--
ALTER TABLE `touritinerary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`tourId`) REFERENCES `tour` (`id`);

--
-- Các ràng buộc cho bảng `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`tourId`) REFERENCES `tour` (`id`);

--
-- Các ràng buộc cho bảng `contactmessages`
--
ALTER TABLE `contactmessages`
  ADD CONSTRAINT `contactmessages_ibfk_1` FOREIGN KEY (`userCreatedId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `contactmessages_ibfk_2` FOREIGN KEY (`userRepliedId`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_ibfk_2` FOREIGN KEY (`buttonPageId`) REFERENCES `page` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `post` (`id`);

--
-- Các ràng buộc cho bảng `place`
--
ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`companyInfoId`) REFERENCES `companyinfo` (`id`);

--
-- Các ràng buộc cho bảng `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `section_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `tourcategory` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `tour`
--
ALTER TABLE `tour`
  ADD CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `tour_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `tourcategory` (`id`);

--
-- Các ràng buộc cho bảng `tourdestination`
--
ALTER TABLE `tourdestination`
  ADD CONSTRAINT `tourdestination_ibfk_1` FOREIGN KEY (`placeId`) REFERENCES `place` (`id`),
  ADD CONSTRAINT `tourdestination_ibfk_2` FOREIGN KEY (`tourId`) REFERENCES `tour` (`id`);

--
-- Các ràng buộc cho bảng `touritinerary`
--
ALTER TABLE `touritinerary`
  ADD CONSTRAINT `touritinerary_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tour` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

    company_name VARCHAR(255) NOT NULL,
    slogan VARCHAR(255),
    logo_url VARCHAR(500),
    address VARCHAR(255),
    email VARCHAR(150),
    hotline VARCHAR(50),
    facebook_link VARCHAR(255),
    instagram_link VARCHAR(255)
);

-- Bảng BannerHomePage
CREATE TABLE BannerHomePage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    dayStart DATE,
    dayEnd DATE
);

-- -----------------------------------------------------
-- BẢNG PHỤ THUỘC
-- -----------------------------------------------------

-- Bảng Post
CREATE TABLE Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    title VARCHAR(255),
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES User(id)
);

-- Bảng Media
CREATE TABLE Media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    type VARCHAR(50),
    postId INT,
    FOREIGN KEY (postId) REFERENCES Post(id)
);

-- Bảng Tour
CREATE TABLE Tour (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    shortDescription TEXT,
    postId INT,
    thumbnailUrl VARCHAR(255),
    tourType VARCHAR(100),
    categoryId INT,
    FOREIGN KEY (postId) REFERENCES Post(id),
    FOREIGN KEY (categoryId) REFERENCES TourCategory(id)
);

-- Bảng TourItinerary
CREATE TABLE TourItinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    availableSeat INT,
    departureDate DATE,
    price DECIMAL(10,2),
    durationDays INT,
    durationNights INT,
    tourId INT,
    FOREIGN KEY (tourId) REFERENCES Tour(id)
);

-- Bảng Place
CREATE TABLE Place (
	id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100),
    companyInfoId INT,
    FOREIGN KEY (companyInfoId) REFERENCES CompanyInfo(id)
);

-- Bảng TourDestination
CREATE TABLE TourDestination(
	placeId INT,
    tourId INT,
    `order` INT UNIQUE,
    PRIMARY KEY(placeId, tourId),
    FOREIGN KEY (placeId) REFERENCES Place(id),
    FOREIGN KEY (tourId) REFERENCES Tour(id)
);

-- Bảng Booking
CREATE TABLE Booking (
    userId INT,
    tourId INT,
    totalCost DECIMAL(10,2),
    numberOfChild INT,
    numberOfAdult INT,
    status VARCHAR(50),
    PRIMARY KEY (userId, tourId),
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (tourId) REFERENCES Tour(id)
);

-- Bảng Comment  (tham chiếu Tour)
CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    tourId INT,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (tourId) REFERENCES Tour(id)
);

-- Bảng Section
CREATE TABLE Section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    category_id INT,
    type VARCHAR(100),
    `order` INT UNIQUE,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    background_color VARCHAR(50),
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES TourCategory(id) ON DELETE SET NULL
);

-- Bảng Item
CREATE TABLE Item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    icon VARCHAR(255),
    title VARCHAR(255),
    buttonText VARCHAR(255),
    buttonPageId INT,
    subtitle VARCHAR(255),
    imageUrl VARCHAR(255),
    `desc` TEXT,
    color VARCHAR(50),
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE,
    FOREIGN KEY (buttonPageId) REFERENCES Page(id) ON DELETE SET NULL
);

-- Bảng Contact Messages
CREATE TABLE ContactMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userCreatedId INT,
  userRepliedId INT,
  repliedMsg TEXT,
  isRead ENUM('unread', 'read') DEFAULT 'unread',
  isReplied ENUM('unreplied', 'replied') DEFAULT 'unreplied',
  FOREIGN KEY (userCreatedId) REFERENCES User(id),
  FOREIGN KEY (userRepliedId) REFERENCES User(id)
);

-- -----------------------------------------------------
-- DỮ LIỆU MẪU BAN ĐẦU
-- -----------------------------------------------------

INSERT INTO Page (name, description) VALUES ('LandingPage', 'Trang chủ của BK Tours');

INSERT INTO Section (page_id, type, `order`, title)
VALUES (1, 'why_choose_us', 1, 'Tại sao nên chọn BKTours');

INSERT INTO Section 
(page_id, type, `order`, title, subtitle, background_color, image_url)
VALUES
(1, 'content_type_one', 2, 'Get Your Favourite Resort Bookings', 'Fast & Easy',
 '#d0d0d042',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=800');

INSERT INTO Section (page_id, type, `order`)
VALUES (1, 'content_type_two', 3);

INSERT INTO Item (section_id, icon, title, `desc`)
VALUES
(1, 'confirmation', 'Ultimate flexibility', 'You''re in control...'),
(1, 'lightbulb', 'Memorable experiences', 'Browse and book...'),
(1, 'diamond', 'Quality at our core', 'High-quality standards...'),
(1, 'medal', 'Award-winning support', 'We''re here to help...');

INSERT INTO Item (section_id, icon, title, `desc`, color)
VALUES
(2, '📍', 'Choose Destination', 'Lorem ipsum...', '#FFB800'),
(2, '📅', 'Check Availability', 'Lorem ipsum...', '#FF6B4A'),
(2, '🚗', 'Let''s Go', 'Lorem ipsum...', '#1B7B8F');

INSERT INTO Item (section_id, title, imageUrl, buttonText)
VALUES
(3, 'Enjoy 5-Star Comfort', '/assets/hotel1.jpg', 'Explore Now'),
(3, 'Discover The Wild', '/assets/hotel2.jpg', 'Book Trip');

INSERT INTO Section (
  page_id, type, `order`,
  title, subtitle, description,
  background_color, image_url
)
VALUES (
  1, 'content_type_three', 4,
  'We Provide You Best Europe Sightseeing Tours',
  'PROMOTION',
  'Et labore harum non nobis ipsum eum molestias...',
  '#ffffff',
  'https://example.com/images/eiffel-tower.jpg'
);

INSERT INTO ContactMessages 
(fullName, title, email, phone, message, createdAt, isRead, isReplied)
VALUES
('Nguyễn Văn A', 'Hỏi về tour Đà Lạt', 'vana@example.com', '0901234567', 'Tôi muốn biết giá tour Đà Lạt 3 ngày 2 đêm.', NOW(), 'unread', 'unreplied'),
('Trần Thị B', 'Thắc mắc thanh toán', 'thib@example.com', '0912345678', 'Tôi đã thanh toán nhưng không nhận được email xác nhận.', NOW(), 'unread', 'unreplied'),
('Lê Minh C', 'Yêu cầu hoàn tiền', 'minhc@example.com', '0987654321', 'Tôi muốn yêu cầu hoàn tiền cho tour Nha Trang.', NOW(), 'unread', 'unreplied');

INSERT INTO CompanyInfo (company_name, slogan, logo_url, address, email, hotline, facebook_link, instagram_link)
VALUES 
('Viatours', 'Khám phá thế giới cùng chúng tôi',
 'https://example.com/logo.png',
 '123 Nguyễn Hữu Cảnh, TP.HCM',
 'contact@viatours.com', '1900-1000',
 'https://facebook.com/viatours',
 'https://instagram.com/viatours');

INSERT INTO Place (city, province, country, companyInfoId)
VALUES 
('Hà Nội', 'Hà Nội', 'Việt Nam', 1),
('TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Việt Nam', 1),
('Đà Nẵng', 'Đà Nẵng', 'Việt Nam', 1),
('Nha Trang', 'Khánh Hòa', 'Việt Nam', 1),
('Đà Lạt', 'Lâm Đồng', 'Việt Nam', 1);