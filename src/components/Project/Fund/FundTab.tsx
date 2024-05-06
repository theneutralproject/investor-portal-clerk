/* eslint-disable */
import { theme } from "@/components/Shell/NeutralThemeProvider";
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { type Deal, type Project } from "@prisma/client";

import { LineDisplay } from "../Overview/InvestmentSummaryBox";
import { SetStateAction, useState } from "react";

const options = [
  {
    value: "DIRECT_DEPOSIT",
    label: "Direct Deposit and Electronic Payment",
    routingNumber: "075911988",
  },
  {
    value: "DOMESTIC_WIRE",
    label: "Domestic Wire",
    routingNumber: "121000248",
  },
  {
    value: "INTERNATIONAL_WIRE",
    label: "International Wire",
    routingNumber: "WFBIUS6S",
  },
];

export const FundTab: React.FC<{ project: Project; deal: Deal }> = ({
  project,
  deal,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMethod, setSelectedMethod] = useState("");
  if (!deal) return null;

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedMethod(event.target.value);
  };

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent sx={{ p: isMobile ? 0 : "16px" }}>
        <CardContent>
          <Typography variant="h6">Fund Your Investment</Typography>
          <Typography variant="caption">
            Placeholder description about what this process is and how it works.
          </Typography>

          <Card>
            <CardContent>
              <Typography variant="body1">Pay by Check</Typography>
              <Divider sx={{ mt: 2 }} />

              <LineDisplay name="Payable To" value="The Neutral Project" />
              <LineDisplay name="Amount" value={`$${deal.amount}`} />
              <LineDisplay
                name="Memo"
                value={`(Your name) / ${project.name} / ID: ${deal.transactionId}`}
              />
              <LineDisplay
                name="Mail to"
                value={
                  <Box sx={{ width: "180px" }}>
                    <Typography variant="body2" sx={{ color: "#000000DE" }}>
                      The Edison Project LLC
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000DE" }}>
                      Attn: Nathan Helbach
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000DE" }}>
                      25 W. Main Street, Suite 500
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000DE" }}>
                      Madison, WI 53703
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="body1">Pay by Wire Transfer</Typography>
              <Divider sx={{ mt: 2 }} />

              <LineDisplay name="Amount" value={`$${deal.amount}`} />
              <LineDisplay name="Account Number" value="9211305785" />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="method-label">Select Routing</InputLabel>
                <Select
                  labelId="method-label"
                  id="method-select"
                  value={selectedMethod}
                  label="Payment Method"
                  onChange={handleChange}
                >
                  {Object.entries(options).map(([value, { label }]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedMethod && (
                <Typography sx={{ mt: 2 }}>
                  {/* @ts-ignore */}
                  Routing Number: {options[selectedMethod].routingNumber}
                </Typography>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </CardContent>
    </Card>
  );
};
