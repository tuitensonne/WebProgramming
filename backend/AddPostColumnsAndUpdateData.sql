-- Add missing columns to Post table
ALTER TABLE Post 
ADD COLUMN description TEXT AFTER content,
ADD COLUMN readTime INT DEFAULT 5 AFTER createdAt,
ADD COLUMN location VARCHAR(255) AFTER type,
ADD COLUMN thumbnailUrl VARCHAR(255) AFTER location;
ADD COLUMN region VARCHAR(50) AFTER location;

UPDATE Post SET
    title = 'Hội An - Phố cổ nhuốm màu thời gian',
    description = 'Hội An là điểm đến thanh bình nơi thời gian dường như chậm lại, với những ngôi nhà mái ngói rêu phong, dòng sông Hoài thơ mộng và những chiếc đèn lồng rực rỡ mỗi khi đêm xuống. Bài viết mang đến hành trình khám phá ẩm thực địa phương, những góc sống ảo tuyệt đẹp và hoạt động đáng trải nghiệm nhất tại phố cổ.',
    content = 'Hội An không chỉ nổi tiếng bởi vẻ đẹp cổ kính mà còn bởi sự giao thoa độc đáo giữa văn hóa Việt – Hoa – Nhật. Dạo bước trên những con phố nhỏ, bạn sẽ bắt gặp những ngôi nhà mang lối kiến trúc hàng trăm năm tuổi, những quán cà phê hoài niệm và những tiệm may truyền thống. Buổi tối, cả phố cổ bừng sáng với hàng trăm chiếc đèn lồng thắp sáng bên dòng sông Hoài. Ngoài việc khám phá ẩm thực như cao lầu, cơm gà bà Buội, bạn còn có thể tham gia chèo thuyền, thả hoa đăng hoặc ghé làng gốm Thanh Hà và làng rau Trà Quế.',
    readTime = 7,
    location = 'Hội An, Việt Nam',
    region = 'vietnam'
WHERE id = 5;

UPDATE Post SET
    title = 'Sa Pa – Hành trình săn mây giữa đại ngàn',
    description = 'Sa Pa là điểm đến lý tưởng cho những ai yêu thích thiên nhiên và muốn tìm cảm giác bình yên giữa núi rừng Tây Bắc. Với những thửa ruộng bậc thang hùng vĩ, bản làng dân tộc thiểu số mộc mạc và khí hậu mát lạnh quanh năm, Sa Pa luôn mang đến trải nghiệm trọn vẹn cho du khách.',
    content = 'Sa Pa gây ấn tượng với cảnh sắc núi đồi trùng điệp, những thung lũng mờ sương và nhịp sống giản dị của đồng bào dân tộc nơi đây. Hành trình khám phá có thể bắt đầu bằng việc chinh phục đỉnh Fansipan – nóc nhà Đông Dương, hoặc trekking bản Cát Cát, Tả Van, Lao Chải. Buổi sáng săn mây tại đèo Ô Quy Hồ, buổi tối thưởng thức thắng cố, thịt nướng và ngắm thị trấn lung linh dưới ánh đèn. Sa Pa không chỉ đẹp mà còn sở hữu văn hóa phong phú, đặc biệt vào mùa lúa chín và mùa đông tuyết rơi.',
    readTime = 8,
    location = 'Sa Pa, Việt Nam',
    region = 'vietnam'
WHERE id = 6;

