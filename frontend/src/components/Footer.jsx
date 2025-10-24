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
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";

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

export default function Footer() {
  return (
    <FooterWrapper>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "1.8rem" },
              }}
            >
              Travel
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
              Travel helps companies manage payments easily.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 1,
              }}
            >
              {[LinkedInIcon, FacebookIcon, TwitterIcon, AllInclusiveIcon].map(
                (Icon, i) => (
                  <IconButton
                    key={i}
                    size="small"
                    sx={{
                      color: "#E4714E",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                )
              )}
            </Box>
          </Grid>

          <Grid item xs={6} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1rem", md: "1.1rem" } }}
            >
              Company
            </Typography>
            {["About Us", "Careers", "Blog", "Pricing"].map((item) => (
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

          <Grid item xs={6} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1rem", md: "1.1rem" } }}
            >
              Destinations
            </Typography>
            {["Maldives", "Los Angeles", "Las Vegas", "Toronto"].map((item) => (
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
              Join Our Newsletter
            </Typography>
            <Box
              sx={{
                display: "flex",
                mb: 1,
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <NewsletterInput
                fullWidth
                placeholder="Your email address"
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: { xs: "8px", sm: "8px 0 0 8px" },
                  },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: { xs: "8px", sm: "0 8px 8px 0" },
                  backgroundColor: "#E4714E",
                  fontWeight: 600,
                  px: 3,
                  fontSize: "16px",
                  minWidth: { sm: "auto" },
                  "&:hover": { backgroundColor: "#d65f3c" },
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#999",
                fontSize: "0.9rem",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              * Will send you weekly updates for your better tour packages.
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

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#ccc", fontSize: { xs: "0.85rem", md: "1rem" } }}
        >
          Copyright © Xpro 2022. All Rights Reserved.
        </Typography>
      </Container>
    </FooterWrapper>
  );
}
