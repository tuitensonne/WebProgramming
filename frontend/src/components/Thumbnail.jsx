import {
  Box,
  InputBase,
  IconButton,
  Typography,
} from '@mui/material';

import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

import { styled, alpha } from '@mui/material/styles';
import thumbnail from "../assets/images/Thumbnail.png";

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  maxWidth: '500px',
  width: '100%',
  padding: '4px 4px 4px 20px',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  '& input': {
    padding: '12px 0',
    fontSize: '15px',
    '&::placeholder': {
      color: '#999',
      opacity: 1,
    },
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#ff6b35',
  color: '#fff',
  padding: '12px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#ff5722',
  },
}));

const HeroSection = styled(Box)(() => ({
  position: "relative",
  width: "100%",  
  minHeight: "100vh",  
  margin: 0,
  padding: 0,
  backgroundImage: `url(${thumbnail})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 0,
  },
}));

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  color: '#fff',
});

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '64px',
  fontWeight: 700,
  marginBottom: '40px',
  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '48px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
    marginBottom: '30px',
  },
}));

const Thumbnail = () => {
  return (
    <Box>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Choose a Country For Your
            <br />
            Next Adventure?
          </HeroTitle>
          <SearchContainer sx={{ margin: '0 auto' }}>
            <LocationOnIcon sx={{ color: '#666', mr: 1 }} />
            <StyledInputBase
              placeholder="Tìm kiếm địa điểm du lịch"
            />
            <SearchButton>
              <SearchIcon />
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>
    </Box>
  );
};

export default Thumbnail;