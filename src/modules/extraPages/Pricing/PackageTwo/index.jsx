import React from 'react';
import PropTypes from 'prop-types';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import PackageCard from './PackageCard';
import AppCard from '@crema/components/AppCard';

const PackageTwo = ({ pricing }) => {
  return (
    <AppCard title="Pricing Package Style 2" sxStyle={{ alignItems: 'center' }}>
      <AppGridContainer
        sx={{
          maxWidth: 1000,
          justifyContent: 'center',
        }}
      >
        {pricing.map((data, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 4
            }}>
            <PackageCard pricing={data} />
          </Grid>
        ))}
      </AppGridContainer>
    </AppCard>
  );
};

export default PackageTwo;

PackageTwo.propTypes = {
  pricing: PropTypes.array,
};
