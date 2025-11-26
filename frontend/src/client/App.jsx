import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutUsPage from "./pages/AboutUsPage";

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

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<SignupPage />} />

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
