import { Box } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { motion } from "framer-motion";

const LoadingComponent = () => {
  const size = 120;
  const radius = size / 2;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ position: "relative", width: size, height: size }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px dashed rgba(228, 113, 78, 0.4)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "center center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)", 
              color: "#E4714E",
            }}
          >
            <AirplanemodeActiveIcon sx={{ fontSize: 40 }} />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoadingComponent;
