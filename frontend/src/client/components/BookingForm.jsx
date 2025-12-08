import styled from 'styled-components';
import { IconMinus, IconPlus, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

const BookingContainer = styled.div`
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

const FormGroup = styled.div`
  margin-bottom: 16px;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
`;

const PriceSummary = styled.div`
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    font-weight: 600;
    font-size: 16px;
    color: #ff6b35;
  }
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
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const BookingForm = ({ tour, onBooking }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    babies: 0
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // If startDate changed and tour has a duration, auto-calc endDate
    if (name === 'startDate') {
      let days = null;
      if (tour?.durationDays) {
        days = parseInt(tour.durationDays, 10);
      } else if (tour?.duration) {
        // try to parse strings like "3 ngày 2 đêm" or "3 ngày"
        const m = String(tour.duration).match(/(\d+)\s*ngày/);
        if (m) days = parseInt(m[1], 10);
      }

      if (days && !isNaN(days) && value) {
        const sd = new Date(value);
        // end date = start date + (days - 1)
        sd.setDate(sd.getDate() + Math.max(0, days - 1));
        const yyyy = sd.getFullYear();
        const mm = String(sd.getMonth() + 1).padStart(2, '0');
        const dd = String(sd.getDate()).padStart(2, '0');
        const endDateStr = `${yyyy}-${mm}-${dd}`;

        setFormData({
          ...formData,
          startDate: value,
          endDate: endDateStr
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const updateQuantity = (type, delta) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const calculateTotal = () => {
    const adultPrice = tour.price || 0;
    const childPrice = (tour.price || 0) * 0.5; // 50%
    
    const total = 
      formData.adults * adultPrice + 
      formData.children * childPrice;
    
    return total;
  };

  const totalPrice = calculateTotal();
  const totalPeople = formData.adults + formData.children + formData.babies;

  const handleBooking = () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Vui lòng chọn ngày xuất phát và ngày về');
      return;
    }
    
    if (totalPeople === 0) {
      alert('Vui lòng chọn số người');
      return;
    }

    onBooking({
      ...formData,
      totalPeople,
      totalPrice
    });
  };

  const priceDisplay = tour.price ? new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(tour.price) : 'Liên hệ';

  const totalDisplay = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(totalPrice);

  return (
    <BookingContainer>
      <Price>{priceDisplay}/người</Price>

      <FormGroup>
        <Label>Ngày xuất phát</Label>
        <Input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleDateChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>Ngày về</Label>
        <Input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleDateChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>Người lớn</Label>
        <QuantityContainer>
          <QuantityButton onClick={() => updateQuantity('adults', -1)}>
            <IconMinus size={18} />
          </QuantityButton>
          <QuantityInput type="number" value={formData.adults} readOnly />
          <QuantityButton onClick={() => updateQuantity('adults', 1)}>
            <IconPlus size={18} />
          </QuantityButton>
        </QuantityContainer>
      </FormGroup>

      <FormGroup>
        <Label>Trẻ em (6-12 tuổi - 50%)</Label>
        <QuantityContainer>
          <QuantityButton onClick={() => updateQuantity('children', -1)}>
            <IconMinus size={18} />
          </QuantityButton>
          <QuantityInput type="number" value={formData.children} readOnly />
          <QuantityButton onClick={() => updateQuantity('children', 1)}>
            <IconPlus size={18} />
          </QuantityButton>
        </QuantityContainer>
      </FormGroup>

      <FormGroup>
        <Label>Em bé (dưới 6 tuổi - Free)</Label>
        <QuantityContainer>
          <QuantityButton onClick={() => updateQuantity('babies', -1)}>
            <IconMinus size={18} />
          </QuantityButton>
          <QuantityInput type="number" value={formData.babies} readOnly />
          <QuantityButton onClick={() => updateQuantity('babies', 1)}>
            <IconPlus size={18} />
          </QuantityButton>
        </QuantityContainer>
      </FormGroup>

      <PriceSummary>
        <SummaryRow>
          <span>Người lớn: {formData.adults} × {tour.price ? new Intl.NumberFormat('vi-VN').format(tour.price) : '0'}</span>
          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((tour.price || 0) * formData.adults)}</span>
        </SummaryRow>
        {formData.children > 0 && (
          <SummaryRow>
            <span>Trẻ em: {formData.children} × {tour.price ? new Intl.NumberFormat('vi-VN').format((tour.price || 0) * 0.5) : '0'}</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((tour.price || 0) * 0.5 * formData.children)}</span>
          </SummaryRow>
        )}
        {formData.babies > 0 && (
          <SummaryRow>
            <span>Em bé: {formData.babies} × Free</span>
            <span>0 ₫</span>
          </SummaryRow>
        )}
        <SummaryRow>
          <span>Tổng cộng ({totalPeople} người):</span>
          <span>{totalDisplay}</span>
        </SummaryRow>
      </PriceSummary>

      <BookingButton onClick={handleBooking}>
        Đặt tour ngay
      </BookingButton>
    </BookingContainer>
  );
};

export default BookingForm;
