# 🚀 Booking System - Quick Setup Guide

## Step 1: Database Setup (2 phút)

### Option A: Using SQL Script
```bash
cd backend
mysql -h 127.0.0.1 -P 3307 -u root -p"your_password" bk_tours_db < BookingTableScript.sql
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to `127.0.0.1:3307`
3. Open file `BookingTableScript.sql`
4. Execute (Ctrl + Shift + Enter)

### Option C: Direct SQL
Copy-paste nội dung từ `BookingTableScript.sql` vào MySQL query editor và execute.

**Verify:**
```sql
SELECT COUNT(*) FROM Booking;
-- Should return: 0 (empty table, ready to go)
```

---

## Step 2: Backend Setup (Already Done ✅)

### Files Created:
- ✅ `backend/app/Models/BookingModel.php`
- ✅ `backend/app/Controllers/BookingController.php`
- ✅ `backend/public/index.php` (routes added)

### Routes Available:
```
POST   /bookings              - Create booking
GET    /bookings/my-bookings  - Get user's bookings
GET    /bookings/{id}         - Get booking detail
PUT    /bookings/{id}         - Update booking
DELETE /bookings/{id}         - Delete/cancel booking
GET    /admin/bookings        - Get all bookings (admin)
```

---

## Step 3: Frontend Setup (Already Done ✅)

### Components Created:
- ✅ `frontend/src/client/components/BookingForm.jsx`
- ✅ `frontend/src/client/components/PaymentModal.jsx`
- ✅ `frontend/src/client/pages/BookingProfilePage.jsx`

### Pages Updated:
- ✅ `frontend/src/client/pages/TourDetailPage.jsx` (BookingForm added)
- ✅ `frontend/src/client/pages/App.jsx` (route added)
- ✅ `frontend/src/client/components/Profile/ProfileSidebar.jsx` (menu added)

### Routes Available:
```
GET /tour/:id                  - Tour detail with booking form
GET /bookings/my-bookings      - Booking history (private)
```

---

## Step 4: Test the System

### 4.1 Backend API Test
```bash
cd backend
# Make sure PHP server running on port 8000
# Then open booking-test.html in browser
# - Test tour detail
# - Create booking
# - Get bookings
```

### 4.2 Frontend Test (Manual)
1. Start frontend dev server: `npm run dev`
2. Go to http://localhost:5173/tour/1
3. Should see BookingForm instead of old PriceBox
4. Fill dates, adjust quantities → see price change
5. Click "Đặt tour ngay" → PaymentModal
6. Fill info → Submit
7. Go to profile → click "Lịch sử Booking"
8. See booking in list

### 4.3 Using Test HTML
```bash
# Open backend/booking-test.html
# Get your token from localStorage (in browser console)
# localStorage.getItem('token')
# Paste into test form and test endpoints
```

---

## Step 5: Integration Checklist

- [ ] Database Booking table created
- [ ] MySQL: `SELECT COUNT(*) FROM Booking;` returns 0
- [ ] Backend server running: `php -S 127.0.0.1:8000 -t public`
- [ ] Frontend server running: `npm run dev`
- [ ] Can see BookingForm on /tour/1
- [ ] Can click "Đặt tour ngay" without errors
- [ ] PaymentModal appears
- [ ] Can fill and submit form
- [ ] Booking appears in /bookings/my-bookings
- [ ] Status shows "Chờ xác nhận" (pending)
- [ ] Can cancel booking if status is pending

---

## Step 6: Production Deployment

### Before Going Live:
1. Test all features thoroughly
2. Check error handling
3. Verify authorization/authentication
4. Test with multiple user accounts
5. Test admin endpoints
6. Check mobile responsiveness
7. Add logging for debugging
8. Setup email notifications

### Optional Enhancements:
- Send confirmation emails
- Admin approval workflow
- Real payment gateway integration
- Invoice generation
- SMS notifications

---

## 📋 File Structure Reference

```
backend/
├── app/
│   ├── Controllers/
│   │   └── BookingController.php ← NEW
│   └── Models/
│       └── BookingModel.php ← NEW
├── public/
│   └── index.php ← UPDATED (routes added)
├── BookingTableScript.sql ← NEW
├── booking-test.html ← NEW
└── DatabaseScript.sql ← UPDATED

frontend/
├── src/
│   ├── client/
│   │   ├── components/
│   │   │   ├── BookingForm.jsx ← NEW
│   │   │   ├── PaymentModal.jsx ← NEW
│   │   │   └── Profile/
│   │   │       └── ProfileSidebar.jsx ← UPDATED
│   │   ├── pages/
│   │   │   ├── TourDetailPage.jsx ← UPDATED
│   │   │   ├── BookingProfilePage.jsx ← NEW
│   │   │   └── App.jsx ← UPDATED
│   │   └── api/
│   │       └── api.js (no changes needed)
│   └── guards/
│       └── PrivateRoute.jsx (already exists)
```

---

## 🔧 Troubleshooting

### Issue: Booking table not found
```
Error: Table 'bk_tours_db.Booking' doesn't exist
```
**Fix:** Run BookingTableScript.sql or copy SQL from BOOKING_FEATURE.md

### Issue: PaymentModal not showing
**Fix:** 
- Check browser console (F12)
- Verify BookingForm component mounted
- Check `onBooking` callback is called

### Issue: Can't create booking
**Fix:**
- Check token in localStorage
- Verify JWT token is valid (not expired)
- Check API response in Network tab

### Issue: Booking not saved to database
**Fix:**
- Verify Booking table exists
- Check Foreign Keys:
  ```sql
  -- Check constraints
  SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_NAME = 'Booking';
  ```
- Check PHP error logs

### Issue: Authorization error (403)
**Fix:**
- Verify user token is valid
- Check userId matches booking.userId
- Verify admin access for admin endpoints

---

## 📞 API Examples

### Create Booking
```bash
curl -X POST http://127.0.0.1:8000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tourId": 1,
    "startDate": "2025-02-15",
    "endDate": "2025-02-18",
    "adults": 2,
    "children": 1,
    "babies": 0,
    "totalPeople": 3,
    "totalPrice": 10500000,
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@gmail.com",
    "phone": "0912345678",
    "address": "123 Le Loi St",
    "paymentMethod": "card"
  }'
```

### Get User Bookings
```bash
curl http://127.0.0.1:8000/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Cancel Booking
```bash
curl -X DELETE http://127.0.0.1:8000/bookings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Documentation Files

1. **BOOKING_FEATURE.md** - Complete API documentation
2. **BOOKING_IMPLEMENTATION.md** - Implementation details
3. **SETUP_INSTRUCTIONS.md** - This file

---

## ✅ Ready to Test?

1. ✅ Database setup: 2 min
2. ✅ Backend: Already done
3. ✅ Frontend: Already done
4. ✅ Test: 5 min

**Total time: ~7 minutes to fully test**

---

**Last Updated:** December 8, 2025
**Status:** 🟢 Ready for Testing
