import React from "react";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";
import { type Deal, type Address } from "@prisma/client";
import { getProjectPicture } from "./CompleteInvestment";

type OrganizationWithFullMembersAndAddress = {
  name: string;
  address: Address | null;
};

type ProjectWithAllNestedData = {
  name: string;
  location: string;
  investmentStats?: {
    investmentRaised: number;
    investmentGoal: number;
  };
};

type DealWithFullOrgAndProject = Deal & {
  organization: OrganizationWithFullMembersAndAddress;
  project: ProjectWithAllNestedData;
};

interface DashboardDealsProps {
  deals: DealWithFullOrgAndProject[];
}

const StyledCard = styled(Card)({
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  borderRadius: 8,
  marginTop: "20px",
});

const ProjectImage = styled("img")({
  width: 48,
  height: 48,
  objectFit: "cover",
  borderRadius: 4,
});

const TableHeader = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "300px 1fr 1fr 1fr 1fr",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TableRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "300px 1fr 1fr 1fr 1fr",
  padding: theme.spacing(1.5),
  alignItems: "center",
  "&:not(:last-child)": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledHeader = styled(Typography)(({}) => ({
  color: "rgba(0, 0, 0, 0.87)",
  fontSize: 14,
  fontWeight: 500,
}));

const DashboardDeals: React.FC<DashboardDealsProps> = ({ deals }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <StyledCard>
      <TableHeader>
        <Box /> {/* Empty space for image and name column */}
        <StyledHeader>Type</StyledHeader>
        <StyledHeader>Committed</StyledHeader>
        <StyledHeader>Distributions to Date</StyledHeader>
      </TableHeader>
      <CardContent sx={{ p: 0 }}>
        {deals.map((deal) => {
          const picture = getProjectPicture(deal);
          return (
            <TableRow key={deal.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ProjectImage src={picture} alt={deal.project.name} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {deal.project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {deal.project.location}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                {deal.investmentStats.financingType === "equity"
                  ? "Equity"
                  : "Debt"}
              </Typography>
              <Typography variant="body2">
                {formatCurrency(deal.investmentStats.amount)}
              </Typography>
              <Typography variant="body2">Need data</Typography>
            </TableRow>
          );
        })}
      </CardContent>
    </StyledCard>
  );
};

export default DashboardDeals;
