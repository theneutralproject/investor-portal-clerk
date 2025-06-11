import Grid from '@mui/material/Grid2';

import { ResourceItem } from '@/libs/types';
import { PictureAsPdfOutlined, Download } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const ReferencePDFs = ({ resources }: { resources: ResourceItem[] }) => {
  if (!resources.length) return;

  const onDownloadClick = (resource?: ResourceItem) => () => {
    if (!resource?.fieldData['downloadable-file']?.url) return;

    const url = resource?.fieldData['downloadable-file']?.url;
    const fileName = resource?.fieldData.name || 'document.pdf';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Grid
      size={{
        xs: 12,
      }}
    >
      {resources.map(pdf => (
        <Grid container alignItems="center" wrap="nowrap" key={pdf.id} gap={2}>
          <Grid
            sx={{
              backgroundColor: 'rgba(227, 242, 253, 1)',
              minWidth: '42px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            <PictureAsPdfOutlined
              sx={{
                fontSize: 24,
                color: 'rgba(21, 101, 192, 1)',
                margin: '0 auto',
              }}
            />
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'rgba(0, 0, 0, 0.87)',
              }}
              id={pdf.fieldData.slug}
            >
              {pdf.fieldData.name}
            </Typography>
          </Grid>
          <Grid
            sx={{
              minWidth: '36px',
            }}
          >
            <IconButton
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                width: '36px',
                height: '32px',
              }}
              onClick={onDownloadClick(pdf)}
            >
              <Download sx={{ color: 'rgba(0, 0, 0, 0.3)', fontSize: 20 }} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReferencePDFs;
