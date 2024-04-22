import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { theme } from "../Shell/NeutralThemeProvider";

const BasicTitleDescriptionCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default BasicTitleDescriptionCard;
