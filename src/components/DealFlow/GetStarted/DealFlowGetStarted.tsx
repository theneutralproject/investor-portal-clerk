import React, { useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { sendGTMEvent } from '@next/third-parties/google';

const DealFlowGetStarted: React.FC = () => {
  const { createDeal, user, project, deal } = useDealFlow();
  const hasCreatedDeal = useRef(false);

  useEffect(() => {
    if (user && project && !deal && !hasCreatedDeal.current) {
      // Mark that we're creating a deal to prevent duplicates
      hasCreatedDeal.current = true;

      // Send GTM event
      sendGTMEvent({
        eventCategory: 'Deal Flow',
        event: `Step 0: Getting Started`,
        eventLabel: `${user?.email} started the deal flow process for ${project?.slug}`,
      });

      // Automatically create deal when component loads
      createDeal();
    }
  }, [user, project, deal, createDeal]);

  return (
    <Box>
      <DealFlowTitle title="Creating Your Deal" />

      <Box
        sx={{
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Please wait while we set up your investment opportunity...
        </Typography>
        <CircularProgress size={60} sx={{ color: '#F0B642' }} />
      </Box>
    </Box>
  );

  // Original get-started component (commented out for easy restoration)
  /*
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
  */
};

export default DealFlowGetStarted;
