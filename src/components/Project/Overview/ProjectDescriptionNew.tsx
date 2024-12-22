import React from 'react';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import type { ProjectWithStats } from '@/libs/types';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const ProjectDescriptionNew = ({ data }: { data: ProjectWithStats }) => {
  let youtubeID = '';
  if (data.youtubeUrl?.includes('v=')) {
    youtubeID = data.youtubeUrl.split('v=')[1]!;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Description
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        {youtubeID.length > 5 && (
          <Card sx={{ mt: theme.spacing(2) }}>
            <LiteYouTubeEmbed id={youtubeID} title={data.name} />
          </Card>
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectDescriptionNew;
