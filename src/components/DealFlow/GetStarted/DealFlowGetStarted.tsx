import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { sendGTMEvent } from '@next/third-parties/google';

const DealFlowGetStarted: React.FC = () => {
  const { createDeal, user, project } = useDealFlow();

  useEffect(() => {
    sendGTMEvent({
      eventCategory: 'Deal Flow',
      event: `Step 0: Getting Started`,
      eventLabel: `${user?.email} started the deal flow process for ${project?.slug}`,
    });
  }, []);

  return (
    <Box>
      <DealFlowTitle title="Get Started" />
      <Typography variant="body2" paragraph>
        Watch a brief overview about the investing process. In this video, Nate,
        CEO of Neutral, provides an overview of the investment process.
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <LiteYouTubeEmbed
          id="7xao7xXOSL4"
          title="Investor Portal Dealflow Walkthrough"
          thumbnail="https://wozumwkyltloehxggvzc.supabase.co/storage/v1/object/public/pictures/misc/videoframe_160801.png"
        />
      </Box>
      <DealFlowFooter onContinue={createDeal} />
    </Box>
  );
};

export default DealFlowGetStarted;
