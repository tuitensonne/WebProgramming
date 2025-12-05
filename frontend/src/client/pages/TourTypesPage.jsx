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

const TourTypesPage = () => {
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
      location: "Tour Biển Đảo",
      icon: "🏖️",
      departure: "Hàng Ngày",
      guests: "10-20 Người",
      address: "Nha Trang, Phú Quốc",
      duration: "3 Ngày 2 Đêm",
      rating: 4.8,
      reviews: 156,
      price: 4500000,
      oldPrice: 5500000,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 2,
      location: "Tour Núi Rừng",
      icon: "⛰️",
      departure: "Thứ 7, Chủ Nhật",
      guests: "15 Người",
      address: "Sapa, Đà Lạt",
      duration: "4 Ngày 3 Đêm",
      rating: 4.7,
      reviews: 98,
      price: 5200000,
      oldPrice: 6500000,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 3,
      location: "Tour Văn Hóa Lịch Sử",
      icon: "🏛️",
      departure: "Hàng Ngày",
      guests: "20 Người",
      address: "Huế, Hội An",
      duration: "3 Ngày 2 Đêm",
      rating: 4.9,
      reviews: 203,
      price: 3800000,
      oldPrice: 4800000,
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 4,
      location: "Tour Ẩm Thực",
      icon: "🍜",
      departure: "Hàng Ngày",
      guests: "8-12 Người",
      address: "Hà Nội, TP.HCM",
      duration: "1 Ngày",
      rating: 4.6,
      reviews: 87,
      price: 1200000,
      oldPrice: 1500000,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 5,
      location: "Tour Mạo Hiểm",
      icon: "🎿",
      departure: "Thứ 7, Chủ Nhật",
      guests: "10-15 Người",
      address: "Ninh Bình, Quảng Bình",
      duration: "2 Ngày 1 Đêm",
      rating: 4.8,
      reviews: 142,
      price: 3500000,
      oldPrice: 4200000,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 6,
      location: "Tour Nghỉ Dưỡng",
      icon: "🌴",
      departure: "Hàng Ngày",
      guests: "15-25 Người",
      address: "Vũng Tàu, Mũi Né",
      duration: "3 Ngày 2 Đêm",
      rating: 4.7,
      reviews: 178,
      price: 4800000,
      oldPrice: 6000000,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 7,
      location: "Tour Sinh Thái",
      icon: "🌿",
      departure: "Cuối Tuần",
      guests: "12-18 Người",
      address: "Cần Thơ, Cà Mau",
      duration: "2 Ngày 1 Đêm",
      rating: 4.5,
      reviews: 94,
      price: 2800000,
      oldPrice: 3500000,
      image: "https://images.unsplash.com/photo-1586500036706-41963de24d99?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 8,
      location: "Tour Team Building",
      icon: "🤝",
      departure: "Theo Yêu Cầu",
      guests: "20-50 Người",
      address: "Các Resort Gần HN, HCM",
      duration: "2 Ngày 1 Đêm",
      rating: 4.8,
      reviews: 165,
      price: 3200000,
      oldPrice: 4000000,
      image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=500&h=300&fit=crop",
      liked: false
    },
    {
      id: 9,
      location: "Tour Khám Phá Hang Động",
      icon: "🕳️",
      departure: "Thứ 7",
      guests: "10-15 Người",
      address: "Quảng Bình, Sơn Đoòng",
      duration: "4 Ngày 3 Đêm",
      rating: 4.9,
      reviews: 76,
      price: 8500000,
      oldPrice: 10000000,
      image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=500&h=300&fit=crop",
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
        params.append('category', filters.category);
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

  const resetFilters = async () => {
    setFilters({
      location: '',
      duration: '',
      category: '',
      discount: '',
      price: '',
      sortBy: ''
    });
    setPage(1);
    // Fetch first page of all international tours
    await fetchTours(1);
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


  // Centralized fetch so other actions can refetch pages or reset filters
  const fetchTours = async (pageNum = 1, opts = {}) => {
    setLoading(true);
    try {
      const offset = (pageNum - 1) * pageSize;
      // Allow callers to override query (e.g., filtered fetches) via opts.url
      const url = opts.url || `/tours?tourType=international&limit=${pageSize}&offset=${offset}`;
      const res = await api.get(url);
      const data = res.data?.data || [];

      if (!data || data.length === 0) {
        setTours([]);
        setHasMore(false);
        setTotalPages(pageNum > 1 ? pageNum : 1);
      } else {
        setTours(data);
        const more = data.length === pageSize;
        setHasMore(more);
        if (!more) {
          setTotalPages(pageNum);
        } else {
          setTotalPages(prev => prev ? Math.max(prev, pageNum + 5) : pageNum + 5);
        }
      }
    } catch (err) {
      console.log('Error fetching tours:', err);
      setTours([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(page);
  }, [page]);

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
                <BookButton>Khám phá ngay</BookButton>
              </ButtonWrapper>
            </TourCard>
            ))
          )}
        </ToursGrid>

        {/* Use shared Pagination component (same as DomesticToursPage) when possible */}
        {(totalPages || hasMore !== null) && (
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