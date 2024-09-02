import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" className="success-container">
      <Box className="success-box">
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 50 50"
          xmlSpace="preserve"
          width="64px"
          height="64px"
          fill="#000000"
          className="success-svg"
        >
          <g id="SVGRepo_iconCarrier">
            <circle style={{ fill: '#3acf53' }} cx="25" cy="25" r="25" />
            <polyline
              style={{
                fill: 'none',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 10,
              }}
              points="38,15 22,33 12,25"
            />
          </g>
        </svg>
        <Typography variant="h4" className="success-message">
          Form Submitted Successfully!
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Thank you for submitting your information. Your data has been successfully saved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToHome}
          className="success-button"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default SuccessPage;
