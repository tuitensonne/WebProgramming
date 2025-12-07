import { useState } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { 
  IconHome,
  IconChevronRight,
  IconStar,
  IconClock,
  IconUsers,
  IconWorld,
  IconBookmark,
  IconShare,
  IconCheck,
  IconX
} from '@tabler/icons-react';

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

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px 40px;

  @media (max-width: 1200px) {
    padding: 0 40px 40px;
  }

  @media (max-width: 768px) {
    padding: 0 20px 30px;
  }
`;

const TourHeader = styled.div`
  padding: 24px 0;
  margin-bottom: 24px;
`;

const TourTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  color: #ffc107;
`;

const RatingText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Reviews = styled.span`
  font-size: 14px;
  color: #666;
`;

const Saved = styled.span`
  font-size: 14px;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0d6efd;
    color: #0d6efd;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(2, 200px);
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin-bottom: 40px;
`;

const MainImage = styled.div`
  grid-row: 1 / 3;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SmallImage = styled.div`
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SeeAllPhotos = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
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
  font-size: 12px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const Section = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
`;

const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HighlightItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #666;
  line-height: 1.6;

  &::before {
    content: "•";
    color: #0d6efd;
    font-weight: 700;
    font-size: 20px;
  }
`;

const IncludedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IncludedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${props => props.$excluded ? '#999' : '#333'};
`;

const BookingCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

const PriceSection = styled.div`
  margin-bottom: 24px;
`;

const PriceLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Price = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;

const DateSelector = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  }
`;

const TicketsSection = styled.div`
  margin-bottom: 24px;
`;

const TicketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketType = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const TicketPrice = styled.span`
  font-size: 13px;
  color: #666;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: #0d6efd;
    color: #0d6efd;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 20px;
  text-align: center;
`;

const ExtraSection = styled.div`
  margin-bottom: 24px;
`;

const ExtraItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ExtraPrice = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 600;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 2px solid #f0f0f0;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #ff6b6b;
`;

const BookButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3);
  }
`;

const ItinerarySection = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const ItineraryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const DayNumber = styled.div`
  width: 32px;
  height: 32px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

const DayTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const DayDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 0 40px;
`;

const MapSection = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  margin-top: 16px;
`;

const CalendarSection = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const CalendarDay = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${props => props.$available ? '#333' : '#ccc'};
  background: ${props => props.$selected ? '#ff6b6b' : props.$available ? 'white' : '#f9f9f9'};
  color: ${props => props.$selected ? 'white' : props.$available ? '#333' : '#ccc'};
  border-radius: 8px;
  cursor: ${props => props.$available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  border: 1px solid ${props => props.$available ? '#e0e0e0' : '#f0f0f0'};

  &:hover {
    ${props => props.$available && `
      background: #fff5f5;
      border-color: #ff6b6b;
    `}
  }
`;

const FAQSection = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const FAQItem = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FAQQuestion = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const FAQAnswer = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 0 32px;
`;

const ReviewsSection = styled.div`
  padding: 0 0 32px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #e0e0e0;
`;

const ReviewStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #999;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const ReviewCard = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ReviewAuthor = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

const ReviewDate = styled.span`
  font-size: 13px;
  color: #999;
`;

const ReviewText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 12px;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 8px;
`;

const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const SuggestionsSection = styled.div`
  padding: 40px 0 0;
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SuggestionCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const SuggestionImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const SuggestionContent = styled.div`
  padding: 16px;
`;

const SuggestionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SuggestionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SuggestionDuration = styled.span`
  font-size: 13px;
  color: #666;
`;

const SuggestionPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ff6b6b;
`;

