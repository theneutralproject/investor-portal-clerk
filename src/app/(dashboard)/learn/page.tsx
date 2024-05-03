"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";

import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import FAQAccordions from "@/components/Learn/FAQAccordion";
import faqData from "./faq";
import InfoSidebar from "@/components/InfoSidebar";
import { theme } from "@/components/Shell/NeutralThemeProvider";

const LearnPage = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Learn`}
        description="Learn about how to invest in a project, what the process is like, and what to expect as an investor."
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={8} sx={{ height: "1000px" }}>
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

        {!isMobile && <InfoSidebar />}
      </Grid>
    </Box>
  );
};

export default LearnPage;
