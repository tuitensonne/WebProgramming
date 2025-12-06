-- Sample test data for Travel Guide feature
-- Run this in MySQL to populate sample posts for testing

-- Ensure User table has test users
INSERT INTO User (fullName, email, password, role, createdAt) VALUES
('Travel Writer', 'writer@bktours.com', 'password123', 'writer', NOW())
ON DUPLICATE KEY UPDATE email=email;

-- Sample posts
INSERT INTO Post (userId, title, description, content, thumbnailUrl, location, readTime, type, createdAt) VALUES
(1, 'A Wonderful Journey to India', 
 'Discover the spiritual wonders of India with our comprehensive travel guide. From the sacred ghats of Varanasi to the majestic Taj Mahal.',
 'India is a country of incredible diversity and rich cultural heritage. This guide will take you through the most beautiful and historically significant destinations...', 
 'https://images.unsplash.com/photo-1504681869696-d977e0531cf1?auto=format&fit=crop&w=500&h=300',
 'Mumbai, India', 
 8, 'travel_guide', NOW()),

(1, 'Unmissable Places to Visit in Jamaica',
 'Explore the beautiful beaches and vibrant culture of Jamaica. Experience reggae music, tropical landscapes, and warm hospitality.',
 'Jamaica is an island paradise known for its laid-back atmosphere, beautiful coastlines, and rich musical heritage. From Montego Bay to Negril, discover why millions visit annually...',
 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&h=300',
 'Kingston, Jamaica',
 12, 'travel_guide', NOW()),

(1, 'Fun Facts About Bay of Islands, New Zealand',
 'Learn fascinating facts about New Zealand\'s stunning Bay of Islands. A paradise for nature lovers and adventure seekers.',
 'The Bay of Islands is one of New Zealand\'s most picturesque destinations. With 144 islands scattered across crystal-clear waters, it offers endless opportunities for exploration...',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&h=300',
 'Bay of Islands, New Zealand',
 6, 'travel_guide', NOW()),

(1, 'Ancient Wonders of Egypt',
 'Step back in time as you explore Egypt\'s most iconic ancient monuments and historical sites.',
 'Egypt has been a cradle of civilization for thousands of years. The pyramids, temples, and tombs tell stories of pharaohs and ancient gods...',
 'https://images.unsplash.com/photo-1551632786-ad1a14ae4e12?auto=format&fit=crop&w=500&h=300',
 'Cairo, Egypt',
 10, 'travel_guide', NOW()),

(1, 'Island Paradise: Maldives Guide',
 'Experience luxury and natural beauty in the Maldives - the perfect tropical getaway.',
 'The Maldives is known for its overwater bungalows, pristine white-sand beaches, and incredible marine life. This comprehensive guide covers the best resorts and activities...',
 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&h=300',
 'Male, Maldives',
 7, 'travel_guide', NOW()),

(1, 'Paris: The City of Light',
 'Discover why Paris is one of the most romantic and culturally rich cities in the world.',
 'From the Eiffel Tower to the Louvre Museum, Paris offers world-class attractions, charming cafés, and exquisite cuisine. This guide will help you make the most of your Parisian adventure...',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&h=300',
 'Paris, France',
 9, 'travel_guide', NOW());

-- Sample comments with ratings
INSERT INTO Comment (userId, postId, content, rating, createdAt) VALUES
(1, 1, 'This guide was incredibly helpful! I followed the recommendations and had an amazing trip to India.', 5, NOW()),
(1, 1, 'Great information about transportation and local customs. Really appreciated the tips!', 5, NOW()),
(1, 2, 'Jamaica exceeded my expectations. This guide prepared me perfectly.', 5, NOW()),
(1, 3, 'Beautiful destination. The guide made it easy to plan our visit.', 4, NOW()),
(1, 3, 'Very informative. Wish there were more details about hiking trails though.', 4, NOW());
