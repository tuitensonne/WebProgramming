import {
  Box,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useEffect, useState } from "react";
import api from "../../api/api";
import login from "../../assets/images/login.png";

export default function ContactPage() {
  const [companyContact, setCompanyContact] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch Footer
  useEffect(() => {
    const fetchCompanyContact = async () => {
      try {
        const res = await api.get("footers");
        if (res.data?.success) {
          const data = Array.isArray(res.data.data)
            ? res.data.data[0]
            : res.data.data;
          setCompanyContact(data);
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
      }
    };
    fetchCompanyContact();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (form.phone && !/^\d{8,15}$/.test(form.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!form.message.trim()) newErrors.message = "Vui lòng nhập nội dung";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/contacts", form);

      if (res.data?.success) {
        showSnackbar("Gửi liên hệ thành công!", "success");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          title: "",
          message: "",
        });
      } else {
        showSnackbar("Gửi thất bại. Vui lòng thử lại!", "error");
      }
    } catch (error) {
      console.error("Error sending contact:", error);
      showSnackbar("Có lỗi xảy ra khi gửi liên hệ!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        py: 8,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          minHeight: { md: 650 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "40px 0 0 40px",
          overflow: "hidden",
        }}
      >
        {/* LEFT IMAGE */}
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            component="img"
            src={login}
            alt="city"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* FORM */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            py: 6,
            px: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Liên hệ với chúng tôi
          </Typography>
          <Typography sx={{ mb: 4, color: "text.secondary", fontSize: 15 }}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label={
                <span>
                  Họ và tên <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fullName"
              size="small"
              error={!!errors.fullName}
              helperText={errors.fullName}
              value={form.fullName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Email <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="email"
              size="small"
              error={!!errors.email}
              helperText={errors.email}
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              size="small"
              value={form.phone}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              size="small"
              value={form.title}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Lời nhắn <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="message"
              multiline
              rows={4}
              size="small"
              error={!!errors.message}
              helperText={errors.message}
              value={form.message}
              onChange={handleChange}
            />

            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(90deg, #4a6cf7 0%, #2f80ed 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #3b5ae0 0%, #256adb 100%)",
                },
              }}
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            py: 6,
            px: 3,
            backgroundColor: "#fff",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Liên hệ
          </Typography>

          <Typography>
            {companyContact?.email || "contact@bktours.vn"}
          </Typography>

          <Typography sx={{ mb: 4 }}>
            {companyContact?.hotline || "contact@bktours.vn"}
          </Typography>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Địa chỉ
          </Typography>

          <Typography sx={{ mb: 4 }}>
            {companyContact?.address || "268 Lý Thường Kiệt, Quận"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <a
              href={companyContact?.facebook_link}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <FacebookIcon sx={{ fontSize: 32, cursor: "pointer" }} />
            </a>
            <a
              href={companyContact?.instagram_link}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <InstagramIcon sx={{ fontSize: 32, cursor: "pointer" }} />
            </a>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
