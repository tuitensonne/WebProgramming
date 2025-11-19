import { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";
import {
    Menu as MenuIcon,
    AccountCircle,
    Notifications,
    Close as CloseIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.6s ease",
}));

const Logo = styled("img")(({ theme }) => ({
    height: 40,
    cursor: "pointer",
}));

const AdminHeader = ({ sidebarOpen, onToggleSidebar }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFixed, setIsFixed] = useState(false);
    const [username, setUsername] = useState("");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
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
        window.location.reload();
    };

    return (
        <Box>
            <StyledAppBar
                position={isFixed ? "fixed" : "relative"}
                sx={{ zIndex: 1100 }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <IconButton onClick={onToggleSidebar} sx={{ mr: 2 }}>
                            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>

                        <Logo
                            src="https://via.placeholder.com/120x40?text=Admin"
                            alt="AdminLogo"
                        />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <IconButton>
                                <Notifications />
                            </IconButton>
                            <Button
                                onClick={handleMenuOpen}
                                startIcon={<AccountCircle />}
                                sx={{ textTransform: "none" }}
                            >
                                {username}
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </StyledAppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Menu Item 1" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Menu Item 2" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

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
