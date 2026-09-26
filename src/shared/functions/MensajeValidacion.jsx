import saMessages from '@crema/services/localization/entries/es_ES';
const mensajeValidacion = (type, cant = 0) => {
  switch (type) {
    case 'max':
      return (
        saMessages.messages['validacion.max1'] +
        cant +
        saMessages.messages['validacion.max2']
      );
    case 'min':
      return (
        saMessages.messages['validacion.min1'] +
        cant +
        saMessages.messages['validacion.min2']
      );
    case 'numero':
      return saMessages.messages['validacion.numero'];
    case 'telefono':
      return saMessages.messages['validacion.telefono'];
    case 'documento':
      return saMessages.messages['validacion.documento'];
    default:
      return '';
  }
};

export default mensajeValidacion;
