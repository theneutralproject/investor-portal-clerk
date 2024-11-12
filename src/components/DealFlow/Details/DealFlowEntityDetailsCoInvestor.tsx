import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  RadioGroup,
  Card,
  CardContent,
  Radio,
} from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";

const DealFlowEntityDetailsCoInvestor: React.FC = () => {
  const router = useRouter();
  const { deal, project } = useDealFlow();
  const [hasCoInvestors, setHasCoInvestors] = useState<boolean | null>(null);

  const handleCoInvestorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHasCoInvestors(event.target.value === "true");
  };

  const handleContinue = () => {
    const route = hasCoInvestors
      ? `/dealflow/${project?.slug}/${deal?.id}/co-investor`
      : `/dealflow/${project?.slug}/${deal?.id}/verify-accreditation`;

    router.push(route);
  };

  return (
    <Box>
      <DealFlowTitle title="Investment Information" />
      <Typography variant="body1" paragraph>
        Would you like to add a co-investor?
      </Typography>
      <RadioGroup
        aria-label="co-investor"
        name="co-investor"
        value={hasCoInvestors}
        onChange={handleCoInvestorChange}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          {[
            { value: true, label: "Add co-investor(s)" },
            { value: false, label: "I don't have co-investors" },
          ].map((option) => (
            <Card
              key={option.value.toString()}
              onClick={() => setHasCoInvestors(option.value)}
              sx={{
                cursor: "pointer",
                boxShadow: 0,
                "&:hover": { boxShadow: 1 },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Radio
                    checked={hasCoInvestors === option.value}
                    value={option.value}
                    name="co-investor-radio-button"
                  />
                  <Typography variant="h6">{option.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>

      <DealFlowFooter onBack={() => null} onContinue={handleContinue} />
    </Box>
  );
};

export default DealFlowEntityDetailsCoInvestor;
