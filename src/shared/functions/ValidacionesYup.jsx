import { useEffect } from 'react';
import * as yup from 'yup';
import { slugify } from '../constants/Turismo';

const vacioANull = (valor, original) => (original === '' || original === null ? null : valor);

// Número opcional: '' se trata como null (los inputs de Formik entregan strings).
export const numeroOpcional = () =>
  yup.number().transform(vacioANull).nullable().typeError('Debe ser numérico');

export const enteroOpcional = () => numeroOpcional().integer('Debe ser un número entero');

export const numeroRequerido = () =>
  yup.number().transform(vacioANull).typeError('Debe ser numérico').required('Requerido');

export const enteroRequerido = () => numeroRequerido().integer('Debe ser un número entero');

export const slugRequerido = (max = 150) =>
  yup
    .string()
    .required('Requerido')
    .max(max, `Máximo ${max} caracteres`)
    .matches(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones');

export const fechaFinPosterior = () =>
  yup
    .string()
    .required('Requerido')
    .test('fecha-fin', 'Debe ser igual o posterior a la fecha de inicio', function (valor) {
      const { fecha_inicio: inicio } = this.parent;
      return !valor || !inicio || valor >= inicio;
    });

/**
 * En creación sugiere el slug a partir del nombre mientras el usuario escribe.
 * (MyTextField prioriza el onChange de Formik, por eso se resuelve con un efecto.)
 */
export const useSlugAutomatico = ({ accion, nombre, setFieldValue, campo = 'slug' }) => {
  useEffect(() => {
    if (accion === 'crear') {
      setFieldValue(campo, slugify(nombre ?? ''));
    }
  }, [accion, nombre]); // eslint-disable-line react-hooks/exhaustive-deps
};
