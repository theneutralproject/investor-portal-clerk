import React, { useState } from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BasicTitleDescriptionAccordion = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleToggle}
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
        mt: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">{description}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicTitleDescriptionAccordion;
