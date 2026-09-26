import React, { useEffect, useState } from 'react';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import PropTypes from 'prop-types';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import { Box } from '@mui/material';
import AppsFooter from '@crema/components/AppsContainer/AppsFooter';
import AppsPagination from '@crema/components/AppsPagination';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import ProductHeader from '../ProductHeader';
import ProductGrid from './ProductGrid';
import { VIEW_TYPE } from '../index';
import ProductList from './ProductList';

const ProductListing = ({ filterData, viewType, setViewType, setFilterData }) => {
  const [page, setPage] = useState(0);

  const [{ apiData: ecommerceList, loading }, { setQueryParams }] = useGetDataApi('/api/ecommerce/list', [], {}, false);

  const { list, total } = ecommerceList;

  useEffect(() => {
    setQueryParams({ page, filterData });
  }, [page, filterData]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setFilterData({ ...filterData, title });
  };
  return (
    <>
      <AppsHeader>
        <ProductHeader
          list={list}
          viewType={viewType}
          page={page}
          totalProducts={total}
          onPageChange={onPageChange}
          onSearch={searchProduct}
          setViewType={setViewType}
        />
      </AppsHeader>

      <AppsContent
        style={{
          backgroundColor: (theme) => theme.alpha(theme.palette.background.default, 0.6),
        }}
      >
        <Box
          sx={{
            width: '100%',
            flex: 1,
            display: 'flex',
            py: 2,
            px: 4,
            height: 1,
            '& > div': {
              width: '100%',
            },
          }}
        >
          {viewType === VIEW_TYPE.GRID ? (
            <ProductGrid ecommerceList={list} loading={loading} />
          ) : (
            <ProductList ecommerceList={list} loading={loading} />
          )}
        </Box>
      </AppsContent>
      <Box component="span" sx={{ display: { sm: 'none', xs: 'block' } }}>
        {list?.length > 0 ? (
          <AppsFooter>
            <AppsPagination count={total} rowsPerPage={10} page={page} onPageChange={onPageChange} />
          </AppsFooter>
        ) : null}
      </Box>
    </>
  );
};

export default ProductListing;
ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string,
  setViewType: PropTypes.func,
  setFilterData: PropTypes.func,
};
