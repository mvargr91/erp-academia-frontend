import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { allowMultiLanguage } from '@crema/constants/AppConst';
import PropTypes from 'prop-types';

const InjectMassage = (props) => {
  if (!props.id) {
    console.error("El id no está definido en InjectMassage");
    return null;
  }

  if (allowMultiLanguage) {
    return <FormattedMessage id={props.id} defaultMessage="Texto de prueba" {...props} />;
  } else {
    return props.id.split('.').pop();
  }
};


InjectMassage.propTypes = {
  id: PropTypes.string, 
};

export default injectIntl(InjectMassage, {
  forwardRef: false,
});
