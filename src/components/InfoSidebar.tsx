import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import Link from "next/link";
import HubspotScheduleCall from "./HubspotScheduleCall";

const InfoSidebar = () => {
  return (
    <Grid item xs={4}>
      <Card>
        <CardContent>
          <Typography variant="h5">Have questions?</Typography>
          <Typography variant="caption">Get in touch with us!</Typography>

          <HubspotScheduleCall />
          <Link href={`/contact`} passHref>
            <Button
              variant="neutralBlack"
              fullWidth
              sx={{ mt: 2, height: "42px" }}
            >
              GET IN TOUCH
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5">About The Neutral Project</Typography>
          <Typography variant="caption">
            The Neutral Project team has more than
            four decades of collective experience in
            multifamily and mixed-use development,
            solidifying their reputation as an innovative
            and successful sustainable real estate
            company.
          </Typography>
          <Typography variant="h5"></Typography>
          <Typography variant="caption">
            As a sustainable real estate development
            firm that aims to redefine traditional
            practices by focusing on sustainability in the
            built environment, The Neutral Project team
            strives to create carbon-neutral mixed-use
            and multi-family developments, removing
            carbon emissions during construction and
            building operations. Their leadership team
            has successfully completed numerous
            projects and has a continued commitment
            to maximizing returns while maintaining
            their thesis of sustainability.</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default InfoSidebar;
