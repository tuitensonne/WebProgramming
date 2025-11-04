import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ItemListingLayout = ({ data }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data?.category_id) return;

    const fetchToursByCategory = async () => {
      try {
        const res = await api.get(`/tours/top?categoryId=${data.category_id}`);
        if (res.data?.success) {
          setTours(res.data.data || []);
        } else {
          setError("Không thể tải dữ liệu tour.");
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Lỗi khi kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchToursByCategory();
  }, [data?.category_id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        py: 10,
        px: { xs: 2, sm: 4, md: 8 },
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Tour Nổi Bật
        </Typography>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Xem tất cả →
        </Typography>
      </Box>

      {/* Grid chia đều */}
      <Grid
        container
        spacing={3}
        sx={{
          width: "100%",
          margin: 0,
        }}
      >
        {tours.slice(0, 4).map((tour) => (
          <Grid
            key={tour.id}
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            component={motion.div}
            variants={itemVariants}
            sx={{
              display: "flex",
              flexBasis: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
                lg: "calc(25% - 18px)",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
                lg: "calc(25% - 18px)",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                "&:hover": { transform: "translateY(-6px)" },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={tour.thumbnailUrl}
                  alt={tour.name}
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 180, md: 200 },
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box
                sx={{
                  p: { xs: 2.5, sm: 2, md: 2.5 },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    mt: 2,
                    fontSize: { xs: "1.1rem", sm: "1rem", md: "1.1rem" },
                    lineHeight: 1.3,
                    wordWrap: "break-word", // Cho phép text xuống hàng
                    overflowWrap: "break-word",
                  }}
                >
                  {tour.name}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: 14, sm: 13, md: 14 },
                    mb: 1,
                    wordWrap: "break-word", // Cho phép text xuống hàng
                    overflowWrap: "break-word",
                  }}
                >
                  {tour.shortDescription}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    color: "text.secondary",
                    fontSize: { xs: 14, sm: 13, md: 14 },
                    flex: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarMonthOutlinedIcon fontSize="small" />
                    <span>{`${tour.durationDays}N${tour.durationNights}Đ`}</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleAltOutlinedIcon fontSize="small" />
                    <span>{`Còn ${tour.availableSeat} chỗ`}</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnOutlinedIcon fontSize="small" />
                    <span>{tour.tourType}</span>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      fontSize="small"
                      sx={{ color: i < 4 ? "#FFD700" : "#ccc" }}
                    />
                  ))}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, fontSize: { xs: 13, sm: 12, md: 13 } }}
                  >
                    {`${tour.totalBookings} lượt đặt`}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    backgroundColor: "#ff7043",
                    "&:hover": { backgroundColor: "#e55b2d" },
                    textTransform: "none",
                    fontSize: { xs: "0.95rem", sm: "0.9rem", md: "0.95rem" },
                  }}
                >
                  Khám phá ngay
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemListingLayout;