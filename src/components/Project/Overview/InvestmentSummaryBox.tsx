import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { type Decimal } from "@prisma/client/runtime/library";
import type { ProjectWithStats } from "@/libs/types";
import type { ProjectInvestmentStats } from "@prisma/client";

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

const getInterestRate = (investmentStats: ProjectInvestmentStats) => {
  if (investmentStats.interestRateMax !== investmentStats.interestRateMin) {
    return `${investmentStats.interestRateMin}% - ${investmentStats.interestRateMax}%`;
  }
  else return `${investmentStats.interestRateMin}%`;
}

const getDebtTermString = (investmentStats: ProjectInvestmentStats) => {
  if (investmentStats.debtTermMonthsMin === investmentStats.debtTermMonthsMax) {
    return `${investmentStats.debtTermMonthsMax} month`;
  }
  return `${investmentStats.debtTermMonthsMin} or ${investmentStats.debtTermMonthsMax} months`;
}

const getEquitySummaryBox = (data: ProjectWithStats) => {
  // for bakers place, only show debt information
  if (!data.investmentStats.boolEquity) {
    return (
      <Grid item xs={12} sm={5.5}>
        <Typography variant="body1">Debt Returns</Typography>
        <LineDisplay name="Interest" value={`${getInterestRate(data.investmentStats)}`} />
        <LineDisplay
          name="Min. Investment"
          value={`$${formatter.format(data.investmentStats.debtMinInvestment)}`}
        />
        <LineDisplay name="Term" value={getDebtTermString(data.investmentStats)} />
        <LineDisplay name="Payment" value={`${data.investmentStats.debtPaymentFreq}`} />
      </Grid>
    );
  }
  return (
    <Grid container spacing={2} sx={{ alignItems: "stretch", height: "100%" }}>
      <Grid item xs={12} sm={5.5}>
        <Typography variant="body1">Equity Returns</Typography>
        <LineDisplay name="IRR" value={`${data.investmentStats.equityIRR}%`} />
        <LineDisplay
          name="Min. Investment"
          value={`$${formatter.format(data.investmentStats.equityMinInvestment)}`}
        />
        <LineDisplay name="Term" value={`${data.investmentStats.equityTermMonths} months`} />
        <LineDisplay name="Distribution" value={`${data.investmentStats.equityPaymentFreq}*`} />
        <LineDisplay
          name="Preferred Return"
          value={`${data.investmentStats.preferredReturn*100}%**`}
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
        <LineDisplay name="Interest" value={`${getInterestRate(data.investmentStats)}***`} />
        <LineDisplay
          name="Min. Investment"
          value={`$${formatter.format(data.investmentStats.debtMinInvestment)}`}
        />
        <LineDisplay name="Term" value={getDebtTermString(data.investmentStats)} />
        <LineDisplay name="Payment" value={`${data.investmentStats.debtPaymentFreq}`} />
      </Grid>

      <Box sx={{ ml: 2 }}>
        <Typography variant="body2">
          {`*${data.investmentStats.equityPaymentFreq} distribution shall commence upon stabilization, defined as
            95% occupied.`}
        </Typography>
        <Typography variant="body2">
          **Equity investors receive a 10% preferred return.
        </Typography>
        <Typography variant="body2">
          {`***${data.investmentStats.interestRateMax} for investment amounts above $${data.investmentStats.interestRateDollarThreshold / 1000}k.`}
        </Typography>
      </Box>
    </Grid>
  );
}

const InvestmentSummaryBox = ({ data }: { data: ProjectWithStats }) => {
  return getEquitySummaryBox(data);
};

export default InvestmentSummaryBox;
