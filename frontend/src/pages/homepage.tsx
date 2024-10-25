import React, { useEffect } from 'react';
import { Link, Element, scroller } from 'react-scroll';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Container, Paper, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = new URLSearchParams(location.search).get('scrollTo');
    if (scrollTarget) {
      scroller.scrollTo(scrollTarget, {
        smooth: true,
        duration: 500,
      });
    }
  }, [location]);

  return (
    <Box>
      <Box
        id="home"
        sx={{
          height: { xs: '200px', sm: '500px', md: '1000px' },
          mb: 4,
          backgroundImage: 'url(/images/homeImage.png)', 
          backgroundSize: { xs: 'contain', sm: 'cover' },
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{ pt: { xs: 1, sm: 5, md: 2 }, fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}
        >
          HOMEPAGE
        </Typography>
      </Box>

      {/* About Us Section */}
      <Element name="about">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" align="center">เกี่ยวกับเรา</Typography>
            <Typography align="center">ทำไมต้องเลือกเรา...</Typography>
            <Typography>มุ่งเน้นมาตราฐานของรถโดยสารสาธารณะและคุณภาพของการบริการ เพื่อสร้างความประทับใจทุกการเดินทาง</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">ชื่อ บริษัท..............</Typography>
              <Typography>
                เราพร้อมดูแลลูกค้าทุกท่านทั่วประเทศไทย...
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Element>

      {/* Our Work Section */}
      <Element name="work">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            ผลงานของเรา
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[...Array(8)].map((_, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Avatar
                  variant="square"
                  sx={{ width: '100%', height: '100px', bgcolor: '#ff0000' }}
                >
                  LOGO
                </Avatar>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Element>

      {/* Contact Us Section */}
      <Element name="contact">
        <Typography variant="h5" align="center" gutterBottom>
          ติดต่อเรา
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8bbd0' }}>
              <Typography>MAP ที่อยู่</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f4c3' }}>
              <Typography>ที่อยู่บริษัท เบอร์โทร</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Element>
    </Box>
  );
};

export default Homepage;
