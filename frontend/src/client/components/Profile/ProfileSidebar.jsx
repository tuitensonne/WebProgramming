import React from 'react';
import styled from 'styled-components';
import { 
  IconLayoutGrid, 
  IconRefresh, 
  IconBookmark, 
  IconLogout 
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 280px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 0 24px 16px;
  margin: 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${props => props.$active ? '#22c55e' : 'transparent'};
    transition: background-color 0.2s;
  }
`;

const MenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: ${props => props.$active ? '#f0f0f0' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: ${props => props.$active ? '#333' : '#666'};
  font-size: 15px;
  font-weight: ${props => props.$active ? '500' : '400'};

  &:hover {
    background: #f5f5f5;
    color: #333;
  }

  svg {
    flex-shrink: 0;
    opacity: ${props => props.$active ? '1' : '0.6'};
  }
`;

export default function ProfileSidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const menuItems = [
    {
      id: 'personal',
      label: 'Thông tin cá nhân',
      icon: IconLayoutGrid
    },
    {
      id: 'tour-manage',
      label: 'Quản lý Tour',
      icon: IconRefresh
    },
    {
      id: 'saved-tours',
      label: 'Đã lưu',
      icon: IconBookmark
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: IconLogout
    }
  ];

  const handleMenuClick = (id) => {
    if (id === 'logout') {
      const confirm = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
      if (confirm) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
      }
    } else {
      setActiveSection(id);
    }
  };

  return (
    <SidebarContainer>
      <Title>Bảng điều khiển</Title>
      
      <MenuList>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <MenuItem 
              key={item.id} 
              $active={activeSection === item.id}
            >
              <MenuButton
                $active={activeSection === item.id}
                onClick={() => handleMenuClick(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </MenuButton>
            </MenuItem>
          );
        })}
      </MenuList>
    </SidebarContainer>
  );
}