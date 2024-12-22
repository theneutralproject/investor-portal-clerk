import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
} from '@mui/material';
import HubspotContactForm from '@/components/HubspotContactForm';
import HubspotScheduleCall from '@/components/HubspotScheduleCall';
import { useRouter } from 'next/navigation';

const HaveQuestionsNew = () => {
  const router = useRouter();

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Have Questions?
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <HubspotContactForm
              onExit={() => null}
              trigger={
                <Button fullWidth variant="grayPill">
                  Send an Email
                </Button>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <HubspotScheduleCall onExit={() => null} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Button
              variant="grayPill"
              fullWidth
              onClick={() => router.push('/learn')}
            >
              View FAQs
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 400, mt: 3 }}>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/g9lmo4egbpiJsKnInQrSC"
            title="Spruce - The Neutral Project Advisor"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default HaveQuestionsNew;
