// FAQAccordion.tsx
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";
import { theme } from "../Shell/NeutralThemeProvider";

interface FAQAccordionProps {
  question: string;
  answer: string;
  isMarkdown?: boolean;
  isHighlighted?: boolean;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  question,
  answer,
  isMarkdown = false,
  isHighlighted = false,
}) => {
  return (
    <Accordion
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "4px !important",
        mt: 2,
        transition: "all 0.3s ease",
        backgroundColor: isHighlighted
          ? `${theme.palette.primary.main}15`
          : "transparent",
        boxShadow: isHighlighted
          ? `0 0 0 2px ${theme.palette.primary.main}20`
          : "none",
        position: "relative",
        "&:first-of-type": {
          borderRadius: "4px !important",
        },
        "&:last-of-type": {
          borderRadius: "4px !important",
        },
        "&::before": {
          display: "none",
        },
        "&::after": {
          content: '""',
          display: isHighlighted ? "block" : "none",
          position: "absolute",
          left: 0,
          top: 0,
          width: "4px",
          height: "100%",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "4px 0 0 4px",
          opacity: 0.6,
        },
        "&:hover": {
          backgroundColor: isHighlighted
            ? `${theme.palette.primary.main}15`
            : "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: isHighlighted ? theme.palette.primary.main : "inherit",
              transform: isHighlighted ? "scale(1.1)" : "none",
              transition: "all 0.3s ease",
            }}
          />
        }
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          backgroundColor: isHighlighted
            ? `${theme.palette.primary.main}08`
            : "transparent",
        }}
      >
        <Typography
          sx={{
            padding: "6px",
            color: isHighlighted ? theme.palette.primary.main : "inherit",
            fontWeight: isHighlighted ? 500 : 400,
            transition: "all 0.3s ease",
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ pl: 1 }}>
          {isMarkdown ? (
            <ReactMarkdown>{answer}</ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQAccordion;
