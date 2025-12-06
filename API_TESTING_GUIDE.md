# API Testing Guide for Travel Guide Feature

Use this guide to test the backend endpoints using a REST client like Postman or curl.

## Base URL

```
http://localhost:8000
```

---

## 1. Get All Posts (with Pagination & Filters)

### Request

```
GET /posts?page=1&limit=12&search=india&location=Mumbai&sort=latest
```

### cURL Example

```bash
curl -X GET "http://localhost:8000/posts?page=1&limit=12&search=india&location=Mumbai&sort=latest" \
  -H "Accept: application/json"
```

### Query Parameters

| Parameter | Type   | Default | Description                             |
| --------- | ------ | ------- | --------------------------------------- |
| page      | int    | 1       | Page number for pagination              |
| limit     | int    | 12      | Items per page                          |
| search    | string | null    | Search in title or description          |
| location  | string | null    | Filter by location                      |
| sort      | string | latest  | Sort by: 'latest', 'oldest', 'readTime' |

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Fetched posts successfully",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "A Wonderful Journey to India",
        "description": "Discover the spiritual wonders of India...",
        "thumbnailUrl": "https://images.unsplash.com/...",
        "location": "Mumbai, India",
        "readTime": 8,
        "createdAt": "2025-12-06T10:30:00",
        "type": "travel_guide",
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

---

## 2. Get Single Post Details

### Request

```
GET /posts/1
```

### cURL Example

```bash
curl -X GET "http://localhost:8000/posts/1" \
  -H "Accept: application/json"
```

### Query Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| id        | int  | Yes      | Post ID     |

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Fetched post successfully",
  "data": {
    "id": 1,
    "title": "A Wonderful Journey to India",
    "description": "Discover the spiritual wonders of India...",
    "content": "Full content of the post...",
    "thumbnailUrl": "https://images.unsplash.com/...",
    "location": "Mumbai, India",
    "readTime": 8,
    "createdAt": "2025-12-06T10:30:00",
    "updatedAt": "2025-12-06T10:30:00",
    "type": "travel_guide",
    "authorName": "Travel Writer",
    "authorAvatar": "https://example.com/avatar.jpg"
  }
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Post not found",
  "status": 404
}
```

---

## 3. Get Unique Locations (for Filter Dropdown)

### Request

```
GET /posts/locations
```

### cURL Example

```bash
curl -X GET "http://localhost:8000/posts/locations" \
  -H "Accept: application/json"
```

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Fetched locations successfully",
  "data": [
    { "location": "Bay of Islands, New Zealand" },
    { "location": "Cairo, Egypt" },
    { "location": "Kingston, Jamaica" },
    { "location": "Male, Maldives" },
    { "location": "Mumbai, India" },
    { "location": "Paris, France" }
  ]
}
```

---

## 4. Get Comments for a Post

### Request

```
GET /posts/1/comments?postId=1
```

### cURL Example

```bash
curl -X GET "http://localhost:8000/posts/1/comments?postId=1" \
  -H "Accept: application/json"
```

### Query Parameters

| Parameter | Type | Required | Description                   |
| --------- | ---- | -------- | ----------------------------- |
| postId    | int  | Yes      | Post ID to fetch comments for |

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Fetched comments successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "content": "This guide was incredibly helpful!",
      "rating": 5,
      "createdAt": "2025-12-06T11:00:00",
      "fullName": "John Doe",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  ]
}
```

---

## 5. Create a New Comment

### Request

```
POST /posts/1/comments

Content-Type: application/json

{
  "postId": 1,
  "userId": 2,
  "content": "Excellent guide! Very helpful for my trip planning.",
  "rating": 5
}
```

### cURL Example

```bash
curl -X POST "http://localhost:8000/posts/1/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "userId": 2,
    "content": "Excellent guide! Very helpful for my trip planning.",
    "rating": 5
  }'
```

### Request Body

| Field   | Type   | Required | Description                     |
| ------- | ------ | -------- | ------------------------------- |
| postId  | int    | Yes      | ID of the post to comment on    |
| userId  | int    | Yes      | ID of the user creating comment |
| content | string | Yes      | Comment text (1+ characters)    |
| rating  | int    | No       | Rating 1-5 stars                |

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 5
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Missing required fields",
  "status": 400
}
```

---

## Testing Scenarios

### Scenario 1: Search for Posts

