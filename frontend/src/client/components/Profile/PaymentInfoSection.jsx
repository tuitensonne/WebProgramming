import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../../api/api';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #999;
  font-size: 16px;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 100%;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background-color: #fff;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const CardNumberInput = styled(Input)`
  position: relative;
  padding-right: 150px;
`;

const CardNumberWrapper = styled.div`
  position: relative;
`;

const CardLogos = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
  align-items: center;
  pointer-events: none;
`;

const CardLogo = styled.img`
  height: 18px;
  width: auto;
  opacity: 0.8;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SaveButton = styled.button`
  align-self: flex-start;
  padding: 12px 32px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background-color: #0b5ed7;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
`;

const SavedMethodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const SavedMethodItem = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, box-shadow 0.15s;

  &:hover {
    background: #f3f3f3;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
`;

export default function PaymentInfoSection({ userData, setUserData }) {
  const [formData, setFormData] = useState({
    method: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [savedMethods, setSavedMethods] = useState([]);

  // Fetch payment info from API when component mounts or userData changes
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const userId = userData?.id;
      if (!userId) return;

      try {
        const token = localStorage.getItem('token');
        const resp = await api.get(`/users/${userId}/payment`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const payment = resp.data?.data || resp.data;
        
        if (payment && Object.keys(payment).length > 0) {
          // Chuẩn hóa thành 1 "saved method" để hiển thị trong danh sách
          const saved = [{
            id: 'primary',
            method: payment.method || payment.paymentMethod || 'card',
            last4: payment.card?.cardNumber?.slice(-4) ||
                   payment.cardNumber?.slice(-4) ||
                   '',
            expiry: payment.card?.expiry ||
                    payment.card?.expiryDate ||
                    payment.expiryDate ||
                    '',
          }];
          setSavedMethods(saved);

          setFormData({
            method: saved[0].method,
            cardNumber: payment.card?.cardNumber || payment.cardNumber || '',
            cardholderName: payment.card?.holderName || payment.card?.cardHolder || payment.cardHolder || '',
            expiryDate: payment.card?.expiry || payment.card?.expiryDate || payment.expiryDate || '',
            cvv: ''  // CVV should never be displayed for security
          });
        } else {
          setSavedMethods([]);
        }
      } catch (error) {
        console.error('Error fetching payment info:', error);
        setSavedMethods([]);
      }
    };

    fetchPaymentInfo();
  }, [userData]);

  // Always show the payment form so user can enter new payment info even if none exists yet
  // If userData.paymentInfo is missing, fields will be empty and saved when user submits

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) value = value.slice(0, 5);
    }
    
    // Format CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSelectSaved = (method) => {
    setFormData((prev) => ({
      ...prev,
      method: method.method,
      // cardNumber và các field chi tiết đã nằm trong state userData.paymentInfo,
      // nên chỉ cần giữ form hiện tại; mục đích chính là để khách thấy thông tin đã lưu.
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const userId = userData?.id;
      if (!userId) {
        setMessage({ error: 'User ID not found' });
        return;
      }

      const token = localStorage.getItem('token');

      // Payload khớp với backend: cần có paymentMethod
      const paymentData = {
        paymentMethod: formData.method || 'card',
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolder: formData.cardholderName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };

      const resp = await api.put(`/users/${userId}/payment`, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Payment update response:', resp);

      // Refresh payment info from API
      const refreshResp = await api.get(`/users/${userId}/payment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedPayment = refreshResp.data?.data || refreshResp.data;

      // Update local state
      if (setUserData) {
        setUserData({
          ...userData,
          paymentInfo: updatedPayment
        });
      }

      // Update form with new data
      if (updatedPayment && Object.keys(updatedPayment).length > 0) {
        const saved = [{
          id: 'primary',
          method: updatedPayment.method || updatedPayment.paymentMethod || 'card',
          last4: updatedPayment.card?.cardNumber?.slice(-4) ||
                 updatedPayment.cardNumber?.slice(-4) ||
                 '',
          expiry: updatedPayment.card?.expiry ||
                  updatedPayment.card?.expiryDate ||
                  updatedPayment.expiryDate ||
                  '',
        }];
        setSavedMethods(saved);

        setFormData({
          method: saved[0].method,
          cardNumber: updatedPayment.card?.cardNumber || updatedPayment.cardNumber || '',
          cardholderName: updatedPayment.card?.holderName || updatedPayment.card?.cardHolder || updatedPayment.cardHolder || '',
          expiryDate: updatedPayment.card?.expiry || updatedPayment.card?.expiryDate || updatedPayment.expiryDate || '',
          cvv: ''
        });
      }

      setMessage({ success: 'Thông tin thanh toán đã được lưu thành công!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving payment info:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Lỗi khi lưu thông tin thanh toán';
      setMessage({ error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Thông tin thanh toán</Title>
      
      {message && (
        <Message success={!!message.success}>
          {message.success || message.error}
        </Message>
      )}

      {savedMethods.length > 0 && (
        <SavedMethodsList>
          {savedMethods.map((m) => (
            <SavedMethodItem
              key={m.id}
              type="button"
              onClick={() => handleSelectSaved(m)}
              disabled={loading}
            >
              <span>
                {m.method === 'card' ? 'Thẻ tín dụng' : m.method} {m.last4 && `(**** ${m.last4})`}
              </span>
              {m.expiry && <span>HSD: {m.expiry}</span>}
            </SavedMethodItem>
          ))}
        </SavedMethodsList>
      )}
      
      <FormGrid>
        <FormField>
          <Label>Số thẻ tín dụng</Label>
          <CardNumberWrapper>
            <CardNumberInput
              type="text"
              value={formData.cardNumber}
              onChange={handleChange('cardNumber')}
              placeholder="1234 1234 1234 1234"
              disabled={loading}
            />
            <CardLogos>
              <CardLogo 
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" 
                alt="Visa" 
              />
              <CardLogo 
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" 
                alt="Mastercard" 
              />
              <CardLogo 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" 
                alt="American Express" 
              />
              <CardLogo 
                src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" 
                alt="Discover" 
              />
            </CardLogos>
          </CardNumberWrapper>
        </FormField>

        <FormField>
          <Label>Tên chủ sở hữu</Label>
          <Input
            type="text"
            value={formData.cardholderName}
            onChange={handleChange('cardholderName')}
            placeholder="Họ và tên"
            style={{ textTransform: 'uppercase' }}
            disabled={loading}
          />
        </FormField>

        <Row>
          <FormField>
            <Label>Hạn sử dụng</Label>
            <Input
              type="text"
              value={formData.expiryDate}
              onChange={handleChange('expiryDate')}
              placeholder="MM/YY"
              disabled={loading}
            />
          </FormField>

          <FormField>
            <Label>CVC</Label>
            <Input
              type="text"
              value={formData.cvv}
              onChange={handleChange('cvv')}
              placeholder="Mã 3 - 4 chữ số"
              disabled={loading}
            />
          </FormField>
        </Row>

        <SaveButton onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </SaveButton>
      </FormGrid>
    </Container>
  );
}
