import { Box, Typography } from '@mui/material';

const DashboardPageBanner = ({
  headline,
  background,
}: {
  headline: string;
  background: string;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '220px',
        width: '100%',
        borderRadius: '8px',
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%), url("${background}") lightgray 0px -122.163px / 100% 391.783% no-repeat`,
      }}
    >
      <Box
        sx={{
          padding: 2,
          marginLeft: 2,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: 'white',
          }}
        >
          {headline}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPageBanner;
