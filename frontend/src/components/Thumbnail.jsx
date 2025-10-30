import { useEffect, useState, useCallback } from "react";

import {
  Box,
  InputBase,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../api/api";

const SearchContainer = styled(Box)(() => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  maxWidth: "500px",
  width: "100%",
  padding: "4px 4px 4px 20px",
}));

const StyledInputBase = styled(InputBase)(() => ({
  flex: 1,
  "& input": {
    padding: "12px 0",
    fontSize: "15px",
    "&::placeholder": {
      color: "#999",
      opacity: 1,
    },
  },
}));

const SearchButton = styled(IconButton)(() => ({
  backgroundColor: "#ff6b35",
  color: "#fff",
  padding: "12px",
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: "#ff5722",
  },
}));

const HeroSection = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.3s ease, transform 0.3s ease",
}));

const HeroContent = styled(Box)(() => ({
  textAlign: "center",
  color: "#fff",
  zIndex: 2,
  position: "relative",
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: "64px",
  fontWeight: 700,
  marginBottom: "40px",
  textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
  lineHeight: 1.2,
  [theme.breakpoints.down("md")]: {
    fontSize: "48px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
    marginBottom: "30px",
  },
}));

const Thumbnail = () => {
  const [fade, setFade] = useState({ opacity: 1, translateY: 0 });
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("banners/list");
        console.log("Banner response:", res); 
        setImages(res.data.data.map((banner) => banner.url));
      } catch (err) {
        console.error("Lỗi tải banner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadePoint = 600;
      const opacity = Math.max(1 - scrollY / fadePoint, 0);
      const translateY = Math.min(scrollY / 5, 80);
      setFade({ opacity, translateY });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  return (
    <Box>
      <HeroSection
        sx={{
          opacity: fade.opacity,
          transform: `translateY(-${fade.translateY}px)`,
        }}
      >
        {loading && (
          <CircularProgress
            sx={{
              color: "#fff",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {images.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              transition: "opacity 1s ease-in-out",
              opacity: index === current ? 1 : 0,
              zIndex: index === current ? 1 : 0,
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1,
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        <HeroContent>
          <HeroTitle>
            Choose a Country For Your
            <br />
            Next Adventure?
          </HeroTitle>

          <SearchContainer sx={{ margin: "0 auto" }}>
            <LocationOnIcon sx={{ color: "#666", mr: 1 }} />
            <StyledInputBase placeholder="Tìm kiếm địa điểm du lịch" />
            <SearchButton>
              <SearchIcon />
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>
    </Box>
  );
};

export default Thumbnail;
