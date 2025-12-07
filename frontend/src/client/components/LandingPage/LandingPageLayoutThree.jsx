// src/components/LandingPage/LandingPageLayoutThree.jsx
import React from "react";
import { Box, Grid, Typography, Button, Card, CardMedia } from "@mui/material";
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

export const LandingPageLayoutThree = ({ data }) => {
  if (!data) return null;

  const { title, subtitle, description, image_url, background_color } = data;

  return (
    <Box
      component={motion.section}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        backgroundColor: background_color || "#fff",
        py: 8,
        px: { xs: 2, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.img
          src={image_url}
          alt={title}
          variants={itemVariants}
          style={{
            width: "100%",
            maxWidth: 500,
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        {subtitle && (
          <Typography
            component={motion.p}
            variants={itemVariants}
            variant="subtitle2"
            sx={{
              color: "#E57373",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {title && (
          <Typography
            component={motion.h2}
            variants={itemVariants}
            variant="h3"
            sx={{ fontWeight: 700, mt: 2, color: "#1A1A1A" }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            component={motion.p}
            variants={itemVariants}
            variant="body1"
            sx={{ color: "#555", mt: 3, maxWidth: 500 }}
          >
            {description}
          </Typography>
        )}

        <motion.div variants={itemVariants}>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              background: "linear-gradient(90deg, #F37B42, #F05555)",
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(240,85,85,0.3)",
            }}
          >
            Khám phá ngay
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LandingPageLayoutThree;
