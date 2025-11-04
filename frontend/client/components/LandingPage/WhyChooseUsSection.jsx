import { Box, Typography, Grid } from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ICON_MAP = {
  confirmation: ConfirmationNumberOutlinedIcon,
  lightbulb: LightbulbOutlinedIcon,
  diamond: DiamondOutlinedIcon,
  medal: EmojiEventsOutlinedIcon,
};

export const WhyChooseUsSection = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, items = [] } = data || {};

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: { xs: 2, sm: 4, md: 8 },
      }}
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <Typography variant="h4" fontWeight="bold" mb={6}>
        {title?.split("BK")?.[0] || title}
        {title?.includes("BK") && (
          <span style={{ color: "#1a237e" }}>BK</span>
        )}
        {title?.split("BK")?.[1] || ""}
      </Typography>

      <Grid
        container
        spacing={{ xs: 4, sm: 4, md: 3 }}
        justifyContent="stretch"
        alignItems="stretch"
      >
        {items.map((item, index) => {
          const Icon = ICON_MAP[item.icon] || ConfirmationNumberOutlinedIcon;

          return (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              component={motion.div}
              variants={itemVariants}
              sx={{
                maxWidth: { lg: "23%", md: "25%", sm: "45%", xs: "100%" },
                textAlign: "center",
                width: "100%",
                mx: "auto",
                p: 3,
                borderRadius: 1,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "rgba(212, 212, 212, 0.6)",
                },
              }}
            >
              <Icon sx={{ fontSize: 48, color: "#ff7043", mb: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
                sx={{ px: 2 }}
              >
                {item.desc}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
