import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { type ProjectWithAllNestedData } from "@/libs/types";
import { LineDisplay } from "../Overview/InvestmentSummaryBox";

interface RightSidebarCTAProps {
  project: ProjectWithAllNestedData;
}

const RightSidebarCTA: React.FC<RightSidebarCTAProps> = ({ project }) => {
  const fundingPercentage = Math.round(
    (project.investmentStats.investmentRaised /
      project.investmentStats.investmentGoal) *
      100
  );

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "50px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {project.name}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              {project.location}
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: `conic-gradient(#F0B642 ${fundingPercentage}%, #E5E7EB ${fundingPercentage}% 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                {fundingPercentage}%
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <LineDisplay
            name="Total Units"
            value={project.propertyStats.numUnits}
          />
          <LineDisplay
            name="Investment Term"
            value={`${project.investmentStats.equityTermMonths} Months`}
          />

          <LineDisplay
            name="Min Investment"
            value={`$${project.investmentStats.equityMinInvestment / 1000}k`}
          />

          <LineDisplay
            name="IRR / Interest"
            value={`${project.investmentStats.equityIRR.toFixed(1)}% / ${
              project.investmentStats.interestRateMin
            }-${project.investmentStats.interestRateMax}%`}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button fullWidth variant="neutralYellow">
            Invest
          </Button>
          <Button fullWidth variant="grayPill">
            Schedule a Call
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RightSidebarCTA;
