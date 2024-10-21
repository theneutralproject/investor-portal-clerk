import React, { useState, useCallback, useEffect } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import CoInvestorCard from "@components/DealFlow/Details/CoInvestorCard";
import { useRouter } from "next/navigation";
import { MembershipType, Role, type User } from "@prisma/client";
import { type MemberWithUser } from "@/libs/prisma";

const DealFlowCoInvestor: React.FC = () => {
  const {
    deal,
    project,
    organization,
    createOrganizationMember,
    updateOrganizationMember,
  } = useDealFlow();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [localMembers, setLocalMembers] = useState<MemberWithUser[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (organization?.members) {
      setLocalMembers(
        organization.members.map((member) => ({
          ...member,
          user: {
            id: member.userId,
            email: member.user.email,
            firstName: member.user.firstName,
            lastName: member.user.lastName,
          },
        }))
      );
    }
  }, [organization]);

  const handleAddCoInvestor = useCallback(async () => {
    if (!deal || !organization) return;

    try {
      const newUser: Partial<User> = {
        role: Role.USER,
        email: `coinvestor-${organization.members.length + 1}@example.com`,
        firstName: "",
        lastName: "",
      };

      await createOrganizationMember(
        deal.id,
        newUser,
        MembershipType.COINVESTOR
      );

      setExpandedCards((prev) => [...prev, organization.members.length]);
    } catch (error) {
      console.error("Error adding co-investor:", error);
    }
  }, [deal, organization, createOrganizationMember]);

  const handleCoInvestorChange = useCallback(
    (index: number, field: keyof User, value: string) => {
      setLocalMembers((prevMembers) => {
        if (!prevMembers) return prevMembers;
        return prevMembers.map((member, i) =>
          i === index
            ? {
                ...member,
                user: { ...member.user, [field]: value } as User,
              }
            : member
        );
      });
    },
    []
  );

  const nextRoute = useCallback(() => {
    if (project?.slug && deal?.id) {
      router.push(`/dealflow/${project.slug}/${deal.id}/verify-accreditation`);
    }
  }, [project, deal, router]);

  const handleSaveCoInvestor = useCallback(
    async (index: number) => {
      const coInvestor = localMembers[index];
      if (coInvestor?.user) {
        try {
          await updateOrganizationMember(coInvestor.user);
          console.log("Co-investor saved successfully");
          setExpandedCards((prev) => prev.filter((i) => i !== index));
        } catch (error) {
          console.error("Error saving co-investor:", error);
        }
      } else {
        console.error("Co-investor user data is missing");
      }
    },
    [localMembers, updateOrganizationMember]
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

      {localMembers.map((coInvestor, index) => (
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
