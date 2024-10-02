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
import {
  ReferralSource,
  type HubspotContact,
} from "@/app/api/utils-module/hubspotUtils";
import { useUser } from "@clerk/nextjs";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

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
    queryKey: ["currentUser"],
    queryFn: () => axios.get<User>("/api/currentUser").then((res) => res.data),
  });

  useEffect(() => {
    if (data?.referralSource) {
      router.push("/projects");
    }
  }, [data?.referralSource, router]);

  if (isLoading) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralSource) return;

    try {
      await axios.post("/api/currentUser", { referralSource });

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

      router.push("/projects");
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
