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

-- Bảng BannerHomePage
CREATE TABLE BannerHomePage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    dayStart DATE,
    dayEnd DATE
);

-- Bảng TourCategory
CREATE TABLE TourCategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tourCategoryName VARCHAR(100),
    description TEXT
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

-- Bảng Tour Destination
CREATE TABLE TourDestination(
	placeId INT,
    tourId INT,
    `order` Int UNIQUE,
    FOREIGN KEY (placeId) REFERENCES Place(id),
    FOREIGN KEY (tourId) REFERENCES Tour(id),
    PRIMARY KEY(placeId, tourId)
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

-- Bảng Comment
CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    tourId INT,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (tourId) REFERENCES TourItinerary(id)
);


CREATE TABLE Page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

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
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE
    FOREIGN KEY (category_id) REFERENCES TourCategory(id) ON DELETE SET NULL
);

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

CREATE TABLE CompanyInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    slogan VARCHAR(255),
    logo_url VARCHAR(500),
    address VARCHAR(255),
    email VARCHAR(150),
    hotline VARCHAR(50),
    facebook_link VARCHAR(255),
    instagram_link VARCHAR(255)
);

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

INSERT INTO Page (name, description) VALUES ('LandingPage', 'Trang chủ của BK Tours');
-- SECTION 1: why_choose_us
INSERT INTO Section 
(page_id, type, `order`, title, subtitle, description, background_color, image_url)
VALUES
(1, 'why_choose_us', 1, 'Tại sao nên chọn BKTours', NULL, NULL, NULL, NULL);

-- SECTION 2: content_type_one
INSERT INTO Section 
(page_id, type, `order`, title, subtitle, description, background_color, image_url)
VALUES
(1, 'content_type_one', 2, 'Get Your Favourite Resort Bookings', 'Fast & Easy', NULL, '#d0d0d042',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=800');

-- SECTION 3: content_type_two
INSERT INTO Section 
(page_id, type, `order`, title, subtitle, description, background_color, image_url)
VALUES
(1, 'content_type_two', 3, NULL, NULL, NULL, NULL, NULL);

INSERT INTO Item (section_id, icon, title, `desc`, imageUrl, buttonText, color)
VALUES
(1, 'confirmation', 'Ultimate flexibility', 'You''re in control...', NULL, NULL, NULL),
(1, 'lightbulb', 'Memorable experiences', 'Browse and book...', NULL, NULL, NULL),
(1, 'diamond', 'Quality at our core', 'High-quality standards...', NULL, NULL, NULL),
(1, 'medal', 'Award-winning support', 'We''re here to help...', NULL, NULL, NULL);

INSERT INTO Item (section_id, icon, title, `desc`, imageUrl, buttonText, color)
VALUES
(2, '📍', 'Choose Destination', 'Lorem ipsum...', NULL, NULL, '#FFB800'),
(2, '📅', 'Check Availability', 'Lorem ipsum...', NULL, NULL, '#FF6B4A'),
(2, '🚗', 'Let''s Go', 'Lorem ipsum...', NULL, NULL, '#1B7B8F');

INSERT INTO Item (section_id, icon, title, `desc`, imageUrl, buttonText, color)
VALUES
(3, NULL, 'Enjoy 5-Star Comfort', NULL, '/assets/hotel1.jpg', 'Explore Now', NULL),
(3, NULL, 'Discover The Wild', NULL, '/assets/hotel2.jpg', 'Book Trip', NULL);

INSERT INTO Section (
  page_id, type, `order`,
  title, subtitle, description,
  background_color, image_url
)
VALUES (
  1, 'content_type_three', 4,
  'We Provide You Best Europe Sightseeing Tours',
  'PROMOTION',
  'Et labore harum non nobis ipsum eum molestias mollitia et corporis praesentium a laudantium internos. Non quis eius quo eligendi corrupti et fugiat nulla qui soluta recusandae in maxime quasi aut ducimus illum aut optio quibusdam!',
  '#ffffff',
  'https://example.com/images/eiffel-tower.jpg'
);

-- Adding Contact Message
INSERT INTO ContactMessages 
(fullName, title, email, phone, message, createdAt, userCreatedId, userRepliedId, repliedMsg, isRead, isReplied) 
VALUES
('Nguyễn Văn A', 'Hỏi về tour Đà Lạt', 'vana@example.com', '0901234567', 'Tôi muốn biết giá tour Đà Lạt 3 ngày 2 đêm.', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Trần Thị B', 'Thắc mắc thanh toán', 'thib@example.com', '0912345678', 'Tôi đã thanh toán nhưng không nhận được email xác nhận.', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Lê Minh C', 'Yêu cầu hoàn tiền', 'minhc@example.com', '0987654321', 'Tôi muốn yêu cầu hoàn tiền cho tour Nha Trang.', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Phạm Thị D', 'Vấn đề khi đăng ký tour', 'thid@example.com', '0971234567', 'Không đăng ký được tour Phú Quốc.', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Hoàng Văn E', 'Hỏi về lịch trình tour Hà Giang', 'vane@example.com', '0939876543', 'Cho tôi xin lịch trình tour Hà Giang 4 ngày 3 đêm.', NOW(), NULL, NULL, NULL, 'read', 'unreplied'),

('Đỗ Thị F', 'Hợp đồng và điều khoản', 'thif@example.com', '0962223344', 'Tôi muốn xem bản hợp đồng mẫu.', NOW(), NULL, NULL, NULL, 'read', 'unreplied'),

('Võ Thành G', 'Giảm giá tour?', 'thanhg@example.com', '0909988776', 'Tour Sapa có đang giảm giá không?', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Trịnh Ngọc H', 'Thêm hành lý', 'ngoch@example.com', '0923344556', 'Tôi có thể mang theo thú cưng không?', NOW(), NULL, NULL, NULL, 'read', 'replied'),

('Ngô Đức I', 'Cần tư vấn gấp', 'duci@example.com', '0911888999', 'Tôi cần tư vấn tour trong tối nay.', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Huỳnh Văn J', 'Kiểm tra booking', 'vanj@example.com', '0945566778', 'Cho tôi kiểm tra mã booking 123456.', NOW(), NULL, NULL, NULL, 'read', 'replied'),

('Trần Mỹ K', 'Hỏi thời tiết Đà Nẵng', 'myk@example.com', '0903334445', 'Tuần sau thời tiết Đà Nẵng có mưa không?', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Phan Quốc L', 'Yêu cầu xuất hóa đơn', 'quocl@example.com', '0931112223', 'Tôi muốn xuất hóa đơn đỏ.', NOW(), NULL, NULL, NULL, 'read', 'unreplied'),

('Bùi Văn M', 'Đổi ngày khởi hành', 'vanm@example.com', '0956677889', 'Tôi muốn đổi ngày khởi hành tour Côn Đảo.', NOW(), NULL, NULL, NULL, 'read', 'unreplied'),

('Lưu Thị N', 'Trả góp', 'thin@example.com', '0983221144', 'Bên mình có hỗ trợ trả góp không?', NOW(), NULL, NULL, NULL, 'unread', 'unreplied'),

('Đặng Minh O', 'Thông tin xe đưa đón', 'minho@example.com', '0901223344', 'Xe đưa đón sẽ liên hệ trước bao lâu?', NOW(), NULL, NULL, NULL, 'read', 'unreplied');

