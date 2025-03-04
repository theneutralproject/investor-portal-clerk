import React from 'react';
import { Paper } from '@mui/material';
import {
  stepComponents,
  useDealFlow,
} from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowContainerLoading from './DealFlowContainerLoading';

const DealFlowContainer: React.FC = () => {
  const { step, deal, organization, isLoading } = useDealFlow();

  const StepComponent = stepComponents[step as keyof typeof stepComponents];

  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  if ((!deal || !organization || isLoading) && step !== 'get-started') {
    return <DealFlowContainerLoading />;
  }

  return (
    <Paper
      sx={{
        p: 3,
        boxShadow: 'unset',
        backgroundColor: 'unset',
        margin: '0 auto',
      }}
    >
      <StepComponent />
    </Paper>
  );
};

export default DealFlowContainer;
