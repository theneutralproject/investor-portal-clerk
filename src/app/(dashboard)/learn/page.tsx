"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import Link from "next/link";
import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import FAQAccordions from "@/components/Learn/FAQAccordion";
import faqData from "./faq";
import HubspotScheduleCall from "@/components/HubspotScheduleCall";

const LearnPage = () => {
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Learn`}
        description="Learn about how to invest in a project, what the process is like, and what to expect as an investor."
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={8} sx={{ height: "1000px" }}>
          <Card>
            <CardContent>
              <Typography variant="h5">FAQs</Typography>

              {faqData.map((faq) => {
                return (
                  <FAQAccordions
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isMarkdown
                  />
                );
              })}
            </CardContent>
          </Card>
        </Grid>
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
                  CHAT //todo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5">About The Neutral Project</Typography>
              <Typography variant="caption">Placeholder</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearnPage;
