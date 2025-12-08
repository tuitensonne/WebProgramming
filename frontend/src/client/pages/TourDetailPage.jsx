import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { 
  IconHome,
  IconChevronRight,
  IconStar,
  IconClock,
  IconUsers,
  IconMapPin,
  IconCheck,
  IconX,
  IconBookmark,
  IconShare
} from '@tabler/icons-react';
import api from '../../api/api';
import BookingForm from '../components/BookingForm';
import PaymentModal from '../components/PaymentModal';

const PageWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const BreadcrumbWrapper = styled.div`
  background: #f5f5f5;
  padding: 16px 60px;
  @media (max-width: 768px) {
    padding: 12px 20px;
  }
`;

const BreadcrumbContainer = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

const BreadcrumbLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  &:hover { color: #0d6efd; }
`;

const BreadcrumbCurrent = styled.span`
  color: #333;
  font-weight: 500;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px 40px;
  @media (max-width: 768px) {
    padding: 0 20px 30px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666;
`;

const ErrorContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const TourTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 24px 0 16px;
  line-height: 1.4;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin: 24px 0;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainImage = styled.div`
  background: #ddd;
  border-radius: 12px;
  overflow: hidden;
  height: 400px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Thumbnail = styled.div`
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
  height: 92px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const OverviewSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const OverviewText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HighlightItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  margin-bottom: 12px;
  
  svg {
    color: #ff6b35;
    flex-shrink: 0;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ServiceItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #666;
  
  svg {
    color: ${props => props.$included ? '#22c55e' : '#ef4444'};
    flex-shrink: 0;
  }
`;

const CommentsSection = styled.div`
  margin: 40px 0;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CommentName = styled.span`
  font-weight: 600;
  color: #333;
`;

const CommentRating = styled.div`
  display: flex;
  gap: 4px;
  color: #ffc107;
  font-size: 14px;
`;

const CommentText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const PriceBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  position: sticky;
  top: 100px;
  
  @media (max-width: 768px) {
    position: static;
  }
`;

const Price = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ff6b35;
  margin-bottom: 20px;
`;

const BookingButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #e55a1f;
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tours/${id}`);
        const tourData = response.data?.data;
        
        if (!tourData) {
          setError('Tour not found');
          return;
        }
        
        setTour(tourData);
        setMainImage(tourData.thumbnailUrl);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError(err.response?.data?.message || 'Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetail();
    }
  }, [id]);

  useEffect(() => {
    // Fetch user info if logged in
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data?.data) {
          setUserInfo(response.data.data);
        }
      } catch (err) {
        // User not logged in, will show form to enter info
      }
    };
    
    fetchUserInfo();
  }, []);

  const handleBooking = (data) => {
    // Check if user is logged in - REQUIRED for booking
    const token = localStorage.getItem('token');
    
    if (!token) {
      const shouldLogin = window.confirm('Bạn cần đăng nhập để đặt tour. Bạn có muốn đăng nhập ngay bây giờ không?');
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }
    
    if (token && userInfo) {
      // Pre-fill with user info
      setBookingData({ ...data, tourId: tour.id, tourName: tour.name });
      setUserInfo({
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || ''
      });
    } else {
      // User has token but userInfo not loaded yet - wait a bit or show form
      setBookingData({ ...data, tourId: tour.id, tourName: tour.name });
      setUserInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        note: ''
      });
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    try {
      const bookingPayload = {
        tourId: bookingData.tourId,
        numberOfAdult: bookingData.adults || 0,
        numberOfChild: bookingData.children || 0,
        status: 'pending'
      };

      console.log('Sending booking payload:', bookingPayload);

      const response = await api.post('/bookings', bookingPayload);
      
      console.log('Booking response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      // Check if request was successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Check if backend indicates success
        if (response.data?.success !== false) {
          // Chuyển đến trang profile với section quản lý tour và timestamp để force refresh
          navigate(`/profile?section=tour-manage&refresh=${Date.now()}`);
          return;
        }
      }

      // If we get here, something went wrong
      const errorMessage = response.data?.message || response.data?.error || 'Booking failed';
      console.error('Booking failed - response:', response.data);
      throw new Error(errorMessage);
    } catch (err) {
      console.error('Error creating booking:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      let errorMessage = 'Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Lỗi từ server: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.message) {
        // Error in request setup
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      throw err;
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <LoadingContainer>Loading tour details...</LoadingContainer>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <ErrorContainer>{error}</ErrorContainer>
        </Container>
      </PageWrapper>
    );
  }

  if (!tour) {
    return (
      <PageWrapper>
        <Container>
          <ErrorContainer>Tour not found</ErrorContainer>
        </Container>
      </PageWrapper>
    );
  }

  const priceDisplay = tour.price ? new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(tour.price) : 'Liên hệ';

  return (
    <PageWrapper>
      <BreadcrumbWrapper>
        <BreadcrumbContainer>
          <BreadcrumbLink to="/">
            <IconHome size={18} />
          </BreadcrumbLink>
          <IconChevronRight size={16} color="#999" />
          <BreadcrumbLink to="/domestic">
            Trang chủ
          </BreadcrumbLink>
          <IconChevronRight size={16} color="#999" />
          <BreadcrumbCurrent>{tour.name}</BreadcrumbCurrent>
        </BreadcrumbContainer>
      </BreadcrumbWrapper>

      <Container>
        <TourTitle>{tour.name}</TourTitle>

        {/* Image Gallery */}
        <ImageGallery>
          <MainImage>
            <img src={mainImage || tour.image || tour.thumbnailUrl} alt={tour.name} />
          </MainImage>
          <ThumbnailGrid>
            <Thumbnail onClick={() => setMainImage(tour.image || tour.thumbnailUrl)}>
              <img src={tour.image || tour.thumbnailUrl} alt="Tour" />
            </Thumbnail>
            {/* Additional thumbnails can be added here if more images available */}
          </ThumbnailGrid>
        </ImageGallery>

        {/* Info Grid */}
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Thời gian</InfoLabel>
            <InfoValue>{tour.duration}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Địa điểm</InfoLabel>
            <InfoValue>{tour.address}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Số người</InfoLabel>
            <InfoValue>{tour.guests}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Loại tour</InfoLabel>
            <InfoValue>{tour.icon} {tour.tourType || 'Group'}</InfoValue>
          </InfoItem>
        </InfoGrid>

        {/* Main Content + Booking Form */}
        <MainContent>
          <div>
            {/* Overview Section */}
            {tour.overview && tour.overview.length > 0 && (
              <OverviewSection>
                <SectionTitle>Tổng quan</SectionTitle>
                {Array.isArray(tour.overview) ? (
                  tour.overview.map((item, idx) => (
                    <OverviewText key={idx}>{item}</OverviewText>
                  ))
                ) : (
                  <OverviewText>{tour.overview}</OverviewText>
                )}
              </OverviewSection>
            )}

            {/* Highlights Section */}
            {tour.highlights && tour.highlights.length > 0 && (
              <OverviewSection>
                <SectionTitle>Điểm nổi bật</SectionTitle>
                <HighlightsList>
                  {Array.isArray(tour.highlights) ? (
                    tour.highlights.map((highlight, idx) => (
                      <HighlightItem key={idx}>
                        <IconStar size={20} fill="currentColor" />
                        {highlight}
                      </HighlightItem>
                    ))
                  ) : (
                    <HighlightItem>
                      <IconStar size={20} fill="currentColor" />
                      {tour.highlights}
                    </HighlightItem>
                  )}
                </HighlightsList>
              </OverviewSection>
            )}

            {/* Services Section */}
            {(tour.includedServices?.length > 0 || tour.excludedServices?.length > 0) && (
              <OverviewSection>
                <SectionTitle>Dịch vụ</SectionTitle>
                <ServicesGrid>
                  {tour.includedServices?.length > 0 && (
                    <div>
                      <h3 style={{ color: '#333', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                        ✓ Bao gồm
                      </h3>
                      <ServiceList>
                        {tour.includedServices.map((service) => (
                          <ServiceItem key={service.id} $included={true}>
                            <IconCheck size={20} />
                            {service.item}
                          </ServiceItem>
                        ))}
                      </ServiceList>
                    </div>
                  )}
                  {tour.excludedServices?.length > 0 && (
                    <div>
                      <h3 style={{ color: '#333', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                        ✗ Không bao gồm
                      </h3>
                      <ServiceList>
                        {tour.excludedServices.map((service) => (
                          <ServiceItem key={service.id} $included={false}>
                            <IconX size={20} />
                            {service.item}
                          </ServiceItem>
                        ))}
                      </ServiceList>
                    </div>
                  )}
                </ServicesGrid>
              </OverviewSection>
            )}

            {/* Comments Section */}
            <CommentsSection>
              <SectionTitle>Đánh giá từ khách hàng</SectionTitle>
              {tour.comments && tour.comments.length > 0 ? (
                <CommentsList>
                  {tour.comments.map((comment, idx) => (
                    <CommentCard key={idx}>
                      <CommentAuthor>
                        <div>
                          <CommentName>{comment.author || 'Anonymous'}</CommentName>
                          <CommentRating>
                            {'⭐'.repeat(comment.rating || 5)}
                          </CommentRating>
                        </div>
                      </CommentAuthor>
                      <CommentText>{comment.text}</CommentText>
                    </CommentCard>
                  ))}
                </CommentsList>
              ) : (
                <p style={{ color: '#999' }}>Chưa có đánh giá nào</p>
              )}
            </CommentsSection>
          </div>

          {/* Booking Form */}
          <BookingForm tour={tour} onBooking={handleBooking} />
        </MainContent>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingData={bookingData}
          userInfo={userInfo}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Container>
    </PageWrapper>
  );
};

export default TourDetailPage;
