import styled from "styled-components";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
`;

const PaginationButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? '#ff6b6b' : '#e0e0e0'};
  background: ${props => props.$active ? '#ff6b6b' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.4 : 1};

  &:hover:not(:disabled) {
    border-color: #ff6b6b;
    color: ${props => props.$active ? 'white' : '#ff6b6b'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const EllipsisButton = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  hasMore = null // For backward compatibility when totalPages is unknown
}) => {
  // Calculate total pages if not provided but hasMore is available
  // This is a fallback - ideally totalPages should be provided
  const effectiveTotalPages = totalPages || (hasMore !== null ? currentPage + (hasMore ? 10 : 0) : currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    
    if (effectiveTotalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate the range: 3 pages on each side of current page
      const leftStart = Math.max(2, currentPage - 3);
      const leftEnd = currentPage - 1;
      const rightStart = currentPage + 1;
      const rightEnd = Math.min(effectiveTotalPages - 1, currentPage + 3);
      
      // Case 1: Current page is near the beginning (currentPage <= 3)
      if (currentPage <= 3) {
        // Show pages from 2 to currentPage + 2
        for (let i = 2; i <= Math.min(effectiveTotalPages - 1, currentPage + 2); i++) {
          pages.push(i);
        }
        // Add ellipsis and last page if needed
        if (currentPage + 2 < effectiveTotalPages - 1) {
          pages.push('...');
        }
        pages.push(effectiveTotalPages);
      }
      // Case 2: Current page is near the end (currentPage >= effectiveTotalPages - 2)
      else if (currentPage >= effectiveTotalPages - 2) {
        // Add ellipsis if needed
        if (currentPage - 2 > 2) {
          pages.push('...');
        }
        // Show pages from currentPage - 2 to last
        const start = Math.max(2, currentPage - 2);
        for (let i = start; i <= effectiveTotalPages; i++) {
          pages.push(i);
        }
      }
      // Case 3: Current page is in the middle
      else {
        // Add ellipsis before
        pages.push('...');
        // Show 2 pages on left, current page, and 2 pages on right
        // Left side: currentPage - 2, currentPage - 1
        for (let i = currentPage - 2; i < currentPage; i++) {
          pages.push(i);
        }
        // Current page
        pages.push(currentPage);
        // Right side: currentPage + 1, currentPage + 2
        for (let i = currentPage + 1; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        // Add ellipsis after
        pages.push('...');
        // Show last page
        pages.push(effectiveTotalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= effectiveTotalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={handlePrevious}
        disabled={isFirstPage}
        $disabled={isFirstPage}
        aria-label="Trang trước"
      >
        <IconChevronLeft size={20} />
      </PaginationButton>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <EllipsisButton key={`ellipsis-${index}`}>
              ...
            </EllipsisButton>
          );
        }

        return (
          <PaginationButton
            key={page}
            onClick={() => handlePageClick(page)}
            $active={page === currentPage}
            aria-label={`Trang ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </PaginationButton>
        );
      })}

      <PaginationButton
        onClick={handleNext}
        disabled={isLastPage}
        $disabled={isLastPage}
        aria-label="Trang sau"
      >
        <IconChevronRight size={20} />
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;

