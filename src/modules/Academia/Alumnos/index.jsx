import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TableViewIcon from '@mui/icons-material/TableView';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImportarCorrecciones from './ImportarCorrecciones';
import { descargarArchivo } from '../../../shared/functions/Archivos';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/alumnos/alumnosSlice';
import { valorActivo, colorActivo, formatoMoneda } from '../../../shared/constants/Academia';

// Qué toma el alumno: se deduce de sus matrículas activas y de sus inscripciones a vacacionales.
const TIPOS = [
  { id: 'cursos', nombre: 'Cursos regulares' },
  { id: 'vacacionales', nombre: 'Vacacionales' },
  { id: 'ambos', nombre: 'Ambos' },
  { id: 'sin_cursos', nombre: 'Sin cursos' },
];
const COLORES_TIPO = { cursos: '#2E75B6', vacacionales: '#7C4DFF', ambos: 'green', sin_cursos: 'gray' };

const columnas = (variasSedes) => [
  { id: 'nombres', typeHead: 'string', label: 'Nombres', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'apellidos', typeHead: 'string', label: 'Apellidos', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'documento', typeHead: 'string', label: 'Documento', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'telefono', typeHead: 'string', label: 'Teléfono', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  celdaSede(variasSedes),
  {
    id: 'tipo',
    typeHead: 'string',
    label: 'Tipo',
    value: (v) => TIPOS.find((t) => t.id === v)?.nombre ?? '',
    cellColor: (v) => COLORES_TIPO[v] ?? '',
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  {
    id: 'saldo_pendiente',
    typeHead: 'numeric',
    label: 'Debe',
    value: (v) => formatoMoneda(v ?? 0),
    align: 'right',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'correo', typeHead: 'string', label: 'Correo', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: false },
  ...auditCells,
];

const filtrosConfig = [
  { name: 'nombre', label: 'Nombre completo', type: 'text' },
  { name: 'tipo', label: 'Tipo', type: 'select', options: TIPOS },
];

const Alumnos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [subiendo, setSubiendo] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='alumnos'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Alumno'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
        botonesExtra={[
          {
            // Excel de validación: alumnos por curso, lo que debe cada uno, paquetes, vacacionales y sin curso.
            titulo: 'Descargar alumnos por curso y deuda',
            icono: TableViewIcon,
            permiso: 'Exportar',
            color: '#B45309',
            mensajeError: 'No se pudo generar el Excel de alumnos por curso. Inténtalo de nuevo.',
            onClick: () =>
              descargarArchivo(
                'alumnos/exportar-por-curso',
                `alumnos-por-curso-${new Date().toISOString().slice(0, 10)}.xlsx`,
              ),
          },
          {
            // Devuelve ese mismo Excel con correcciones: pareja, valor especial, retiros y nuevas matrículas.
            titulo: 'Subir correcciones',
            icono: UploadFileIcon,
            permiso: 'ImportarCorrecciones',
            color: '#0369A1',
            onClick: () => setSubiendo(true),
          },
        ]}
        accionesExtra={[
          {
            titulo: 'Estado de cuenta y pagos',
            icono: AccountBalanceWalletIcon,
            permiso: 'EstadoCuenta',
            onClick: (row) => navigate(`${route.path}/${row.id}/cuenta`),
          },
        ]}
      />
      <ImportarCorrecciones abierto={subiendo} onCerrar={() => setSubiendo(false)} onAplicado={updateColeccion} />
    </>
  );
};

Alumnos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Alumnos;
