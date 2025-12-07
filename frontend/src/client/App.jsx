import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import DomesticToursPage from "./pages/DomesticToursPage";
import InternationalToursPage from "./pages/InternationalToursPage";
import TourTypesPage from "./pages/TourTypesPage";
import SchedulePage from "./pages/SchedulePage";
import GuidePage from "./pages/GuidePage";
import TourDetailPage from "./pages/TourDetailPage";

import PrivateRoute from "../guards/PrivateRoute";
import PublicRoute from "../guards/PublicRoute";

const MainLayout = ({ children }) => (
  <>
    <Header />
    <Box component="main">{children}</Box>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Box>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/domestic"
            element={
              <MainLayout>
                <DomesticToursPage />
              </MainLayout>
            }
          />

          <Route
            path="/international"
            element={
              <MainLayout>
                <InternationalToursPage />
              </MainLayout>
            }
          />

          <Route
            path="/tour-types"
            element={
              <MainLayout>
                <TourTypesPage />
              </MainLayout>
            }
          />

          <Route
            path="/schedule"
            element={
              <MainLayout>
                <SchedulePage />
              </MainLayout>
            }
          />

          <Route
            path="/guide"
            element={
              <MainLayout>
                <GuidePage />
              </MainLayout>
            }
          />

          <Route
            path="/tour/:id"
            element={
              <MainLayout>
                <TourDetailPage />
              </MainLayout>
            }
          />

          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
