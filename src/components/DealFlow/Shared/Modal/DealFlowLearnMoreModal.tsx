import {
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  styled,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Link from "next/link";

export const MODAL_KEYS = {
  CHOOSE_INVESTMENT_TYPE: "CHOOSE_INVESTMENT_TYPE",
  VERIFY_ACCREDITATION: "VERIFY_ACCREDITATION",
} as const;

export type ModalKeyType = (typeof MODAL_KEYS)[keyof typeof MODAL_KEYS];

// Modal style configuration
const ModalContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  minWidth: 400,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(1),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// Types for different modal content
interface ModalContent {
  title: string;
  content: React.ReactNode;
}

interface DealFlowLearnMoreModalProps {
  modalKey: ModalKeyType;
}

const DealFlowLearnMoreModal: React.FC<DealFlowLearnMoreModalProps> = ({
  modalKey,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Modal content mapping
  const modalContents: Record<ModalKeyType, ModalContent> = {
    [MODAL_KEYS.CHOOSE_INVESTMENT_TYPE]: {
      title: "Choose Investment Type",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" paragraph>
            The primary difference between common Debt and common equity is the
            level of risk and potential return. Common Debt provides fixed
            returns and has priority in repayment, making it less risky than
            equity but with limited upside.
          </Typography>

          <Typography variant="body1" paragraph>
            Common Equity is more exposed to the property&apos;s performance,
            offering higher potential returns but at a higher risk. The
            property&apos;s success incentivizes Common Equity investors, as
            their returns are tied to the project&apos;s profitability. In
            contrast, common debt investors are focused on the security of their
            principal and interest payments.
          </Typography>

          <Typography variant="body1">
            Refer to this{" "}
            <Link
              href="https://www.neutral.us/learn/real-estate-capital-stacks"
              target="_blank"
              rel="noopener"
              style={{ textDecoration: "underline", color: "#000000DE" }}
            >
              blog post
            </Link>{" "}
            if you want to read more about the multiple layers of financing used
            in our real estate projects.
          </Typography>
        </Box>
      ),
    },
    [MODAL_KEYS.VERIFY_ACCREDITATION]: {
      title: "Accreditation Verification",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">
            How can I prove I&apos;m an accredited investor?
          </Typography>

          <Typography variant="body2">
            If you invest in a publicly fundraising fund, you will need to
            provide documentation to verify your status as an accredited
            investor under US securities law. The documentation you provide
            depends on the basis on which you are accredited. You can accredit
            based on either:
          </Typography>

          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography variant="body2" component="li" sx={{ mb: 1 }}>
              Income: $200,000 USD ($300,000 USD together with a spouse) in each
              of the last 2 years.
            </Typography>
            <Typography variant="body2" component="li" sx={{ mb: 1 }}>
              Net Worth: Net worth over $1,000,000 USD, individually or together
              with a spouse - excluding the value of your primary residence.
            </Typography>
            <Typography variant="body2" component="li" sx={{ mb: 1 }}>
              Verification by Licensed Professional: You can provide a letter
              from one of the following licensed third-party verifiers: CPAs,
              Attorneys, or licensed professionals holding either FINRA Series
              7, 65, or 82 licenses.
            </Typography>
            <Typography variant="body2" component="li">
              Series 7, Series 65, or Series 82 License Documentation: If you
              are accredited based on holding a Series 7, Series 65, or Series
              82 license, you must prove you hold this license and are in good
              standing.
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontStyle: "italic",
              color: "text.secondary",
            }}
          >
            All accreditation documents you submit will remain confidential and
            will be solely used for verification purposes.
          </Typography>
        </Box>
      ),
    },
  };

  const currentContent = modalContents[modalKey] || {
    title: "Information",
    content: <Typography>Content not found for this section.</Typography>,
  };

  return (
    <>
      <Button
        startIcon={<HelpOutlineIcon />}
        onClick={handleOpen}
        variant="grayPill"
        size="small"
        color="primary"
      >
        Learn More
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalContainer
          elevation={24}
          sx={{
            maxWidth: 600,
            maxHeight: 600,
          }}
        >
          <ModalHeader>
            <Typography variant="h6" component="h2" id="modal-title">
              {currentContent.title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              size="small"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          <Box id="modal-description" sx={{ flex: 1, overflow: "auto" }}>
            {currentContent.content}
          </Box>

          <ModalFooter>
            <Button onClick={handleClose} variant="blackPill">
              Close
            </Button>
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default DealFlowLearnMoreModal;
