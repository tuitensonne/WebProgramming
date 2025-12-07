import styled from "styled-components";
import { Link } from "react-router-dom";
import { IconHome, IconChevronRight } from "@tabler/icons-react";

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
  padding: 60px;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

const GuidePage = () => {
  return (
    <PageWrapper>
      <BreadcrumbWrapper>
        <BreadcrumbContainer>
          <BreadcrumbLink to="/">
            <IconHome size={18} />
          </BreadcrumbLink>
          <Separator size={16} />
          <BreadcrumbCurrent>Cẩm nang du lịch</BreadcrumbCurrent>
        </BreadcrumbContainer>
      </BreadcrumbWrapper>

      <Container>
        <Title>Cẩm Nang Du Lịch</Title>
        <Description>
          Trang cẩm nang du lịch với những thông tin, mẹo vặt và kinh nghiệm 
          du lịch sẽ sớm được cập nhật. Vui lòng quay lại sau để tìm hiểu 
          thêm về các địa điểm du lịch và cách chuẩn bị cho chuyến du lịch 
          của bạn.
        </Description>
      </Container>
    </PageWrapper>
  );
};

export default GuidePage;
