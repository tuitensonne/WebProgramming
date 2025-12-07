import React, { useState } from 'react';
import styled from 'styled-components';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 50px 14px 16px;
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

const EyeButton = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    color: #333;
  }

  &:focus {
    outline: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChangeButton = styled.button`
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

export default function ChangePasswordSection() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSubmit = async () => {
    try {
      setMessage(null);

      // Validation
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setMessage({ error: 'Vui lòng điền đầy đủ thông tin!' });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ error: 'Mật khẩu mới và xác nhận mật khẩu không khớp!' });
        return;
      }

      if (formData.newPassword.length < 6) {
        setMessage({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
        return;
      }

      setLoading(true);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.id;
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setMessage({ error: 'User ID or token not found' });
        return;
      }

      const resp = await api.put(`/users/${userId}/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Change password response:', resp);

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setMessage({ success: 'Mật khẩu đã được thay đổi thành công!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Lỗi khi thay đổi mật khẩu';
      setMessage({ error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Thay đổi mật khẩu</Title>
      
      {message && (
        <Message success={!!message.success}>
          {message.success || message.error}
        </Message>
      )}
      
      <FormGrid>
        {/* Current Password */}
        <FormField>
          <Label>Mật khẩu hiện tại</Label>
          <InputWrapper>
            <Input
              type={showPassword.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange('currentPassword')}
              placeholder="Nhập mật khẩu hiện tại"
              disabled={loading}
            />
            <EyeButton
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              disabled={loading}
            >
              {showPassword.current ? (
                <IconEyeOff size={20} />
              ) : (
                <IconEye size={20} />
              )}
            </EyeButton>
          </InputWrapper>
        </FormField>

        {/* New Password & Confirm Password Row */}
        <Row>
          <FormField>
            <Label>Mật khẩu mới</Label>
            <InputWrapper>
              <Input
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
              />
              <EyeButton
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                disabled={loading}
              >
                {showPassword.new ? (
                  <IconEyeOff size={20} />
                ) : (
                  <IconEye size={20} />
                )}
              </EyeButton>
            </InputWrapper>
          </FormField>

          <FormField>
            <Label>Xác nhận mật khẩu mới</Label>
            <InputWrapper>
              <Input
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
              <EyeButton
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={loading}
              >
                {showPassword.confirm ? (
                  <IconEyeOff size={20} />
                ) : (
                  <IconEye size={20} />
                )}
              </EyeButton>
            </InputWrapper>
          </FormField>
        </Row>

        {/* Change Password Button */}
        <ChangeButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
        </ChangeButton>
      </FormGrid>
    </Container>
  );
}