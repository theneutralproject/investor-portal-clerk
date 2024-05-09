/* eslint-disable */
// @ts-nocheck

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CollapsibleCard = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleToggle}
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "4px",
        mt: 2,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel-header">
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleCard;
