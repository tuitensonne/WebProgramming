# 🚀 Hướng Dẫn Thiết Lập Dự Án

Hướng dẫn này mô tả các bước cần thiết để thiết lập và chạy dự án **backend** và **frontend** trên máy cục bộ của bạn.

---

## ⚙️ I. Thiết Lập Backend

### 1. Chuẩn bị File `.htaccess`

File `.htaccess` là cần thiết để định tuyến (routing) đúng cách trong thư mục `public` của backend.

- Điều hướng đến thư mục `public` của backend:
  ```bash
  cd backend/public
  ```
- **Chỉnh sửa hoặc đảm bảo** file `.htaccess` đã được cấu hình chính xác cho môi trường server của bạn (ví dụ: để xử lý các yêu cầu được chuyển hướng đến file index chính).

### 2. Cấu hình Biến Môi Trường

Bạn cần tạo một file môi trường để lưu trữ các thông tin cấu hình nhạy cảm như thông tin cơ sở dữ liệu và khóa AWS.

- Tạo một file có tên **`.env`** ở **thư mục gốc của backend**.

- Thêm các biến môi trường sau vào file `.env` (thay thế giá trị bằng thông tin thực tế của bạn):

  ```ini
  # Cấu hình Cơ sở dữ liệu (Database Configuration)
  DB_HOST=
  DB_NAME=
  DB_PORT=
  DB_USER=
  DB_PASS=

  # Cấu hình AWS S3 (AWS S3 Configuration)
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_KEY_ACCESS=
  BUCKET_NAME=
  REGION=
  ```

  > ⚠️ **Lưu ý:** Giữ file `.env` của bạn **riêng tư** và **không** đưa vào hệ thống kiểm soát phiên bản (ví dụ: thêm vào `.gitignore`).

### 3. Thiết Lập Cơ Sở Dữ Liệu

Bạn sẽ sử dụng file `Database.sql` để xây dựng cấu trúc cơ sở dữ liệu cần thiết.

- Sử dụng một công cụ quản lý cơ sở dữ liệu (như phpMyAdmin, DBeaver, MySQL Workbench, v.v.) để kết nối với cơ sở dữ liệu của bạn bằng các thông tin đã cấu hình trong file `.env`.
- **Thực thi** nội dung của file **`Database.sql`** để tạo các bảng và dữ liệu ban đầu cho dự án.

---

## 🎨 II. Thiết Lập Frontend

### 1. Cấu hình URL API

Frontend cần biết URL cơ sở (base URL) của backend để gửi các yêu cầu API.

- Điều hướng đến thư mục `frontend`:
  ```bash
  cd ../../frontend
  ```
- Tạo một file có tên **`.env`** (hoặc `.env.local` tùy theo framework frontend của bạn) ở **thư mục gốc của frontend**.
- Thêm biến môi trường sau:

  ```ini
  VITE_API_BASE_URL=http://localhost/project/backend/public
  ```

  > 📝 **Ghi chú:** Đảm bảo đường dẫn này trỏ chính xác đến thư mục `public` của backend trên server cục bộ của bạn. Tên biến có thể khác nếu bạn không sử dụng Vite (ví dụ: `REACT_APP_API_BASE_URL`).

### 2. Cài đặt và Chạy Dự án

- **Cài đặt các gói phụ thuộc** (dependencies) bằng cách chạy lệnh:
  ```bash
  npm install
  ```
- **Chạy dự án** (Development Server):
  ```bash
  npm run dev
  # hoặc 'npm start' tùy thuộc vào script trong package.json của bạn
  ```
  Dự án frontend bây giờ sẽ chạy trên một cổng cục bộ (thường là `http://localhost:3000` hoặc tương tự).

### 3. 🖼️ Lưu Ý Về Giao Diện Người Dùng (UI)

- **Thư mục `admin`:** Sử dụng thư viện **Tabler** để xây dựng giao diện quản trị.
- **Thư mục `client`:** Sử dụng thư viện **MUI (Material-UI)** để xây dựng giao diện người dùng cuối.

---

## 💻 III. Chạy Dự Án

Sau khi hoàn thành các bước trên, bạn có thể truy cập **frontend** thông qua URL được cung cấp sau khi chạy lệnh `npm run dev`. Frontend sẽ gửi yêu cầu đến **backend** qua URL API đã cấu hình.

- **Frontend URL:** (Kiểm tra terminal của bạn sau khi chạy `npm run dev`)
- **Backend Base URL:** `http://localhost/project/backend/public`
