import React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import ShareOnSocial from "./ShareOnSocial";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import { PaymentMethod } from "@prisma/client";

const PaymentProcessing: React.FC = () => {
  const router = useRouter();
  const { deal } = useDealFlow();
  const goToDashboard = () => {
    router.push("/projects");
  };

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

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
            Thank you for your payment in the amount of $
            {deal?.investmentStats?.amount} for your investment with ID{" "}
            {deal?.paymentReferenceId}.
          </Typography>

          {deal?.paymentMethod === PaymentMethod.ACH && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please print this authorization for your records.You have
              authorized us to initiate an automated clearing house (ACH)
              one-time debit in your name to your bank account. This transaction
              will be presented to your financial institution by the next
              business day. You further agree that you may not revoke this
              authorization or cancel this payment.
            </Typography>
          )}
          {deal?.paymentMethod !== PaymentMethod.ACH && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Todo for check and wire
            </Typography>
          )}

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
