"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Container,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { type HubspotContact } from "@/app/api/utils-module/hubspotUtils";
import { useUser } from "@clerk/nextjs";

const ReferralSources = {
  "Event Mailer": "Event Mailer",
  "Investor Event": "Investor Event",
  Referral: "Referral",
  "A Neutral Team Member": "A Neutral Team Member",
  Google: "Google",
  "Advertisement Online": "Advertisement Online",
  "Neutral Email": "Neutral Email",
  Newsletter: "Newsletter",
  "Neutral Podcast": "Neutral Podcast",
  Facebook: "Facebook",
  X: "X",
  LinkedIn: "LinkedIn",
  Instagram: "Instagram",
  Other: "Other",
} as const;

type ReferralSource = keyof typeof ReferralSources;

const Referral: React.FC = () => {
  const [referralSource, setReferralSource] = useState<ReferralSource | "">("");
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralSource) return;

    console.log("Selected referral source:", referralSource);

    try {
      if (!user?.primaryEmailAddress) {
        throw new Error("User email address not found");
      }

      const hsUser: HubspotContact = {
        email: user.primaryEmailAddress.toString(),
        properties: [
          {
            property: "referral_source",
            value: referralSource,
          },
        ],
      };

      await axios.put("/api/users/hubspot", hsUser);
    } catch (error) {
      console.error("Error updating user information:", error);
    } finally {
      console.log("Redirecting to projects page");
      router.push("/projects");
    }
  };

  return (
    <Container sx={{ maxWidth: "500px !important" }}>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Create Your Account
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: "28px", mb: 2, textAlign: "center" }}
      >
        How Did You Hear About Us?
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <RadioGroup
              value={referralSource}
              onChange={(e) =>
                setReferralSource(e.target.value as ReferralSource)
              }
            >
              {Object.entries(ReferralSources).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={value}
                />
              ))}
            </RadioGroup>
          </form>
        </CardContent>
      </Card>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="neutralYellow"
          disabled={!referralSource}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
};

export default Referral;
