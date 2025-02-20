import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import { useRouter } from 'next/navigation';
interface DealFlowFooterProps {
  onBack?: () => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
}

const DealFlowFooter: React.FC<DealFlowFooterProps> = ({
  onBack = null,
  onContinue,
  isContinueDisabled = false,
}) => {
  const { isLoading } = useDealFlow();
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Button
        variant="text"
        onClick={() => router.push('/dashboard')}
        sx={{ color: '#00000061' }}
      >
        FINISH LATER
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {onBack && onBack !== (() => null) && (
          <Button variant="blackPill" onClick={onBack}>
            BACK
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onContinue}
          disabled={isLoading || isContinueDisabled}
          sx={{
            backgroundColor: '#f0b84a',
            color: 'white',
            boxShadow: 0,
            borderRadius: '25px',
            padding: '8px 25px',
            textTransform: 'uppercase',
            '&:hover': { backgroundColor: '#e0a83a' },
            minWidth: '120px',
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Continue'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowFooter;
