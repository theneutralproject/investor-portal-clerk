import React from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import LinkIcon from '@mui/icons-material/Link';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';

const steps = [
  'Visit <b>&nbsp;invest.neutral.us&nbsp;</b> on your desktop',
  'Sign in to your account',
  'Navigate to the <b>&nbsp;Projects&nbsp;</b> section on the Dashboard',
  "Select the project you'd like to invest in",
  'Click <b>&nbsp;Continue Investment&nbsp;</b>',
];

const DealFlowGetStartedMobile: React.FC = () => {
  const router = useRouter();

  const handleCopyLink = () => {
    void navigator.clipboard.writeText('invest.neutral.us');
    toast.success('Link copied to clipboard');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Button
          onClick={() => router.push('/dashboard')}
          sx={{
            minWidth: 'auto',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#000000DE',
          }}
        >
          <ArrowBackIosIcon />
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 500, color: '#000000DE' }}>
            Invest
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{
          borderColor: 'rgba(0, 0, 0, 0.12)',
          mb: 3,
        }}
      />

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
        This feature is optimized for our desktop site.
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Investing in a project is much easier on a computer:
      </Typography>

      <List sx={{ mb: 3, pl: 1 }}>
        {steps.map((step, index) => (
          <ListItem
            key={index}
            sx={{
              p: 0.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 24 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 8,
                  color: 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              }
            />
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* <Button variant="neutralRustTerracotta" fullWidth>
          Email me the link
        </Button> */}
        <Button
          variant="text"
          fullWidth
          startIcon={<LinkIcon sx={{ color: 'rgba(0, 0, 0, 0.38)' }} />}
          sx={{
            flex: 1,
            color: 'rgba(0, 0, 0, 0.38)',
          }}
          onClick={handleCopyLink}
        >
          Copy Link
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowGetStartedMobile;
