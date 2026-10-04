import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/clasesPrivadas/clasesPrivadasSlice';
import { onGetColeccionLigera as onGetProfesores } from '../../../@crema/redux/features/profesores/profesoresSlice';

const COLORES = { programada: '#1A73E8', realizada: 'green', cancelada: 'gray' };

const columnas = (variasSedes) => [
  { id: 'fecha', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'hora', typeHead: 'string', label: 'Hora', value: (v, row) => `${v} (${row.duracion_min} min)`, align: 'left', mostrarInicio: true, ordenable: false },
  celdaSede(variasSedes),
  { id: 'alumnos_nombres', typeHead: 'string', label: 'Alumno(s)', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'profesor_nombre', typeHead: 'string', label: 'Profesor', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  {
    id: 'estado_nombre',
    typeHead: 'string',
    label: 'Estado',
    value: (v) => v,
    cellColor: (_v, row) => COLORES[row?.estado] ?? '',
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  ...auditCells,
];

const ClasesPrivadas = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const dispatch = useDispatch();
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();
  const { coleccionLigera: profesores } = useSelector((s) => s.profesores);

  useEffect(() => {
    dispatch(onGetProfesores());
  }, [dispatch]);

  const filtrosConfig = [
    { name: 'fecha_desde', label: 'Desde', type: 'date' },
    { name: 'fecha_hasta', label: 'Hasta', type: 'date' },
    { name: 'profesor_id', label: 'Profesor', type: 'select', options: profesores ?? [] },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { id: 'programada', nombre: 'Programada' },
        { id: 'realizada', nombre: 'Realizada' },
        { id: 'cancelada', nombre: 'Cancelada' },
      ],
    },
  ];

  return (
    <AppCrudTable
      stateKey='clasesPrivadas'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Cada alumno descuenta 1 clase de su paquete si asiste, no asiste o cancela con menos de 24 horas.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Clase'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
      accionesExtra={[
        {
          titulo: 'Registrar asistencia',
          icono: HowToRegIcon,
          permiso: 'Modificar',
          color: 'green',
          onClick: (row) => navigate(`${route.path}/${row.id}/registrar`),
        },
      ]}
    />
  );
};

ClasesPrivadas.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default ClasesPrivadas;
