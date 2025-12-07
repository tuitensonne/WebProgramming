// src/components/LandingPage/ContentSectionTypeOne.jsx
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import * as Icons from "@mui/icons-material";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const LandingPageLayoutOne = ({ data }) => {
  if (!data) return null;

  const {
    title,
    subtitle,
    description,
    backgroundColor,
    image_url,
    items = [],
  } = data;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 4, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 6, md: 8 },
        backgroundColor: backgroundColor || "#f5f5f5",
        overflow: "hidden",
      }}
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* LEFT CONTENT */}
      <Box
        sx={{ flex: 1, minWidth: 300 }}
        component={motion.div}
        variants={itemVariants}
      >
        {subtitle && (
          <Typography variant="subtitle1" color="#ff7043" fontWeight={600}>
            {subtitle}
          </Typography>
        )}

        {title && (
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#0A093D",
              lineHeight: 1.2,
              mt: 1,
              mb: 3,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500 }}
          >
            {description}
          </Typography>
        )}

        {items.map((item) => {
          const MUIIcon = Icons[item.icon] || Icons["Star"];

          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 3,
              }}
              component={motion.div}
              variants={itemVariants}
            >
              {/* Icon Box */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  backgroundColor: item.color || "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: "#fff",
                  mr: 2.5,
                }}
              >
                <MUIIcon sx={{ fontSize: 30 }} />
              </Box>

              {/* Text */}
              <Box>
                <Typography fontWeight={600}>
                  {item.title || "Untitled"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {item.desc || ""}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* RIGHT IMAGE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: { xs: "flex-start", md: "flex-start" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            width: { xs: "100%", sm: 360, md: 600 },
            p: { xs: 2, sm: 3 },
            mx: "auto",
          }}
        >
          <Box
            component="img"
            src={image_url}
            alt={title}
            sx={{
              borderRadius: 3,
              width: "100%",
              height: { xs: 180, sm: 200, md: 300 },
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPageLayoutOne;
