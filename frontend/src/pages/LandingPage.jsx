import {
  Box,
} from '@mui/material';

import Header from '../components/Header';
import Thumbnail from '../components/Thumbnail';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <Box sx={{ paddingTop: "120px"}}>
      <Header></Header>
      <Thumbnail></Thumbnail>
      <Footer></Footer>
    </Box>
  );
};

export default LandingPage;