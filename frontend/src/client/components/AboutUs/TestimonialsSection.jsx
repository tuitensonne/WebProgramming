import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
    Button,
    CircularProgress,
    Rating,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import FilterListIcon from "@mui/icons-material/FilterList";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import api from "../../../api/api";

const COMMENTS_API_ENDPOINT = "/comments";

const INITIAL_LIMIT = 6;

const RatingStars = ({ rating }) => {
    const filledStars = Math.min(5, Math.max(0, Math.round(rating)));
    return (
        <Box sx={{ display: "flex", color: "#ffc107", mb: 1 }}>
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    fontSize="small"
                    sx={{ opacity: i < filledStars ? 1 : 0.3 }}
                />
            ))}
        </Box>
    );
};

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.2 },
    },
};
const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export const TestimonialsSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle } = data;

    const [allComments, setAllComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const [selectedRating, setSelectedRating] = useState(5);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const res = await api.get(COMMENTS_API_ENDPOINT);

                if (res.data?.success) {
                    const commentsFromApi = res.data.data.map((cmt) => ({
                        quote: cmt.content || "Không có nội dung bình luận.",
                        rating: parseInt(cmt.rating) || 5,
                        name: cmt.user?.fullName || "Khách hàng ẩn danh",
                        avatarUrl:
                            cmt.user?.avatarUrl || "https://i.pravatar.cc/150",
                    }));

                    const sortedComments = commentsFromApi.sort(
                        (a, b) => b.rating - a.rating
                    );
                    setAllComments(sortedComments);
                } else {
                    console.error("API returned failure:", res.data);
                    setIsError(true);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, []);

    const { filteredComments, ratingCounts, averageRating } = useMemo(() => {
        const counts = allComments.reduce((acc, cmt) => {
            const rating = cmt.rating;
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
        }, {});

        const totalRating = allComments.reduce(
            (sum, cmt) => sum + cmt.rating,
            0
        );
        const avg =
            allComments.length > 0 ? totalRating / allComments.length : 0;

        let list = allComments;

        if (selectedRating > 0) {
            list = list.filter((cmt) => cmt.rating === selectedRating);
        }

        const displayList =
            showAll || selectedRating > 0 || list.length <= INITIAL_LIMIT
                ? list
                : list.slice(0, INITIAL_LIMIT);

        return {
            filteredComments: displayList,
            ratingCounts: counts,
            averageRating: avg,
        };
    }, [allComments, selectedRating, showAll]);

    const starRatings = [5, 4, 3, 2, 1];

    const handleRatingFilter = (rating) => {
        const newRating = selectedRating === rating ? 0 : rating;

        setSelectedRating(newRating);
        setShowAll(newRating !== 0);
    };

    const handleShowMore = () => {
        setShowAll((prev) => !prev);
    };

    const totalComments = allComments.length;

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2 }}>Đang tải đánh giá...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h6" color="error">
                    Lỗi tải đánh giá. Vui lòng kiểm tra console và kết nối API.
                </Typography>
            </Box>
        );
    }

    if (totalComments === 0 && selectedRating === 0) return null;

    return (
        <Box
            sx={{
                py: 10,
                px: { xs: 2, md: 8 },
                textAlign: "center",
                backgroundColor: "#fcfcfc",
            }}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <Typography variant="subtitle1" color="#ff7043" fontWeight={700}>
                {subtitle || "KHÁCH HÀNG ĐÁNH GIÁ"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 6 }}>
                {title || "Ý kiến của cộng đồng du lịch"}
            </Typography>

            <Box
                sx={{
                    maxWidth: 1000,
                    margin: "0 auto",
                    mb: 6,
                    p: 3,
                    border: "1px solid #ff704330",
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    boxShadow: 2,
                }}
            >
                <Grid container alignItems="center">
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                            borderRight: { md: "1px solid #eee" },
                            pb: { xs: 3, md: 0 },
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            Đánh giá trung bình
                        </Typography>
                        <Box sx={{ my: 1 }}>
                            <Typography
                                variant="h3"
                                fontWeight={800}
                                color="#ff7043"
                            >
                                {averageRating.toFixed(1)}/5
                            </Typography>
                            <Rating
                                name="read-only-rating"
                                value={averageRating}
                                precision={0.1}
                                readOnly
                                size="large"
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                        >
                            ({totalComments} đánh giá)
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8} sx={{ pl: { md: 4 } }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {/* Nút TẤT CẢ */}
                            <Button
                                variant={
                                    selectedRating === 0
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handleRatingFilter(0)}
                                size="medium"
                                sx={{
                                    backgroundColor:
                                        selectedRating === 0
                                            ? "#ff7043"
                                            : "transparent",
                                    color:
                                        selectedRating === 0
                                            ? "#fff"
                                            : "#ff7043",
                                    borderColor: "#ff7043",
                                    "&:hover": {
                                        backgroundColor:
                                            selectedRating === 0
                                                ? "#e55b2d"
                                                : "#fff3e0",
                                        borderColor: "#ff7043",
                                    },
                                    minWidth: "auto",
                                    py: 1,
                                    px: 2,
                                    fontSize: "0.875rem",
                                }}
                            >
                                {selectedRating === 0 ? "TẤT CẢ" : "Tất cả"} (
                                {totalComments})
                            </Button>

                            {starRatings.map((rating) => (
                                <Button
                                    key={rating}
                                    onClick={() => handleRatingFilter(rating)}
                                    variant={
                                        selectedRating === rating
                                            ? "contained"
                                            : "outlined"
                                    }
                                    size="medium"
                                    sx={{
                                        backgroundColor:
                                            selectedRating === rating
                                                ? "#ff7043"
                                                : "transparent",
                                        color:
                                            selectedRating === rating
                                                ? "#fff"
                                                : "#ff7043",
                                        borderColor: "#ff7043",
                                        "&:hover": {
                                            backgroundColor:
                                                selectedRating === rating
                                                    ? "#e55b2d"
                                                    : "#fff3e0",
                                            borderColor: "#ff7043",
                                        },
                                        minWidth: "auto",
                                        py: 1,
                                        px: 2,
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    <Rating
                                        value={rating}
                                        readOnly
                                        size="small"
                                        sx={{
                                            color:
                                                selectedRating === rating
                                                    ? "#fff"
                                                    : "#ff7043",
                                            mr: 0.5,
                                        }}
                                    />
                                    ({ratingCounts[rating] || 0})
                                </Button>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {filteredComments.length > 0 ? (
                <Grid container spacing={4} justifyContent="center">
                    {filteredComments.map((testimony, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            component={motion.div}
                            variants={testimonialVariants}
                            sx={{ height: "auto", display: "flex" }}
                        >
                            <Card
                                sx={{
                                    height: "100%",
                                    boxShadow: 3,
                                    p: 3,
                                    borderRadius: 3,
                                    textAlign: "left",
                                    minHeight: { xs: "auto", sm: 220, md: 240 },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <RatingStars
                                            rating={testimony.rating}
                                        />
                                        <FormatQuoteIcon
                                            sx={{
                                                fontSize: 40,
                                                color: "#ff7043",
                                                mb: 2,
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{ fontStyle: "italic", mb: 3 }}
                                        >
                                            "{testimony.quote}"
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mt: "auto",
                                        }}
                                    >
                                        <Avatar
                                            src={testimony.avatarUrl}
                                            sx={{ mr: 2 }}
                                        />
                                        <Typography fontWeight={700}>
                                            {testimony.name}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" color="text.secondary" sx={{ py: 4 }}>
                    Không tìm thấy đánh giá nào với mức sao đã chọn.
                </Typography>
            )}

            {filteredComments.length <
                (selectedRating === 0
                    ? totalComments
                    : ratingCounts[selectedRating]) && (
                <Box sx={{ mt: 6 }}>
                    <Button
                        variant="contained"
                        onClick={() => setShowAll(true)}
                        sx={{
                            backgroundColor: "#ff7043",
                            "&:hover": { backgroundColor: "#e55b2d" },
                        }}
                    >
                        {`Xem thêm ${
                            (selectedRating === 0
                                ? totalComments
                                : ratingCounts[selectedRating]) -
                            filteredComments.length
                        } đánh giá`}
                    </Button>
                </Box>
            )}
            {showAll && filteredComments.length > INITIAL_LIMIT && (
                <Box sx={{ mt: 6 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowAll(false)}
                        sx={{
                            color: "#ff7043",
                            borderColor: "#ff7043",
                            "&:hover": { backgroundColor: "#fff3e0" },
                        }}
                    >
                        Thu gọn danh sách
                    </Button>
                </Box>
            )}
        </Box>
    );
};
