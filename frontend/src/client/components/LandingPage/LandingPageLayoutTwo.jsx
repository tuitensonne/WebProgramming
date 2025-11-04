// src/components/LandingPage/LandingPageLayoutTwo.jsx
import { Box, Typography } from "@mui/material";
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

export const LandingPageLayoutTwo = ({ data }) => {
  if (!data) return null;

  const { items = [] } = data; 

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        height: { xs: "400px", md: "500px" },
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id || index}
          component={motion.div}
          variants={itemVariants}
          sx={{
            backgroundImage: `url(${item.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2 }}>
            {item.subtitle && (
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: 1 }}
              >
                {item.subtitle}
              </Typography>
            )}
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                my: 2,
                fontSize: { xs: "2rem", md: "2.8rem" },
              }}
            >
              {item.title}
            </Typography>
            {item.buttonText && (
              <Box
                component="button"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.2,
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {item.buttonText}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LandingPageLayoutTwo;
