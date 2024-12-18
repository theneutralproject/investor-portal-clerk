import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  XIcon,
  LinkedinIcon,
  FacebookIcon,
} from "react-share";

const ShareOnSocial = () => {
  const shareUrl = "https://neutral.us";
  const title =
    "I just invested with @Neutral - a sustainable mass timber developer. Check them out";
  const hashtags = ["sustainability", "investing", "neutral"];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, mt: 2 }}>
        Share on Social:
      </Typography>

      <Card sx={{ display: "flex", width: "100%" }}>
        <CardMedia
          component="img"
          sx={{
            width: 150,
            height: 150,
            backgroundColor: "#DBA111",
            objectFit: "contain",
            flexShrink: 0,
          }}
          image="/socialIcon.png"
          alt="Neutral logo"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: 150,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              p: 2,
            }}
          >
            <Box>
              <Typography variant="body1" color="text.primary" gutterBottom>
                {title}{" "}
                <Box component="span" sx={{ textDecoration: "underline" }}>
                  {shareUrl}
                </Box>
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                {hashtags.map((hashtag) => (
                  <Typography
                    key={hashtag}
                    variant="body2"
                    color="text.secondary"
                  >
                    #{hashtag}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: "auto", ml: "auto" }}
            >
              <Typography variant="body2" color="text.secondary">
                Post with:
              </Typography>

              <TwitterShareButton
                url={shareUrl}
                title={title}
                hashtags={hashtags}
              >
                <IconButton size="small" aria-label="share on twitter">
                  <XIcon size={25} round />
                </IconButton>
              </TwitterShareButton>

              <LinkedinShareButton url={shareUrl} title={title}>
                <IconButton size="small" aria-label="share on linkedin">
                  <LinkedinIcon size={25} round />
                </IconButton>
              </LinkedinShareButton>

              <FacebookShareButton url={shareUrl} hashtag={`#${hashtags[0]}`}>
                <IconButton size="small" aria-label="share on facebook">
                  <FacebookIcon size={25} round />
                </IconButton>
              </FacebookShareButton>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default ShareOnSocial;
