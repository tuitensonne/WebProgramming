# Booking Feature - Hướng Dẫn Cấu Hình

## 1. Database Setup

### Thêm Booking Table vào Database

Chạy lệnh SQL này trên MySQL:

```bash
cd backend
mysql -h 127.0.0.1 -P 3307 -u root -p bk_tours_db < BookingTableScript.sql
```

Hoặc copy nội dung từ `BookingTableScript.sql` vào MySQL Workbench và execute.

**Schema Booking Table:**
```sql
CREATE TABLE Booking (
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
```

## 2. Backend Components

### BookingModel.php
- **Location:** `backend/app/Models/BookingModel.php`
- **Methods:**
  - `createBooking($bookingData)` - Tạo booking mới
  - `getBookingById($bookingId)` - Lấy booking theo ID
  - `getUserBookings($userId)` - Lấy tất cả booking của user
  - `updateBookingStatus($bookingId, $status)` - Cập nhật trạng thái
  - `deleteBooking($bookingId)` - Xóa booking
  - `getAllBookings($filters)` - Lấy tất cả booking (admin only)

### BookingController.php
- **Location:** `backend/app/Controllers/BookingController.php`
- **Routes:**
  - `POST /bookings` - Tạo booking mới
  - `GET /bookings/my-bookings` - Lấy booking của user hiện tại
  - `GET /bookings/{id}` - Lấy chi tiết booking
  - `PUT /bookings/{id}` - Cập nhật booking
  - `DELETE /bookings/{id}` - Xóa/hủy booking
  - `GET /admin/bookings` - Lấy tất cả booking (admin only)

### Route Configuration
Tất cả routes đã được thêm vào `backend/public/index.php`:
```php
use App\Controllers\BookingController;

$router->post('/bookings', [BookingController::class, 'createBooking']);
$router->get('/bookings/my-bookings', [BookingController::class, 'getUserBookings']);
$router->get('/bookings/{id}', [BookingController::class, 'getBookingById']);
$router->put('/bookings/{id}', [BookingController::class, 'updateBooking']);
$router->delete('/bookings/{id}', [BookingController::class, 'deleteBooking']);
$router->get('/admin/bookings', [BookingController::class, 'getAllBookings']);
```

## 3. Frontend Components

### BookingForm.jsx
- **Location:** `frontend/src/client/components/BookingForm.jsx`
- **Features:**
  - Chọn ngày xuất phát - ngày về
  - Điều chỉnh số người (người lớn, trẻ em 50%, em bé free)
  - Tính tổng giá tự động
  - Validation dates
  - Callback khi booking

**Props:**
```jsx
<BookingForm 
  tour={tourData}
  onBooking={handleBooking}
/>
```

### PaymentModal.jsx
- **Location:** `frontend/src/client/components/PaymentModal.jsx`
- **Features:**
  - Form nhập thông tin khách hàng
  - 3 phương thức thanh toán: Thẻ tín dụng, Chuyển khoản, Thanh toán tại chỗ
  - Validation email, phone
  - Modal overlay
  - Pre-fill nếu user đã đăng nhập

**Props:**
```jsx
<PaymentModal 
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  bookingData={bookingData}
  userInfo={userInfo}
  onPaymentSuccess={handlePaymentSuccess}
/>
```

### BookingProfilePage.jsx
- **Location:** `frontend/src/client/pages/BookingProfilePage.jsx`
- **Features:**
  - Hiển thị lịch sử booking của user
  - Hiển thị trạng thái (Chờ xác nhận, Đã xác nhận, Đã hủy, Hoàn thành)
  - Chi tiết: ngày, số người, giá tiền, thông tin khách
  - Button hủy booking (chỉ pending bookings)
  - Empty state khi chưa có booking

**Route:** `/bookings/my-bookings` (Private Route)

### TourDetailPage Updates
- Import BookingForm, PaymentModal
- Add state: `showPaymentModal`, `bookingData`, `userInfo`
- Add `handleBooking()` - kiểm tra login, show modal
- Add `handlePaymentSuccess()` - call `/bookings` endpoint
- Render BookingForm thay thế PriceBox

## 4. Routes & Navigation

### Frontend Routes
**App.jsx:**
- `/tour/:id` → TourDetailPage (có BookingForm)
- `/bookings/my-bookings` → BookingProfilePage (Private Route)

**ProfileSidebar Updates:**
- Thêm menu item "Lịch sử Booking" → navigate `/bookings/my-bookings`

