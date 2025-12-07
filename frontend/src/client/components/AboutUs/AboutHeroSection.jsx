import { Box, Typography } from "@mui/material";
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
    const { title, subtitle, description, image_url } = data;
    const missionText = data.items?.[0]?.desc || description;
    const mainImage =
        image_url ||
        data.items?.[0]?.imageUrl ||
        "https://placehold.co/500x400/94a3b8/ffffff?text=About+Image";

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
            <Box sx={{ flex: 1, pr: { md: 5 } }}>
                <Typography
                    variant="h6"
                    color="#ff7043"
                    fontWeight={700}
                    sx={{ letterSpacing: "2px", textTransform: "uppercase" }}
                    component={motion.p}
                    variants={textVariants}
                >
                    {subtitle || "SỨ MỆNH CỦA CHÚNG TÔI"}
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
                    {missionText || "BK Tour."}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <motion.img
                    src={mainImage}
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
