import React from 'react';
import Grid from '@mui/material/Grid';
import BlogSidebarCard from '../BlogSidebarCard';
import Blogs from './Blogs';
import AppGridContainer from '@crema/components/AppGridContainer';
import PropTypes from 'prop-types';

const BlogContent = ({ blogSidebar, blogContent }) => {
  return (
    <AppGridContainer>
      <Grid
        sx={{
          order: { md: 2 },
          position: { md: 'sticky' },
          top: { md: 70 },
          bottom: { md: 0 },
          zIndex: 2,
          alignSelf: { md: 'flex-start' },
          '.bit-bucket-sidebar + .mainContent &': {
            top: { md: 0 },
          },
        }}
        size={{
          xs: 12,
          md: 4,
          lg: 4,
          xl: 3
        }}>
        <BlogSidebarCard blogSidebar={blogSidebar} />
      </Grid>
      <Grid
        sx={{ order: { md: 1 } }}
        size={{
          xs: 12,
          md: 8,
          lg: 8,
          xl: 9
        }}>
        <Blogs blogs={blogContent} />
      </Grid>
    </AppGridContainer>
  );
};

export default BlogContent;
BlogContent.propTypes = {
  blogSidebar: PropTypes.object.isRequired,
  blogContent: PropTypes.array.isRequired,
};
