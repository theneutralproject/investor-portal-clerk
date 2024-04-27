import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactMarkdown from "react-markdown";

export default function FAQAccordion({
  question,
  answer,
  isMarkdown = false,
}: {
  question: string;
  answer: string;
  isMarkdown?: boolean;
}) {
  return (
    <Accordion
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "4px",
        mt: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="body1" sx={{ padding: "6px" }}>
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isMarkdown ? (
          <ReactMarkdown>{answer}</ReactMarkdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: answer }} />
        )}
      </AccordionDetails>
    </Accordion>
  );
}
