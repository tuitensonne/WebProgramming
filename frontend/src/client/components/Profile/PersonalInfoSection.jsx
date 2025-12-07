import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IconCalendar, IconUpload } from '@tabler/icons-react';
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
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 48px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background-color: #fff;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  /* Hide default date picker icon on Chrome/Safari */
  &::-webkit-calendar-picker-indicator {
    display: none;
  }

  /* Hide default date picker icon on Firefox */
  &::-moz-calendar-picker-indicator {
    display: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CalendarButton = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.2s;

  &:hover {
    color: #666;
  }

  &:focus {
    outline: none;
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

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 8px;

  @media (max-width: 968px) {
    padding-top: 0;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  ${props => props.isDragging && `
    border-color: #0d6efd;
    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
  `}
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  padding: 16px;

  ${AvatarWrapper}:hover & {
    opacity: 1;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  border: 2px solid #0d6efd;
  color: #0d6efd;
  background-color: white;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background-color: rgba(13, 110, 253, 0.04);
    border-color: #0b5ed7;
  }

  input {
    display: none;
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

export default function PersonalInfoSection({ userData, setUserData }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: ''
  });

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const dateInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // Initialize form data when userData loads
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData?.fullName || userData?.full_name || '',
        dateOfBirth: userData?.dateOfBirth || userData?.date_of_birth || '',
        email: userData?.email || '',
        phone: userData?.phone || ''
      });
      setAvatarUrl(userData?.avatarUrl || userData?.avatar || '');
    }
  }, [userData]);

  // If no user data, still show form so user can enter/update information
  // We'll display a small note if no userData is present

  // Format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
      return dateString; // Already in YYYY-MM-DD format
    }
    // Convert from DD-MM-YYYY to YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const validateAndSetFile = (file) => {
    if (!file) return false;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ error: 'Chỉ chấp nhận file ảnh: JPEG, PNG, GIF, WebP' });
      setTimeout(() => setMessage(null), 3000);
      return false;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ error: 'File quá lớn. Kích thước tối đa: 5MB' });
      setTimeout(() => setMessage(null), 3000);
      return false;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && validateAndSetFile(file)) {
      // Auto upload when file is selected
      handleAvatarUpload(file);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateAndSetFile(file)) {
      // Auto upload when file is dropped
      handleAvatarUpload(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file && validateAndSetFile(file)) {
          // Auto upload when image is pasted
          handleAvatarUpload(file);
        }
        break;
      }
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingAvatar(true);
      setMessage(null);

      let userId = userData?.id;
      if (!userId) {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id) {
            userId = parsed.id;
          }
        }

        if (!userId) {
          setMessage({ error: 'User ID not found. Vui lòng đăng nhập.' });
          return;
        }
      }

      const formDataObj = new FormData();
      formDataObj.append('avatar', file);

      const token = localStorage.getItem('token');
      const avatarResp = await api.post(`/users/${userId}/avatar`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const uploadedUser = avatarResp.data?.data || avatarResp.data;
      const newAvatarUrl = uploadedUser?.avatarUrl || uploadedUser?.avatar;

      console.log('Avatar upload response:', uploadedUser);
      console.log('New avatar URL:', newAvatarUrl);

      if (newAvatarUrl) {
        // Clean up the URL - remove any query params first, then add timestamp
        const cleanUrl = newAvatarUrl.split('?')[0];
        const avatarWithTimestamp = cleanUrl + '?t=' + Date.now();
        
        console.log('Setting avatar URL:', avatarWithTimestamp);
        setAvatarUrl(avatarWithTimestamp);
        setAvatarFile(null);

        // Update user data
        const updatedUser = {
          ...(userData || {}),
          ...uploadedUser,
          avatarUrl: newAvatarUrl,
          avatar: newAvatarUrl
        };

        if (setUserData) {
          setUserData(updatedUser);
        }

        // Update localStorage for Header
        try {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Trigger custom event to update Header
          window.dispatchEvent(new CustomEvent('userUpdated'));
        } catch (e) {
          console.warn('Failed to update stored user after avatar upload', e);
        }

        setMessage({ success: 'Ảnh đại diện đã được cập nhật thành công!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Lỗi khi tải ảnh lên';
      setMessage({ error: errorMsg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      let userId = userData?.id;
      if (!userId) {
        // Try to get user ID from localStorage as a fallback
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id) {
            // assign and continue
            userId = parsed.id;
          }
        }

        if (!userId) {
          setMessage({ error: 'User ID not found. Vui lòng đăng nhập.' });
          return;
        }
      }

      // Update profile data
      const profileData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth
      };

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const resp = await api.put(`/users/${userId}/profile`, profileData, { headers });
      console.log('Profile update response:', resp);

      // Upload avatar if changed (but not already uploaded)
      if (avatarFile && !uploadingAvatar) {
        await handleAvatarUpload(avatarFile);
      }

      // Get updated user data from API response if available
      const updatedUserData = resp.data?.data || resp.data;
      
      // Build updated user object (merge with existing)
      const updatedUser = {
        ...(userData || {}),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        ...(updatedUserData || {}),
        avatarUrl: updatedUserData?.avatarUrl || updatedUserData?.avatar || avatarUrl
      };

      // Update local state
      if (setUserData) {
        setUserData(updatedUser);
      }

      // Đồng bộ lại localStorage để Header đọc được tên mới
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Trigger custom event to update Header
        window.dispatchEvent(new CustomEvent('userUpdated'));
      } catch (e) {
        console.warn('Failed to update stored user after profile save', e);
      }

      setMessage({ success: 'Thay đổi đã được lưu thành công!' });
      setAvatarFile(null);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Lỗi khi lưu thay đổi';
      setMessage({ error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Thông tin cá nhân</Title>
      
      {message && (
        <Message success={!!message.success}>
          {message.success || message.error}
        </Message>
      )}
      
      <FormGrid>
        <FormSection>
          <FormField>
            <Label>Họ và tên</Label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              placeholder={formData.fullName ? 'Nhập họ và tên' : 'Đã ẩn'}
              disabled={loading}
            />
          </FormField>

          <FormField>
            <Label>Ngày sinh</Label>
            <InputWrapper>
              <Input
                ref={dateInputRef}
                type="date"
                value={formatDateForInput(formData.dateOfBirth)}
                onChange={handleChange('dateOfBirth')}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              <CalendarButton type="button" onClick={handleDateClick} disabled={loading}>
                <IconCalendar size={20} />
              </CalendarButton>
            </InputWrapper>
          </FormField>

          <FormField>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="example@email.com"
              disabled={loading}
            />
          </FormField>

          <FormField>
            <Label>Số điện thoại</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder={formData.phone ? 'Nhập số điện thoại' : 'Đã ẩn'}
              disabled={loading}
            />
          </FormField>

          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </SaveButton>
        </FormSection>

        <AvatarSection
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
        >
          <AvatarWrapper
            isDragging={isDragging}
            onClick={() => !loading && !uploadingAvatar && fileInputRef.current?.click()}
          >
            <Avatar 
              src={avatarUrl || 'https://via.placeholder.com/200'} 
              alt="Profile Avatar"
              onError={(e) => {
                console.error('Failed to load avatar image:', avatarUrl);
                e.target.src = 'https://via.placeholder.com/200';
              }}
              key={avatarUrl} // Force re-render when URL changes
            />
            <UploadArea>
              {uploadingAvatar ? 'Đang tải...' : 'Kéo thả ảnh hoặc click để chọn'}
            </UploadArea>
          </AvatarWrapper>
          <UploadButton disabled={loading || uploadingAvatar}>
            <IconUpload size={20} />
            {uploadingAvatar ? 'Đang tải...' : loading ? 'Đang lưu...' : 'Chọn ảnh'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading || uploadingAvatar}
            />
          </UploadButton>
          <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', maxWidth: '200px' }}>
            Kéo thả ảnh, paste hoặc click để chọn. Hỗ trợ: JPEG, PNG, GIF, WebP (tối đa 5MB)
          </div>
        </AvatarSection>
      </FormGrid>
    </Container>
  );
}
