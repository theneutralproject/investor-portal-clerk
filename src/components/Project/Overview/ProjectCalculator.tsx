import React, { useState } from "react";
import { Typography, Divider, TextField } from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import CollapsibleCard from "./CollapsibleCard";
import type { ProjectWithStats } from "@/libs/prisma";

const ProjectCalculator = ({ data }: { data: ProjectWithStats }) => {
  const [investment, setInvestment] = useState(100000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(event.target.value));
  };

  const targetTermLength = data.investmentStats.equityTermMonths;

  const sp_annual_rate = 12.2;
  const reit_annual_rate = 11.3;
  const { targetEquityMultiple } = data.investmentStats;

  const sp500return = Math.round(
    investment * (1 + (sp_annual_rate / 100) * (targetTermLength / 12))
  );
  const reitReturn = Math.round(
    investment * (1 + (reit_annual_rate / 100) * (targetTermLength / 12))
  );

  const totalTargetedReturn = Math.round(investment * targetEquityMultiple);

  return (
    <CollapsibleCard title="Investment Calculator">
      <Divider />

      <TextField
        label="Investment Amount ($)"
        type="number"
        variant="outlined"
        fullWidth
        value={investment}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <LineDisplay
        name="Target Equity Multiple"
        value={targetEquityMultiple + "x"}
      />
      <LineDisplay
        name="Target Term Length (Months)"
        value={targetTermLength}
      />

      <Typography variant="h6" sx={{ fontWeight: "500" }}>
        Total targeted return: ${totalTargetedReturn.toLocaleString()} over{" "}
        {targetTermLength} months
      </Typography>

      <Divider sx={{ mt: 2, mb: 2 }} />

      <Typography>Compare returns:</Typography>

      <LineDisplay
        name="AVG. S&P 500"
        value={`$${sp500return.toLocaleString()}`}
      />
      <LineDisplay
        name="AVG. Real estate investment trust"
        value={`$${reitReturn.toLocaleString()}`}
      />
    </CollapsibleCard>
  );
};

export default ProjectCalculator;
