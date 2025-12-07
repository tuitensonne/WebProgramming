import { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";
import Breadcrumb from "../components/Breadcrumb";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import PersonalInfoSection from "../components/Profile/PersonalInfoSection";
import PaymentInfoSection from "../components/Profile/PaymentInfoSection";
import ChangePasswordSection from "../components/Profile/ChangePasswordSection";
import TourManagementSection from "../components/Profile/TourManagementSection";
import SavedToursSection from "../components/Profile/SavedToursSection";

const PageWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const ProfileContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 200px);
  gap: 24px;
  padding: 30px 60px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    padding: 30px 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
`;

const SidebarWrapper = styled.div`
  flex: 0 0 280px;

  @media (max-width: 768px) {
    flex: 0 0 auto;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("No token found in localStorage");
          setLoading(false);
          return;
        }

        // Always fetch fresh data from API to ensure we have the latest user data
        try {
          // First try /users/profile endpoint (uses JWT token)
          const profileRes = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profile = profileRes.data?.data || profileRes.data;
          
          if (profile) {
            console.log('Fetched profile from API:', profile);
            setUserData(profile);
            // Update both localStorage keys for compatibility
            localStorage.setItem('user', JSON.stringify(profile));
            localStorage.setItem('userData', JSON.stringify(profile));
            return;
          }
        } catch (e) {
          console.warn('Failed to fetch profile from /users/profile, trying /users/{id}', e);
          
          // Fallback: try to get user ID from localStorage and fetch by ID
          const storedUserData = localStorage.getItem("userData");
          const storedUser = localStorage.getItem("user");
          const userFromStorage = storedUserData ? JSON.parse(storedUserData) : 
                                  storedUser ? JSON.parse(storedUser) : null;
          
          if (userFromStorage?.id) {
            try {
              const res = await api.get(`/users/${userFromStorage.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const profile = res.data?.data || res.data;
              if (profile) {
                console.log('Fetched profile by ID:', profile);
                setUserData(profile);
                localStorage.setItem('user', JSON.stringify(profile));
                localStorage.setItem('userData', JSON.stringify(profile));
                return;
              }
            } catch (e2) {
              console.warn('Failed to fetch profile by ID', e2);
            }
          }
          
          // Last resort: use stored data if API calls fail
          if (userFromStorage) {
            console.warn('Using stored user data as fallback');
            setUserData(userFromStorage);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Final fallback to localStorage
        const storedUserData = localStorage.getItem("userData");
        const storedUser = localStorage.getItem("user");
        const fallbackUser = storedUserData ? JSON.parse(storedUserData) : 
                            storedUser ? JSON.parse(storedUser) : null;
        if (fallbackUser) {
          setUserData(fallbackUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingComponent />;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Tài khoản", link: null }
  ];

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProfileContainer>
        <SidebarWrapper>
          <ProfileSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        </SidebarWrapper>
        
        <ContentWrapper>
          {activeSection === "tour-manage" && <TourManagementSection />}
          {activeSection === "saved-tours" && <SavedToursSection />}
          {activeSection === "personal" && (
            <>
              <PersonalInfoSection 
                userData={userData} 
                setUserData={setUserData} 
              />
              <PaymentInfoSection 
                userData={userData} 
                setUserData={setUserData} 
              />
              <ChangePasswordSection />
            </>
          )}
        </ContentWrapper>
      </ProfileContainer>
    </PageWrapper>
  );
};

export default ProfilePage;