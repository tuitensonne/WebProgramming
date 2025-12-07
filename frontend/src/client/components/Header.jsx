import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  LocalOffer as LocalOfferIcon,
  HelpOutline as HelpOutlineIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { styled, alpha, useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { authUtils } from "../../utils/auth";
import api from "../../api/api";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.8s ease",
}));

const Logo = styled("img")(({ theme }) => ({
  height: 40,
  cursor: "pointer",
  transition: "all 0.4s ease",
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: "#666",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  padding: "6px 12px",
  "&:hover": {
    backgroundColor: alpha("#000", 0.04),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "15px",
  fontWeight: 500,
  padding: "10px 24px",
  borderRadius: "8px",
  marginLeft: "12px",
  transition: "all 0.3s ease",
}));

const Header = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { token, userRole, userData } = authUtils.getAuth();
  const isAuthenticated = authUtils.isAuthenticated();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get("footers");
        console.log(res.data);
        if (res.data?.success) {
          console.log(res.data.data.logo_url);
          setLogoUrl(res.data.data.logo_url);
        } else {
          console.error("Failed to fetch sections:", res.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsFixed(scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleLogout = () => {
    handleUserMenuClose();
    authUtils.clearAuth();
    authUtils.navigateToApp("/");
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate("/profile");
  };

  const menuItems = [
    { label: "Du lịch trong nước", path: "/domestic" },
    { label: "Du lịch quốc tế", path: "/international" },
    { label: "Kiểu tour du lịch", path: "/tour-types" },
    { label: "Lịch khởi hành", path: "/schedule" },
    { label: "Cẩm nang du lịch", path: "/guide" },
  ];

  const UserMenu = () => (
    <>
      <Box
        onClick={handleUserMenuOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: alpha("#000", 0.04),
          },
        }}
      >
        <Avatar
          src={userData?.avatarUrl}
          alt={userData?.fullName || "User"}
          sx={{
            width: isFixed ? 32 : 36,
            height: isFixed ? 32 : 36,
            transition: "all 0.3s ease",
          }}
        >
          {!userData?.avatarUrl && (userData?.fullName?.[0] || "U")}
        </Avatar>
        <Typography
          sx={{
            color: "#333",
            fontSize: "14px",
            fontWeight: 500,
            display: "block",
            maxWidth: 100,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userData?.fullName || "User"}
        </Typography>

        <KeyboardArrowDownIcon sx={{ color: "#666", fontSize: 20 }} />
      </Box>

      <Menu
        anchor="right"
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {userData?.fullName || "User"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block" }}
          >
            {userData?.email || ""}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: "#666" }} />
          Hồ sơ cá nhân
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: alpha("#d32f2f", 0.08),
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Box>
      <StyledAppBar
        position={isFixed ? "fixed" : "relative"}
        sx={{
          height: isFixed ? 70 : { md: 120, xs: 90 },
          boxShadow: isFixed
            ? "0 4px 20px rgba(0,0,0,0.1)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          transform: isFixed ? "translateY(0)" : "none",
          transition: "all 0.4s ease",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              minHeight: isFixed ? "64px" : "80px",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            {isMobile && (
              <Box sx={{ position: "absolute", left: 0 }}>
                <IconButton onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            <Box
              sx={{
                flex: isMobile ? 1 : "none",
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Logo
                src={logoUrl}
                alt="Viatours"
                onClick={() => navigate("/")}
                style={{
                  height: isFixed ? 32 : 40,
                }}
              />
            </Box>

            {!isTablet && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  sx={{
                    color: "#666",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Đặt tour
                </Button>
                <Button
                  sx={{
                    color: "#666",
                    textTransform: "none",
                    fontSize: "14px",
                  }}
                  onClick={() => navigate("/about-us")}
                >
                  Giới thiệu
                </Button>
                <Button
                  startIcon={<HelpOutlineIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: "#666",
                    textTransform: "none",
                    fontSize: "14px",
                  }}
                  onClick={() => navigate("/contact")}
                >
                  Liên hệ
                </Button>

                {!isAuthenticated ? (
                  <>
                    <ActionButton
                      variant="outlined"
                      onClick={() => navigate("/register")}
                      sx={{
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        borderWidth: 2,
                        padding: isFixed ? "6px 18px" : "10px 24px",
                      }}
                    >
                      Đăng ký
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      onClick={() => navigate("/login")}
                      sx={{
                        backgroundColor: "#1976d2",
                        padding: isFixed ? "6px 18px" : "10px 24px",
                      }}
                    >
                      Đăng nhập
                    </ActionButton>
                  </>
                ) : (
                  <UserMenu />
                )}
              </Box>
            )}

            {isTablet && !isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  sx={{
                    color: "#666",
                    textTransform: "none",
                  }}
                >
                  Đặt tour
                </Button>
                {!isAuthenticated ? (
                  <ActionButton
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{ backgroundColor: "#1976d2" }}
                  >
                    Đăng nhập
                  </ActionButton>
                ) : (
                  <UserMenu />
                )}
              </Box>
            )}

            {isMobile && (
              <Box sx={{ position: "absolute", right: 0 }}>
                {!isAuthenticated ? (
                  <ActionButton
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                      backgroundColor: "#1976d2",
                      padding: "8px 16px",
                      fontSize: "13px",
                    }}
                  >
                    Đăng nhập
                  </ActionButton>
                ) : (
                  <></>
                )}
              </Box>
            )}
          </Toolbar>

          {!isTablet && !isFixed && (
            <Box sx={{ borderTop: "1px solid #e0e0e0", py: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                {menuItems.map((item) => (
                  <NavButton
                    key={item.label}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleMenuOpen}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </StyledAppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 260,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: "#fafafa",
          }}
        >
          {/* User info in drawer */}
          {isAuthenticated && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <Avatar
                  src={userData?.avatar}
                  alt={userData?.fullName || "User"}
                  sx={{ width: 48, height: 48 }}
                >
                  {!userData?.avatar && (userData?.fullName?.[0] || "U")}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userData?.fullName || "User"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {userData?.email || ""}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          <List
            sx={{
              gap: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem
                  key={item.label}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    toggleDrawer(false)();
                  }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "#e3f2fd" : "transparent",
                    border: isActive ? "2px solid #1976d2" : "none",
                    "&:hover": {
                      bgcolor: isActive ? "#e3f2fd" : "#f5f5f5",
                    },
                    transition: "0.2s ease",
                  }}
                  button
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#1976d2" : "#666",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Box
            sx={{
              mt: "auto",
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <ListItem
              button
              onClick={() => {
                navigate("/");
                toggleDrawer(false)();
              }}
              sx={{
                borderRadius: 2,
                bgcolor: location.pathname === "/" ? "#e3f2fd" : "transparent",
                border:
                  location.pathname === "/" ? "2px solid #1976d2" : "none",
                "&:hover": {
                  bgcolor: location.pathname === "/" ? "#e3f2fd" : "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary="Trang chủ"
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: location.pathname === "/" ? 600 : 400,
                  color: location.pathname === "/" ? "#1976d2" : "#666",
                }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                navigate("/contact");
                toggleDrawer(false)();
              }}
              sx={{
                borderRadius: 2,
                bgcolor:
                  location.pathname === "/contact" ? "#e3f2fd" : "transparent",
                border:
                  location.pathname === "/contact"
                    ? "2px solid #1976d2"
                    : "none",
                "&:hover": {
                  bgcolor:
                    location.pathname === "/contact" ? "#e3f2fd" : "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary="Liên hệ"
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: location.pathname === "/contact" ? 600 : 400,
                  color: location.pathname === "/contact" ? "#1976d2" : "#666",
                }}
              />
            </ListItem>

            {isAuthenticated ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    navigate("/profile");
                    toggleDrawer(false)();
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <PersonIcon sx={{ mr: 1.5, color: "#666" }} />
                  <ListItemText
                    primary="Hồ sơ cá nhân"
                    primaryTypographyProps={{ fontSize: 15 }}
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: alpha("#d32f2f", 0.08),
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5 }} />
                  <ListItemText
                    primary="Đăng xuất"
                    primaryTypographyProps={{ fontSize: 15 }}
                  />
                </ListItem>
              </>
            ) : (
              <ListItem
                button
                onClick={() => {
                  navigate("/login");
                  toggleDrawer(false)();
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#1976d2",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                }}
              >
                <ListItemText
                  primary="Đăng nhập"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                />
              </ListItem>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
