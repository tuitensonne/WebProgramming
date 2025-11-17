// src/components/LandingPage/ContentSectionTypeOne.jsx
import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const LandingPageLayoutOne = ({ data }) => {
  const { title, subtitle, backgroundColor, items = [], imageUrl } = data;

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
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#d0d0d042",
        }}
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Box
          sx={{ flex: 1, minWidth: 300 }}
          component={motion.div}
          variants={itemVariants}
        >
          <Typography variant="subtitle1" color="#ff7043" fontWeight={600}>
            Fast & Easy
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#0A093D",
              lineHeight: 1.2,
              mt: 1,
              mb: 4,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Get Your Favourite <br /> Resort Bookings
          </Typography>

          {[
            {
              color: "#FFB800",
              icon: "📍",
              title: "Choose Destination",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
            },
            {
              color: "#FF6B4A",
              icon: "📅",
              title: "Check Availability",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
            },
            {
              color: "#1B7B8F",
              icon: "🚗",
              title: "Let’s Go",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
            },
          ].map((step, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 3,
              }}
              component={motion.div}
              variants={itemVariants}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  backgroundColor: step.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#fff",
                  mr: 2.5,
                }}
              >
                {step.icon}
              </Box>
              <Box>
                <Typography fontWeight={600}>{step.title}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {step.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-start" }, 
            mt: { xs: 6, md: 0 },
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              overflow: "hidden",
              width: { xs: "100%", sm: 360, md: 400 }, 
              maxWidth: { md: 400 },
              p: { xs: 2, sm: 3 },
              position: "relative",
              mx: "auto",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=800"
              alt="Resort"
              sx={{
                borderRadius: 3,
                width: "100%",
                height: { xs: 180, sm: 200, md: 220 },
                objectFit: "cover",
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Trip to Hawaii
              </Typography>
              <Typography color="text.secondary" variant="body2" mb={1}>
                14–29 June | by JR Martir
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" color="primary" fontWeight={600}>
                  Ongoing
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
  );
};
