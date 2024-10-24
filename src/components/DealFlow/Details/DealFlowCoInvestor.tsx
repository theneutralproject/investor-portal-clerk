import React, { useState, useCallback, useEffect } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import CoInvestorCard from "@components/DealFlow/Details/CoInvestorCard";
import { useRouter } from "next/navigation";
import { MembershipType, Role, type User } from "@prisma/client";
import { type MemberWithUser } from "@/libs/prisma";
import {
  type UserCreateSchema,
  type UserUpdateSchema,
} from "@/libs/user/schema";

const DealFlowCoInvestor: React.FC = () => {
  const {
    deal,
    project,
    organization,
    createOrganizationMember,
    updateOrganizationMember,
  } = useDealFlow();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [localMembers, setLocalMembers] = useState<Partial<MemberWithUser>[]>(
    []
  );

  const router = useRouter();

  useEffect(() => {
    if (organization?.members) {
      setLocalMembers(organization.members);
    }
  }, [organization?.members]);

  const handleAddCoInvestor = useCallback(() => {
    const newMember: Partial<MemberWithUser> = {
      type: MembershipType.COINVESTOR,
      title: "",
      user: {
        role: Role.USER,
        email: "",
        firstName: "",
        lastName: "",
      },
    };

    setLocalMembers((prev) => [...prev, newMember]);
    setExpandedCards((prev) => [...prev, localMembers.length]);
  }, [localMembers.length]);

  const handleCoInvestorChange = useCallback(
    (index: number, field: keyof User | "title", value: string) => {
      setLocalMembers((prevMembers) => {
        if (!prevMembers) return prevMembers;
        return prevMembers.map((member, i) =>
          i === index
            ? {
                ...member,
                ...(field === "title"
                  ? { title: value }
                  : {
                      user: { ...member.user, [field]: value } as Partial<User>,
                    }),
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
      if (!deal) return;

      const coInvestor = localMembers[index];
      if (!coInvestor?.user) {
        console.error("Co-investor user data is missing");
        return;
      }

      try {
        if (coInvestor.id) {
          // Update existing member
          await updateOrganizationMember({
            id: coInvestor.id,
            dealId: deal.id,
            user: coInvestor.user as UserUpdateSchema,
            title: coInvestor.title ?? "",
            type: MembershipType.COINVESTOR,
          });
        } else {
          // Create new member
          await createOrganizationMember({
            dealId: deal.id,
            user: coInvestor.user as UserCreateSchema,
            title: coInvestor.title ?? "",
            type: MembershipType.COINVESTOR,
          });
        }
        setExpandedCards((prev) => prev.filter((i) => i !== index));
      } catch (error) {
        console.error("Error saving co-investor:", error);
      }
    },
    [deal, localMembers, createOrganizationMember, updateOrganizationMember]
  );

  const handleCancelCoInvestor = useCallback(
    (index: number) => {
      setExpandedCards((prev) => prev.filter((i) => i !== index));

      // If the member has no ID (newly added), remove it from localMembers
      const member = localMembers[index];
      if (!member?.id) {
        setLocalMembers((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [localMembers]
  );

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
          key={`${coInvestor.id ?? index}`}
          coInvestor={coInvestor as MemberWithUser}
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
