// AccreditationQuestion.tsx

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { type Question } from "@/components/DealFlow/Helpers/types";

interface AccreditationQuestionProps {
  question: Question;
  answer: string;
  onChange: (id: string, value: string) => void;
  expanded: boolean;
  onToggle: (id: string) => void;
}

const AccreditationQuestion: React.FC<AccreditationQuestionProps> = ({
  question,
  answer,
  onChange,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={() => onToggle(question.id)}
      sx={{ boxShadow: 0 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">{question.title}</Typography>
          {answer && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Selected: {answer}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" gutterBottom>
          {question.subtitle}
        </Typography>
        <RadioGroup
          aria-label={question.id}
          name={question.id}
          value={answer || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
        >
          {question.options.map((option) => (
            <Card key={option} sx={{ mb: 1, "&:hover": { boxShadow: 3 } }}>
              <CardContent>
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccreditationQuestion;
