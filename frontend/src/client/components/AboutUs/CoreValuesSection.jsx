import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import * as MuiIcons from "@mui/icons-material";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, duration: 0.6 },
    },
};
const valueVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const getIconComponent = (iconName, fallbackTitle) => {
    // Ưu tiên iconName từ DB (ví dụ: 'SecurityIcon')
    if (iconName) {
        const IconComponent = MuiIcons[iconName];
        if (IconComponent) return IconComponent;
    }

    // Fallback dựa trên title
    const title = fallbackTitle.toLowerCase();
    if (title.includes("an toàn")) return SecurityIcon;
    if (title.includes("trải nghiệm")) return StarIcon;
    if (title.includes("tận tâm") || title.includes("khách hàng"))
        return PeopleIcon;
    return StarIcon;
};

export const CoreValuesSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, items = [] } = data;

    const values =
        items.length > 0
            ? items.map((item) => ({
                  title: item.title,
                  description: item.desc,
                  icon: item.icon,
                  color: item.color || "#ff7043",
              }))
            : [
                  {
                      title: "An Toàn Tuyệt Đối",
                      description: "...",
                      color: "#4caf50",
                      icon: "SecurityIcon",
                  },
                  {
                      title: "Trải Nghiệm Độc Đáo",
                      description: "...",
                      color: "#2196f3",
                      icon: "StarIcon",
                  },
                  {
                      title: "Phục Vụ Tận Tâm",
                      description: "...",
                      color: "#ff7043",
                      icon: "PeopleIcon",
                  },
              ];

    return (
        <Box
            sx={{
                py: 10,
                px: { xs: 2, md: 8 },
                textAlign: "center",
                backgroundColor: "#f5f5f5",
            }}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <Typography variant="subtitle1" color="#E57373" fontWeight={700}>
                {subtitle || "VĂN HÓA DOANH NGHIỆP"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 8 }}>
                {title || "Những Giá Trị Cốt Lõi Của Chúng Tôi"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {values.map((value, index) => {
                    const IconComponent = getIconComponent(
                        value.icon,
                        value.title
                    );

                    return (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            component={motion.div}
                            variants={valueVariants}
                        >
                            <Box
                                sx={{
                                    p: 4,
                                    backgroundColor: "#fff",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    height: "100%",
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        fontSize: 50,
                                        color: value.color,
                                        mb: 2,
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{ mb: 1 }}
                                >
                                    {value.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {value.description}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};
