import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutUsPage from "./pages/AboutUsPage";
import { FaqPage } from "./pages/FaqPage";

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
          <Route
            path="/about-us"
            element={
              <MainLayout>
                <AboutUsPage />
              </MainLayout>
            }
          />
          <Route
            path="/faqs"
            element={
              <MainLayout>
                <FaqPage />
              </MainLayout>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute restricted={true}>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute restricted={true}>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Private routes - chỉ user role
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          /> */}

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
