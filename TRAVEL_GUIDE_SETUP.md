# Travel Guide Page Implementation - Setup Guide

## Overview

This implementation adds a Travel Guide feature to the BK Tours application, including:

- **TravelGuidePage**: Displays a list of travel guide posts with search, filter, and sort functionality
- **PostDetailPage**: Shows full post content with comments and ratings
- **Backend APIs**: RESTful endpoints for posts and comments
- **Database**: New fields in Post and Comment tables

---

## Database Setup

### Step 1: Run Migration

Run the migration script to add required fields to the `Post` table:

```sql
-- Execute in MySQL client or phpMyAdmin
source C:\xampp\htdocs\btl_LTWeb\project\backend\DatabaseMigrations.sql;
```

Or run manually:

```sql
ALTER TABLE Post ADD COLUMN IF NOT EXISTS description TEXT AFTER title;
ALTER TABLE Post ADD COLUMN IF NOT EXISTS thumbnailUrl VARCHAR(255) AFTER description;
ALTER TABLE Post ADD COLUMN IF NOT EXISTS location VARCHAR(255) AFTER thumbnailUrl;
ALTER TABLE Post ADD COLUMN IF NOT EXISTS readTime INT AFTER location;
ALTER TABLE Post ADD COLUMN IF NOT EXISTS updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt;

ALTER TABLE Comment ADD COLUMN IF NOT EXISTS postId INT AFTER tourId;
ALTER TABLE Comment ADD CONSTRAINT fk_comment_post FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE;
```

### Step 2: Insert Sample Data (Optional)

Insert test posts for development:

```sql
INSERT INTO User (fullName, email, password, role) VALUES
('Admin User', 'admin@bktours.com', 'hashed_password', 'admin'),
('Travel Writer', 'writer@bktours.com', 'hashed_password', 'writer');

INSERT INTO Post (userId, title, description, content, thumbnailUrl, location, readTime, type, createdAt) VALUES
(2, 'A Wonderful Journey to India', 'Discover the spiritual wonders of India with our comprehensive travel guide.', 'Full content here...', 'https://via.placeholder.com/500x300?text=India', 'Mumbai, India', 8, 'travel_guide', NOW()),
(2, 'Unmissable Places to Visit in Jamaica', 'Explore the beautiful beaches and vibrant culture of Jamaica.', 'Full content here...', 'https://via.placeholder.com/500x300?text=Jamaica', 'Kingston, Jamaica', 12, 'travel_guide', NOW()),
(2, 'Fun Facts About Bay of Islands, New Zealand', 'Learn fascinating facts about New Zealand\'s stunning Bay of Islands.', 'Full content here...', 'https://via.placeholder.com/500x300?text=New+Zealand', 'Bay of Islands, New Zealand', 6, 'travel_guide', NOW());
```

---

## Backend Setup

### Controllers Added

#### **PostController** (`backend/app/Controllers/PostController.php`)

- **`getAllPosts()`**: Get posts with pagination, search, location filter, and sorting

  - Query params: `search`, `location`, `sort` (latest/oldest/readTime), `page`, `limit`
  - Returns: paginated posts with total count

- **`getPostById()`**: Get full post details by ID

  - Query param: `id`

- **`getLocations()`**: Get unique locations for filter dropdown

#### **PostCommentController** (`backend/app/Controllers/PostCommentController.php`)

- **`getCommentsByPost()`**: Get all comments for a post

  - Query param: `postId`

- **`createComment()`**: Create a new comment
  - Body: `{ postId, userId, content, rating }`

### Models Added

#### **PostModel** (`backend/app/Models/PostModel.php`)

- `getAllPosts($search, $location, $sort, $limit, $offset)`
- `countPosts($search, $location)`
- `getPostById($id)`
- `getUniqueLocations()`

#### **Updated CommentModel** (`backend/app/Models/CommentModel.php`)

- `getCommentsByPostId($postId)`
- `createForPost($data)`

### Routes Added (`backend/public/index.php`)

```
GET    /posts                    → PostController::getAllPosts
GET    /posts/{id}               → PostController::getPostById
GET    /posts/locations          → PostController::getLocations
GET    /posts/{postId}/comments  → PostCommentController::getCommentsByPost
POST   /posts/{postId}/comments  → PostCommentController::createComment
```

---

## Frontend Setup

### Components Created

#### **TravelGuidePage** (`frontend/src/client/pages/TravelGuidePage.jsx`)

Features:

- Search bar (by title/description)
- Location filter dropdown (dynamically populated)
- Sort options: Latest, Oldest, Read Time
- Pagination (12 items per page)
- Card display with:
  - Thumbnail image
  - Location badge
  - Title and description (truncated)
  - Creation date and read time
  - "View Details" button

#### **PostDetailPage** (`frontend/src/client/pages/PostDetailPage.jsx`)

Features:

- Full post content display
- Author info with avatar
- Breadcrumb navigation
- Location info
- Comments & ratings section with:
  - Comment form with star rating
  - List of existing comments
  - Author avatars and timestamps
- Comment submission with success message

### Routes Added (`frontend/src/client/App.jsx`)

