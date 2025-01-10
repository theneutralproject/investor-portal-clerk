import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import ChatInterface from '../ChatInterface';

interface QuestionsProps {
  phoneNumber?: string;
}

const Questions: React.FC<QuestionsProps> = ({
  phoneNumber = '(608) 205-8336',
}) => {
  return (
    <Card sx={{ borderRadius: '8px', mt: 2 }}>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontSize: '20px',
            mb: 2,
          }}
        >
          Questions?
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Image width="40" height="40" src={'/StormAvatar.png'} alt={''} />
          <Typography
            variant="subtitle2"
            fontSize="12px"
            color="text.secondary"
          >
            Give us a call or chat anytime - we&apos;ll answer any questions you
            have
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <ChatInterface type="DEALFLOW_BUTTON" />
          <Typography
            variant="subtitle2"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {phoneNumber}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Questions;
