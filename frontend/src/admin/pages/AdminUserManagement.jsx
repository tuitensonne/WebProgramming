import React, { useState, useEffect } from "react";
import {
    Box,
    Avatar,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
} from "@mui/material";
import { Lock, LockOpen, Refresh } from "@mui/icons-material";

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fakeUsers = [
            {
                id: 1,
                role: "admin",
                fullName: "Nguyen Van A",
                avatarUrl: "https://i.pravatar.cc/150?img=1",
                email: "admin@bktours.com",
                phone: "0909000001",
                isActive: true,
            },
            {
                id: 2,
                role: "user",
                fullName: "Tran Thi B",
                avatarUrl: "https://i.pravatar.cc/150?img=2",
                email: "tranb@gmail.com",
                phone: "0909000002",
                isActive: true,
            },
            {
                id: 3,
                role: "user",
                fullName: "Le Van C",
                avatarUrl: "https://i.pravatar.cc/150?img=3",
                email: "levanc@gmail.com",
                phone: "0909000003",
                isActive: false,
            },
            {
                id: 4,
                role: "editor",
                fullName: "Pham Thi D",
                avatarUrl: "https://i.pravatar.cc/150?img=4",
                email: "phamd@gmail.com",
                phone: "0909000004",
                isActive: true,
            },
            {
                id: 5,
                role: "user",
                fullName: "Do Van E",
                avatarUrl: "https://i.pravatar.cc/150?img=5",
                email: "doe@gmail.com",
                phone: "0909000005",
                isActive: true,
            },
        ];
        setUsers(fakeUsers);
    }, []);

    const handleResetPassword = (userId) => {
        const user = users.find((u) => u.id === userId);
        alert(`✅ Mật khẩu của ${user.fullName} đã được reset!`);
    };

    const handleToggleActive = (userId, isActive) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, isActive: !isActive } : u
            )
        );
    };

    const filteredUsers = users.filter(
        (u) =>
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 2 }}>
            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 2, color: "#1976d2" }}
            >
                Quản lý Người dùng
            </Typography>

            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                    label="Tìm kiếm người dùng..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 300 }}
                />
                <Button variant="contained" color="primary">
                    + Thêm Người dùng
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                        <TableRow>
                            <TableCell sx={{ color: "#fff" }}>Avatar</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Họ Tên</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Role</TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                                Trạng thái
                            </TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                            >
                                <TableCell>
                                    <Avatar src={user.avatarUrl} />
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            backgroundColor:
                                                user.role === "admin"
                                                    ? "#ff7043"
                                                    : user.role === "editor"
                                                    ? "#42a5f5"
                                                    : "#9ccc65",
                                            color: "#fff",
                                            display: "inline-block",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {user.role}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        color={user.isActive ? "green" : "red"}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            handleResetPassword(user.id)
                                        }
                                    >
                                        <Refresh />
                                    </IconButton>
                                    <IconButton
                                        color={
                                            user.isActive ? "error" : "success"
                                        }
                                        onClick={() =>
                                            handleToggleActive(
                                                user.id,
                                                user.isActive
                                            )
                                        }
                                    >
                                        {user.isActive ? (
                                            <Lock />
                                        ) : (
                                            <LockOpen />
                                        )}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
