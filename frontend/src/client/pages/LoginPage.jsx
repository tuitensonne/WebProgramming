import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Container,
  keyframes,
  Snackbar,
  Alert,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/images/logo.png";
import login from "../../assets/images/login.png";
import api from "../../api/api";
import { authUtils } from "../../utils/auth";

const slideFromLeft = keyframes`
  from {  
    transform: translateX(-100%);
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("Login response:", response.data.data);
      if (response.data.success) {
        authUtils.setAuth(
          response.data.data.token,
          response.data.data.user.role,
          response.data.data.user
        );

        if (response.data.data.user.role === "admin") {
          authUtils.navigateToApp("/admin");
        } else {
          authUtils.navigateToApp("/");
        }
        showSnackbar("Đăng nhập thành công!", "success");

        setTimeout(() => {
          navigate("/");
        }, 800);

        return;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";

      showSnackbar(errorMessage, "error");

      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        animation: `${slideFromLeft} 0.6s ease-out`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "#fff",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 5,
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
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1a1a1a",
                animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
              }}
            >
              Đăng nhập
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                animation: `${fadeInUp} 0.5s ease-out 0.4s both`,
              }}
            >
              Hãy đăng nhập vào tài khoản của bạn để biết thêm nhiều thông tin
              thú vị hơn!
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                mb: 3,
                animation: `${fadeInUp} 0.5s ease-out 0.5s both`,
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateX(5px)" },
                  "&.Mui-focused": { transform: "scale(1.02)" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                animation: `${fadeInUp} 0.5s ease-out 0.6s both`,
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateX(5px)" },
                  "&.Mui-focused": { transform: "scale(1.02)" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.2)" },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                animation: `${fadeInUp} 0.5s ease-out 0.9s both`,
              }}
            >
              Don't have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/register")}
                sx={{
                  color: "#ed782aff",
                  textDecoration: "none",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          background: "white",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={login}
          alt="Login Illustration"
          sx={{
            width: "80%",
            objectFit: "contain",
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        />
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
