import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link, Paper } from "@mui/material";
import { Home, NavigateNext } from "@mui/icons-material";

// 1. Bảng dịch từ đường dẫn URL sang tên hiển thị
const breadcrumbNameMap = {
  "/travel-guides": "Cẩm nang du lịch",
  "/contact": "Liên hệ",
};

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px 8px",
        margin: "16px auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        width: "min(90%, 1100px)",
        mb: 3,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {/* Nút Home luôn luôn hiển thị đầu tiên */}
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5, color: "#4a4a4a" }} />
        </Link>

        {/* Vòng lặp tạo ra các đoạn breadcrumb tiếp theo */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // Lấy tên hiển thị từ map, nếu không có thì lấy chính đoạn url đó
          const displayName = breadcrumbNameMap[to] || value;

          return last ? (
            // Phần tử cuối cùng (Trang hiện tại) -> Không click được, chữ đậm
            <Typography
              color="text.primary"
              key={to}
              sx={{ fontWeight: 500, color: "#333" }}
            >
              {displayName}
            </Typography>
          ) : (
            // Các phần tử cha -> Click được để quay lại
            <Link
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={to}
              key={to}
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Paper>
  );
}

export default Breadcrumb;
