"use client";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import QuestionIcon from "@mui/icons-material/QuestionAnswer";
import HubspotScheduleCall from "@/components/HubspotScheduleCall";
import ChatInterface from "@/components/ChatInterface";
import HubspotContactForm from "@/components/HubspotContactForm";
import { useRouter } from "next/navigation";

const ContactMethod = ({
  Icon,
  title,
  description,
  buttonText,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
}) => {
  const router = useRouter();
  const renderCTA = () => {
    if (buttonText === "Schedule Now") {
      return (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "180px" }}>
            <HubspotScheduleCall onExit={() => null} />
          </Box>
        </Box>
      );
    }

    if (buttonText === "Start Chat") {
      return (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "180px" }}>
            <ChatInterface type="BUTTON" />
          </Box>
        </Box>
      );
    }

    if (buttonText === "Email Us") {
      return (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "180px" }}>
            <HubspotContactForm onExit={() => null} />
          </Box>
        </Box>
      );
    }

    if (buttonText === "Visit Learn Page") {
      return (
        <Button
          variant="neutralBlack"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => router.push("/learn")}
        >
          {buttonText}
        </Button>
      );
    }

    return (
      <Button variant="neutralBlack" color="primary" sx={{ marginTop: 2 }}>
        {buttonText}
      </Button>
    );
  };
  return (
    <Grid item xs={12} sm={4}>
      <Card sx={{ textAlign: "center", padding: 2 }}>
        <CardContent>
          <Icon sx={{ fontSize: 30, color: "#626F52" }} />
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
          {renderCTA()}
        </CardContent>
      </Card>
    </Grid>
  );
};

const ContactPage = () => {
  return (
    <Box>
      <Card
        sx={{
          backgroundColor: "#626F52",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          color: "white",
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ color: "white" }}>
            How Can We Help?
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            Get in touch with us or check our Learn page for answers.
          </Typography>
        </CardContent>
      </Card>

      {/* 3 column grid layout */}
      <Grid container spacing={2} sx={{ marginTop: 2, padding: 2 }}>
        <ContactMethod
          Icon={EmailIcon}
          title="Send an Email"
          description="Have any question or need support? Send us an email."
          buttonText="Email Us"
        />
        <ContactMethod
          Icon={PhoneInTalkIcon}
          title="Schedule a Call"
          description="Want to discuss your needs in detail? Schedule a call with us."
          buttonText="Schedule Now"
        />
        <ContactMethod
          Icon={QuestionIcon}
          title="Frequently Asked Questions"
          description="Check our Learn page for answers to common questions."
          buttonText="Visit Learn Page"
        />
      </Grid>
    </Box>
  );
};

export default ContactPage;
