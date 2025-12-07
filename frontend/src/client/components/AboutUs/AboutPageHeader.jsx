import { useEffect, useState, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const HeroSection = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    minHeight: "65vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#263238",
    [theme.breakpoints.down("md")]: {
        minHeight: "35vh",
    },
    [theme.breakpoints.down("sm")]: {
        minHeight: "30vh",
    },
}));

const HeroContent = styled(Box)(() => ({
    textAlign: "center",
    color: "#fff",
    zIndex: 2,
    position: "relative",
    padding: "0 20px",
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: "16px",
    textShadow:
        "3px 3px 10px rgba(0,0,0,0.7), 0 0 5px rgba(255, 255, 255, 0.4)",
    lineHeight: 1.1,
    fontSize: "80px",
    [theme.breakpoints.down("lg")]: {
        fontSize: "68px",
    },
    [theme.breakpoints.down("md")]: {
        fontSize: "52px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "40px",
    },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: "30px",
    fontWeight: 500,
    marginTop: theme.spacing(2),
    textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
    [theme.breakpoints.down("md")]: {
        fontSize: "24px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "18px",
    },
}));

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
};

export const AboutPageHeader = ({ data }) => {
    const [loading, setLoading] = useState(true);

    const title = data?.title || "VỀ CHÚNG TÔI";
    const subtitle = data?.subtitle || "Sứ mệnh, Lịch sử và Đội ngũ";
    const imageUrl = data?.image_url;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [imageUrl]);

    return (
        <Box>
            <HeroSection>
                {imageUrl ? (
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="About Us Header Background"
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            zIndex: 0,
                            opacity: loading ? 0 : 1,
                            transition: "opacity 0.5s ease-in-out",
                        }}
                    />
                ) : (
                    setLoading(false)
                )}

                {loading && (
                    <CircularProgress
                        sx={{
                            color: "#fff",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 3,
                        }}
                    />
                )}

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1,
                    }}
                />

                <HeroContent
                    component={motion.div}
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                >
                    <HeroTitle variant="h1">{title}</HeroTitle>
                    <HeroSubtitle variant="h5">{subtitle}</HeroSubtitle>
                </HeroContent>
            </HeroSection>
        </Box>
    );
};
