import React from 'react';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import type { ProjectWithAllNestedData } from '@/libs/types';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const GalleryNew = ({ data }: { data: ProjectWithAllNestedData }) => {
  const images =
    data.pictures?.map(picture => ({
      original: picture.url,
      thumbnail: picture.url,
    })) || [];

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Gallery
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={true}
          showNav={false}
          showThumbnails={true}
          thumbnailPosition="bottom"
        />
      </CardContent>
    </Card>
  );
};

export default GalleryNew;
