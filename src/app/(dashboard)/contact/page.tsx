"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import InfoSidebar from "@/components/InfoSidebar";

const ContactPage = () => {
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Contact Us`}
        description="Learn about how to invest in a project, what the process is like, and what to expect as an investor."
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={8} sx={{ height: "1000px" }}>
          <Card>
            <CardContent>
              <Typography variant="h5">Contact Us</Typography>
            </CardContent>
          </Card>
        </Grid>

        <InfoSidebar />
      </Grid>
    </Box>
  );
};

export default ContactPage;
