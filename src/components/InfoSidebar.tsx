import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';
import HubspotScheduleCall from './HubspotScheduleCall';

const InfoSidebar = () => {
  return (
    <Grid item xs={4}>
      <Card>
        <CardContent>
          <Typography variant="h5">Have questions?</Typography>
          <Typography variant="caption">Get in touch with us!</Typography>

          <HubspotScheduleCall />
          <Link href={`/contact`} passHref>
            <Button variant="grayPill" fullWidth sx={{ mt: 2, height: '42px' }}>
              GET IN TOUCH
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5">About Neutral</Typography>
          <Typography variant="caption">
            Neutral is a regenerative and sustainable real estate
            company. Our leadership team has successfully completed numerous
            projects and is committed to maximizing investors’ alpha while
            maintaining our thesis of developing sustainable and regenerative
            buildings.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default InfoSidebar;
