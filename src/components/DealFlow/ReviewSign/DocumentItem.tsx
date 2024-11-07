import React from "react";
import { Box, Typography, Button, ListItem, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
        <Typography variant="body2">Signed</Typography>
      ) : (
        <Button variant="neutralBlack" onClick={onSign}>
          REVIEW & SIGN
        </Button>
      )}
    </ListItem>
  );
};

export default DocumentItem;
