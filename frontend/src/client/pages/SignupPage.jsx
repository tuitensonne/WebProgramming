import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  Snackbar,
  keyframes,
} from "@mui/material";

import api from "../../api/api";

import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
} from "@mui/icons-material";

import signup from "../../assets/images/signup.png";
import logo from "../../assets/images/logo.png";

const slideFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [resetEmail, setResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (!value.trim()) {
      newErrors[name] = `Trường này không được để trống`;
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors[name] = "Email không hợp lệ";
    } else if (
      name === "phone" &&
      !/^\d{10,}$/.test(value.replace(/[^\d]/g, ""))
    ) {
      newErrors[name] = "Số điện thoại không hợp lệ";
    } else if (name === "password" && value.length < 6) {
      newErrors[name] = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (name === "confirmPassword" && value !== formData.password) {
      newErrors[name] = "Mật khẩu xác nhận không khớp";
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `Trường này không được để trống`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (
      formData.phone &&
      !/^\d{10,}$/.test(formData.phone.replace(/[^\d]/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      setErrorMessage("Vui lòng điền đầy đủ và chính xác thông tin!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const { confirmPassword, ...signupData } = formData;

      const res = await api.post("/auth/signup", signupData);

      if (res.data?.success) {
        showSnackbar("Tạo user thành công!", "success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else {
        showSnackbar("Gửi thất bại. Vui lòng thử lại!", "error");
      }
    } catch (error) {
      console.error("Error sending contact:", error);
      showSnackbar("Có lỗi xảy ra khi đăng ký!", "error");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = (delay) => ({
    animation: `${fadeInUp} 0.5s ease-out ${delay}s both`,
    "& .MuiOutlinedInput-root": {
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateX(5px)",
        boxShadow: "0 4px 12px rgba(255, 95, 0, 0.15)",
      },
      "&.Mui-focused": {
        transform: "scale(1.02)",
        boxShadow: "0 4px 20px rgba(255, 95, 0, 0.2)",
      },
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        animation: `${slideFromRight} 0.6s ease-out`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          background: "white",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={signup}
          alt="Signup Illustration"
          sx={{
            width: "80%",
            objectFit: "contain",
            animation: `${fadeInUp} 0.8s ease-out`,
            zIndex: 1,
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                animation: `${fadeInUp} 0.5s ease-out 0.2s both`,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: 200,
                  height: 100,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ animation: `${fadeInUp} 0.5s ease-out 0.2s both` }}
            >
              Đăng ký tài khoản
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ animation: `${fadeInUp} 0.5s ease-out 0.3s both` }}
            >
              Điền thông tin để tạo tài khoản mới
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={
                <span>
                  Họ và tên <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.fullName && !!errors.fullName}
              helperText={touched.fullName && errors.fullName}
              sx={{
                ...textFieldStyle(0.4),
                "& .MuiFormHelperText-root": { minHeight: "5px" },
                "& .MuiFormControl-root": { marginBottom: "5px" },
                height: "70px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#FF5F00" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Email <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{
                ...textFieldStyle(0.4),
                "& .MuiFormHelperText-root": { minHeight: "5px" },
                "& .MuiFormControl-root": { marginBottom: "5px" },
                height: "70px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#FF5F00" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              sx={{
                ...textFieldStyle(0.4),
                "& .MuiFormHelperText-root": { minHeight: "5px" },
                "& .MuiFormControl-root": { marginBottom: "5px" },
                height: "70px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "#FF5F00" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Mật khẩu <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              sx={{
                ...textFieldStyle(0.4),
                "& .MuiFormHelperText-root": { minHeight: "5px" },
                "& .MuiFormControl-root": { marginBottom: "5px" },
                height: "70px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#FF5F00" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "rotate(180deg)" },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ color: "#FF5F00" }} />
                      ) : (
                        <Visibility sx={{ color: "#FF5F00" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={
                <span>
                  Nhập lại mật khẩu <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={{
                ...textFieldStyle(0.4),
                "& .MuiFormHelperText-root": { minHeight: "5px" },
                "& .MuiFormControl-root": { marginBottom: "5px" },
                height: "70px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#FF5F00" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "rotate(180deg)" },
                      }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ color: "#FF5F00" }} />
                      ) : (
                        <Visibility sx={{ color: "#FF5F00" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                bgcolor: "#ed782aff",
                borderRadius: 1,
                py: 1.5,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 500,
                mb: 3,
                animation: `${fadeInUp} 0.5s ease-out 0.8s both`,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#fbbb91ff",
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 20px rgba(187, 131, 79, 0.3)",
                },
              }}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <Box
              sx={{
                textAlign: "center",
                animation: `${fadeInUp} 0.5s ease-out 1s both`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/login")}
                  underline="hover"
                  sx={{
                    color: "#FF5F00",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    "&:hover": { color: "#CC4A00" },
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>
          </Box>

          <Dialog
            open={openForgotPassword}
            onClose={() => setOpenForgotPassword(false)}
            maxWidth="xs"
            fullWidth
            TransitionComponent={Zoom}
          >
            <DialogTitle sx={{ fontWeight: "bold" }}>Quên mật khẩu</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
              </Typography>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#FF5F00" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenForgotPassword(false)}>Hủy</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenForgotPassword(false);
                  setResetEmail("");
                }}
                disabled={!resetEmail}
                sx={{
                  background:
                    "linear-gradient(135deg, #FF8C42 0%, #FF5F00 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #E6762E 0%, #CC4A00 100%)",
                  },
                }}
              >
                Gửi liên kết
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
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
