import { Card, CardContent, Typography, Divider, Box } from '@mui/material';

import ProgressBar from './ProgressBar';

import StepAvatar from '@/components/StepAvatar';
import { type Project } from '@prisma/client';
import HubspotScheduleCall from '@/components/HubspotScheduleCall';

const SuccessfulInvestor: React.FC<{ project: Project }> = ({}) => {
  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <StepAvatar isComplete stepNumber={3} />
            <Typography
              variant="h6"
              sx={{ ml: '10px' }}
            >{`You're an Investor`}</Typography>
          </Box>
          <Typography variant="caption">Completed</Typography>
          <ProgressBar dealStage={3} />

          <Divider sx={{ mt: 2, mb: 2 }} />

          <Typography variant="subtitle2" sx={{ color: '#000000DE' }}>
            Have Questions?
          </Typography>
          <Typography variant="caption">
            Contact our team, we’re happy to help.
          </Typography>

          <Divider sx={{ mt: 2, mb: 2 }} />

          <HubspotScheduleCall />
        </CardContent>
      </Card>
    </>
  );
};

export default SuccessfulInvestor;
