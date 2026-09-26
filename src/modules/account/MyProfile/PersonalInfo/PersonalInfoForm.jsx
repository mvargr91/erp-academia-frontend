import React, { useEffect, useState } from 'react';
import { alpha, Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useDropzone } from 'react-dropzone';
import { Form } from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { Fonts } from '@crema/constants/AppEnums';
import MyAutocomplete from '../../../../shared/components/MyAutoCompleteRol';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,   
    height: '60px',
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: '#1d83f3',
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: '#1d83f3',
  },
  btnSecundary: {
    backgroundColor: 'gray',
  },
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
}));


const PersonalInfoForm = (props) => {
  const { values, initialValues, roles, usuario } = props;

  const classes = useStyles(props);
  return (
    <Form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 4 },
        }}
      >
        <IntlMessages id='common.personalInfo' />
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { xs: 5, lg: 6 },
        }}
      >        
        <Box
          sx={{
            ml: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: Fonts.MEDIUM,
            }}
          >
            {values.displayName}
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {values.email}
          </Typography>
        </Box>
      </Box>
      <AppGridContainer spacing={4}>
        <AppTextField
          sx={{
            display: 'none', // Oculta el campo
          }}
          name='id'
          fullWidth
          label={<IntlMessages id='common.id' />}
        />
        <Grid item xs={12} md={6}>
          <AppTextField
            variant="standard"
            name='nombre'
            fullWidth
            label={<IntlMessages id='common.fullName' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            fullWidth
            variant="standard"
            disabled={true}
            name='identificacion_usuario'
            label={<IntlMessages id='common.identificacion_usuario' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            variant="standard"
            name='correo_electronico'
            fullWidth
            label={<IntlMessages id='common.email' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
            <MyAutocomplete
              options={roles}
              name='rol_id'
              inputValue={usuario?.usuario.rol.id}
              label='Rol'
              disabled={true}            
              className={classes.myTextField}
              required
              fullWidth
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

export default PersonalInfoForm;
PersonalInfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
};
