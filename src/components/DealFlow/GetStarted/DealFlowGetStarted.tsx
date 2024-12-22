import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const DealFlowGetStarted: React.FC = () => {
  const { createDeal } = useDealFlow();

  return (
    <Box>
      <DealFlowTitle title="Get Started" />
      <Typography variant="body2" paragraph>
        Watch a brief overview about the investing process. In this video, Nate,
        CEO of Neutral, provides an overview of the investment process.
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <LiteYouTubeEmbed
          id="ocvR5xUWLP4"
          title="The Edison in Milwaukee, Wisconsin by The Neutral Project"
        />
      </Box>
      <DealFlowFooter onBack={() => null} onContinue={createDeal} />
    </Box>
  );
};

export default DealFlowGetStarted;
