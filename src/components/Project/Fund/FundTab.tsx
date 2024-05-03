/* eslint-disable */
import useDocuments, { DocumentWithCompletion } from "@/app/hooks/useDocuments";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Deal, type Project } from "@prisma/client";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";
import { Key } from "react";
import { LineDisplay } from "../Overview/InvestmentSummaryBox";

export const FundTab: React.FC<{ project: Project; deal: Deal }> = ({
  project,
  deal,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mutate: mutateDeal } = useIncrementDealMutation(project.id);
  if (!deal) return null;
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
              <LineDisplay name="Account Number" value="#####" />
              <LineDisplay name="Routing Number" value="#####" />
            </CardContent>
          </Card>
        </CardContent>
      </CardContent>
    </Card>
  );
};
