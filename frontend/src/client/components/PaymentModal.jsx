import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #ff6b35;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
`;

const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active ? '#ff6b35' : '#999'};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? '#ff6b35' : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.3s;
  
  &:hover {
    color: #ff6b35;
  }
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
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const SummaryBox = styled.div`
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    border-top: 1px solid #ddd;
    padding-top: 8px;
    font-weight: 600;
    color: #ff6b35;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #e55a1f;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-top: 12px;
`;

const PaymentModal = ({ isOpen, onClose, bookingData, userInfo, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: ''
  });

  // Fetch payment info from API when modal opens and user is logged in
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!isOpen || !userInfo?.id) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get(`/users/${userInfo.id}/payment`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const payment = response.data?.data || response.data;
        if (payment && Object.keys(payment).length > 0) {
          setSavedPaymentInfo(payment);
          // Set payment method from saved info
          const method = payment.method || payment.paymentMethod || 'card';
          setPaymentMethod(method);
        }
      } catch (err) {
        console.log('No saved payment info found or error:', err);
        setSavedPaymentInfo(null);
      }
    };

    fetchPaymentInfo();
  }, [isOpen, userInfo?.id]);

  // When userInfo changes (e.g., fetched after mount), prefill formData and paymentMethod
  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        note: userInfo.note || ''
      }));

      // try to derive payment method from userInfo.paymentInfo (may be JSON)
      if (userInfo.paymentInfo) {
        try {
          const p = typeof userInfo.paymentInfo === 'string' ? JSON.parse(userInfo.paymentInfo) : userInfo.paymentInfo;
          if (p && p.method) setPaymentMethod(p.method);
          if (p && p.defaultMethod) setPaymentMethod(p.defaultMethod);
        } catch (err) {
          // ignore parse error
        }
      }
      if (userInfo.paymentMethod) {
        setPaymentMethod(userInfo.paymentMethod);
      }
    }
  }, [userInfo]);

  if (!isOpen || !bookingData) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Email không hợp lệ');
      return false;
    }
    if (!/^0\d{9,10}$/.test(formData.phone)) {
      alert('Số điện thoại không hợp lệ');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onPaymentSuccess({
        ...formData,
        bookingData,
        paymentMethod
      });
      onClose();
    } catch (error) {
      // Error message is already shown in handlePaymentSuccess
      // Don't show duplicate alert here
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDisplay = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(bookingData.totalPrice);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <IconX size={24} />
        </CloseButton>

        <Title>Thông tin thanh toán</Title>

        <SummaryBox>
          <SummaryItem>
            <span>Ngày xuất phát</span>
            <span>{new Date(bookingData.startDate).toLocaleDateString('vi-VN')}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Ngày về</span>
            <span>{new Date(bookingData.endDate).toLocaleDateString('vi-VN')}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Tổng số người</span>
            <span>{bookingData.totalPeople}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Tổng giá tiền</span>
            <span>{totalDisplay}</span>
          </SummaryItem>
        </SummaryBox>

        {userInfo ? (
          // If user logged in, show summary (no need to fill)
          <>
            <SummaryItem>
              <span>Họ và tên</span>
              <span>{formData.fullName || '—'}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Email</span>
              <span>{formData.email || '—'}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Số điện thoại</span>
              <span>{formData.phone || '—'}</span>
            </SummaryItem>
          </>
        ) : (
          <>
            <FormGroup>
              <Label>Họ và tên</Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>Số điện thoại</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0xxxxxxxxx"
              />
            </FormGroup>
          </>
        )}

        <FormGroup>
          <Label>Ghi chú (tùy chọn)</Label>
          <TextArea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Ghi chú thêm nếu có"
            rows="3"
          />
        </FormGroup>

        <FormGroup>
          <Label>Phương thức thanh toán</Label>
          
          {/* Hiển thị thông tin thanh toán đã lưu nếu có */}
          {savedPaymentInfo && savedPaymentInfo.cardNumber && (
            <SummaryBox style={{ marginBottom: '16px', background: '#f0f8ff', border: '1px solid #0d6efd' }}>
              <InfoText style={{ margin: 0, fontSize: '13px' }}>
                <strong>💳 Thẻ đã lưu:</strong> **** {savedPaymentInfo.cardNumber.slice(-4)}
                {savedPaymentInfo.cardHolder && ` - ${savedPaymentInfo.cardHolder}`}
                {savedPaymentInfo.expiryDate && ` - HSD: ${savedPaymentInfo.expiryDate}`}
              </InfoText>
            </SummaryBox>
          )}

          <TabContainer>
            <Tab 
              $active={paymentMethod === 'card'} 
              onClick={() => setPaymentMethod('card')}
            >
              Thẻ tín dụng
            </Tab>
            <Tab 
              $active={paymentMethod === 'bank'} 
              onClick={() => setPaymentMethod('bank')}
            >
              Chuyển khoản
            </Tab>
            <Tab 
              $active={paymentMethod === 'cash'} 
              onClick={() => setPaymentMethod('cash')}
            >
              Thanh toán tại chỗ
            </Tab>
          </TabContainer>

          {paymentMethod === 'card' && (
            <>
              {savedPaymentInfo && savedPaymentInfo.cardNumber ? (
                <InfoText style={{ background: '#e8f5e9', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                  <strong>✓ Sử dụng thẻ đã lưu:</strong> **** {savedPaymentInfo.cardNumber.slice(-4)}
                  <br />
                  {savedPaymentInfo.cardHolder && `Chủ thẻ: ${savedPaymentInfo.cardHolder}`}
                  {savedPaymentInfo.expiryDate && ` - HSD: ${savedPaymentInfo.expiryDate}`}
                </InfoText>
              ) : (
                <>
                  <FormGroup>
                    <Label>Số thẻ</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16)}
                    />
                  </FormGroup>
                  <Row>
                    <FormGroup>
                      <Label>Hạn sử dụng</Label>
                      <Input type="text" placeholder="MM/YY" />
                    </FormGroup>
                    <FormGroup>
                      <Label>CVV</Label>
                      <Input type="text" placeholder="123" />
                    </FormGroup>
                  </Row>
                </>
              )}
            </>
          )}

          {paymentMethod === 'bank' && (
            <InfoText>
              <strong>Thông tin chuyển khoản:</strong><br/>
              Ngân hàng: Ngân hàng Việt Nam<br/>
              Tài khoản: 1234567890<br/>
              Chủ tài khoản: Tour Travel<br/>
              Nội dung: Booking #{Date.now()}
            </InfoText>
          )}

          {paymentMethod === 'cash' && (
            <InfoText>
              Bạn sẽ thanh toán toàn bộ chi phí khi gặp hướng dẫn viên tại điểm tập trung.
            </InfoText>
          )}
        </FormGroup>

        <Button 
          onClick={handlePayment} 
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : `Xác nhận thanh toán - ${totalDisplay}`}
        </Button>
      </Modal>
    </Overlay>
  );
};

export default PaymentModal;