```bash
# Test search functionality
curl -X GET "http://localhost:8000/posts?search=egypt" \
  -H "Accept: application/json"

# Expected: Returns posts with "egypt" in title or description
```

### Scenario 2: Filter by Location

```bash
# Test location filter
curl -X GET "http://localhost:8000/posts?location=Mumbai" \
  -H "Accept: application/json"

# Expected: Returns only posts from Mumbai
```

### Scenario 3: Sort by Read Time

```bash
# Test sorting
curl -X GET "http://localhost:8000/posts?sort=readTime" \
  -H "Accept: application/json"

# Expected: Returns posts sorted by readTime (ascending)
```

### Scenario 4: Pagination

```bash
# Test pagination - get page 2 with 5 items per page
curl -X GET "http://localhost:8000/posts?page=2&limit=5" \
  -H "Accept: application/json"

# Expected: Returns items 6-10 (offset 5, limit 5)
```

### Scenario 5: Combined Filters

```bash
# Test all filters together
curl -X GET "http://localhost:8000/posts?search=journey&location=India&sort=latest&page=1&limit=10" \
  -H "Accept: application/json"

# Expected: Returns posts with "journey", from India, newest first, paginated
```

### Scenario 6: Submit Comment with Rating

```bash
curl -X POST "http://localhost:8000/posts/1/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "userId": 3,
    "content": "Amazing article! I learned so much.",
    "rating": 5
  }'

# Expected: Comment created with ID returned
```

### Scenario 7: Get Comments After Submission

```bash
# After submitting a comment, verify it appears in the list
curl -X GET "http://localhost:8000/posts/1/comments?postId=1" \
  -H "Accept: application/json"

# Expected: New comment appears in the array
```

---

## Error Handling Tests

### Test Invalid Post ID

```bash
curl -X GET "http://localhost:8000/posts/999" \
  -H "Accept: application/json"

# Expected: 404 with "Post not found"
```

### Test Missing Query Parameter

```bash
curl -X GET "http://localhost:8000/posts/1/comments" \
  -H "Accept: application/json"

# Expected: 400 with "Invalid or missing postId"
```

### Test Invalid Rating (Outside 1-5)

```bash
curl -X POST "http://localhost:8000/posts/1/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "userId": 2,
    "content": "Test comment",
    "rating": 10
  }'

# Note: MySQL CHECK constraint will validate (1-5 range)
```

---

## Postman Collection Quick Import

Save this as `collection.json` and import into Postman:

```json
{
  "info": {
    "name": "Travel Guide API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Posts",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/posts?page=1&limit=12&sort=latest",
          "host": ["localhost"],
          "port": "8000",
          "path": ["posts"],
          "query": [
            { "key": "page", "value": "1" },
            { "key": "limit", "value": "12" },
            { "key": "sort", "value": "latest" }
          ]
        }
      }
    },
    {
      "name": "Get Post by ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/posts/1",
          "host": ["localhost"],
          "port": "8000",
          "path": ["posts", "1"]
        }
      }
    },
    {
      "name": "Get Locations",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/posts/locations",
          "host": ["localhost"],
          "port": "8000",
          "path": ["posts", "locations"]
        }
      }
    },
    {
      "name": "Get Comments",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/posts/1/comments?postId=1",
          "host": ["localhost"],
          "port": "8000",
          "path": ["posts", "1", "comments"],
          "query": [{ "key": "postId", "value": "1" }]
        }
      }
    },
    {
      "name": "Create Comment",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "raw": "{\"postId\": 1, \"userId\": 2, \"content\": \"Test\", \"rating\": 5}"
        },
        "url": {
          "raw": "{{base_url}}/posts/1/comments",
          "host": ["localhost"],
          "port": "8000",
          "path": ["posts", "1", "comments"]
        }
      }
    }
  ]
}
```

---

## Common Issues During Testing

| Issue                | Cause                     | Solution                                  |
| -------------------- | ------------------------- | ----------------------------------------- |
| 404 - Post not found | Invalid post ID           | Use IDs from actual database (1, 2, 3...) |
| 500 - Database error | Missing columns           | Run DatabaseMigrations.sql                |
| Empty results        | No test data              | Run TestData.sql                          |
| CORS error           | Frontend/backend mismatch | Verify CORS headers in index.php          |
| Bad request          | Missing parameters        | Check all required fields are included    |

---

For more details, refer to `TRAVEL_GUIDE_SETUP.md`
