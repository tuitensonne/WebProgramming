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
} from "@mui/material";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    LocalOffer as LocalOfferIcon,
    HelpOutline as HelpOutlineIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";

import { styled, alpha, useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const location = useLocation();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsFixed(scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const toggleDrawer = (open) => () => setDrawerOpen(open);

    const menuItems = [
        { label: "Du lịch trong nước", path: "/domestic" },
        { label: "Du lịch quốc tế", path: "/international" },
        { label: "Kiểu tour du lịch", path: "/tour-types" },
        { label: "Lịch khởi hành", path: "/schedule" },
        { label: "Cẩm nang du lịch", path: "/guide" },
    ];

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
                                justifyContent: isMobile
                                    ? "center"
                                    : "flex-start",
                            }}
                        >
                            <Logo
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Cpath fill='%23ff6b35' d='M20 10 L30 30 L20 35 L10 30 Z'/%3E%3Cpath fill='%23ff8855' d='M20 10 L30 30 L40 25 L30 5 Z'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='28' font-weight='bold' fill='%23ff6b35'%3Eviatours%3C/text%3E%3C/svg%3E"
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
                                    startIcon={
                                        <HelpOutlineIcon
                                            sx={{ fontSize: 18 }}
                                        />
                                    }
                                    sx={{
                                        color: "#666",
                                        textTransform: "none",
                                        fontSize: "14px",
                                    }}
                                    onClick={() => navigate("/contact")}
                                >
                                    Liên hệ
                                </Button>
                                <ActionButton
                                    variant="outlined"
                                    onClick={() => navigate("/register")}
                                    sx={{
                                        borderColor: "#1976d2",
                                        color: "#1976d2",
                                        borderWidth: 2,
                                        padding: isFixed
                                            ? "6px 18px"
                                            : "10px 24px",
                                    }}
                                >
                                    Đăng ký
                                </ActionButton>
                                <ActionButton
                                    variant="contained"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        padding: isFixed
                                            ? "6px 18px"
                                            : "10px 24px",
                                    }}
                                >
                                    Đăng nhập
                                </ActionButton>
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
                                <ActionButton
                                    variant="contained"
                                    sx={{ backgroundColor: "#1976d2" }}
                                >
                                    Đăng nhập
                                </ActionButton>
                            </Box>
                        )}

                        {isMobile && (
                            <Box sx={{ position: "absolute", right: 0 }}>
                                <ActionButton
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        padding: "8px 16px",
                                        fontSize: "13px",
                                    }}
                                >
                                    Đăng nhập
                                </ActionButton>
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

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
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
                                        bgcolor: isActive
                                            ? "#e3f2fd"
                                            : "transparent",
                                        border: isActive
                                            ? "2px solid #1976d2"
                                            : "none",
                                        "&:hover": {
                                            bgcolor: isActive
                                                ? "#e3f2fd"
                                                : "#f5f5f5",
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
                                            color: isActive
                                                ? "#1976d2"
                                                : "#666",
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
                                bgcolor:
                                    location.pathname === "/"
                                        ? "#e3f2fd"
                                        : "transparent",
                                border:
                                    location.pathname === "/"
                                        ? "2px solid #1976d2"
                                        : "none",
                                "&:hover": {
                                    bgcolor:
                                        location.pathname === "/"
                                            ? "#e3f2fd"
                                            : "#f5f5f5",
                                },
                            }}
                        >
                            <ListItemText
                                primary="Trang chủ"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight:
                                        location.pathname === "/" ? 600 : 400,
                                    color:
                                        location.pathname === "/"
                                            ? "#1976d2"
                                            : "#666",
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
                                    location.pathname === "/contact"
                                        ? "#e3f2fd"
                                        : "transparent",
                                border:
                                    location.pathname === "/contact"
                                        ? "2px solid #1976d2"
                                        : "none",
                                "&:hover": {
                                    bgcolor:
                                        location.pathname === "/contact"
                                            ? "#e3f2fd"
                                            : "#f5f5f5",
                                },
                            }}
                        >
                            <ListItemText
                                primary="Liên hệ"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight:
                                        location.pathname === "/contact"
                                            ? 600
                                            : 400,
                                    color:
                                        location.pathname === "/contact"
                                            ? "#1976d2"
                                            : "#666",
                                }}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => {
                                navigate("/book-tour");
                                toggleDrawer(false)();
                            }}
                            sx={{
                                borderRadius: 2,
                                bgcolor:
                                    location.pathname === "/book-tour"
                                        ? "#e3f2fd"
                                        : "transparent",
                                border:
                                    location.pathname === "/book-tour"
                                        ? "2px solid #1976d2"
                                        : "none",
                                "&:hover": {
                                    bgcolor:
                                        location.pathname === "/book-tour"
                                            ? "#e3f2fd"
                                            : "#f5f5f5",
                                },
                            }}
                        >
                            <ListItemText
                                primary="Đặt tour"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight:
                                        location.pathname === "/book-tour"
                                            ? 600
                                            : 400,
                                    color:
                                        location.pathname === "/book-tour"
                                            ? "#1976d2"
                                            : "#666",
                                }}
                            />
                        </ListItem>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Header;