```
/travel-guides              → TravelGuidePage
/travel-guides/:id          → PostDetailPage
```

### Header Menu Updated

- "Cẩm nang du lịch" menu item now links to `/travel-guides`

---

## API Endpoints Reference

### Get All Posts

```
GET /posts?search=india&location=Mumbai&sort=latest&page=1&limit=12

Response:
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "...",
        "description": "...",
        "thumbnailUrl": "...",
        "location": "Mumbai, India",
        "readTime": 8,
        "createdAt": "2025-12-06T10:30:00",
        "authorName": "Travel Writer"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 12,
    "pages": 2
  }
}
```

### Get Single Post

```
GET /posts/1

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "...",
    "description": "...",
    "content": "...",
    "location": "...",
    "readTime": 8,
    "thumbnailUrl": "...",
    "createdAt": "...",
    "authorName": "...",
    "authorAvatar": "..."
  }
}
```

### Get Post Comments

```
GET /posts/1/comments?postId=1

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 2,
      "content": "Great post!",
      "rating": 5,
      "createdAt": "...",
      "fullName": "Reader Name",
      "avatarUrl": "..."
    }
  ]
}
```

### Create Comment

```
POST /posts/1/comments

Body:
{
  "postId": 1,
  "userId": 3,
  "content": "Amazing article!",
  "rating": 5
}

Response:
{
  "success": true,
  "data": {
    "id": 5
  }
}
```

### Get Locations

```
GET /posts/locations

Response:
{
  "success": true,
  "data": [
    { "location": "Mumbai, India" },
    { "location": "Kingston, Jamaica" },
    { "location": "Bay of Islands, New Zealand" }
  ]
}
```

---

## Environment Configuration

Ensure `backend/.env` exists with:

```env
DB_HOST=127.0.0.1
DB_NAME=btl_db
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_CHARSET=utf8mb4
```

And `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Running the Application

### Terminal 1: Start Backend

```powershell
cd C:\xampp\htdocs\btl_LTWeb\project\backend
php -S localhost:8000 -t public
```

### Terminal 2: Start Frontend

```powershell
cd C:\xampp\htdocs\btl_LTWeb\project\frontend
npm run dev
```

### Access the Application

- Frontend: `http://localhost:5173`
- Travel Guides page: `http://localhost:5173/travel-guides`
- Backend API: `http://localhost:8000`

---

## Testing Checklist

- [ ] Navigate to `/travel-guides` - see paginated list
- [ ] Search for a post title
- [ ] Filter by location
- [ ] Sort by different options
- [ ] Pagination works correctly
- [ ] Click "View Details" → Post detail page loads
- [ ] Comments section displays
- [ ] Submit a comment with rating
- [ ] New comment appears in list
- [ ] API endpoints return correct JSON format
- [ ] Error handling works (invalid ID, no results)

---

## File Structure

```
backend/
  app/
    Controllers/
      PostController.php          (new)
      PostCommentController.php   (new)
    Models/
      PostModel.php              (new)
      CommentModel.php           (updated)
  public/
    index.php                    (updated - new routes)
  DatabaseMigrations.sql         (new)

frontend/
  src/
    client/
      pages/
        TravelGuidePage.jsx      (redesigned)
        PostDetailPage.jsx       (new)
      App.jsx                    (updated - new routes)
      components/
        Header.jsx               (updated - menu link)
```

---

## Common Issues & Solutions

### Issue: "Database environment variables are missing"

**Solution**: Ensure `backend/.env` exists with correct DB credentials

### Issue: Posts not appearing

**Solution**: Check if sample data was inserted. Run the INSERT statements in MySQL

### Issue: API returns 404

**Solution**: Verify all routes are correctly added in `backend/public/index.php`

### Issue: Frontend can't reach backend

**Solution**:

- Confirm backend is running on `http://localhost:8000`
- Verify `VITE_API_BASE_URL` in `frontend/.env` is correct
- Check browser console for CORS errors

### Issue: Comments not submitting

**Solution**:

- Verify `postId` and `userId` are correct in request body
- Check database has `Comment.postId` column (run migration)
- Check browser console for error details

---

## Future Enhancements

- [ ] Add user authentication for comments
- [ ] Implement comment edit/delete functionality
- [ ] Add related posts recommendation
- [ ] SEO optimization (meta tags, schema markup)
- [ ] Image optimization and lazy loading
- [ ] Add social sharing buttons
- [ ] Implement search history
- [ ] Add post categories/tags
- [ ] Create admin panel for post management

---

## Git Commit Message

```
feat: Add Travel Guide listing and post detail pages with search/filter/sort

- Redesign TravelGuidePage with search, location filter, sort, pagination
- Create PostDetailPage with full content and comments section
- Add PostModel and PostController for post listing/search
- Add comment management with ratings
- Add API routes: /posts, /posts/{id}, /posts/locations, /posts/{id}/comments
- Update database schema with Post fields: description, thumbnailUrl, location, readTime
- Update header menu to link to travel guides
- Include comprehensive API documentation
```

---

For questions or issues, refer to the API documentation above or check server logs for detailed error messages.
