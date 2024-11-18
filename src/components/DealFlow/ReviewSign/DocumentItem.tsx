import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";

interface DocumentItemProps {
  title: string;
  fileName: string;
  isCompleted: boolean;
  onSign?: () => void;
  index: number;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  title,
  fileName,
  isCompleted,
  onSign,
  index,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    toast.success("Generating document...");
    onSign?.();
  };

  return (
    <ListItem
      disableGutters
      sx={{
        py: 2,
        px: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      {isCompleted ? (
        <CheckCircleIcon
          sx={{
            color: "success.main",
            width: 24,
            height: 24,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            typography: "body2",
            color: "text.secondary",
          }}
        >
          {index}
        </Box>
      )}
      <Stack direction="column" spacing={0.5} flex={1}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {fileName}
        </Typography>
      </Stack>
      {isCompleted ? (
        <Button variant="grayPill">SIGNED</Button>
      ) : (
        <Button
          variant="blackPill"
          onClick={handleClick}
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "GENERATING..." : "REVIEW & SIGN"}
        </Button>
      )}
    </ListItem>
  );
};

export default DocumentItem;
