import { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Menu,
    MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import { styled, alpha, useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.8s ease",
}));

const Logo = styled("img")(({ theme }) => ({
    height: 40,
    cursor: "pointer",
    transition: "all 0.4s ease",
}));

const AdminHeader = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFixed, setIsFixed] = useState(false);
    const [username, setUsername] = useState("");

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        // giả lập lấy username từ localStorage
        const user = localStorage.getItem("adminUsername") || "Admin";
        setUsername(user);

        const handleScroll = () => setIsFixed(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDrawer = (open) => () => setDrawerOpen(open);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        localStorage.removeItem("adminUsername");
        window.location.reload(); // hoặc navigate về /login
    };

    const menuItems = [
        { label: "Dashboard" },
        { label: "Users" },
        { label: "Products" },
        { label: "Pages" },
        { label: "Orders" },
    ];

    return (
        <Box>
            <StyledAppBar
                position={isFixed ? "fixed" : "relative"}
                sx={{ zIndex: 1100 }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{ justifyContent: "space-between" }}
                    >
                        {isMobile && (
                            <IconButton onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Logo
                                src="https://via.placeholder.com/120x40?text=Admin"
                                alt="AdminLogo"
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
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        sx={{ textTransform: "none" }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}

                                <Button
                                    startIcon={<AccountCircle />}
                                    onClick={handleMenuOpen}
                                    sx={{ textTransform: "none" }}
                                >
                                    {username}
                                </Button>
                            </Box>
                        )}

                        {isMobile && (
                            <Button
                                onClick={handleMenuOpen}
                                startIcon={<AccountCircle />}
                            >
                                {username}
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </StyledAppBar>

            {/* Drawer Mobile */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.label}
                                onClick={toggleDrawer(false)}
                            >
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Account Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        handleLogout();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AdminHeader;
