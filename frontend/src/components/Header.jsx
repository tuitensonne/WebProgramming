import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  LocalOffer as LocalOfferIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';

import { styled, alpha } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  height: "120px",
  padding: "0"
}));

const Logo = styled('img')({
  height: 40,
  cursor: 'pointer',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#666',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  padding: '6px 12px',
  '&:hover': {
    backgroundColor: alpha('#000', 0.04),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  padding: '10px 24px',
  borderRadius: '8px',
  marginLeft: '12px',
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  return (
    <Box>
      <StyledAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Logo src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Cpath fill='%23ff6b35' d='M20 10 L30 30 L20 35 L10 30 Z'/%3E%3Cpath fill='%23ff8855' d='M20 10 L30 30 L40 25 L30 5 Z'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='28' font-weight='bold' fill='%23ff6b35'%3Eviatours%3C/text%3E%3C/svg%3E" alt="Viatours" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 20 14'%3E%3Crect fill='%23DA251D' width='20' height='14'/%3E%3Cpolygon fill='%23FFFF00' points='10,3 11,6 14,6 11.5,8 12.5,11 10,9 7.5,11 8.5,8 6,6 9,6'/%3E%3C/svg%3E" alt="VN flag" style={{ width: 20, height: 14 }} />}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ color: '#666', textTransform: 'none', fontSize: '14px', minWidth: 'auto' }}
              >
                VND | VI
              </Button>
              <Button
                startIcon={<LocalOfferIcon sx={{ fontSize: 18 }} />}
                sx={{ color: '#666', textTransform: 'none', fontSize: '14px' }}
              >
                Khuyến mãi
              </Button>
              <Button
                startIcon={<HelpOutlineIcon sx={{ fontSize: 18 }} />}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ color: '#666', textTransform: 'none', fontSize: '14px' }}
              >
                Hỗ trợ
              </Button>
              <Button sx={{ color: '#666', textTransform: 'none', fontSize: '14px', fontWeight: 500 }}>
                Đặt tour
              </Button>
              <ActionButton variant="outlined" sx={{ borderColor: '#1976d2', color: '#1976d2', borderWidth: 2 }}>
                Đăng ký
              </ActionButton>
              <ActionButton variant="contained" sx={{ backgroundColor: '#1976d2' }}>
                Đăng nhập
              </ActionButton>
            </Box>
          </Toolbar>

          <Box sx={{ borderTop: '1px solid #e0e0e0', py: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <NavButton
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => handleMenuOpen(e, 'domestic')}
              >
                Du lịch trong nước
              </NavButton>
              <NavButton
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => handleMenuOpen(e, 'international')}
              >
                Du lịch quốc tế
              </NavButton>
              <NavButton
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => handleMenuOpen(e, 'tourType')}
              >
                Kiểu tour du lịch
              </NavButton>
              <NavButton
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => handleMenuOpen(e, 'departure')}
              >
                Lịch khởi hành
              </NavButton>
              <NavButton>Cẩm nang du lịch</NavButton>
              <NavButton>Giới thiệu</NavButton>
            </Box>
          </Box>
        </Container>
      </StyledAppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
        <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
        <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;