UPDATE Post SET
    title = 'Bangkok – Thành phố không ngủ của châu Á',
    description = 'Bangkok là sự hòa quyện giữa hiện đại và truyền thống, nơi có những ngôi chùa dát vàng lộng lẫy, các trung tâm mua sắm lớn và nền ẩm thực đường phố nổi tiếng thế giới. Đây là hướng dẫn chi tiết để bạn khám phá Bangkok theo cách trọn vẹn nhất.',
    content = 'Bangkok hấp dẫn du khách bởi sự sôi động và nguồn năng lượng bất tận. Hành trình có thể bắt đầu với việc tham quan Grand Palace, Wat Arun và Wat Phra Kaew – những công trình mang dấu ấn văn hóa Thái. Sau đó, bạn có thể trải nghiệm mua sắm tại Siam Paragon, CentralWorld hoặc các chợ địa phương như Chatuchak Weekend Market. Ẩm thực Bangkok vô cùng phong phú với pad Thái, xôi xoài, tom yum và hàng trăm món ăn đường phố. Buổi tối, thành phố trở nên náo nhiệt với các phố đi bộ, khu chợ đêm và các quán rooftop view sông Chao Phraya.',
    readTime = 9,
    location = 'Bangkok, Thái Lan',
    region = 'asia'
WHERE id = 7;

UPDATE Post SET
    title = 'Tokyo – Nét giao thoa hoàn hảo giữa truyền thống và hiện đại',
    description = 'Tokyo là một trong những thành phố phát triển bậc nhất thế giới nhưng vẫn giữ được nét văn hóa đặc trưng của Nhật Bản. Bài viết giúp bạn khám phá những địa điểm nổi bật, món ăn nên thử và các trải nghiệm độc đáo tại Tokyo.',
    content = 'Tokyo là vùng đất kết hợp giữa công nghệ hiện đại và những giá trị truyền thống lâu đời. Bạn có thể bắt đầu hành trình tại Shibuya, Ginza hoặc Shinjuku – những khu vực sôi động nhất thành phố. Đền Senso-ji, khu Asakusa và vườn quốc gia Shinjuku Gyoen là những điểm đến mang lại cảm giác bình yên hiếm thấy. Ẩm thực Tokyo vô cùng phong phú với sushi, ramen, wagyu và các quán ăn nhỏ ven đường. Nếu bạn yêu thích mua sắm, Akihabara và Harajuku sẽ là thiên đường dành cho bạn. Tokyo cũng nổi tiếng với những tuyến tàu điện hiện đại và các trải nghiệm độc đáo như tắm onsen hoặc xem sumo.',
    readTime = 10,
    location = 'Tokyo, Nhật Bản',
    region = 'asia'
WHERE id = 8;

UPDATE Post SET
    title = 'Paris – Hành trình khám phá Thành phố Ánh sáng',
    description = 'Paris luôn nằm trong danh sách những thành phố lãng mạn nhất thế giới với tháp Eiffel, bảo tàng Louvre, đại lộ Champs-Élysées và những quán cà phê bên đường. Bài viết mang đến cho bạn góc nhìn đầy đủ về văn hóa, ẩm thực và các điểm đến không thể bỏ qua tại Paris.',
    content = 'Paris là một thành phố mang đậm sắc màu nghệ thuật, lịch sử và sự lãng mạn. Hành trình khám phá có thể bắt đầu từ tháp Eiffel – biểu tượng vĩ đại của nước Pháp. Tiếp đó, bạn có thể ghé bảo tàng Louvre để chiêm ngưỡng kiệt tác Mona Lisa, hoặc dạo bước dọc theo sông Seine với những cây cầu cổ kính. Khu Montmartre với nhà thờ Sacré-Cœur cũng là điểm đến tuyệt đẹp cho những ai thích không khí thơ mộng. Paris còn hấp dẫn bởi ẩm thực tinh tế với bánh croissant, macaron và rượu vang. Thành phố luôn biết cách khiến du khách say mê bởi vẻ đẹp tráng lệ cả ngày lẫn đêm.',
    readTime = 12,
    location = 'Paris, Pháp',
    region = 'europe'
WHERE id = 9;

