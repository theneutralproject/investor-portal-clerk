import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";

import { DealFinancingType, type Deal, type Project } from "@prisma/client";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import HubspotScheduleCall from "@/components/HubspotScheduleCall";
import StepAvatar from "@/components/StepAvatar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DealCreateSchema } from "@/libs/deal/schema";
import { updateDeal } from "@/libs/deal/utils";

const INVESTMENT_STEPS = [
  "Schedule a Call with an Advisor",
  "Review Project Documents",
  "Sign Investment Agreements",
  "Fund Your Investment",
];

const InvestmentProgress: React.FC<{
  project: Project;
  deal: Deal | null;
  currentTab: number;
  setTabValue: (number: number) => void;
}> = ({ project, deal, currentTab, setTabValue }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createDealMutation = useMutation({
    mutationFn: (dealData: DealCreateSchema) =>
      axios.post(`/api/deals`, dealData),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["deal", project.id.toString()],
      });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: (updateData: { hubspotId: string; dealStage: number }) =>
      updateDeal(updateData),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["deal", project.id.toString()],
      });
    },
  });

  const generateCTAButton = () => {
    if (project.status === "INACTIVE") {
      return (
        <Typography variant="caption">
          This project is fully funded. Feel free to explore other investment
          opportunities.
        </Typography>
      );
    }
    if (!deal) {
      const dealData: DealCreateSchema = {
        financingType: DealFinancingType.equity,
        projectId: project.id,
        dealStage: 1,
      };
      return (
        <HubspotScheduleCall
          onExit={() => createDealMutation.mutate(dealData)}
        />
      );
    }

    if (deal.dealStage === 0) {
      return (
        <HubspotScheduleCall
          onExit={() =>
            updateDealMutation.mutate({
              hubspotId: deal.hubspotId,
              dealStage: deal.dealStage + 1,
            })
          }
        />
      );
    }

    if (deal.dealStage === 1) {
      if (currentTab === 1) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Review Project Documents
            </Typography>
            <Typography variant="caption">
              Understand all details of the performance of an investment into
              The Edison from the financial model and market study to the legal
              documents.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(1)}
          >
            Review Project Docs
          </Button>
        );
      }
    }

    if (deal.dealStage === 2) {
      if (currentTab === 2) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Review Invest Agreements
            </Typography>
            <Typography variant="caption">
              Review, fill, and execute the Subscription Agreement to your
              respective investment.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(2)}
          >
            Sign Agreements
          </Button>
        );
      }
    }

    if (deal.dealStage === 3) {
      if (currentTab === 3) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Fund Your Investment
            </Typography>
            <Typography variant="caption">
              Complete your investment by sending a check or wiring funds.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(3)}
          >
            Fund Investment
          </Button>
        );
      }
    }
  };

  //Funded
  if (project.status === "INACTIVE") {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <StepAvatar isComplete stepNumber={3} />
            <Typography variant="h6" sx={{ ml: "10px" }}>{`Funded`}</Typography>
          </Box>

          <Divider sx={{ mt: 2, mb: 2 }} />

          <Button
            variant="neutralBlack"
            sx={{ width: "100%" }}
            onClick={() => router.push("/projects")}
          >
            Browse Projects
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">Investment Progress:</Typography>
          <Typography variant="caption">
            Next Step: {INVESTMENT_STEPS[deal?.dealStage ?? 0]}
          </Typography>
          <ProgressBar dealStage={deal?.dealStage ?? 0} />

          <Divider sx={{ mt: 2, mb: 2 }} />

          {INVESTMENT_STEPS.map((step, index) => (
            <StepIndicator
              dealStage={deal?.dealStage ?? 0}
              key={index}
              totalSteps={3}
              label={step}
              stepNumber={index}
            />
          ))}

          <Divider sx={{ mt: 2, mb: 2 }} />

          {generateCTAButton()}
        </CardContent>
      </Card>
    </>
  );
};

export default InvestmentProgress;
