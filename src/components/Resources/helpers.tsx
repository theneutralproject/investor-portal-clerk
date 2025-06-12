import { ResourceItem } from '@/libs/types';
import { Typography, Box } from '@mui/material';
import { ContentField } from './types';

export const renderResourceItem = (
  item: ResourceItem,
  contentField: ContentField,
  onClick?: (resource: ResourceItem) => void
) => {
  const handleClick = () => {
    onClick?.(item);
  };

  return (
    <Box
      key={item.id}
      onClick={handleClick}
      sx={{
        cursor: Boolean(onClick) ? 'pointer' : 'auto',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 1)',
        }}
        id={item.fieldData.slug}
      >
        {item.fieldData.name}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '14px',
          fontWeight: '400',
          color: 'rgba(0, 0, 0, 0.5)',
        }}
        dangerouslySetInnerHTML={{
          __html: item.fieldData[contentField] || '',
        }}
      ></Typography>
    </Box>
  );
};
