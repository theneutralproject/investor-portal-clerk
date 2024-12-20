import React from "react";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";
import { getProjectPicture } from "./CompleteInvestment";
import type { PortfolioReturnsResponse } from "@/libs/returns/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DashboardDealsProps {
  loggedIn: boolean;
}

interface Project {
  name: string;
  location: string;
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

const DashboardDeals: React.FC<DashboardDealsProps> = ({ loggedIn }) => {
  const { data } = useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ["dashboard", "portfolio"],
    queryFn: async () => {
      const response = await axios.get<PortfolioReturnsResponse>(
        "/api/dashboard/returns"
      );
      return response.data;
    },
    enabled: loggedIn,
  });
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!data?.dealStats.length) return null;
  console.log(data.dealStats.length);
  return (
    <StyledCard>
      <TableHeader>
        <Box /> {/* Empty space for image and name column */}
        <StyledHeader>Type</StyledHeader>
        <StyledHeader>Committed</StyledHeader>
        <StyledHeader>Distributions to Date</StyledHeader>
      </TableHeader>
      <CardContent sx={{ p: 0 }}>
        {data.dealStats.map((deal) => {
          if (!deal.project) return null;
          // @ts-expect-error this mapping is okay
          const picture = getProjectPicture(deal);
          return (
            <TableRow key={deal.dealId}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ProjectImage src={picture} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {(deal.project as Project)?.name || "Project"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(deal.project as Project)?.location || "Location"}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                {deal.financingType === "equity" ? "Equity" : "Debt"}
              </Typography>
              <Typography variant="body2">
                {formatCurrency(deal.committedAmount)}
              </Typography>
              <Typography variant="body2">
                {formatCurrency(deal.distributionsToDate)}
              </Typography>
            </TableRow>
          );
        })}
      </CardContent>
    </StyledCard>
  );
};

export default DashboardDeals;
