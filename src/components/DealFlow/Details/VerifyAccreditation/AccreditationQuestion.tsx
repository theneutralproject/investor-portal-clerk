// AccreditationQuestion.tsx

import React, { useState } from 'react';
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
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type Question } from '@/components/DealFlow/Helpers/types';

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
  const [showAllOptions, setShowAllOptions] = useState(false);

  const isVerificationQuestion = question.id === 'verification';
  const shouldHideUploadOption = isVerificationQuestion && !showAllOptions;

  const visibleOptions = shouldHideUploadOption
    ? question.options.filter(option => option !== 'Upload Document')
    : question.options;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => onToggle(question.id)}
      sx={{
        boxShadow: 0,
        '&:before': { display: 'none' },
        mt: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6">{question.title}</Typography>
          {answer && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Selected: {answer}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <RadioGroup
          aria-label={question.id}
          name={question.id}
          value={answer || ''}
          onChange={e => onChange(question.id, e.target.value)}
        >
          {visibleOptions.map(option => (
            <Card key={option} sx={{ mb: 1, '&:hover': { boxShadow: 3 } }}>
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
        {isVerificationQuestion && !showAllOptions && (
          <Button
            onClick={() => setShowAllOptions(true)}
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              color: 'rgba(0, 0, 0, 0.54)',
            }}
            variant="text"
          >
            Show more options
            <ExpandMoreIcon sx={{ ml: 1 }} />
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccreditationQuestion;
