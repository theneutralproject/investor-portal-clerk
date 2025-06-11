import Grid from '@mui/material/Grid2';

import { renderResourceItem } from './helpers';
import { IResourceCenterComponentProps } from './types';

const ShortArticles = ({
  resources,
  contentField,
}: IResourceCenterComponentProps) => {
  if (!resources.length) return;

  return (
    <Grid
      size={{
        xs: 12,
      }}
      sx={{
        display: 'grid',
        gap: 2,
      }}
    >
      {resources.map(article => renderResourceItem(article, contentField))}
    </Grid>
  );
};

export default ShortArticles;
