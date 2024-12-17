"use client";
import React, { useState, useEffect } from "react";
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
import { useUser } from "@clerk/nextjs";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ReferralSource } from "@/libs/hubspot/utils";
import { type HubspotContact } from "@/libs/hubspot/schema";

const normalizeLabel = (label: string) => {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Referral: React.FC = () => {
  const [referralSource, setReferralSource] = useState<ReferralSource | "">("");
  const router = useRouter();
  const { user } = useUser();

  const { isLoading, data } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => axios.get<User>("/api/users").then((res) => res.data),
  });

  useEffect(() => {
    if (data?.referralSource) {
      router.push("/dashboard");
    }
  }, [data?.referralSource, router]);

  if (isLoading) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralSource) return;

    try {
      await axios.put("/api/users", { referralSource });
      const email = user?.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : user?.emailAddresses[0]?.emailAddress ?? null;
      if (!email) {
        throw new Error("User email address not found");
      }

      const hsUser: HubspotContact = {
        email,
        properties: [
          {
            property: "referral_source",
            value: referralSource,
          },
        ],
      };

      await axios.put("/api/users/hubspot", hsUser);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user information:", error);
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
              {Object.entries(ReferralSource).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={value}
                  control={<Radio />}
                  label={normalizeLabel(key)}
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
