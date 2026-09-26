import React , {useState, useEffect} from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { Form } from 'formik';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from '@crema/mockapi';
import BasicDatePicker from '../../../muiComponents/lab/DatePicker/BasicDatePicker';
import { parse } from 'date-fns';

const convertToLocalDate = (dateString) => {
  if (!dateString) return null; // Verifica que la cadena no esté vacía
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return date instanceof Date && !isNaN(date) ? date : null; // Asegura que sea válida
};

const InfoForm = ({ values, setFieldValue, selectedRow }) => {

  // console.log(selectedRow.fecha_nacimiento);
  return (
    <Form autoComplete='off'>
      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              '& .MuiTextField-root': {
                width: '100%',
              },
            }}
          >
            <BasicDatePicker
              label={<IntlMessages id="common.birthDate" />}
              value={selectedRow.fecha_nacimiento}
              onChange={(newValue) => {
                setFieldValue('fecha_nacimiento', newValue); // Actualiza el valor en Formik
              }}
            />            
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
        <Autocomplete
                id='country-select-demo'
                fullWidth
                options={countries}
                name='country' 
                variant="standard"
                value={values.country}
                onChange={(_, newValue) => {
                  setFieldValue('country', newValue);
                }}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component='li'
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading='lazy'
                      width='20'
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=''
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                   variant="standard"
                     {...params}
                    label={<IntlMessages id='common.country' />}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                      variant: "standard"
                    }}
                  />
                )}
              />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            fullWidth
            name='telefono'
            variant="standard"
            label={<IntlMessages id='common.phoneNumber' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              type='submit'
            >
              <IntlMessages id='common.saveChanges' />
            </Button>
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
                ml: 2.5,
              }}
              color='primary'
              variant='outlined'
              type='cancel'
            >
              <IntlMessages id='common.cancel' />
            </Button>
          </Box>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

export default InfoForm;
InfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
