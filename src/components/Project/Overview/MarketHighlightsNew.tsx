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

const MarketHighlightsNew = ({ data }: { data: ProjectWithStats }) => {
  const highlights = data.marketHighlights.split('|').map(highlight => {
    const [title, content] = highlight.trim().split(':');
    return { title: title?.trim(), content: content?.trim() };
  });

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Market Highlights
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <List sx={{ p: 0 }}>
          {highlights.map((highlight, index) => (
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
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default MarketHighlightsNew;
