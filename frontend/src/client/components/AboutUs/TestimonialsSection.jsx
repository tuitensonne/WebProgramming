import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, duration: 0.6 },
    },
};
const testimonialVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const TestimonialsSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, items = [] } = data;

    // Dữ liệu giả định nếu không có item nào
    const defaultTestimonials = [
        {
            name: "Nguyễn Văn A",
            quote: "BK Tour đã mang đến trải nghiệm tuyệt vời, vượt xa mong đợi!",
            avatarUrl: "https://i.pravatar.cc/150?img=41",
        },
        {
            name: "Trần Thị B",
            quote: "Dịch vụ chuyên nghiệp, hỗ trợ 24/7 và chất lượng tour hoàn hảo.",
            avatarUrl: "https://i.pravatar.cc/150?img=33",
        },
    ];
    const testimonials = items.length > 0 ? items : defaultTestimonials;

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
            <Typography variant="subtitle1" color="#E57373" fontWeight={700}>
                {subtitle || "ĐÁNH GIÁ THỰC TẾ"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 8 }}>
                {title || "Khách hàng nói gì về chúng tôi"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {testimonials.map((testimony, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        component={motion.div}
                        variants={testimonialVariants}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                boxShadow: 3,
                                p: 3,
                                borderRadius: 3,
                                textAlign: "left",
                            }}
                        >
                            <CardContent>
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
                                    "{testimony.desc || testimony.quote}"
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mt: 2,
                                    }}
                                >
                                    <Avatar
                                        src={
                                            testimony.imageUrl ||
                                            "https://i.pravatar.cc/150"
                                        }
                                        sx={{ mr: 2 }}
                                    />
                                    <Typography fontWeight={700}>
                                        {testimony.title || testimony.name}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
