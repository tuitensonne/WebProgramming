import { Box, Typography, Grid, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ItemListingLayout = ({ data }) => {
  if (!data) return null;

  const { title, items = [] } = data;

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        py: 10,
        px: { xs: 2, sm: 4, md: 8 },
        backgroundColor: data.backgroundColor || "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Xem tất cả →
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          justifyContent="center"
        >
          {items.slice(0, 4).map((tour, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={4}
              md={3}
              sx={{
                display: {
                  xs: 'block',
                  sm: index === 3 ? 'none' : 'block',
                  md: 'block'
                }
              }}
              component={motion.div}
              variants={itemVariants}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={tour.imageUrl}
                    alt={tour.title}
                    sx={{
                      width: "100%",
                      height: { xs: 200, sm: 180, md: 200 },
                      objectFit: "cover",
                    }}
                  />
              
                </Box>

                <Box
                  sx={{
                    p: { xs: 2.5, sm: 2, md: 2.5 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      mt: 2,
                      fontSize: { xs: "1.1rem", sm: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {tour.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      color: "text.secondary",
                      fontSize: { xs: 14, sm: 13, md: 14 },
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonthOutlinedIcon fontSize="small" />
                      <span>{tour.schedule}</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleAltOutlinedIcon fontSize="small" />
                      <span>{tour.people}</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnOutlinedIcon fontSize="small" />
                      <span>{tour.location}</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeOutlinedIcon fontSize="small" />
                      <span>{tour.duration}</span>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      sx={{
                        color: "#e53935",
                        fontWeight: 700,
                        fontSize: { xs: "1.1rem", sm: "1rem", md: "1.1rem" },
                        mr: 1,
                        display: "inline",
                      }}
                    >
                      {tour.newPrice.toLocaleString("vi-VN")} VND
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.disabled",
                        textDecoration: "line-through",
                        display: "inline",
                        ml: 1,
                        fontSize: { xs: "0.9rem", sm: "0.85rem", md: "0.9rem" },
                      }}
                    >
                      {tour.oldPrice.toLocaleString("vi-VN")} VND
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        fontSize="small"
                        sx={{
                          color:
                            i < Math.round(tour.rating) ? "#FFD700" : "#ccc",
                        }}
                      />
                    ))}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: { xs: 13, sm: 12, md: 13 } }}
                    >
                      ({tour.reviews} Đánh Giá)
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                      backgroundColor: "#ff7043",
                      "&:hover": { backgroundColor: "#e55b2d" },
                      textTransform: "none",
                      fontSize: { xs: "0.95rem", sm: "0.9rem", md: "0.95rem" },
                    }}
                  >
                    {tour.buttonText || "Khám phá ngay"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ItemListingLayout;