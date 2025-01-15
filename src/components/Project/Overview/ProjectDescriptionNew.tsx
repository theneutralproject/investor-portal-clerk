import React from 'react';
import {
  Card,
  CardContent,
  Divider,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import type { ProjectWithStats } from '@/libs/types';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const ProjectDescriptionNew = ({ data }: { data: ProjectWithStats }) => {
  let youtubeID = '';
  if (data.youtubeUrl?.includes('v=')) {
    youtubeID = data.youtubeUrl.split('v=')[1]!;
  }

  const projectDescription = data.description.split('|').map(highlight => {
    const [title, content] = highlight.trim().split(':');
    return { title: title?.trim(), content: content?.trim() };
  });

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

        <List sx={{ p: 0 }}>
          {projectDescription.map((highlight, index) =>
            highlight.content ? (
              <ListItem
                key={index}
                sx={{
                  display: 'block',
                  p: '5px 0',
                  pl: 2,
                  position: 'relative',
                  '&::before': {
                    content: '"•"',
                    position: 'absolute',
                    left: 0,
                    top: '5px',
                  },
                }}
              >
                <Typography variant="body2">
                  <strong>{highlight.title}:</strong> {highlight.content}
                </Typography>
              </ListItem>
            ) : (
              <Typography key={index} variant="body2" sx={{ p: '10px 0' }}>
                {highlight.title}
              </Typography>
            )
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProjectDescriptionNew;
