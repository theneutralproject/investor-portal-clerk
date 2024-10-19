import React, { useState, useCallback } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import CoInvestorCard from "@components/DealFlow/Details/CoInvestorCard";
import { useRouter } from "next/navigation";
import { MembershipType, Role, type User } from "@prisma/client";
import { type MemberWithUser } from "@/libs/prisma";

const DealFlowCoInvestor: React.FC = () => {
  const { deal, project, organization, updateOrganizationMember } =
    useDealFlow();
  const [coInvestors, setCoInvestors] = useState<MemberWithUser[]>(
    organization?.members ?? []
  );
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const router = useRouter();

  const handleAddCoInvestor = useCallback(() => {
    const newCoInvestor: MemberWithUser = {
      id: Date.now(),
      userId: Date.now(),
      organizationId: organization?.id ?? 0,
      type: MembershipType.COINVESTOR,
      user: {
        id: Date.now(),
        hubspotId: "",
        role: Role.USER,
        email: "",
        firstName: "",
        lastName: "",
      },
    };
    setCoInvestors((prev) => [...prev, newCoInvestor]);
    setExpandedCards((prev) => [...prev, coInvestors.length]);
  }, [organization?.id, coInvestors.length]);

  const handleCoInvestorChange = useCallback(
    (index: number, field: keyof User, value: string) => {
      setCoInvestors((prev) =>
        prev.map((investor, i) =>
          i === index
            ? { ...investor, user: { ...investor.user, [field]: value } }
            : investor
        )
      );
    },
    []
  );

  const nextRoute = () => {
    if (project?.slug && deal?.id) {
      router.push(`/dealflow/${project.slug}/${deal.id}/verify-accreditation`);
    }
  };

  const handleSaveCoInvestor = useCallback(
    async (index: number) => {
      const coInvestor = coInvestors[index];
      if (deal?.id) {
        try {
          if (coInvestor?.user) {
            await updateOrganizationMember(
              deal.id,
              coInvestor.user,
              MembershipType.COINVESTOR
            );
            console.log("Co-investor saved successfully");
            setExpandedCards((prev) => prev.filter((i) => i !== index));
          } else {
            console.error("Co-investor user data is missing");
          }
        } catch (error) {
          console.error("Error saving co-investor:", error);
        }
      }
    },
    [coInvestors, deal?.id, updateOrganizationMember]
  );

  const handleCancelCoInvestor = useCallback((index: number) => {
    setExpandedCards((prev) => prev.filter((i) => i !== index));
  }, []);

  const handleExpandCard = useCallback((index: number) => {
    setExpandedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  if (!organization || !deal) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Investment Details
      </Typography>

      <Box my={2}>
        <Typography variant="body1">Add Investors</Typography>
      </Box>

      {coInvestors.map((coInvestor, index) => (
        <CoInvestorCard
          key={coInvestor.id}
          coInvestor={coInvestor}
          index={index}
          onSave={handleSaveCoInvestor}
          onCancel={handleCancelCoInvestor}
          onChange={handleCoInvestorChange}
          expanded={expandedCards.includes(index)}
          onExpand={handleExpandCard}
        />
      ))}

      <Box mt={2}>
        <Button
          variant="outlined"
          startIcon={<span>+</span>}
          onClick={handleAddCoInvestor}
        >
          ADD CO-INVESTOR
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <DealFlowFooter onBack={() => null} onContinue={nextRoute} />
    </Box>
  );
};

export default DealFlowCoInvestor;
