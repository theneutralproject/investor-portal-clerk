import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { type Project } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";

export const LineDisplay = ({
  name,
  value,
}: {
  name: string;
  value: string | number | Decimal;
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    marginBottom={2}
    marginTop={2}
  >
    <Typography variant="body2">{name}:</Typography>
    <Typography variant="body2" sx={{ color: "#000000DE" }}>
      {String(value)}
    </Typography>
  </Box>
);

const InvestmentSummaryBox = ({ data }: { data: Project }) => {
  return (
    <Grid container spacing={2} sx={{ alignItems: "stretch", height: "100%" }}>
      <Grid item xs={5.5}>
        <Typography variant="body1">Equity Returns</Typography>
        <LineDisplay name="IRR" value={data.projectIrr} />
        <LineDisplay name="Min. Investment" value="--" />
        <LineDisplay name="Term" value="--" />
      </Grid>
      <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
        <Divider orientation="vertical" flexItem sx={{ height: "100%" }} />
      </Grid>
      <Grid item xs={5.5}>
        <Typography variant="body1">Debt Returns</Typography>
        <LineDisplay name="Interest" value="--" />
        <LineDisplay name="Min. Investment" value="--" />
        <LineDisplay name="Term" value="--" />
        <LineDisplay name="Payment" value="--" />
      </Grid>
    </Grid>
  );
};

export default InvestmentSummaryBox;
