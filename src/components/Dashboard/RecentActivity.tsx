import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Button,
  Box,
} from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';

interface ActivityItem {
  id: string;
  userId: number;
  header: string;
  body: string;
  dateCreated: string;
  link?: string;
  type: string;
  itemId: number;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/activity');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ActivityItem[] = await response.json();

        setActivities(data);
        setError(null);
      } catch (err) {
        setError('Failed to load activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: '8px', mt: 2 }}>
        <CardContent>
          <Typography variant="body1" sx={{ fontSize: '20px', mb: 2 }}>
            Recent Activity
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ py: 4, textAlign: 'center' }}>
            Loading activities...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: '8px', mt: 2 }}>
        <CardContent>
          <Typography variant="body1" sx={{ fontSize: '20px', mb: 2 }}>
            Recent Activity
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="body2"
            sx={{ py: 4, textAlign: 'center', color: 'error.main' }}
          >
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '8px', mt: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: '20px',
              mb: 2,
              pt: 2,
            }}
          >
            Recent Activity
          </Typography>
          <Divider />
        </Box>

        <Box sx={{ maxHeight: '400px', overflowY: 'auto', px: 2 }}>
          {activities.length === 0 ? (
            <Typography variant="body2" sx={{ py: 4, textAlign: 'center' }}>
              No activity found
            </Typography>
          ) : (
            activities.map((activity, index) => (
              <Box key={`${activity.id}-${index}`}>
                <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1 }}>
                  <Box sx={{ mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <InsertDriveFileOutlined
                        sx={{
                          width: 24,
                          height: 24,
                          opacity: 0.6,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: 14, fontWeight: 500 }}
                    >
                      {activity.header}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 1, fontSize: 12 }}
                    >
                      {activity.body}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 12 }}
                    >
                      {formatDate(activity.dateCreated)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      href={activity.link}
                      sx={{
                        borderRadius: 28,
                        textTransform: 'none',
                        px: 3,
                        border: '1px solid #e0e0e0',
                        color: 'text.primary',
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Stack>
                {index !== activities.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
