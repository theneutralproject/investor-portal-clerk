import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { type Project } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";

const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

export const LineDisplay = ({
  name,
  value,
}: {
  name: string;
  value: string | number | Decimal | React.ReactNode;
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    marginBottom={2}
    marginTop={2}
  >
    <Typography variant="body2">{name}:</Typography>
    {typeof value === "string" || typeof value === "number" ? (
      <Typography variant="body2" sx={{ color: "#000000DE" }}>
        {value}
      </Typography>
    ) : (
      <>{value}</>
    )}
  </Box>
);

const InvestmentSummaryBox = ({ data }: { data: Project }) => {
  return (
    <Grid container spacing={2} sx={{ alignItems: "stretch", height: "100%" }}>
      <Grid item xs={12} sm={5.5}>
        <Typography variant="body1">Equity Returns</Typography>
        <LineDisplay name="IRR" value={`${data.equityIRR}%`} />
        <LineDisplay
          name="Min. Investment"
          value={`$${formatter.format(data.equityMinInvestment)}`}
        />
        <LineDisplay name="Term" value={`${data.equityTermMonths} months`} />
        <LineDisplay name="Distribution" value={`${data.equityPaymentFreq}*`} />
        <LineDisplay
          name="Preferred Return"
          value={`${data.preferredReturn}**`}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={1}
        sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center" }}
      >
        <Divider orientation="vertical" flexItem sx={{ height: "100%" }} />
      </Grid>
      <Grid item xs={12} sm={5.5}>
        <Typography variant="body1">Debt Returns</Typography>
        <LineDisplay name="Interest" value={`${data.debtInterestRate}***`} />
        <LineDisplay
          name="Min. Investment"
          value={`$${formatter.format(data.debtMinInvestment)}`}
        />
        <LineDisplay name="Term" value={`${data.debtTermMonths} months`} />
        <LineDisplay name="Payment" value={`${data.debtPaymentFreq}`} />
      </Grid>

      <Box sx={{ ml: 2 }}>
        <Typography variant="body2">
          *Quarterly distribution shall commence upon stabilization, defined as
          95% occupied.
        </Typography>
        <Typography variant="body2">
          **Equity investors receive a 10% preferred return.
        </Typography>
        <Typography variant="body2">
          ***12% for investment amounts above $500k.
        </Typography>
      </Box>
    </Grid>
  );
};

export default InvestmentSummaryBox;
