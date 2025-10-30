import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';

import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  LocalOffer as LocalOfferIcon,
  HelpOutline as HelpOutlineIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { styled, alpha, useTheme } from '@mui/material/styles';

// ==== Styled Components ====
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

// ==== Header Component ====
const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md")); // < 960px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Danh sách menu (dùng lại cho Drawer)
  const menuItems = [
    { label: "Du lịch trong nước" },
    { label: "Du lịch quốc tế" },
    { label: "Kiểu tour du lịch" },
    { label: "Lịch khởi hành" },
    { label: "Cẩm nang du lịch" },
    { label: "Giới thiệu" },
  ];

  return (
    <Box>
      <StyledAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ 
            justifyContent: 'space-between', 
            minHeight: '70px',
            position: 'relative'
          }}>
            {/* --- Mobile Layout: Menu Icon (Left) --- */}
            {isMobile && (
              <Box sx={{ position: 'absolute', left: 0 }}>
                <IconButton onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            {/* Logo - Desktop: Left, Mobile: Center */}
            <Box sx={{ 
              flex: isMobile ? 1 : 'none',
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <Logo
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Cpath fill='%23ff6b35' d='M20 10 L30 30 L20 35 L10 30 Z'/%3E%3Cpath fill='%23ff8855' d='M20 10 L30 30 L40 25 L30 5 Z'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='28' font-weight='bold' fill='%23ff6b35'%3Eviatours%3C/text%3E%3C/svg%3E"
                alt="Viatours"
              />
            </Box>

            {/* --- Desktop Menu --- */}
            {!isTablet && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            )}

            {/* --- Tablet (ẩn bớt) --- */}
            {isTablet && !isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button sx={{ color: '#666', textTransform: 'none' }}>Đặt tour</Button>
                <ActionButton variant="contained" sx={{ backgroundColor: '#1976d2' }}>
                  Đăng nhập
                </ActionButton>
              </Box>
            )}

            {/* --- Mobile: Login Button (Right) --- */}
            {isMobile && (
              <Box sx={{ position: 'absolute', right: 0 }}>
                <ActionButton 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#1976d2',
                    padding: '8px 16px',
                    fontSize: '13px'
                  }}
                >
                  Đăng nhập
                </ActionButton>
              </Box>
            )}
          </Toolbar>

          {/* Chỉ hiện hàng menu phụ khi không phải mobile */}
          {!isTablet && (
            <Box sx={{ borderTop: '1px solid #e0e0e0', py: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {menuItems.map((item) => (
                  <NavButton
                    key={item.label}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(e) => handleMenuOpen(e, item.label)}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </StyledAppBar>

      {/* --- Menu khi bấm 3 gạch (Mobile Drawer) --- */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} onClick={toggleDrawer(false)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Menu Dropdown (Desktop) */}
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