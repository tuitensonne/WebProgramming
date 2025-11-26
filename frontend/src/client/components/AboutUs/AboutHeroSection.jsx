import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
};
const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
};

export const AboutHeroSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, description, image_url } = data; // Lấy từ Section table
    // Giả định Items[0] chứa đoạn văn dài (Item.desc)
    const missionText = data.items?.[0]?.desc || description;
    const mainImage = data.items?.[0]?.imageUrl || image_url; // Lấy ảnh chính từ Item hoặc Section

    return (
        <Box
            sx={{
                py: 8,
                px: { xs: 2, md: 8 },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 5,
                backgroundColor: "#fff",
            }}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            {/* Khối Text và Button */}
            <Box sx={{ flex: 1, pr: { md: 5 } }}>
                <Typography
                    variant="subtitle1"
                    color="#ff7043"
                    fontWeight={700}
                    component={motion.p}
                    variants={textVariants}
                >
                    {subtitle || "VỀ CHÚNG TÔI"}
                </Typography>

                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{ mt: 1, mb: 3, color: "#1A1A1A" }}
                    component={motion.h3}
                    variants={textVariants}
                >
                    {title || "Chúng tôi mang đến những chuyến đi tuyệt vời"}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                    component={motion.p}
                    variants={textVariants}
                >
                    {missionText ||
                        "BK Tour được thành lập với sứ mệnh kết nối du khách với những điểm đến đẹp nhất thế giới, cung cấp trải nghiệm du lịch chất lượng cao và dịch vụ tận tâm."}
                </Typography>

                <motion.div variants={textVariants}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#ff7043",
                            "&:hover": { backgroundColor: "#e55b2d" },
                        }}
                    >
                        Xem Lịch sử
                    </Button>
                </motion.div>
            </Box>

            {/* Khối Hình ảnh */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <motion.img
                    src={
                        mainImage ||
                        "https://placehold.co/500x400/94a3b8/ffffff?text=About+Image"
                    }
                    alt="Sightseeing Tour"
                    style={{
                        width: "100%",
                        maxWidth: 500,
                        height: "auto",
                        borderRadius: "20px",
                        objectFit: "cover",
                    }}
                    component={motion.img}
                    variants={containerVariants}
                />
            </Box>
        </Box>
    );
};
