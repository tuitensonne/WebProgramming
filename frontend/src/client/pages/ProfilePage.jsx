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
        const storedUser = localStorage.getItem("user");

        // If we don't have a stored user but we have a token, try /users/profile
        if (token && !storedUser) {
          try {
            const profileRes = await api.get('/users/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const profile = profileRes.data?.data || profileRes.data;
            if (profile) {
                console.log('Fetched profile (token path):', profile);
                setUserData(profile);
              localStorage.setItem('user', JSON.stringify(profile));
              return;
            }
          } catch (e) {
            console.warn('Failed to fetch profile with token', e);
          }
        }

        // If we have a stored user, try to refresh their full profile
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userId = user?.id;

          if (userId && token) {
            try {
              const res = await api.get(`/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const profile = res.data?.data || res.data;
              if (profile) {
                console.log('Fetched profile (id path):', profile);
                setUserData(profile);
                localStorage.setItem('user', JSON.stringify(profile));
                return;
              }
            } catch (e) {
              console.warn('Failed to refresh user profile, falling back to stored user', e);
            }
          }

          // Fallback to stored user if fetch failed
          setUserData(JSON.parse(storedUser));
          return;
        }

        // No token/user available
        console.log("No token or user found in localStorage");
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to localStorage user data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
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