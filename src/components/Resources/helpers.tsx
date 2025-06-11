import { ResourceItem } from '@/libs/types';
import { Typography, Box } from '@mui/material';
import { ContentField } from './types';

export const renderResourceItem = (
  item: ResourceItem,
  contentField: ContentField
) => (
  <Box key={item.id}>
    <Typography
      variant="h4"
      sx={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 1)',
      }}
      id={item.fieldData.slug}
    >
      {item.fieldData.name}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.5)',
      }}
      dangerouslySetInnerHTML={{
        __html: item.fieldData[contentField] || '',
      }}
    ></Typography>
  </Box>
);
