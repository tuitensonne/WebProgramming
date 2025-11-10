import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    TravelExplore as TourIcon,
    Category as CategoryIcon,
    Event as EventIcon,
    BookOnline as BookOnlineIcon,
    Article as ArticleIcon,
    Image as ImageIcon,
    Home as HomeIcon,
    Flag as BannerIcon,
    AccountBalance as FooterIcon,
    Close as CloseIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function AdminSidebar({ open, setOpen }) {
    const location = useLocation();
    const toggleDrawer = () => setOpen(!open);

    const menuItems = [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
        {
            label: "Quản lý Người dùng",
            icon: <PeopleIcon />,
            path: "/admin/users",
        },
        { label: "Quản lý Tour", icon: <TourIcon />, path: "/admin/tours" },
        {
            label: "Danh mục Tour",
            icon: <CategoryIcon />,
            path: "/admin/tour-categories",
        },
        {
            label: "Lịch trình Tour",
            icon: <EventIcon />,
            path: "/admin/tour-itineraries",
        },
        {
            label: "Quản lý Đặt tour",
            icon: <BookOnlineIcon />,
            path: "/admin/bookings",
        },
        {
            label: "Quản lý Bài viết",
            icon: <ArticleIcon />,
            path: "/admin/posts",
        },
        { label: "Quản lý Media", icon: <ImageIcon />, path: "/admin/media" },
        {
            label: "Trang chủ / Sections",
            icon: <HomeIcon />,
            path: "/admin/landing-page",
        },
        {
            label: "Quản lý Banner",
            icon: <BannerIcon />,
            path: "/admin/banners",
        },
        {
            label: "Quản lý Footer",
            icon: <FooterIcon />,
            path: "/admin/footer",
        },
    ];

    return (
        <>
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    position: "fixed",
                    top: 20,
                    left: open ? drawerWidth + 8 : 8,
                    zIndex: 1300,
                    backgroundColor: "#ff7043",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e64a19" },
                    borderRadius: "50%",
                    p: 1.5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transition: "left 0.3s",
                }}
            >
                {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Drawer
                variant="permanent"
                sx={{
                    width: open ? drawerWidth : 60,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : 60,
                        overflowX: "hidden",
                        transition: "width 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        color: "#1976d2",
                        borderRight: "1px solid #ddd",
                    },
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            color: "#1976d2",
                            display: open ? "block" : "none",
                        }}
                    >
                        BK Tours Admin
                    </Typography>
                </Toolbar>
                <Divider />
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItemButton
                                key={item.label}
                                component={Link}
                                to={item.path}
                                selected={isActive}
                                sx={{
                                    color: "#1976d2",
                                    mb: 0.5,
                                    borderRadius: 1,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2,
                                    "&.Mui-selected": {
                                        backgroundColor: "#ff7043",
                                        color: "#fff",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#ffe0d6",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "#fff" : "#1976d2",
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {open && <ListItemText primary={item.label} />}{" "}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
}
