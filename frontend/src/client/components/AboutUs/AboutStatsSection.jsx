import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.15, duration: 0.6 },
    },
};
const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const AboutStatsSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, items = [] } = data;

    // Nếu items rỗng, sử dụng dữ liệu mặc định (hoặc từ mô tả section)
    const stats =
        items.length > 0
            ? items
            : [
                  { title: "Khách hàng hài lòng", value: 92, color: "#4caf50" },
                  { title: "Tour đã tổ chức", value: 75, color: "#9c27b0" },
                  { title: "Chi nhánh toàn quốc", value: 55, color: "#e91e63" },
              ];

    return (
        <Box
            sx={{
                textAlign: "center",
                py: 8,
                px: { xs: 2, md: 8 },
                backgroundColor: "#f5f5f5",
            }}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <Typography variant="subtitle1" color="#ff7043" fontWeight={700}>
                {subtitle || "THÀNH TÍCH"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 6 }}>
                {title || "Những con số biết nói"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {stats.map((stat, index) => (
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={index}
                        component={motion.div}
                        variants={statVariants}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-flex",
                                mb: 2,
                            }}
                        >
                            {/* Vòng tròn nền */}
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={120}
                                thickness={5}
                                sx={{
                                    color: "#ccc",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            />
                            {/* Vòng tròn giá trị */}
                            <CircularProgress
                                variant="determinate"
                                value={stat.value > 100 ? 100 : stat.value}
                                size={120}
                                thickness={5}
                                sx={{
                                    color: stat.color || "#ff7043",
                                    transition: "all 0.8s ease",
                                }}
                            />
                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    component="div"
                                    fontWeight="bold"
                                    color="#1A1A1A"
                                >
                                    {`${stat.value}${stat.unit || "%"}`}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ fontSize: "1.1rem" }}
                        >
                            {stat.title}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
