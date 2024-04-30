import React, { useState } from "react";
import {
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import { theme } from "../../Shell/NeutralThemeProvider";
import { type Project } from "@prisma/client";

const ProjectCalculator = ({ data }: { data: Project }) => {
  const [investment, setInvestment] = useState(100000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(event.target.value));
  };

  const targetTermLength = data.equityTermMonths;

  const sp_annual_rate = 12.2;
  const reit_annual_rate = 11.3;
  const project_annual_rate = data.equityIRR;

  const sp500return = Math.round(
    investment * (1 + (sp_annual_rate / 100) * (targetTermLength / 12))
  );
  const reitReturn = Math.round(
    investment * (1 + (reit_annual_rate / 100) * (targetTermLength / 12))
  );

  const totalTargetedReturn = Math.round(
    investment * (1 + (project_annual_rate / 100) * (targetTermLength / 12))
  );

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Investment Calculator
        </Typography>

        <Divider sx={{ mt: 2, mb: 2 }} />

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
          name="Target Equity Multiple?"
          value={project_annual_rate + "%"}
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
      </CardContent>
    </Card>
  );
};

export default ProjectCalculator;
