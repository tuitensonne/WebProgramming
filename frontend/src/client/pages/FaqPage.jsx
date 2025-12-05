import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    CircularProgress,
    Button,
    Tabs,
    Tab,
    Paper, // Dùng Paper cho các khối nội dung
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CategoryIcon from "@mui/icons-material/Category";
import { motion } from "framer-motion";
// FIX LỖI: Giả định api nằm ở cấp trên (ví dụ: ../../api/api hoặc ../api/api)
import api from "../../api/api";

// --- API Endpoints ---
const FAQ_API_ENDPOINT = "/faqs";
const CATEGORIES_API_ENDPOINT = "/faqs/categories";

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.1, duration: 0.6 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
// --- END FRAMER MOTION VARIANTS ---

/**
 * Trang FAQ dành cho khách hàng, sử dụng Material UI Accordion và lọc theo danh mục.
 */
export const FaqPage = () => {
    const ACCENT_COLOR = "#ff7043";

    const [faqs, setFaqs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(0); // 0 là 'Tất cả'

    // 1. FETCH DATA TỪ API (FAQs và Categories)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setIsError(false);
            try {
                // Fetch Categories
                const catRes = await api.get(CATEGORIES_API_ENDPOINT);
                let cats = catRes.data?.success ? catRes.data.data : [];
                // Thêm danh mục 'Tất cả' vào đầu
                cats = [
                    { id: 0, categoryName: "Tất cả", categoryOrder: -1 },
                    ...cats,
                ];
                setCategories(cats);

                // Fetch FAQs
                const faqRes = await api.get(FAQ_API_ENDPOINT);
                if (faqRes.data?.success) {
                    // Giả định API trả về mảng các FAQ (id, question, answer, categoryId...)
                    setFaqs(faqRes.data.data.faqs || []);
                } else {
                    setIsError(true);
                }
            } catch (error) {
                console.error("Error fetching FAQ data:", error);
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChangeCategory = useCallback((event, newValue) => {
        setSelectedCategory(newValue);
    }, []);

    // Logic lọc FAQ theo danh mục
    const filteredFaqs = useMemo(() => {
        if (selectedCategory === 0) {
            // Sắp xếp theo faqOrder, categoryOrder, rồi id
            return faqs.sort((a, b) => a.faqOrder - b.faqOrder);
        }
        return faqs
            .filter((faq) => faq.categoryId === selectedCategory)
            .sort((a, b) => a.faqOrder - b.faqOrder);
    }, [faqs, selectedCategory]);

    // Tìm tên danh mục hiện tại
    const currentCategoryName = useMemo(() => {
        const cat = categories.find((c) => c.id === selectedCategory);
        return cat
            ? cat.categoryName
            : selectedCategory === 0
            ? "Tất cả Câu hỏi"
            : "Danh mục không tồn tại";
    }, [categories, selectedCategory]);

    if (loading) {
        return (
            <Box textAlign="center" py={10} minHeight="80vh">
                <CircularProgress sx={{ color: ACCENT_COLOR }} />
                <Typography mt={2}>Đang tải dữ liệu FAQ...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box textAlign="center" py={10} minHeight="80vh">
                <Typography variant="h6" color="error">
                    Không thể tải dữ liệu Hỏi/Đáp. Vui lòng kiểm tra kết nối.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 8 },
                backgroundColor: "#f7f7f7",
                minHeight: "80vh",
            }}
            component={motion.div}
            initial="hidden"
            animate="visible" // Dùng animate thay vì whileInView để chạy animation 1 lần
            variants={containerVariants}
        >
            {/* Header Section */}
            <Box
                textAlign="center"
                maxWidth="1000px"
                mx="auto"
                mb={6}
                component={motion.div}
                variants={itemVariants}
            >
                <HelpOutlineIcon
                    sx={{ fontSize: 50, color: ACCENT_COLOR, mb: 1 }}
                />
                <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{ color: "#1A1A1A", mb: 1 }}
                >
                    TRUNG TÂM HỖ TRỢ VÀ GIẢI ĐÁP
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Tìm kiếm câu trả lời nhanh chóng cho các thắc mắc phổ biến
                    về dịch vụ, đặt tour và các chính sách của BK Tour.
                </Typography>
            </Box>

            {/* Image/CTA Section (Added Section) */}
            <Paper
                elevation={3}
                sx={{
                    mb: 8,
                    borderRadius: 3,
                    overflow: "hidden",
                    p: { xs: 3, md: 5 },
                    backgroundImage: `url(https://placehold.co/1200x200/ff7043/ffffff?text=H%E1%BB%97+TR%E1%BB%A2+24%2F7)`,
                    backgroundSize: "cover",
                    color: "#fff",
                    textAlign: "left",
                    position: "relative",
                }}
                component={motion.div}
                variants={itemVariants}
            >
                {/* Overlay làm tối ảnh để chữ nổi bật */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        zIndex: 1,
                        borderRadius: 3,
                    }}
                />

                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    sx={{ position: "relative", zIndex: 2 }}
                >
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                        >
                            Không tìm thấy câu trả lời?
                        </Typography>
                        <Typography variant="body1">
                            Hãy gửi câu hỏi của bạn cho chúng tôi, đội ngũ hỗ
                            trợ sẽ phản hồi trong vòng 24 giờ.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        textAlign={{ xs: "center", md: "right" }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: "#fff",
                                color: ACCENT_COLOR,
                                "&:hover": { backgroundColor: "#f0f0f0" },
                            }}
                        >
                            Gửi Yêu cầu Hỗ trợ
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main Content: Category Filter (Left) and Accordion List (Right) */}
            <Grid container spacing={4}>
                {/* Cột Trái: Category Tabs (Responsive: Full width on mobile, 30% on desktop) */}
                <Grid item xs={12} md={3}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            // Dùng sticky cho desktop để tabs giữ nguyên khi cuộn
                            position: { md: "sticky" },
                            top: { md: 20 },
                        }}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2, display: { xs: "none", md: "block" } }}
                        >
                            <CategoryIcon
                                sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                    color: ACCENT_COLOR,
                                }}
                            />{" "}
                            Danh mục
                        </Typography>

                        {/* Tabs Lọc */}
                        <Tabs
                            value={selectedCategory}
                            onChange={handleChangeCategory}
                            // Responsive: Stacked vertical on desktop, Scrollable horizontal on mobile
                            orientation={
                                window.innerWidth > 960
                                    ? "vertical"
                                    : "horizontal"
                            }
                            variant={
                                window.innerWidth > 960
                                    ? "scrollable"
                                    : "scrollable"
                            }
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                width: "100%",
                                borderRight: { md: "none" },
                                "& .MuiTabs-indicator": {
                                    backgroundColor: ACCENT_COLOR,
                                },
                                "& .MuiTab-root": {
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    "&.Mui-selected": {
                                        color: ACCENT_COLOR,
                                    },
                                    // Tối ưu cho layout dọc/ngang
                                    justifyContent: "flex-start",
                                    padding: "12px 16px",
                                },
                            }}
                        >
                            {categories.map((cat) => (
                                <Tab
                                    key={cat.id}
                                    label={cat.categoryName}
                                    value={cat.id}
                                />
                            ))}
                        </Tabs>
                    </Paper>
                </Grid>

                {/* Cột Phải: FAQ Accordion List (Responsive: 70% on desktop) */}
                <Grid item xs={12} md={9}>
                    <Box mb={3} component={motion.div} variants={itemVariants}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            color={ACCENT_COLOR}
                            textAlign="left"
                        >
                            {currentCategoryName} ({filteredFaqs.length})
                        </Typography>
                    </Box>

                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <Accordion
                                key={faq.id}
                                component={motion.div}
                                variants={itemVariants}
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                    "&:before": { display: "none" },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon
                                            sx={{ color: ACCENT_COLOR }}
                                        />
                                    }
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#fff",
                                        "&.Mui-expanded": {
                                            minHeight: 48,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ color: "#1A1A1A" }}
                                    >
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        textAlign: "left",
                                        borderTop: "1px solid #eee",
                                        backgroundColor: "#fcfcfc",
                                    }}
                                >
                                    {/* Sử dụng dangerouslySetInnerHTML để render nội dung TEXT/HTML nếu có */}
                                    <Typography
                                        color="text.secondary"
                                        dangerouslySetInnerHTML={{
                                            __html: faq.answer,
                                        }}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <Box
                            textAlign="center"
                            py={5}
                            component={motion.div}
                            variants={itemVariants}
                        >
                            <Typography variant="h6" color="text.secondary">
                                Không tìm thấy câu hỏi nào trong danh mục này.
                            </Typography>
                            {selectedCategory !== 0 && (
                                <Button
                                    onClick={() => setSelectedCategory(0)}
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: ACCENT_COLOR,
                                        "&:hover": {
                                            backgroundColor: "#e55b2d",
                                        },
                                    }}
                                >
                                    Xem tất cả câu hỏi
                                </Button>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
