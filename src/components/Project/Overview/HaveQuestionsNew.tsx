import React from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import type { ProjectWithStats } from "@/libs/types";

const HaveQuestionsNew = ({ data }: { data: ProjectWithStats }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Have Questions?
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography variant="body2" sx={{ mt: 2 }}>
          {data.marketHighlights}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HaveQuestionsNew;
