import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Breadcrumb from "./components/Breadcrump";

import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import TravelGuidePage from "./pages/TravelGuidePage";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <Router>
      <Box>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/travel-guides" element={<TravelGuidePage />} />
          <Route path="/travel-guides/:id" element={<PostDetailPage />} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
}
export default App;
