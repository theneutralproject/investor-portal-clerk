import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import Image from 'next/image';

interface QuestionsProps {
  phoneNumber?: string;
}

const Questions: React.FC<QuestionsProps> = ({
  phoneNumber = '(608) 205-8134',
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
          <Image
            width="40"
            height="40"
            src={'/chat_thumbnail_sarah.png'}
            alt={''}
          />
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
          <Button
            href="mailto:invest@neutral.us"
            target="_blank"
            rel="noopener noreferrer"
            variant="grayPill"
          >
            Email us
          </Button>
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
