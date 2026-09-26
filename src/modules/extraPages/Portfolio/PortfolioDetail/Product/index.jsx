import React from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const Product = ({ product }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        mb: { xs: 7.5, md: 15 },
        px: 7.5,
        '& .product-img img': {
          width: '100%',
        },
        '& .product-grid:nth-of-type(odd) .product-img': {
          mt: { md: 25 },
        },
      }}
    >
      <AppGridContainer>
        {product.map((product, index) => (
          <Grid
            key={index}
            className="product-grid"
            size={{
              xs: 12,
              sm: 6,
              md: 3
            }}>
            <Box className="product-img">
              <img src={product.srcImg} alt="Product" />
            </Box>
          </Grid>
        ))}
      </AppGridContainer>
    </Box>
  );
};

export default Product;

Product.propTypes = {
  product: PropTypes.array,
};
