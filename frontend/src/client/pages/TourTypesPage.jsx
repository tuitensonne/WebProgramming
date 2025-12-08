import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
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
  transition: color 0.2s;

  &:hover {
    color: #0d6efd;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #333;
  font-weight: 500;
`;

const Separator = styled(IconChevronRight)`
  color: #999;
  flex-shrink: 0;
`;

const FilterBar = styled.div`
  background: #f5f5f5;
  padding: 0 60px 24px;

  @media (max-width: 1200px) {
    padding: 0 40px 24px;
  }

  @media (max-width: 768px) {
    padding: 0 20px 20px;
  }
`;

const FilterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

const FilterSelect = styled.select`
  flex: 1;
  min-width: 150px;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.2s;

  &:hover {
    border-color: #0d6efd;
  }

  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  }

  @media (max-width: 1024px) {
    flex: 1 1 calc(50% - 6px);
  }

  @media (max-width: 640px) {
    flex: 1 1 100%;
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

const TourIcon = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 28px;
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
  padding: 20px 20px 16px;
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
  gap: 10px;
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

const PriceValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ff4757;
`;


const RatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
`;

const Stars = styled.div`
  display: flex;
  gap: 6px;
  color: #ffa500;
`;

const ReviewCount = styled.div`
  color: #666;
  font-size: 13px;
`;

const ButtonWrapper = styled.div`
  padding: 12px 20px 20px 20px;
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

const TourTypesPage = () => {
  const [filters, setFilters] = useState({
    location: '',
    duration: '',
    price: '',
    sortBy: ''
  });
  const [searchParams] = useSearchParams();

  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    durations: [],
    categories: []
  });

  const [tours, setTours] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };


  const toggleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để lưu tour');
      return;
    }

    const tour = tours.find(t => t.id === id);
    const newLikedState = !tour?.liked;

    // Optimistically update UI
    setTours(prev => prev.map(t => t.id === id ? { ...t, liked: newLikedState } : t));

    try {
      if (newLikedState) {
        await api.post('/users/saved-tours', { tourId: id });
      } else {
        await api.delete(`/users/saved-tours/${id}`);
      }
    } catch (err) {
      console.log('Error saving/unsaving tour:', err);
      // Revert UI on error
      setTours(prev => prev.map(t => t.id === id ? { ...t, liked: !newLikedState } : t));
      
      // Show user-friendly error message
      if (err.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  // Fetch tours for Tour Types page - show tour types (categories 3+)
  useEffect(() => {
    // Category filter removed - TourTypesPage shows all tour types
    const fetchTours = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * pageSize;
        const params = { limit: pageSize, offset };
        
        // Filter by categoryId: if category is provided, use it; otherwise show all categories (3, 4, 5, etc.)
        // TourTypesPage shows tour types (categories 3+), not domestic/international
        if (filters.category) {
          params.categoryId = filters.category;
        }
        // If no category filter, don't filter by categoryId to show all tour types
        
        // Apply other filters
        if (filters.location) {
          params.location = filters.location;
        }
        if (filters.duration) {
          params.duration = filters.duration;
        }
        if (filters.price) {
          params.price = filters.price;
        }
        if (filters.sortBy) {
          params.sortBy = filters.sortBy;
        }
        
        const res = await api.get('/tours', { params });
        const data = res.data?.data || [];
        if (!data || data.length === 0) {
          setTours([]);
          setHasMore(false);
          setTotalPages(page > 1 ? page : 1);
        } else {
          // Fetch saved tours to set liked state
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const savedRes = await api.get('/users/saved-tours');
              const savedTours = savedRes.data?.data || [];
              const savedTourIds = new Set(savedTours.map(t => t.id));
              // Set liked state for tours that are saved
              data.forEach(tour => {
                tour.liked = savedTourIds.has(tour.id);
              });
            } catch (err) {
              // If fetch saved tours fails (e.g., token expired), just continue without liked state
              if (err.response?.status !== 401) {
                console.log('Error fetching saved tours:', err);
              }
            }
          }
          
          setTours(data);
          const more = data.length === pageSize;
          setHasMore(more);
          if (!more) {
            // No more data, current page is the last page
            setTotalPages(page);
          } else {
            // Still have more data
            setTotalPages(prev => {
              // If we're on page 1 and have data, estimate a reasonable number of pages
              if (page === 1) {
                // Estimate at least 10 pages if we have data on page 1
                return Math.max(prev || 0, 10);
              }
              // For other pages, only increase totalPages if we're very close to the limit
              if (prev && page >= prev - 1) {
                // We're at the limit, increase it by 3 (more conservative)
                return prev + 3;
              }
              // Keep existing totalPages if we haven't reached it yet
              return prev || page + 1;
            });
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
  }, [page, filters.sortBy, filters.location, filters.duration, filters.category, filters.price]);


  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch filter options without categoryId filter (show all tours)
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
          <BreadcrumbCurrent>Kiểu tour du lịch</BreadcrumbCurrent>
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
            <option value="">Kiểu tour</option>
            {filterOptions.categories.map((cat, idx) => (
              <option key={idx} value={cat.id}>{cat.name}</option>
            ))}
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

        </FilterContainer>
      </FilterBar>

      <Container>
        <Header>
          <Title>Kiểu Tour Du Lịch</Title>
        </Header>

        <ToursGrid>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            tours.map(tour => (
            <TourCard key={tour.id}>
              <TourImage>
                <img src={tour.image} alt={tour.location} />
                <TourIcon>{tour.icon}</TourIcon>
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

export default TourTypesPage;