UPDATE Post SET
    title = 'Rome – Trở về với trái tim của Đế chế La Mã',
    description = 'Rome là nơi lưu giữ những công trình lịch sử vĩ đại như Đấu trường La Mã, Vatican và đài phun nước Trevi. Bài viết mang đến hành trình theo dấu những giá trị cổ đại tồn tại hàng nghìn năm.',
    content = 'Rome là thành phố của lịch sử, nghệ thuật và đức tin. Điểm bắt đầu lý tưởng là Colosseum – biểu tượng huyền thoại của Đế chế La Mã. Không xa đó là Roman Forum, nơi từng là trung tâm chính trị và thương mại cổ đại. Vatican, với nhà thờ Thánh Peter và Sistine Chapel, là kiệt tác không thể bỏ qua. Khi đi dạo qua những con phố lát đá, bạn sẽ bắt gặp những đài phun nước, quảng trường và quán cà phê cổ kính. Ẩm thực Rome nổi tiếng với pasta carbonara, pizza đế mỏng và gelato. Rome đem lại cảm giác như bước vào bộ phim lịch sử sống động.',
    readTime = 13,
    location = 'Rome, Ý',
    region = 'europe'
WHERE id = 10;

UPDATE Post SET
    title = 'Đà Nẵng – Thành phố đáng sống bên bờ biển',
    description = 'Đà Nẵng là thành phố năng động với nhiều địa điểm hấp dẫn như Bà Nà Hills, biển Mỹ Khê và bán đảo Sơn Trà. Bài viết mang đến hành trình khám phá thiên nhiên, văn hóa và ẩm thực đặc sắc của Đà Nẵng.',
    content = 'Đà Nẵng sở hữu khí hậu ôn hòa, bãi biển đẹp và nhiều công trình kiến trúc độc đáo. Bạn có thể bắt đầu chuyến đi bằng việc ngắm biển Mỹ Khê buổi sáng, sau đó di chuyển tới Bà Nà Hills để tham quan Cầu Vàng nổi tiếng. Bán đảo Sơn Trà là nơi lý tưởng để ngắm thành phố từ trên cao và tìm hiểu về hệ sinh thái rừng nguyên sinh. Ngoài ra, Đà Nẵng còn gần phố cổ Hội An và thánh địa Mỹ Sơn – thuận tiện cho du khách khám phá thêm. Ẩm thực nơi đây cũng rất đặc sắc như mì Quảng, bún chả cá và hải sản tươi sống.',
    readTime = 7,
    location = 'Đà Nẵng, Việt Nam',
    region = 'vietnam'
WHERE id = 11;

UPDATE Post SET
    title = 'Seoul - Nơi giao thoa giữa truyền thống và hiện đại',
    description = 'Seoul mang nét đẹp hòa quyện giữa những cung điện cổ kính, khu phố thời trang sầm uất và văn hóa Kpop lan tỏa toàn cầu. Đây là bài viết giúp bạn khám phá Seoul một cách đầy đủ và cuốn hút nhất.',
    content = 'Seoul là một trong những thành phố năng động bậc nhất châu Á. Cung Gyeongbokgung và làng Bukchon Hanok là nơi lý tưởng để tìm hiểu văn hóa truyền thống. Nếu bạn yêu thích mua sắm và thời trang, Myeongdong và Hongdae sẽ khiến bạn choáng ngợp với vô số cửa hàng, quán cà phê và thương hiệu nổi tiếng. Tháp Namsan mang đến góc nhìn toàn cảnh thành phố, đặc biệt đẹp vào ban đêm. Ẩm thực Hàn Quốc tại Seoul rất phong phú với kimchi, bibimbap, thịt nướng và các quán ăn đường phố mở cửa tới khuya. Seoul là điểm đến phù hợp cho cả du lịch nghỉ dưỡng lẫn trải nghiệm hiện đại.',
    readTime = 9,
    location = 'Seoul, Hàn Quốc',
    region = 'asia'
WHERE id = 12;

CREATE TABLE CommentPost (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    postId INT,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (postId) REFERENCES Post(id)
);
