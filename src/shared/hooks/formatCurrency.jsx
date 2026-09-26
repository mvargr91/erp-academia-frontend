  export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0
    }).format(value);
  };

  export const CurrencyDecimal = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 2
    }).format(value);
  };

  export const formatCurrencyDecimal = (value) => {
      return value.toString().replace('.', ',');
  };

  export const formatCurrencyDecimalsinComa = (value) => {
      return value.toString().replace(',', '.');
  };

  const convertCommaToDot = (value) => {
    return value ? value.replace(',', '.') : value;
  };

  export const  unformatNumber = (value) => {
    if (!value) return '';
    // Usa /\./g para reemplazar todos los puntos en la cadena
    return value.toString().replace(/\./g, '');
  };