### Backend Routes
Tất cả trong `backend/public/index.php`:
- Public: `POST /bookings` (tạo booking - chỉ cần login)
- User: `GET /bookings/my-bookings` (view own bookings)
- User: `GET /bookings/{id}` (view own booking detail)
- User: `PUT /bookings/{id}` (update own booking)
- User: `DELETE /bookings/{id}` (delete own pending booking)
- Admin: `GET /admin/bookings` (view all bookings)

## 5. API Request/Response Examples

### Create Booking
```javascript
POST /bookings
Content-Type: application/json
Authorization: Bearer {token}

{
  "tourId": 1,
  "startDate": "2025-02-15",
  "endDate": "2025-02-18",
  "adults": 2,
  "children": 1,
  "babies": 0,
  "totalPeople": 3,
  "totalPrice": 10500000,
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0912345678",
  "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "note": "Yêu cầu phòng gần cửa",
  "paymentMethod": "card"
}

Response:
{
  "success": true,
  "code": 201,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "userId": 5,
    "tourId": 1,
    "startDate": "2025-02-15",
    "endDate": "2025-02-18",
    "adults": 2,
    "children": 1,
    "babies": 0,
    "totalPeople": 3,
    "totalPrice": 10500000,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0912345678",
    "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
    "note": "Yêu cầu phòng gần cửa",
    "paymentMethod": "card",
    "status": "pending",
    "createdAt": "2025-02-01 10:30:00",
    "updatedAt": "2025-02-01 10:30:00"
  }
}
```

### Get User Bookings
```javascript
GET /bookings/my-bookings
Authorization: Bearer {token}

Response:
{
  "success": true,
  "code": 200,
  "message": "User bookings fetched successfully",
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "tourName": "Đà Lạt 3N2Đ - Thành phố sương mù",
      "startDate": "2025-02-15",
      "endDate": "2025-02-18",
      "totalPeople": 3,
      "totalPrice": 10500000,
      "fullName": "Nguyễn Văn A",
      "status": "pending",
      "createdAt": "2025-02-01 10:30:00"
    },
    ...
  ]
}
```

### Cancel Booking
```javascript
DELETE /bookings/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "code": 200,
  "message": "Booking deleted successfully",
  "data": null
}
```

## 6. Authentication & Authorization

### Frontend
- Token stored in `localStorage.getItem('token')`
- API client automatically adds `Authorization: Bearer {token}` header
- PrivateRoute guards access to `/bookings/my-bookings`

### Backend
- `BookingController` extracts userId from JWT token
- Users can only view/edit/delete their own bookings
- Admin users can view all bookings

## 7. Pricing Logic

### Price Calculation
- **Người lớn:** Giá tour × 1
- **Trẻ em (6-12 tuổi):** Giá tour × 0.5
- **Em bé (dưới 6 tuổi):** Free (0 VNĐ)

**Ví dụ:** Tour 3.5M VNĐ
- 2 người lớn: 7M
- 1 trẻ em: 1.75M
- 1 em bé: 0
- **Tổng:** 8.75M VNĐ

## 8. Testing Checklist

- [ ] Database Booking table created successfully
- [ ] BookingForm renders correctly in TourDetailPage
- [ ] Date selection works
- [ ] Quantity buttons update numbers
- [ ] Price calculation is accurate
- [ ] Payment modal shows on "Đặt tour" click
- [ ] Form validation works
- [ ] Booking created in database
- [ ] User can see booking in `/bookings/my-bookings`
- [ ] Booking status displays correctly
- [ ] Cancel booking functionality works
- [ ] Authorization prevents unauthorized access

## 9. File Locations Summary

```
Backend:
- BookingModel.php → app/Models/
- BookingController.php → app/Controllers/
- BookingTableScript.sql → root backend/
- Routes → public/index.php (already updated)

Frontend:
- BookingForm.jsx → src/client/components/
- PaymentModal.jsx → src/client/components/
- BookingProfilePage.jsx → src/client/pages/
- TourDetailPage.jsx → src/client/pages/ (updated)
- App.jsx → src/client/ (routes updated)
- ProfileSidebar.jsx → src/client/components/Profile/ (menu updated)
```

## 10. Common Issues & Fixes

**Issue:** PaymentModal not showing
- Fix: Check `showPaymentModal` state in TourDetailPage
- Verify BookingForm `onBooking` callback is firing

**Issue:** Booking not saving to database
- Fix: Check Bearer token in request headers
- Verify user is logged in (check localStorage token)
- Check MySQL Booking table exists

**Issue:** Can't see bookings in profile
- Fix: Verify `/bookings/my-bookings` route is accessible
- Check user token is valid
- Ensure Booking records have userId

**Issue:** Price calculation wrong
- Fix: Verify formula: (adults × price) + (children × price × 0.5)
- Check tour.price is not null

---

**Last Updated:** December 8, 2025
**Version:** 1.0
