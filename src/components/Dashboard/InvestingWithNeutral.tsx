import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const InvestingWithNeutral: React.FC = () => {
  return null;
  return (
    <Card sx={{ borderRadius: '8px' }}>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontSize: '20px',
            mb: 2,
          }}
        >
          Investing with Neutral
        </Typography>
        <Divider />
      </CardContent>

      <Box sx={{ width: '100%', margin: '0 auto', p: 2 }}>
        <LiteYouTubeEmbed
          id="ocvR5xUWLP4"
          title="The Edison in Milwaukee, Wisconsin by Neutral"
        />
      </Box>

      <CardContent sx={{ p: '0 20px' }}>
        <Typography variant="subtitle2" fontSize="12px" color="text.secondary">
          Learn about Neutral, this platform, and how to get started investing
          in sustainable real estate.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InvestingWithNeutral;
