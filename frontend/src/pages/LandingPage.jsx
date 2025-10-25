import { Box, Typography, Grid } from "@mui/material";
import Header from "../components/Header";
import Thumbnail from "../components/Thumbnail";
import Footer from "../components/Footer";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { motion } from "framer-motion";
import plane from "../assets/images/plane.png";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -60 }, 
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", duration: 0.6, bounce: 0.3 },
    },
  };

  return (
    <Box
      sx={{
        paddingTop: "120px",
        backgroundColor: "#ffffff",
      }}
    >
      <Header />
      <Thumbnail />

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
          Tại sao nên chọn BK
          <span style={{ color: "#1a237e" }}>Tours</span>
        </Typography>

        <Grid
          container
          spacing={{ xs: 4, sm: 4, md: 3 }}
          justifyContent="stretch"
          alignItems="stretch"
        >
          {[
            {
              icon: (
                <ConfirmationNumberOutlinedIcon
                  sx={{ fontSize: 48, color: "#ff7043", mb: 2 }}
                />
              ),
              title: "Ultimate flexibility",
              desc: "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
            },
            {
              icon: (
                <LightbulbOutlinedIcon
                  sx={{ fontSize: 48, color: "#ff7043", mb: 2 }}
                />
              ),
              title: "Memorable experiences",
              desc: "Browse and book tours and activities so incredible, you'll want to tell your friends.",
            },
            {
              icon: (
                <DiamondOutlinedIcon
                  sx={{ fontSize: 48, color: "#ff7043", mb: 2 }}
                />
              ),
              title: "Quality at our core",
              desc: "High-quality standards. Millions of reviews. A Tourz company.",
            },
            {
              icon: (
                <EmojiEventsOutlinedIcon
                  sx={{ fontSize: 48, color: "#ff7043", mb: 2 }}
                />
              ),
              title: "Award-winning support",
              desc: "New price? New plan? No problem. We're here to help, 24/7.",
            },
          ].map((item, index) => (
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
              {item.icon}
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
          ))}
        </Grid>
      </Box>
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
      <Box sx={{ flex: 1, minWidth: 300 }} component={motion.div} variants={itemVariants}>
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
          minWidth: 300,
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          mt: { xs: 6, md: 0 },
        }}
        component={motion.div}
        variants={itemVariants}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            width: "100%",
            maxWidth: { xs: 320, sm: 360, md: 400 },
            p: { xs: 2, sm: 3 },
            position: "relative",
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
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Trip to Rome
                </Typography>
                <Typography variant="caption" color="error">
                  40% completed
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#eee",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "40%",
                      backgroundColor: "#ff7043",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Plane image
          <Box
            component="img"
            src={plane}
            alt="Airplane"
            sx={{
              position: "absolute",
              right: { xs: "0%", sm: "2%", md: "4%" },
              top: { xs: "-4%", sm: "-8%", md: "-10%" },
              width: { xs: "65%", sm: "75%", md: "80%" },
              opacity: 0.9,
              transform: "rotate(5deg)",
              zIndex: 1,
            }}
          /> */}
        </Box>
      </Box>
    </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
