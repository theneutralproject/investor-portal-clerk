import { Avatar } from '@mui/material';
import Image from 'next/image';

const StepAvatar = ({
  isComplete,
  stepNumber,
}: {
  isComplete: boolean;
  stepNumber: number;
}) => {
  return (
    <Avatar
      sx={{
        bgcolor: isComplete ? '#626f52' : '#969f7e',
        width: 24,
        height: 24,
        fontSize: isComplete ? undefined : '12px',
      }}
    >
      {isComplete ? (
        <Image
          src={'/CheckFilled.png'}
          alt="Completed Step"
          width={24}
          height={24}
        />
      ) : (
        stepNumber + 1
      )}
    </Avatar>
  );
};

export default StepAvatar;
