import React from "react";
import {
  Typography,
  Box,
  Divider,
  Card,
  Stack,
  type Theme,
  type SxProps,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Business as BusinessIcon,
  Place as PlaceIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";

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
      sx: { color: "text.secondary" },
    })}
    <Box>
      {caption && (
        <Typography variant="caption" display="block">
          {caption}
        </Typography>
      )}
      <Typography variant="body2">{text}</Typography>
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
  const isIndividual = ownershipType === "INDIVIDUAL";

  const formatOwnershipType = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  const formatAddress = (addr: typeof address) => {
    if (!addr) return "";
    const { street, city, state, zipcode } = addr;
    return `${street}, ${city}, ${state} ${zipcode}`;
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body1">Details</Typography>

      {/* User Details */}
      <Stack spacing={0.5}>
        <Typography variant="body2">{`${firstName} ${lastName}`}</Typography>
        <Typography variant="body2">{formatAddress(address)}</Typography>
        <Typography variant="body2">{phoneNumber}</Typography>
        <Typography variant="body2">{email}</Typography>
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
          {members?.map((investor) => {
            if (investor.type === "OWNER") return null;

            return (
              <Card
                key={investor.id}
                elevation={0}
                sx={{
                  p: 1,
                  bgcolor: "transparent",
                }}
              >
                <IconText
                  icon={<PersonIcon />}
                  text={`${investor.user.firstName} ${investor.user.lastName}`}
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
