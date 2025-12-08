-- Add sample data for Tour overview and highlights
UPDATE Tour SET 
  overview = JSON_ARRAY(
    'Khám phá vẻ đẹp tuyệt vời của Hạ Long với những tảng đá vôi hùng vĩ',
    'Thăm Sapa - nơi có khí hậu mát mẻ và cảnh quan thiên nhiên hùng vĩ',
    'Trải nghiệm cuộc sống địa phương tại các làng dân tộc'
  ),
  highlights = JSON_ARRAY(
    'Vịnh Hạ Long - một trong 7 Kỳ quan Thiên nhiên mới của thế giới',
    'Ngủ trên tàu du lịch giữa Vịnh Hạ Long',
    'Trekking tại Sapa, Fansipan - nóc nhà Đông Dương',
    'Thăm làng dân tộc H\'Mông, Dao ở Sapa',
    'Tham quan Bảo tàng Hạ Long',
    'Trải nghiệm ẩm thực địa phương'
  )
WHERE id = 1;

UPDATE Tour SET 
  overview = JSON_ARRAY(
    'Khám phá thủ đô Singapore - quốc đảo hiện đại của Đông Nam Á',
    'Thăm các điểm du lịch nổi tiếng như Marina Bay Sands, Sentosa Island',
    'Trải nghiệm ẩm thực đa dạng từ nhiều nền văn hóa'
  ),
  highlights = JSON_ARRAY(
    'Chụp ảnh tại Marina Bay Sands với 3 bể bơi nổi tiếng',
    'Thăm vườn Bonsai Gardens và phụng cảnh Singapore',
    'Khám phá Sentosa Island - đảo giải trí',
    'Tham quan chợ đêm Geylang Serai',
    'Thưởng thức ẩm thực đường phố Singapore',
    'Trải nghiệm mua sắm tại orchard Road'
  )
WHERE id = 4;

-- Add tour services (included/excluded)
INSERT INTO TourService (tourId, item, type, isImportant) VALUES
-- Tour 1 included services
(1, 'Vé máy bay khứ hồi', 'included', true),
(1, 'Khách sạn 3-4 sao', 'included', true),
(1, 'Ăn sáng hàng ngày', 'included', true),
(1, 'Ăn trưa và tối (5 bữa)', 'included', true),
(1, 'Tàu du lịch Vịnh Hạ Long', 'included', true),
(1, 'Hướng dẫn viên tiếng Việt', 'included', false),
(1, 'Bảo hiểm du lịch', 'included', false),

-- Tour 1 excluded services
(1, 'Thị thực quốc tế', 'excluded', true),
(1, 'Chi phí cá nhân', 'excluded', false),
(1, 'Các tour tùy chọn thêm', 'excluded', false),

-- Tour 4 included services
(4, 'Vé máy bay khứ hồi', 'included', true),
(4, 'Khách sạn 4-5 sao', 'included', true),
(4, 'Ăn sáng hàng ngày', 'included', true),
(4, 'Ăn trưa và tối (4 bữa)', 'included', true),
(4, 'Vé vào cảnh khoảng Sentosa', 'included', true),
(4, 'Hướng dẫn viên tiếng Anh', 'included', false),
(4, 'Bảo hiểm du lịch', 'included', false),

-- Tour 4 excluded services
(4, 'Thị thực quốc tế', 'excluded', true),
(4, 'Nước uống ngoài dịch vụ', 'excluded', false),
(4, 'Chi phí cá nhân', 'excluded', false);
