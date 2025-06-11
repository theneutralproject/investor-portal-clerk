import Grid from '@mui/material/Grid2';

import { renderResourceItem } from './helpers';
import { IResourceCenterComponentProps } from './types';
import { ResourceItem } from '@/libs/types';

interface IShortArticleProps extends IResourceCenterComponentProps {
  onArticleClick: (resource: ResourceItem) => void;
}

const ShortArticles = ({
  resources,
  contentField,
  onArticleClick,
}: IShortArticleProps) => {
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
      {resources.map(article =>
        renderResourceItem(article, contentField, onArticleClick)
      )}
    </Grid>
  );
};

export default ShortArticles;
