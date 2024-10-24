import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MembershipType, type User } from "@prisma/client";
import { type MemberWithUser } from "@/libs/prisma";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ExpandableHeader = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ExpandMoreProps extends React.HTMLAttributes<HTMLDivElement> {
  expand: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => {
  const { onClick, ...rest } = other;
  return (
    <div {...rest} onClick={onClick}>
      <ExpandMoreIcon />
    </div>
  );
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface CoInvestorCardProps {
  coInvestor: MemberWithUser;
  index: number;
  onSave: (index: number) => void;
  onCancel: (index: number) => void;
  onChange: (index: number, field: keyof User | "title", value: string) => void;
  expanded: boolean;
  onExpand: (index: number) => void;
}

const CoInvestorCard: React.FC<CoInvestorCardProps> = ({
  coInvestor,
  index,
  onSave,
  onCancel,
  onChange,
  expanded,
  onExpand,
}) => {
  const handleChange = (field: keyof User | "title", value: string) =>
    onChange(index, field, value);
  const investorType = coInvestor.type === "OWNER" ? "Investor" : "Co-Investor";

  const readOnly = coInvestor.type === MembershipType.OWNER;

  return (
    <StyledCard>
      <ExpandableHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => onExpand(index)}
      >
        <Box>
          <Typography variant="overline" display="block" gutterBottom>
            {investorType}
          </Typography>
          <Typography variant="h6">
            {coInvestor.user.firstName ?? coInvestor.user.lastName
              ? `${coInvestor.user.firstName} ${coInvestor.user.lastName}`
              : `${investorType} ${index + 1}`}
          </Typography>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            onExpand(index);
          }}
          aria-expanded={expanded}
          aria-label="show more"
        />
      </ExpandableHeader>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="First Name"
                value={coInvestor.user.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                fullWidth
                disabled={readOnly}
              />
              <TextField
                label="Last Name"
                value={coInvestor.user.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                fullWidth
                disabled={readOnly}
              />
            </Box>
            <TextField
              label="Email"
              value={coInvestor.user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              label="Phone Number"
              value={coInvestor.user.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              label="Title"
              value={coInvestor.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              disabled={readOnly}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onCancel(index)}
            disabled={readOnly}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave(index)}
            disabled={readOnly}
          >
            Save {investorType}
          </Button>
        </CardActions>
      </Collapse>
    </StyledCard>
  );
};

export default CoInvestorCard;
