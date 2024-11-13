import React from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import ShareOnSocial from "./ShareOnSocial";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";

const bulletPoints = [
  "Priority project construction updates",
  "Access to exclusive investor events",
  "Investor newsletter and regular investment updates",
  "View investment details and project updates 24/7 in your investor portal",
];

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: "32px",
  "& .MuiSvgIcon-root": {
    color: "#16a34a", // Green color for check icons
    fontSize: "1.2rem",
  },
});

const PaymentProcessing: React.FC = () => {
  const router = useRouter();

  const goToDashboard = () => {
    router.push("/projects");
  };

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="We're Processing Your Payment" />

      <Typography variant="body2" gutterBottom sx={{ mb: 1 }}>
        After we&apos;ve received your funds we&apos;ll update your account to
        reflect that you&apos;ve complete all 4 steps.
      </Typography>

      <Typography variant="body2" sx={{ mb: 4 }}>
        You&apos;ll hear from our team shortly about transferring the funds.
        After that, we&apos;ll keep you posted regularly about construction
        progress, investment updates, and more.
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Your payment is processing
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Congratulations on investing in a sustainable development!
            Here&apos;s what you can expect from us from here on out:
          </Typography>

          <List sx={{ mb: 2 }}>
            {bulletPoints.map((point, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <StyledListItemIcon>
                  <CheckIcon />
                </StyledListItemIcon>
                <ListItemText
                  primary={point}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { lineHeight: 1.3 },
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Button fullWidth variant="neutralBlack" onClick={goToDashboard}>
            GO TO DASHBOARD
          </Button>
        </CardContent>
      </Card>

      <ShareOnSocial />
    </Box>
  );
};

export default PaymentProcessing;
