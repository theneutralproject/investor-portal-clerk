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

const ExpandMore = styled(({ expand, ...other }) => {
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

const CoInvestorCard = ({
  coInvestor,
  index,
  onSave,
  onCancel,
  onChange,
  expanded,
  onExpand,
}) => {
  const handleChange = (field, value) => onChange(index, field, value);
  const investorType = coInvestor.type === "OWNER" ? "Investor" : "Co-Investor";

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
            {coInvestor.user.firstName || coInvestor.user.lastName
              ? `${coInvestor.user.firstName} ${coInvestor.user.lastName}`
              : `${investorType} ${index + 1}`}
          </Typography>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={(e) => {
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
              />
              <TextField
                label="Last Name"
                value={coInvestor.user.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Email"
              value={coInvestor.user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={coInvestor.user.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              fullWidth
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onCancel(index)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave(index)}
          >
            Save {investorType}
          </Button>
        </CardActions>
      </Collapse>
    </StyledCard>
  );
};

export default CoInvestorCard;