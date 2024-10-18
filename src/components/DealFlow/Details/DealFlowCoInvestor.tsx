import React, { useState, useCallback } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import CoInvestorCard from "@components/DealFlow/Details/CoInvestorCard";
import { useRouter } from "next/navigation";
const DealFlowCoInvestor = () => {
  const { deal, project, organization, updateOrganizationMember } =
    useDealFlow();
  const [coInvestors, setCoInvestors] = useState(organization?.members || []);
  const [expandedCards, setExpandedCards] = useState([]);

  const router = useRouter();

  const handleAddCoInvestor = useCallback(() => {
    const newCoInvestor = {
      id: Date.now(),
      userId: Date.now(),
      organizationId: organization.id,
      type: "MEMBER",
      user: {
        id: Date.now(),
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      },
    };
    setCoInvestors((prev) => [...prev, newCoInvestor]);
    setExpandedCards((prev) => [...prev, coInvestors.length]);
  }, [organization?.id, coInvestors.length]);

  const handleCoInvestorChange = useCallback((index, field, value) => {
    setCoInvestors((prev) =>
      prev.map((investor, i) =>
        i === index
          ? { ...investor, user: { ...investor.user, [field]: value } }
          : investor
      )
    );
  }, []);

  const nextRoute = () => {
    router.push(`/dealflow/${project.slug}/${deal.id}/verify-accreditation`);
  };

  const handleSaveCoInvestor = useCallback(
    async (index) => {
      const coInvestor = coInvestors[index];
      try {
        await updateOrganizationMember(deal.id, coInvestor.user, "COINVESTOR");
        console.log("Co-investor saved successfully");
        setExpandedCards((prev) => prev.filter((i) => i !== index));
      } catch (error) {
        console.error("Error saving co-investor:", error);
      }
    },
    [coInvestors, deal?.id, updateOrganizationMember]
  );

  const handleCancelCoInvestor = useCallback((index) => {
    // setCoInvestors((prev) => prev.filter((_, i) => i !== index));
    setExpandedCards((prev) => prev.filter((i) => i !== index));
  }, []);

  const handleExpandCard = useCallback((index) => {
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

      <DealFlowFooter onBack={() => {}} onContinue={nextRoute} />
    </Box>
  );
};

export default DealFlowCoInvestor;
