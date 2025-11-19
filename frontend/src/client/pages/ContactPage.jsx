import { Box, TextField, Typography, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ContactPage() {
  const [companyContact, setCompanyContact] = useState(null);

  useEffect(() => {
    const fetchCompanyContact = async () => {
      try {
        const res = await api.get("footers");
        if (res.data?.success) {
          const data = Array.isArray(res.data.data)
            ? res.data.data[0]
            : res.data.data;

          setCompanyContact(data);
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
      }
    };

    fetchCompanyContact();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        py: 8,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          minHeight: { md: 650 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "40px 0 0 40px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            component="img"
            src={companyContact?.logo_url}
            alt="city"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            py: 6,
            px: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Liên hệ với chúng tôi
          </Typography>
          <Typography sx={{ mb: 4, color: "text.secondary", fontSize: 15 }}>
            Chúng tôi luôn sẵn sàng hỗ trợ, dù bạn ở bất cứ nơi đâu
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Họ và tên"
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              placeholder="Số điện thoại"
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              placeholder="Lời nhắn"
              multiline
              rows={4}
              variant="outlined"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(90deg, #4a6cf7 0%, #2f80ed 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #3b5ae0 0%, #256adb 100%)",
                },
              }}
            >
              Gửi
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            py: 6,
            px: 3,
            backgroundColor: "#fff",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1, fontSize: 18 }}
          >
            Contact
          </Typography>

          <Typography sx={{ mb: 4, fontSize: 16 }}>
            {companyContact?.email || "contact@bktours.vn"}
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1, fontSize: 18 }}
          >
            Based in
          </Typography>

          <Typography sx={{ fontSize: 16, mb: 4 }}>
            {companyContact?.address || "268 Lý Thường Kiệt, Quận"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <a
              href={companyContact?.facebook_link}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <FacebookIcon sx={{ fontSize: 32, cursor: "pointer" }} />
            </a>
            <a
              href={companyContact?.instagram_link}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <InstagramIcon sx={{ fontSize: 32, cursor: "pointer" }} />
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
