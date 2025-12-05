import { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  IconMapPin, 
  IconStar,
  IconClock,
  IconHeart,
  IconHome,
  IconChevronRight,
  IconCalendar,
  IconUsers
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import api from "../../api/api";
import Pagination from "../components/Pagination";

const PageWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const BreadcrumbWrapper = styled.div`
  background: #f5f5f5;
  padding: 16px 60px;

  @media (max-width: 1200px) {
    padding: 16px 40px;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
  }
`;

const BreadcrumbContainer = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 180, 219, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 60px;

  @media (max-width: 1200px) {
    padding: 30px 40px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const TourCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const TourImage = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  ${TourCard}:hover & img {
    transform: scale(1.1);
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    color: ${props => props.$liked ? '#ff4757' : '#666'};
    fill: ${props => props.$liked ? '#ff4757' : 'none'};
  }
`;

const TourContent = styled.div`
  padding: 20px 20px 0;
`;

const TourLocation = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const TourInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;

  svg {
    flex-shrink: 0;
    color: #999;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 20px;
  margin-bottom: 8px;
`;

const PriceValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ff4757;
`;

const OldPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  margin-bottom: 16px;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  color: #ffc107;
`;

const ReviewCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const ButtonWrapper = styled.div`
  padding: 0 20px 20px;
`;

const BookButton = styled.button`
  padding: 10px 24px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background-color: #ff5252;
    transform: translateY(-1px);
  }
`;

const InternationalToursPage = () => {
  const [filters, setFilters] = useState({
    location: '',
    duration: '',
    category: '',
    discount: '',
    price: '',
    sortBy: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    durations: [],
    categories: []
  });

  const mockTours = [
    {
      id: 1,
      location: "Switzerland",
      country: "🇨🇭",
      departure: "Thứ 7 Hàng Tuần",
      guests: "15 Người",
      address: "Zurich, Geneva",
      duration: "5 Ngày 4 Đêm",
      rating: 4.8,
      reviews: 24,
      price: 45000000,
      oldPrice: 52000000,
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 2,
      location: "France",
      country: "🇫🇷",
      departure: "Thứ 7 Hàng Tuần",
      guests: "20 Người",
      address: "Paris, Lyon",
      duration: "6 Ngày 5 Đêm",
      rating: 4.9,
      reviews: 35,
      price: 38000000,
      oldPrice: 45000000,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 3,
      location: "Japan",
      country: "🇯🇵",
      departure: "Thứ 7 Hàng Tuần",
      guests: "18 Người",
      address: "Tokyo, Osaka",
      duration: "7 Ngày 6 Đêm",
      rating: 4.9,
      reviews: 42,
      price: 42000000,
      oldPrice: 48000000,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 4,
      location: "Italy",
      country: "🇮🇹",
      departure: "Thứ 7 Hàng Tuần",
      guests: "15 Người",
      address: "Rome, Venice",
      duration: "6 Ngày 5 Đêm",
      rating: 4.7,
      reviews: 28,
      price: 40000000,
      oldPrice: 46000000,
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 5,
      location: "United Kingdom",
      country: "🇬🇧",
      departure: "Thứ 7 Hàng Tuần",
      guests: "20 Người",
      address: "London, Edinburgh",
      duration: "5 Ngày 4 Đêm",
      rating: 4.6,
      reviews: 31,
      price: 44000000,
      oldPrice: 50000000,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 6,
      location: "Thailand",
      country: "🇹🇭",
      departure: "Thứ 7 Hàng Tuần",
      guests: "15 Người",
      address: "Bangkok, Phuket",
      duration: "4 Ngày 3 Đêm",
      rating: 4.8,
      reviews: 38,
      price: 18000000,
      oldPrice: 22000000,
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 7,
      location: "South Korea",
      country: "🇰🇷",
      departure: "Thứ 7 Hàng Tuần",
      guests: "18 Người",
      address: "Seoul, Busan",
      duration: "5 Ngày 4 Đêm",
      rating: 4.7,
      reviews: 29,
      price: 25000000,
      oldPrice: 30000000,
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 8,
      location: "Australia",
      country: "🇦🇺",
      departure: "Thứ 7 Hàng Tuần",
      guests: "15 Người",
      address: "Sydney, Melbourne",
      duration: "8 Ngày 7 Đêm",
      rating: 4.9,
      reviews: 33,
      price: 55000000,
      oldPrice: 62000000,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 9,
      location: "United States",
      country: "🇺🇸",
      departure: "Thứ 7 Hàng Tuần",
      guests: "20 Người",
      address: "New York, Los Angeles",
      duration: "10 Ngày 9 Đêm",
      rating: 4.8,
      reviews: 45,
      price: 65000000,
      oldPrice: 75000000,
      image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=500&h=300&fit=crop",
      liked: false
    }
  ];

  const [tours, setTours] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleViewPrice = async () => {
    setLoading(true);
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();
      
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.duration) {
        params.append('duration', filters.duration);
      }
      if (filters.category) {
        params.append('categoryId', filters.category);
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      
      // Always get 'international' tour type
      params.append('tourType', 'international');
      params.append('limit', pageSize);
      params.append('offset', 0);
      
      const res = await api.get(`/tours?${params.toString()}`);
      const data = res.data?.data || [];
      
      setTours(data);
      setPage(1);
      const more = data.length === pageSize;
      setHasMore(more);
      setTotalPages(more ? 10 : 1); // Estimate for filtered results
    } catch (err) {
      console.log('Error fetching filtered tours:', err);
      alert('Không tìm thấy tour phù hợp với bộ lọc của bạn');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    setTours(tours.map(tour => 
      tour.id === id ? { ...tour, liked: !tour.liked } : tour
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * pageSize;
        const params = { limit: pageSize, offset, tourType: 'international' };
        if (filters.sortBy) {
          params.sortBy = filters.sortBy;
        }
        const res = await api.get('/tours', { params });
        const data = res.data?.data || [];
        if (!data || data.length === 0) {
          // No data from backend — show empty state
          setTours([]);
          setHasMore(false);
          setTotalPages(page);
        } else {
          setTours(data);
          const more = data.length === pageSize;
          setHasMore(more);
          if (!more) {
            setTotalPages(page);
          } else {
            setTotalPages(prev => prev ? Math.max(prev, page + 5) : page + 5);
          }
        }
      } catch (err) {
        console.log('Error fetching tours:', err);
        setTours([]);
        setHasMore(false);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [page, filters.sortBy]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await api.get('/filters');
        const data = res.data?.data || {};
        setFilterOptions({
          locations: data.locations || [],
          durations: data.durations || [],
          categories: data.categories || []
        });
      } catch (err) {
        console.log('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <BreadcrumbWrapper>
        <BreadcrumbContainer>
          <BreadcrumbLink to="/">
            <IconHome size={18} />
          </BreadcrumbLink>
          <Separator size={16} />
          <BreadcrumbCurrent>Du lịch quốc tế</BreadcrumbCurrent>
        </BreadcrumbContainer>
      </BreadcrumbWrapper>

      {/* Filter Bar */}
      <FilterBar>
        <FilterContainer>
          <FilterSelect 
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">Địa điểm</option>
            {filterOptions.locations.map((loc, idx) => (
              <option key={idx} value={loc.value}>{loc.label}</option>
            ))}
          </FilterSelect>

          <FilterSelect 
            value={filters.duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
          >
            <option value="">Thời gian</option>
            {filterOptions.durations.map((dur, idx) => (
              <option key={idx} value={dur.value}>{dur.label}</option>
            ))}
          </FilterSelect>

          <FilterSelect 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Loại tour</option>
            {filterOptions.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.tourCategoryName}</option>
            ))}
          </FilterSelect>

          <FilterSelect 
            value={filters.discount}
            onChange={(e) => handleFilterChange('discount', e.target.value)}
          >
            <option value="">Giảm giá</option>
            <option value="10">Giảm 10%</option>
            <option value="20">Giảm 20%</option>
            <option value="30">Giảm 30%</option>
            <option value="50">Giảm 50%</option>
          </FilterSelect>

          <FilterSelect 
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
          >
            <option value="">Giá</option>
            <option value="0-20">Dưới 20 triệu</option>
            <option value="20-40">20-40 triệu</option>
            <option value="40-60">40-60 triệu</option>
            <option value="60+">Trên 60 triệu</option>
          </FilterSelect>

          <FilterSelect 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="">Sắp xếp theo</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </FilterSelect>

          <ViewPriceButton onClick={handleViewPrice}>
            Xem giá
          </ViewPriceButton>
        </FilterContainer>
      </FilterBar>

      <Container>
        <Header>
          <Title>Du Lịch Quốc Tế</Title>
        </Header>

        <ToursGrid>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            tours.map(tour => (
            <TourCard key={tour.id}>
              <TourImage>
                <img src={tour.image} alt={tour.location} />
                <FavoriteButton 
                  $liked={tour.liked}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(tour.id);
                  }}
                >
                  <IconHeart size={20} />
                </FavoriteButton>
              </TourImage>

              <TourContent>
                <TourLocation>{tour.location}</TourLocation>
                
                <TourInfo>
                  <InfoRow>
                    <IconCalendar size={16} />
                    <span>{tour.departure}</span>
                  </InfoRow>
                  <InfoRow>
                    <IconUsers size={16} />
                    <span>{tour.guests}</span>
                  </InfoRow>
                  <InfoRow>
                    <IconMapPin size={16} />
                    <span>{tour.address}</span>
                  </InfoRow>
                  <InfoRow>
                    <IconClock size={16} />
                    <span>{tour.duration}</span>
                  </InfoRow>
                </TourInfo>
              </TourContent>

              <PriceRow>
                <PriceValue>{tour.price !== null ? formatPrice(tour.price) : 'Đang cập nhật'}</PriceValue>
                <OldPrice>{tour.oldPrice !== null ? formatPrice(tour.oldPrice) : ''}</OldPrice>
              </PriceRow>

              <RatingRow>
                <Stars>
                  {[...Array(5)].map((_, i) => (
                    <IconStar 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(tour.rating || 0) ? "currentColor" : "none"}
                    />
                  ))}
                </Stars>
                <ReviewCount>({tour.reviews || 0} Đánh Giá)</ReviewCount>
              </RatingRow>

              <ButtonWrapper>
                <Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                  <BookButton>Khám phá ngay</BookButton>
                </Link>
              </ButtonWrapper>
            </TourCard>
            ))
          )}
        </ToursGrid>

        {totalPages && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasMore={hasMore}
          />
        )}
      </Container>
    </PageWrapper>
  );
};

export default InternationalToursPage;