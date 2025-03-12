import React from 'react';
import {
  Typography,
  Box,
  Divider,
  Card,
  Stack,
  type Theme,
  type SxProps,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Business as BusinessIcon,
  Place as PlaceIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';

// Types
interface IconTextProps {
  icon: React.ReactNode;
  text: string;
  caption?: string;
  sx?: SxProps<Theme>;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, caption, sx }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={sx}>
    {React.cloneElement(icon as React.ReactElement, {
      sx: { color: '#0000004D' },
    })}
    <Box>
      {caption && (
        <Typography
          variant="caption"
          display="block"
          sx={{ color: '#00000099' }}
        >
          {caption}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: '#000000DE' }}>
        {text}
      </Typography>
    </Box>
  </Stack>
);

const DealFlowSidebarDetails: React.FC = () => {
  const { organization, user } = useDealFlow();

  if (!user || !organization) {
    return null;
  }

  const { ownershipType, name, juristication, members } = organization;
  const { firstName, lastName, email, address, phoneNumber } = user;
  const isIndividual = ownershipType === 'INDIVIDUAL';

  const formatOwnershipType = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  const formatAddress = (addr: typeof address) => {
    if (!addr) return '';

    const { street, city, state, zipcode } = addr;
    if (!street || !city || !state || !zipcode) return '';
    return `${street}, ${city}, ${state} ${zipcode}`;
  };

  return (
    <Stack spacing={2}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#000000DE',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        Details
      </Typography>

      {/* User Details */}
      <Stack sx={{ marginTop: '10px !important', p: 0 }} spacing={0.4}>
        <Typography variant="body2" sx={{ color: '#000000DE' }}>
          {`${firstName} ${lastName}`}
        </Typography>
        <Typography variant="body2" sx={{ color: '#000000DE' }}>
          {formatAddress(address)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#000000DE' }}>
          {phoneNumber}
        </Typography>
        <Typography variant="body2" sx={{ color: '#000000DE' }}>
          {email}
        </Typography>
      </Stack>

      <Divider />

      {/* Organization Details */}
      <IconText
        icon={<AccountBalanceIcon />}
        text={formatOwnershipType(ownershipType)}
      />

      {!isIndividual && (
        <>
          <IconText icon={<BusinessIcon />} text={name} />

          {juristication && (
            <IconText icon={<PlaceIcon />} text={juristication} />
          )}

          {/* Co-Investors */}
          {members?.map(investor => {
            if (investor.type === 'OWNER') return null;

            return (
              <Card
                key={investor.id}
                elevation={0}
                sx={{
                  p: 1,
                  bgcolor: 'transparent',
                }}
              >
                <IconText
                  icon={<PersonIcon />}
                  text={`${investor?.user?.firstName} ${investor?.user?.lastName}`}
                  caption="Co-Investor"
                />
              </Card>
            );
          })}
        </>
      )}
    </Stack>
  );
};

export default DealFlowSidebarDetails;
