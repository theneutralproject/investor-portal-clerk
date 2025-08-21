'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  styled,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  imageUrl?: string;
  type: 'blog' | 'podcast';
}

const NewsCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.neutralMarble.main,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.75),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: theme.spacing(0.75),
  overflow: 'hidden',
  marginRight: theme.spacing(1.5),
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: 55,
    height: 55,
    marginRight: theme.spacing(1),
  },
}));

const NewsImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const TypeBadge = styled(Box)(({ type }: { type: 'blog' | 'podcast' }) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '100px',
  fontSize: '0.7rem',
  fontWeight: 500,
  backgroundColor: type === 'blog' ? '#F0F7F0' : '#FFF8E1',
  color: type === 'blog' ? '#2E7D32' : '#F57F17',
}));

const DateText = styled(Typography)({
  color: '#9E9E9E',
  marginLeft: 'auto',
  fontSize: '0.7rem',
});

const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/public/rss?limit=15');

        if (response.status !== 200) {
          throw new Error('Failed to fetch news');
        }

        setNewsItems(response.data.data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news content');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <Card
      sx={{
        mt: 1.5,
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
      variant="marble"
    >
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 500, mb: 1.5 }}
        >
          News
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 1.5 }}>
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: '500px',
              overflow: 'auto',
              pr: isMobile ? 0.5 : 0.75,
            }}
          >
            {newsItems.map((item, index) => (
              <NewsCard
                key={index}
                elevation={0}
                onClick={() => window.open(item.link, '_blank')}
              >
                <Box
                  sx={{ display: 'flex', width: '100%', alignItems: 'center' }}
                >
                  <ImageContainer>
                    <NewsImage
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.title}
                    />
                  </ImageContainer>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                        justifyContent: 'space-between',
                      }}
                    >
                      <TypeBadge type={item.type}>
                        {item.type === 'blog' ? 'Blog' : 'Podcast'}
                      </TypeBadge>
                      <DateText variant="body2">
                        {formatDate(item.pubDate)}
                      </DateText>
                    </Box>

                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      component="h3"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.3,
                        mb: isMobile ? 0 : 0.75,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </Typography>

                    {!isMobile && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </NewsCard>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsComponent;
