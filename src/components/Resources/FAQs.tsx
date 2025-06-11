import Grid from '@mui/material/Grid2';

import { renderResourceItem } from './helpers';
import { IResourceCenterComponentProps } from './types';

const FAQs = ({ resources, contentField }: IResourceCenterComponentProps) => {
  const dataSize = resources.length;
  if (!dataSize) return;

  const halfSize = Math.ceil(dataSize / 2);
  const firstColumnData = resources.slice(0, halfSize);
  const secondColumnData = resources.slice(halfSize, dataSize);

  return (
    <Grid container>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
        sx={{
          pr: 2,
        }}
      >
        {firstColumnData.map(data => renderResourceItem(data, contentField))}
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        {secondColumnData.map(data => renderResourceItem(data, contentField))}
      </Grid>
    </Grid>
  );
};

export default FAQs;
