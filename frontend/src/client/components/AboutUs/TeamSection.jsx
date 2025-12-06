import { Box, Typography, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, duration: 0.6 },
    },
};
const memberVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const TeamSection = ({ data }) => {
    if (!data) return null;

    const { title, subtitle, items = [] } = data;

    //item.title = Tên, item.subtitle = Chức danh, item.imageUrl = Ảnh đại diện
    const teamMembers =
        items.length > 0
            ? items.map((item) => ({
                  name: item.title,
                  role: item.subtitle,
                  avatarUrl: item.imageUrl,
              }))
            : [
                  {
                      name: "Lê Văn Cường",
                      role: "CEO & Founder",
                      avatarUrl: "https://i.pravatar.cc/150?img=68",
                  },
                  {
                      name: "Phạm Thu Hương",
                      role: "Trưởng phòng Tour Design",
                      avatarUrl: "https://i.pravatar.cc/150?img=43",
                  },
                  {
                      name: "Ngô Trí Dũng",
                      role: "Trưởng nhóm Hướng dẫn viên",
                      avatarUrl: "https://i.pravatar.cc/150?img=50",
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
                {subtitle || "CON NGƯỜI LÀ NỀN TẢNG"}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 8 }}>
                {title || "Gặp gỡ Đội ngũ của Chúng tôi"}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {teamMembers.map((member, index) => (
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={index}
                        component={motion.div}
                        variants={memberVariants}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                transition: "transform 0.3s",
                                "&:hover": { transform: "translateY(-5px)" },
                            }}
                        >
                            <Avatar
                                src={
                                    member.avatarUrl ||
                                    "https://i.pravatar.cc/150"
                                }
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: "0 auto",
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h6" fontWeight={700}>
                                {member.name}
                            </Typography>
                            <Typography variant="body2" color="#ff7043">
                                {member.role}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
