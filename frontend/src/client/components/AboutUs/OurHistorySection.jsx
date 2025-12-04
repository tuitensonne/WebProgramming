import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, duration: 0.6 },
    },
};
const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const OurHistorySection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, items = [] } = data;

    //item.title = Năm/Sự kiện, item.desc = Mô tả chi tiết
    const historyItems =
        items.length > 0
            ? items.map((item) => ({
                  year: item.title,
                  description: item.desc,
              }))
            : [
                  {
                      year: "2010",
                      description:
                          "BK Tour được thành lập tại TP.HCM, bắt đầu với các tour trong nước.",
                  },
                  {
                      year: "2015",
                      description:
                          "Mở rộng sang thị trường Đông Nam Á, nhận giải thưởng 'Top 10 Công ty Lữ hành Trẻ'.",
                  },
                  {
                      year: "2020",
                      description:
                          "Ra mắt nền tảng booking trực tuyến, đạt cột mốc 50,000 khách hàng.",
                  },
                  {
                      year: "2024",
                      description:
                          "Đạt chứng nhận đối tác du lịch bền vững, mở chi nhánh thứ 5 tại Hà Nội.",
                  },
              ];

    return (
        <Box
            sx={{
                py: 10,
                px: { xs: 2, md: 8 },
                textAlign: "center",
                backgroundColor: "#fff",
            }}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <Typography variant="subtitle1" color="#E57373" fontWeight={700}>
                {subtitle || "CỘT MỐC QUAN TRỌNG"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 8 }}>
                {title || "Hành trình Phát triển của Chúng tôi"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {historyItems.map((item, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                p: 3,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderTop: "5px solid #ff7043",
                                borderRadius: 2,
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <AccessTimeIcon
                                    sx={{ fontSize: 40, color: "#ff7043" }}
                                />
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ mt: 1, color: "#1A1A1A" }}
                                >
                                    {item.year}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {item.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
