import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
  IconButton,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Instagram } from "@mui/icons-material";

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#1f2b32",
  color: "#fff",
  width: "100%",
  position: "relative",
  padding: "60px 0 30px",
  overflowX: "hidden",
  [theme.breakpoints.down("md")]: {
    padding: "40px 0 20px",
  },
}));

const NewsletterInput = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "8px 0 0 8px",
    backgroundColor: "#fff",
    fontSize: "16px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
});

export default function Footer({ data }) {
  const [footerData, setFooterData] = useState(data || null);
  const [loading, setLoading] = useState(!data);
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setFooterData(data);
      return;
    }

    const fetchFooter = async () => {
      try {
        const res = await api.get("footers");
        console.log(res.data);
        if (res.data?.success) {
          setFooterData(res.data.data);
        } else {
          console.error("Failed to fetch sections:", res.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, [data]);

  if (!footerData) return null;

  const {
    company_name,
    slogan,
    facebook_link,
    instagram_link,
    places = [],
  } = footerData;

  const countries = [...new Set(places.map((p) => p.city))];

  return (
    <FooterWrapper>
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: { xs: "center", md: "space-between" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* === Cột 1 === */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "1.8rem" },
              }}
            >
              {company_name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#ccc",
                mb: 2,
                lineHeight: 1.6,
                fontSize: { xs: "1rem", md: "1rem" },
              }}
            >
              {slogan}
            </Typography>

            {/* Mạng xã hội */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 1,
                mb: 2,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: "#E4714E",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.1)",
                  },
                }}
                component="a"
                href={facebook_link}
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: "#E4714E",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.1)",
                  },
                }}
                component="a"
                href={instagram_link}
                target="_blank"
              >
                <Instagram />
              </IconButton>
            </Box>

            <Box sx={{ color: "#ccc" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, mb: 0.5 }}
              >
                {footerData.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, mb: 0.5 }}
              >
                {footerData.hotline}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
              >
                {footerData.address}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={6}
            sm={6}
            md={2}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Địa điểm
            </Typography>
            {countries.map((country) => (
              <Typography
                key={country}
                variant="body1"
                sx={{
                  mb: 1,
                  color: "#ccc",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                <Link
                  href="#"
                  underline="none"
                  sx={{ color: "inherit", "&:hover": { color: "#fff" } }}
                >
                  {country}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* === Cột 2 === */}
          <Grid
            item
            xs={6}
            sm={6}
            md={2}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Công ty
            </Typography>
            {["Về chúng tôi", "Blog"].map((item) => (
              <Typography
                key={item}
                variant="body1"
                sx={{
                  mb: 1,
                  color: "#ccc",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                <Link
                  href="#"
                  underline="none"
                  sx={{ color: "inherit", "&:hover": { color: "#fff" } }}
                >
                  {item}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* === Cột 4 (Newsletter) === */}
          <Grid item xs={12} sm={12} md={5}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Liên hệ với chúng tôi
            </Typography>
            <a
              href="/contact"
              style={{
                textDecoration: "none",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                  mb: 1,
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                <NewsletterInput
                  fullWidth
                  placeholder="Địa chỉ email của bạn"
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: { xs: "8px", sm: "8px 0 0 8px" },
                    },
                    pointerEvents: "none", // để click vào input vẫn redirect
                  }}
                />

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: { xs: "8px", sm: "0 8px 8px 0" },
                    backgroundColor: "#E4714E",
                    fontWeight: 600,
                    px: 3,
                    fontSize: "16px",
                    "&:hover": { backgroundColor: "#d65f3c" },
                    pointerEvents: "none", // để click vào khu vực nút vẫn redirect
                  }}
                >
                  Gửi
                </Button>
              </Box>
            </a>

            <Typography
              variant="body2"
              sx={{
                color: "#999",
                fontSize: "0.9rem",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              * Chúng tôi sẽ phản hồi lại bạn qua email đăng ký
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            mt: { xs: 4, md: 6 },
            mb: 3,
          }}
        />
      </Container>
    </FooterWrapper>
  );
}
