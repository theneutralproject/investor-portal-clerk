import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { ResourceItem } from '@/libs/types';

const QuickLinks = ({ resources }: { resources: ResourceItem[] }) => {
  if (!resources.length) return;

  return (
    <Grid
      size={{
        xs: 12,
      }}
      sx={{
        display: 'grid',
        gap: 1,
      }}
    >
      {resources.map(link => (
        <Box key={link.id}>
          <Link
            id={link.fieldData.slug}
            href={link.fieldData['external-link'] || ''}
            target="_blank"
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '16px',
                color: 'rgba(25, 118, 210, 1)',
                textDecoration: 'underline',
              }}
            >
              {link.fieldData.name}
            </Typography>
          </Link>
        </Box>
      ))}
    </Grid>
  );
};

export default QuickLinks;
