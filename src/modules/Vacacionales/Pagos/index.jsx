// Pagos de vacacionales (solo consulta): se registran y se quitan desde la inscripción.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion } from '../../../@crema/redux/features/vacacionales/vacacionalPagosSlice';
import { METODOS_PAGO, nombreDe, formatoMoneda } from '../../../shared/constants/Academia';

const texto = { typeHead: 'string', value: (v) => v, align: 'left', ordenable: false };

const columnas = (variasSedes) => [
  { id: 'alumno_nombre', label: 'Alumno', ...texto, mostrarInicio: true },
  { id: 'curso_nombre', label: 'Curso vacacional', ...texto, mostrarInicio: true },
  celdaSede(variasSedes),
  { id: 'monto', label: 'Monto', ...texto, typeHead: 'numeric', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'fecha_pago', label: 'Fecha de pago', ...texto, mostrarInicio: true },
  { id: 'metodo_pago', label: 'Método', ...texto, value: (v) => nombreDe(METODOS_PAGO, v), mostrarInicio: true },
  { id: 'referencia', label: 'Referencia', ...texto, mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [
  { name: 'nombre', label: 'Alumno', type: 'text' },
  { name: 'desde', label: 'Desde', type: 'date' },
  { name: 'hasta', label: 'Hasta', type: 'date' },
];

const VacacionalPagos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='vacacionalPagos'
      onGetColeccion={onGetColeccion}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Solo pagos de vacacionales. Se registran desde Inscripciones, con «Registrar pago».'
      urlAyuda={urlAyuda}
      // Solo consulta y exporte: aquí no se crea, modifica ni elimina.
      permisos={permisos.filter((p) => ['Listar', 'Exportar', 'VerInscripcion'].includes(p))}
      entidadNombre='Pago'
      refreshKey={refreshKey}
      defaultOrderBy=''
      accionesExtra={[
        {
          titulo: 'Ver pagos de la inscripción',
          icono: ReceiptLongIcon,
          permiso: 'VerInscripcion',
          onClick: (row) => navigate(`/vacacionales-inscripciones/${row.inscripcion_id}/pago?volver=${route.path}`),
        },
      ]}
    />
  );
};

VacacionalPagos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalPagos;
