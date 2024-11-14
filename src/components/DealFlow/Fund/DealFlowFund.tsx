import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WireIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "../Shared/DealFlowFooter";
import PaymentProcessing from "./PaymentProcessing";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";
const DealFlowFund: React.FC = () => {
  const { project, deal } = useDealFlow();
  console.log(project);
  const [copied, setCopied] = useState<string | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    plaid: false,
    check: false,
    wire: false,
  });

  const investmentAmount = deal?.investmentStats?.amount;
  const companyName = project?.name;
  const mailTo =
    "The Edison Project LLC\nAttn: Nathan Helbach\n25 W. Main Street, Suite 500\nMadison, WI 53703";

  const wireDetails = {
    accountNumber: "1234567890",
    routingNumber: "021000021",
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = (text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePlaidConnection = async () => {
    // Implement Plaid connection logic here
    console.log("Connecting to Plaid...");
  };

  const toProcessingScreen = async () => {
    setShowProcessing(true);
  };

  const renderDetailRow = (
    label: string,
    value: string | number,
    copyable?: boolean
  ) => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start" // Changed from center to flex-start
      sx={{ width: "100%" }}
    >
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {label}:
      </Typography>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        {copied === label && (
          <Alert sx={{}} severity="success">
            Copied to clipboard
          </Alert>
        )}

        <Typography
          component="pre" // Changed to pre
          sx={{
            fontFamily: "inherit", // Keep the same font
            margin: 0, // Remove default pre margins
            whiteSpace: "pre-line", // Respect \n but wrap text
          }}
        >
          {value}
        </Typography>
        {copyable && (
          <IconButton
            size="small"
            onClick={() => copyToClipboard(String(value), label)}
          >
            <CopyIcon fontSize="small" sx={{ color: "black" }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );

  if (showProcessing) {
    return <PaymentProcessing />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        As the final step, provide the bank account you&apos;d like to use to
        fund your investment. All information and transactions are encrypted and
        Neutral does not store your banking information.
      </Typography>

      {/* Plaid Connection Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={() => toggleSection("plaid")}
            sx={{ cursor: "pointer" }}
          >
            <BankIcon sx={{ color: "black" }} />
            <Typography variant="h6" flex={1}>
              Connect Your Bank Account
            </Typography>
            {expandedSections.plaid ? (
              <ExpandLessIcon sx={{ color: "black" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "black" }} />
            )}
          </Stack>

          <Collapse in={expandedSections.plaid}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 3 }}
            >
              Fund transfers are powered by our trusted partner, Plaid, the
              industry standard for connecting to bank accounts and transferring
              funds.
            </Typography>

            <Button
              variant="neutralBlack"
              onClick={handlePlaidConnection}
              startIcon={<BankIcon sx={{ color: "white" }} />}
              fullWidth
            >
              Connect to Bank
            </Button>
          </Collapse>
        </CardContent>
      </Card>

      {/* Check Payment Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={() => toggleSection("check")}
            sx={{ cursor: "pointer" }}
          >
            <PaymentIcon sx={{ color: "black" }} />
            <Typography variant="h6" flex={1}>
              Pay by Check
            </Typography>
            {expandedSections.check ? (
              <ExpandLessIcon sx={{ color: "black" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "black" }} />
            )}
          </Stack>

          <Collapse in={expandedSections.check}>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                {renderDetailRow("Pay to", companyName)}
                {renderDetailRow(
                  "Amount",
                  `$${investmentAmount.toLocaleString()}`
                )}
                {renderDetailRow("Memo", `Deal ID: ${deal?.id}`)}
                {renderDetailRow("Mail to", mailTo)}
              </Stack>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Wire Transfer Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={() => toggleSection("wire")}
            sx={{ cursor: "pointer" }}
          >
            <WireIcon sx={{ color: "black" }} />
            <Typography variant="h6" flex={1}>
              Wire Transfer
            </Typography>
            {expandedSections.wire ? (
              <ExpandLessIcon sx={{ color: "black" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "black" }} />
            )}
          </Stack>

          <Collapse in={expandedSections.wire}>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                {renderDetailRow(
                  "Amount",
                  `$${investmentAmount.toLocaleString()}`
                )}
                {renderDetailRow(
                  "Account Number",
                  wireDetails.accountNumber,
                  true
                )}
                {renderDetailRow(
                  "Routing Number",
                  wireDetails.routingNumber,
                  true
                )}
              </Stack>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <DealFlowFooter onBack={() => null} onContinue={toProcessingScreen} />
    </Box>
  );
};

export default DealFlowFund;
