import React from 'react';
import {
  Avatar,
  Card,
  Button,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCustodianPlatforms } from '@/app/hooks/useCustodianPlatforms';
import { Status } from '@prisma/client';
import { Circle } from '@mui/icons-material';

const detailList = [
  'Direct access to due diligence materials and subscription documents.',
  'Streamlined onboarding for clients.',
  'Integration with your firm’s compliance and reporting systems.',
  'Direct access to due diligence materials with Factright and Buttonwood.',
];

const statusMapper = {
  [Status.ACTIVE]: 'View',
  [Status.UPCOMING]: 'Coming Soon',
  [Status.INACTIVE]: 'Inactive',
};

const statusColorMapper = {
  [Status.ACTIVE]: 'rgba(0, 0, 0, 0.87)',
  [Status.UPCOMING]: 'rgba(0, 0, 0, 0.38)',
  [Status.INACTIVE]: 'rgba(0, 0, 0, 0.38)',
};

const statusIconColorMapper = {
  [Status.ACTIVE]: 'rgba(76, 175, 80, 1)',
  [Status.UPCOMING]: 'rgba(223, 175, 68, 1)',
  [Status.INACTIVE]: 'rgba(223, 175, 68, 1)',
};

const CustodianPlatforms = ({ projectId }: { projectId: number }) => {
  const { data, isLoading } = useCustodianPlatforms(projectId);

  if (!isLoading && !data?.data.length) return null;

  return (
    <Card sx={{ mt: 2 }} variant="marble">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          For Registered Investment Advisors & Broker Dealers
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          Partner with us through your preferred investment platform:
        </Typography>
        <List
          sx={{
            width: '100%',
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {detailList.map((value, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon
                sx={{
                  minWidth: '29px',
                }}
              >
                <CheckIcon
                  sx={{
                    color: '#C88527',
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>

        <Divider />

        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        )}

        <List
          sx={{
            width: '100%',
            color: 'rgba(0, 0, 0, 0.6)',
            padding: '0px',
          }}
        >
          {(data?.data || []).map((custodian, index) => (
            <ListItem
              key={index}
              disableGutters
              secondaryAction={
                <Button>
                  <Typography
                    variant="body2"
                    sx={{
                      color: statusColorMapper[custodian.status],
                    }}
                  >
                    {statusMapper[custodian.status]}
                  </Typography>
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={`${custodian.name} logo`}
                  src={custodian.logoUrl || ''}
                  sx={{ width: '36px', height: '36px' }}
                  variant="square"
                />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  color: statusColorMapper[custodian.status],
                  fontWeight: '700',
                  fontSize: '1rem',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: statusColorMapper[custodian.status],
                    fontWeight: '500',
                  }}
                >
                  {custodian.name}
                  <Circle
                    sx={{
                      width: '8px',
                      height: '8px',
                      marginLeft: '5px',
                      color: statusIconColorMapper[custodian.status],
                    }}
                  />
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CustodianPlatforms;