const TourDetailPage = () => {
  const [tickets, setTickets] = useState({
    adult: 3,
    youth: 2,
    children: 4
  });

  const [extras, setExtras] = useState({
    servicePerBooking: false,
    servicePerPerson: false
  });

  const ticketPrices = {
    adult: 262.00,
    youth: 188.00,
    children: 80.00
  };

  const extraPrices = {
    servicePerBooking: 40,
    servicePerPerson: 40
  };

  const updateQuantity = (type, delta) => {
    setTickets(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const toggleExtra = (key) => {
    setExtras(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    total += tickets.adult * ticketPrices.adult;
    total += tickets.youth * ticketPrices.youth;
    total += tickets.children * ticketPrices.children;
    
    if (extras.servicePerBooking) total += extraPrices.servicePerBooking;
    if (extras.servicePerPerson) {
      const totalPeople = tickets.adult + tickets.youth + tickets.children;
      total += totalPeople * extraPrices.servicePerPerson;
    }
    
    return total.toFixed(2);
  };

  return (
    <PageWrapper>
      <BreadcrumbWrapper>
        <BreadcrumbContainer>
          <BreadcrumbLink to="/">
            <IconHome size={18} />
          </BreadcrumbLink>
          <Separator size={16} />
          <BreadcrumbLink to="/domestic">
            Du lịch trong nước
          </BreadcrumbLink>
          <Separator size={16} />
          <BreadcrumbCurrent>Tour Hà Nội - Hạ Long - Sapa</BreadcrumbCurrent>
        </BreadcrumbContainer>
      </BreadcrumbWrapper>

      <Container>
        <TourHeader>
          <TourTitle>
            Tour Hà Nội - Hạ Long - Bãi Đình Trắng An (Ngủ tàu trên Vịnh Hạ Long - một trong 7 Kỳ quan Thiên nhiên mới của thế giới) tour trọn gói đặc sắc nhất năm 2025
          </TourTitle>
          <HeaderMeta>
            <MetaLeft>
              <Rating>
                <Stars>
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                  ))}
                </Stars>
                <RatingText>4.5</RatingText>
                <Reviews>(15)</Reviews>
              </Rating>
              <Saved>100+ đã đặt</Saved>
            </MetaLeft>
            <ActionButtons>
              <ActionButton>
                <IconBookmark size={18} />
                Save
              </ActionButton>
              <ActionButton>
                <IconShare size={18} />
                Share
              </ActionButton>
            </ActionButtons>
          </HeaderMeta>
        </TourHeader>

        <ImageGallery>
          <MainImage>
            <img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop" alt="Tour main" />
          </MainImage>
          <SmallImage>
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Tour 2" />
          </SmallImage>
          <SmallImage>
            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop" alt="Tour 3" />
          </SmallImage>
          <SeeAllPhotos>See all photos</SeeAllPhotos>
        </ImageGallery>

        <MainContent>
          <LeftColumn>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Duration</InfoLabel>
                <InfoValue>3 days</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group Size</InfoLabel>
                <InfoValue>10 people</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ages</InfoLabel>
                <InfoValue>18-99 yrs</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Languages</InfoLabel>
                <InfoValue>English, Japanese</InfoValue>
              </InfoItem>
            </InfoGrid>

            <Section>
              <SectionTitle>Tour Overview</SectionTitle>
              <Description>
                The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip whisks you around the islands in one day. Swim over the coral reefs of Pileh Lagoon, have lunch at Phi Phi Leh, snorkel at Bamboo Island, and visit Monkey Beach and Maya Bay. Boat transfers, snacks, buffet lunch, snorkeling equipment, and Phuket hotel pickup and drop-off all included.
              </Description>
              
              <SectionTitle>Tour Highlights</SectionTitle>
              <HighlightsList>
                <HighlightItem>Experience the thrill of a speedboat to the stunning Phi Phi Islands</HighlightItem>
                <HighlightItem>Be amazed by the variety of marine life in the archipelago</HighlightItem>
                <HighlightItem>Enjoy relaxing in paradise with white sand beaches and azure turquoise water</HighlightItem>
                <HighlightItem>Feel the comfort of a tour limited to 35 passengers</HighlightItem>
                <HighlightItem>Catch a glimpse of the wild monkeys around Monkey Beach</HighlightItem>
              </HighlightsList>
            </Section>

            <Section>
              <SectionTitle>What's included</SectionTitle>
              <IncludedGrid>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Beverages, drinking water, morning tea and buffet lunch
                </IncludedItem>
                <IncludedItem $excluded>
                  <IconX size={20} color="#ef4444" />
                  Towel
                </IncludedItem>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Local taxes
                </IncludedItem>
                <IncludedItem $excluded>
                  <IconX size={20} color="#ef4444" />
                  Tips
                </IncludedItem>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Hotel pickup and drop-off by air-conditioned minivan
                </IncludedItem>
                <IncludedItem $excluded>
                  <IconX size={20} color="#ef4444" />
                  Alcoholic Beverages
                </IncludedItem>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Insurance/Transfer to a private pier
                </IncludedItem>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Soft drinks
                </IncludedItem>
                <IncludedItem>
                  <IconCheck size={20} color="#22c55e" />
                  Tour Guide
                </IncludedItem>
              </IncludedGrid>
            </Section>

            <ItinerarySection>
              <SectionTitle>Itinerary</SectionTitle>
              
              <div style={{ marginBottom: '24px' }}>
                <ItineraryTitle>
                  <DayNumber>1</DayNumber>
                  <DayTitle>Day 1: Prepare & Start Cruise</DayTitle>
                </ItineraryTitle>
                <DayDescription>
                  Begin your adventure with hotel pickup in Hanoi. Travel to Ha Long Bay and board your cruise ship. Enjoy welcome drinks and a briefing about the journey ahead.
                </DayDescription>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <ItineraryTitle>
                  <DayNumber>2</DayNumber>
                  <DayTitle>Day 2: Explore Caves & Swimming</DayTitle>
                </ItineraryTitle>
                <DayDescription>
                  Wake up to the stunning bay views. Visit magnificent caves, go kayaking, and enjoy swimming in crystal clear waters. Experience traditional fishing village life.
                </DayDescription>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <ItineraryTitle>
                  <DayNumber>3</DayNumber>
                  <DayTitle>Day 3: Visit Sapa Trekking</DayTitle>
                </ItineraryTitle>
                <DayDescription>
                  Journey to Sapa and begin trekking through terraced rice fields and ethnic minority villages. Meet local people and learn about their unique culture.
                </DayDescription>
              </div>
            </ItinerarySection>

            <MapSection>
              <SectionTitle>Tour Map</SectionTitle>
              <MapPlaceholder>
                Interactive Map - Ha Long Bay to Sapa Route
              </MapPlaceholder>
            </MapSection>

            <CalendarSection>
              <SectionTitle>Availability Calendar</SectionTitle>
              <CalendarGrid>
                {[...Array(31)].map((_, i) => (
                  <CalendarDay 
                    key={i} 
                    $available={i % 3 !== 0}
                    $selected={i === 15}
                  >
                    {i + 1}
                  </CalendarDay>
                ))}
              </CalendarGrid>
            </CalendarSection>

            <FAQSection>
              <SectionTitle>FAQ</SectionTitle>
              
              <FAQItem>
                <FAQQuestion>
                  <span style={{ color: '#ff6b6b' }}>Q</span>
                  Can I get the refund?
                </FAQQuestion>
                <FAQAnswer>
                  Yes, you can get a full refund if you cancel at least 48 hours before the tour starts. Cancellations within 48 hours are subject to a 50% fee.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <span style={{ color: '#ff6b6b' }}>Q</span>
                  What do I need to bring?
                </FAQQuestion>
                <FAQAnswer>
                  Please bring comfortable walking shoes, sunscreen, hat, camera, and any personal medications. Swimming gear is optional.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <span style={{ color: '#ff6b6b' }}>Q</span>
                  Is the tour suitable for children?
                </FAQQuestion>
                <FAQAnswer>
                  Yes, this tour is family-friendly and suitable for children aged 5 and above. Children must be accompanied by adults.
                </FAQAnswer>
              </FAQItem>
            </FAQSection>

            <ReviewsSection>
              <SectionTitle>Customer Reviews</SectionTitle>
              
              <ReviewStats>
                <StatItem>
                  <StatLabel>Location</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Amenities</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Food</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Price</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Rooms</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Tourism</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Cleanliness</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Tour Operator</StatLabel>
                  <StatValue>5.0</StatValue>
                </StatItem>
              </ReviewStats>

              <ReviewCard>
                <ReviewHeader>
                  <ReviewAuthor>All Fams</ReviewAuthor>
                  <ReviewDate>April 2020</ReviewDate>
                </ReviewHeader>
                <ReviewText>
                  "Nice to have 2+ full day trip to have it. This isn't a short's trip should have passed I am lucky of this all be happy to here spend I have trip I am there nice have place trip"
                </ReviewText>
                <ReviewImages>
                  <ReviewImage src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" alt="Review 1" />
                  <ReviewImage src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop" alt="Review 2" />
                  <ReviewImage src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=100&h=100&fit=crop" alt="Review 3" />
                </ReviewImages>
              </ReviewCard>

              <ReviewCard>
                <ReviewHeader>
                  <ReviewAuthor>Ali Tufan</ReviewAuthor>
                  <ReviewDate>April 2020</ReviewDate>
                </ReviewHeader>
                <ReviewText>
                  "Nice to have 2+ full day trip to have it. This isn't a short's trip should have passed I am lucky of this all be happy to here spend I have trip I am there nice have place trip"
                </ReviewText>
                <ReviewImages>
                  <ReviewImage src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" alt="Review 1" />
                  <ReviewImage src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop" alt="Review 2" />
                  <ReviewImage src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=100&h=100&fit=crop" alt="Review 3" />
                </ReviewImages>
              </ReviewCard>
            </ReviewsSection>
          </LeftColumn>

          <BookingCard>
            <PriceSection>
              <PriceLabel>From</PriceLabel>
              <Price>$1,200</Price>
            </PriceSection>

            <DateSelector>
              <Label>From</Label>
              <Input type="text" value="February 05 - March 14" readOnly />
            </DateSelector>

            <DateSelector>
              <Label>Time</Label>
              <Input type="text" placeholder="Choose time" />
            </DateSelector>

            <TicketsSection>
              <Label>Tickets</Label>
              <TicketItem>
                <TicketInfo>
                  <TicketType>Adult (18+ years)</TicketType>
                  <TicketPrice>${ticketPrices.adult}</TicketPrice>
                </TicketInfo>
                <QuantityControl>
                  <QuantityButton onClick={() => updateQuantity('adult', -1)} disabled={tickets.adult === 0}>
                    −
                  </QuantityButton>
                  <Quantity>{tickets.adult}</Quantity>
                  <QuantityButton onClick={() => updateQuantity('adult', 1)}>
                    +
                  </QuantityButton>
                </QuantityControl>
              </TicketItem>

              <TicketItem>
                <TicketInfo>
                  <TicketType>Youth (13-17 years)</TicketType>
                  <TicketPrice>${ticketPrices.youth}</TicketPrice>
                </TicketInfo>
                <QuantityControl>
                  <QuantityButton onClick={() => updateQuantity('youth', -1)} disabled={tickets.youth === 0}>
                    −
                  </QuantityButton>
                  <Quantity>{tickets.youth}</Quantity>
                  <QuantityButton onClick={() => updateQuantity('youth', 1)}>
                    +
                  </QuantityButton>
                </QuantityControl>
              </TicketItem>

              <TicketItem>
                <TicketInfo>
                  <TicketType>Children (0-12 years)</TicketType>
                  <TicketPrice>${ticketPrices.children}</TicketPrice>
                </TicketInfo>
                <QuantityControl>
                  <QuantityButton onClick={() => updateQuantity('children', -1)} disabled={tickets.children === 0}>
                    −
                  </QuantityButton>
                  <Quantity>{tickets.children}</Quantity>
                  <QuantityButton onClick={() => updateQuantity('children', 1)}>
                    +
                  </QuantityButton>
                </QuantityControl>
              </TicketItem>
            </TicketsSection>

            <ExtraSection>
              <Label>Add Extra</Label>
              <ExtraItem>
                <label>
                  <input 
                    type="checkbox" 
                    checked={extras.servicePerBooking}
                    onChange={() => toggleExtra('servicePerBooking')}
                  />
                  Add Service per booking
                </label>
                <ExtraPrice>${extraPrices.servicePerBooking}</ExtraPrice>
              </ExtraItem>
              <ExtraItem>
                <label>
                  <input 
                    type="checkbox"
                    checked={extras.servicePerPerson}
                    onChange={() => toggleExtra('servicePerPerson')}
                  />
                  Add Service per person
                </label>
                <ExtraPrice>
                  Adult: ${extraPrices.servicePerPerson} - Youth: $14.00
                </ExtraPrice>
              </ExtraItem>
            </ExtraSection>

            <TotalSection>
              <TotalLabel>Total:</TotalLabel>
              <TotalPrice>${calculateTotal()}</TotalPrice>
            </TotalSection>

            <BookButton>Book Now</BookButton>
          </BookingCard>
        </MainContent>

        <SuggestionsSection>
          <SectionTitle>You might also like...</SectionTitle>
          <SuggestionsGrid>
            <SuggestionCard>
              <SuggestionImage src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Tour 1" />
              <SuggestionContent>
                <SuggestionTitle>Centipede Tour - Guided Arizona Desert Tour by ATV</SuggestionTitle>
                <SuggestionMeta>
                  <SuggestionDuration>4 days</SuggestionDuration>
                  <SuggestionPrice>From $336.28</SuggestionPrice>
                </SuggestionMeta>
              </SuggestionContent>
            </SuggestionCard>

            <SuggestionCard>
              <SuggestionImage src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop" alt="Tour 2" />
              <SuggestionContent>
                <SuggestionTitle>Molokini and Turtle Town Snorkeling Adventure Aboard</SuggestionTitle>
                <SuggestionMeta>
                  <SuggestionDuration>4 days</SuggestionDuration>
                  <SuggestionPrice>From $225</SuggestionPrice>
                </SuggestionMeta>
              </SuggestionContent>
            </SuggestionCard>

            <SuggestionCard>
              <SuggestionImage src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop" alt="Tour 3" />
              <SuggestionContent>
                <SuggestionTitle>Westminster Walking Tour & Westminster Abbey Entry</SuggestionTitle>
                <SuggestionMeta>
                  <SuggestionDuration>4 days</SuggestionDuration>
                  <SuggestionPrice>From $943</SuggestionPrice>
                </SuggestionMeta>
              </SuggestionContent>
            </SuggestionCard>

            <SuggestionCard>
              <SuggestionImage src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop" alt="Tour 4" />
              <SuggestionContent>
                <SuggestionTitle>All-Inclusive Ultimate Circle Island Day Tour with Lunch</SuggestionTitle>
                <SuggestionMeta>
                  <SuggestionDuration>4 days</SuggestionDuration>
                  <SuggestionPrice>From $771</SuggestionPrice>
                </SuggestionMeta>
              </SuggestionContent>
            </SuggestionCard>
          </SuggestionsGrid>
        </SuggestionsSection>
      </Container>
    </PageWrapper>
  );
};

export default TourDetailPage;