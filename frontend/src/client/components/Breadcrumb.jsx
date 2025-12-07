import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconHome, IconChevronRight } from '@tabler/icons-react';

const BreadcrumbContainer = styled.nav`
  background: #f5f5f5;
  padding: 16px 60px;
  margin-bottom: 0;

  @media (max-width: 1200px) {
    padding: 16px 40px;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const BreadcrumbWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const BreadcrumbLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #0d6efd;
  }
`;

const BreadcrumbText = styled.span`
  color: #333;
  font-weight: 500;
`;

const Separator = styled(IconChevronRight)`
  color: #999;
  flex-shrink: 0;
`;

export default function Breadcrumb({ items }) {
  return (
    <BreadcrumbContainer>
      <BreadcrumbWrapper>
        <BreadcrumbItem>
          <BreadcrumbLink to="/">
            <IconHome size={18} />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items?.map((item, index) => (
          <React.Fragment key={index}>
            <Separator size={16} />
            <BreadcrumbItem>
              {item.link && index < items.length - 1 ? (
                <BreadcrumbLink to={item.link}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbText>{item.label}</BreadcrumbText>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbWrapper>
    </BreadcrumbContainer>
  );
}