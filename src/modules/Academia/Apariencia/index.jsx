// Configuración → Apariencia: colores del ERP, logos, pantalla de ingreso y modo por defecto
// de la academia. Los cambios se ven en la vista previa y se aplican a todos al guardar.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import { extraerMensajeError } from '../../../@crema/redux/helpers/createCrudSlice';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { useApariencia } from '../../../shared/apariencia';
import {
  APARIENCIA_DEFECTO,
  CONTRASTE_MINIMO,
  LOGO_DEFECTO,
  LOGO_OSCURO_DEFECTO,
  MODO_CLARO,
  MODO_OSCURO,
  contrasteConBlanco,
  esColor,
} from '../../../shared/apariencia/tema';
import fondoLoginDefecto from '../../../assets/fondo/247.jpg';
import VistaPrevia from './VistaPrevia';

const sombra = { boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };

const COLORES = [
  ['color_primario', 'Color principal', 'Botones, enlaces y elementos resaltados.'],
  ['color_menu', 'Color del menú', 'Menú lateral y títulos de la cabecera.'],
  ['color_acento', 'Color de acento', 'Opción activa del menú y filtros.'],
];

const COMBINACIONES = [
  { nombre: 'Azul', color_primario: '#00A1CC', color_menu: '#1C4A59', color_acento: '#00A1CC' },
  { nombre: 'Violeta', color_primario: '#7B3FE4', color_menu: '#2A1B4D', color_acento: '#B061FF' },
  { nombre: 'Rojo', color_primario: '#D32F2F', color_menu: '#3A1414', color_acento: '#F0564A' },
  { nombre: 'Verde', color_primario: '#2E8B57', color_menu: '#173B2A', color_acento: '#3FAE73' },
  { nombre: 'Naranja', color_primario: '#E8590C', color_menu: '#3D2314', color_acento: '#F7822F' },
  { nombre: 'Rosa', color_primario: '#D6336C', color_menu: '#40152A', color_acento: '#F06595' },
  { nombre: 'Grafito', color_primario: '#37474F', color_menu: '#1F2933', color_acento: '#607D8B' },
];

// campo => [título, ayuda, imagen por defecto, peso máximo en MB, fondo de la miniatura]
const IMAGENES = {
  logo: ['Logo', 'Se muestra en la cabecera y en la pantalla de ingreso. PNG con fondo transparente recomendado.', LOGO_DEFECTO, 2, '#FFFFFF'],
  logo_oscuro: ['Logo para modo oscuro', 'Opcional: versión clara del logo para fondos oscuros. Si no se sube, se usa el logo normal.', LOGO_OSCURO_DEFECTO, 2, '#1E2530'],
  login_fondo: ['Imagen de fondo', 'Cubre toda la pantalla de ingreso. Horizontal, de al menos 1600 px de ancho.', fondoLoginDefecto, 5, '#FFFFFF'],
};
const FORMATOS = ['image/png', 'image/jpeg', 'image/webp'];
const SIN_IMAGENES = { logo: null, logo_oscuro: null, login_fondo: null };

const camposDe = (apariencia) =>
  Object.fromEntries(Object.keys(APARIENCIA_DEFECTO).filter((c) => !c.endsWith('_url') && c !== 'nombre').map((c) => [c, apariencia[c] ?? '']));

const CampoColor = ({ etiqueta, ayuda, valor, onChange, disabled }) => {
  const valido = esColor(valor);
  const pocoContraste = valido && contrasteConBlanco(valor) < CONTRASTE_MINIMO;
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component='input'
          type='color'
          aria-label={etiqueta}
          value={valido ? valor : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          disabled={disabled}
          sx={{ width: 44, height: 40, p: 0, border: 'none', background: 'none', cursor: disabled ? 'default' : 'pointer', flexShrink: 0 }}
        />
        <Tooltip title={ayuda ?? ''} placement='top-start'>
          <TextField
            variant='standard'
            fullWidth
            label={etiqueta}
            value={valor}
            onChange={(e) => onChange(e.target.value.trim().toUpperCase())}
            disabled={disabled}
            error={!valido}
            helperText={!valido ? 'Formato #RRGGBB' : pocoContraste ? 'Muy claro: el texto encima se verá oscuro.' : ''}
            inputProps={{ maxLength: 7, spellCheck: false }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

CampoColor.propTypes = {
  etiqueta: PropTypes.string.isRequired,
  ayuda: PropTypes.string,
  valor: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const CampoImagen = ({ campo, vista, personalizada, onElegir, onQuitar, disabled }) => {
  const input = useRef(null);
  const [titulo, ayuda, , maxMB, fondo] = IMAGENES[campo];
  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
      <Box
        component='img'
        src={vista}
        alt=''
        sx={{
          width: 132,
          height: 76,
          objectFit: campo === 'login_fondo' ? 'cover' : 'contain',
          p: campo === 'login_fondo' ? 0 : 1,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: fondo,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography variant='h5'>{titulo}</Typography>
        <Typography variant='body2' color='text.secondary'>{ayuda}</Typography>
        <Typography variant='caption' color='text.secondary'>PNG, JPG o WEBP · máximo {maxMB} MB</Typography>
      </Box>
      {!disabled && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant='outlined' size='small' startIcon={<UploadFileIcon />} onClick={() => input.current?.click()}>
            {personalizada ? 'Cambiar' : 'Subir'}
          </Button>
          {personalizada && (
            <Button size='small' color='inherit' onClick={onQuitar}>Quitar</Button>
          )}
        </Box>
      )}
      <input
        ref={input}
        type='file'
        hidden
        accept={FORMATOS.join(',')}
        onChange={(e) => {
          onElegir(e.target.files?.[0] ?? null);
          e.target.value = ''; // permite volver a elegir el mismo archivo
        }}
      />
    </Box>
  );
};

CampoImagen.propTypes = {
  campo: PropTypes.string.isRequired,
  vista: PropTypes.string.isRequired,
  personalizada: PropTypes.bool,
  onElegir: PropTypes.func.isRequired,
  onQuitar: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const Seccion = ({ titulo, descripcion, children }) => (
  <Card sx={{ ...sombra, mb: 4 }}>
    <CardContent sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>{titulo}</Typography>
        {descripcion && <Typography variant='body1' color='text.secondary'>{descripcion}</Typography>}
      </Box>
      {children}
    </CardContent>
  </Card>
);

Seccion.propTypes = {
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  children: PropTypes.node,
};

const Apariencia = ({ route }) => {
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const { apariencia, aplicarApariencia } = useApariencia();
  const [campos, setCampos] = useState(() => camposDe(apariencia));
  const [archivos, setArchivos] = useState(SIN_IMAGENES); // File nuevo por imagen
  const [quitar, setQuitar] = useState({}); // imágenes que vuelven a la de por defecto
  const [guardando, setGuardando] = useState(false);
  const puedeEditar = permisos.includes('Modificar');

  // La apariencia llega del API después del primer render (o cambia al guardar/restaurar).
  useEffect(() => {
    setCampos(camposDe(apariencia));
    setArchivos(SIN_IMAGENES);
    setQuitar({});
  }, [apariencia]);

  const vistas = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(IMAGENES).map((campo) => [
          campo,
          archivos[campo] ? URL.createObjectURL(archivos[campo]) : (!quitar[campo] && apariencia[`${campo}_url`]) || null,
        ]),
      ),
    [archivos, quitar, apariencia],
  );
  useEffect(
    () => () => Object.values(vistas).forEach((url) => url?.startsWith('blob:') && URL.revokeObjectURL(url)),
    [vistas],
  );

  // Lo que se vería al guardar: alimenta la vista previa.
  const borrador = useMemo(
    () => ({
      ...apariencia,
      ...campos,
      logo_url: vistas.logo,
      logo_oscuro_url: vistas.logo_oscuro,
      login_fondo_url: vistas.login_fondo,
    }),
    [apariencia, campos, vistas],
  );

  const cambiar = (campo, valor) => setCampos((actual) => ({ ...actual, [campo]: valor }));

  const elegirImagen = (campo, archivo) => {
    if (!archivo) return;
    const maxMB = IMAGENES[campo][3];
    if (!FORMATOS.includes(archivo.type)) {
      Swal.fire({ icon: 'error', title: 'Formato no permitido', text: 'La imagen debe ser PNG, JPG o WEBP.' });
      return;
    }
    if (archivo.size > maxMB * 1048576) {
      Swal.fire({ icon: 'error', title: 'Imagen muy pesada', text: `No puede pesar más de ${maxMB} MB.` });
      return;
    }
    setArchivos((actual) => ({ ...actual, [campo]: archivo }));
    setQuitar((actual) => ({ ...actual, [campo]: false }));
  };

  const quitarImagen = (campo) => {
    setArchivos((actual) => ({ ...actual, [campo]: null }));
    setQuitar((actual) => ({ ...actual, [campo]: true }));
  };

  const coloresValidos = COLORES.every(([campo]) => esColor(campos[campo]));

  const guardar = async () => {
    const datos = new FormData();
    Object.entries(campos).forEach(([campo, valor]) => datos.append(campo, valor ?? ''));
    Object.keys(IMAGENES).forEach((campo) => {
      if (archivos[campo]) datos.append(campo, archivos[campo]);
      else if (quitar[campo]) datos.append(`quitar_${campo}`, '1');
    });
    setGuardando(true);
    try {
      const { data } = await jwtAxios.post('apariencia', datos, { headers: { 'Content-Type': 'multipart/form-data' } });
      aplicarApariencia(data.datos);
      Swal.fire({ icon: 'success', title: 'Apariencia guardada', text: 'Los demás usuarios verán los cambios al recargar la página.', timer: 3500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: extraerMensajeError(error) });
    } finally {
      setGuardando(false);
    }
  };

  const restaurar = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: 'Restaurar apariencia',
      text: 'Se quitarán los colores, logos, textos e imagen de ingreso de la academia y volverán los del sistema.',
      showCancelButton: true,
      confirmButtonText: 'Restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });
    if (!isConfirmed) return;
    setGuardando(true);
    try {
      const { data } = await jwtAxios.delete('apariencia');
      aplicarApariencia(data.datos);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'No se pudo restaurar', text: extraerMensajeError(error) });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: '20px' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h1' component='h1'>{titulo || 'Apariencia'}</Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          Colores, logo y pantalla de ingreso de la academia. Se aplican a todos los usuarios.
        </Typography>
      </Box>

      {cargado && !puedeEditar && (
        <Alert severity='info' sx={{ mb: 4 }}>Tu rol solo puede consultar la apariencia.</Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: 4, alignItems: 'start' }}>
        <Box>
          <Seccion titulo='Colores'>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {COMBINACIONES.map(({ nombre, ...colores }) => (
                <Button
                  key={nombre}
                  size='small'
                  variant='outlined'
                  color='inherit'
                  disabled={!puedeEditar}
                  onClick={() => setCampos((actual) => ({ ...actual, ...colores }))}
                  startIcon={
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: `linear-gradient(135deg, ${colores.color_primario} 50%, ${colores.color_menu} 50%)` }} />
                  }
                >
                  {nombre}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4 }}>
              {COLORES.map(([campo, etiqueta, ayuda]) => (
                <CampoColor
                  key={campo}
                  etiqueta={etiqueta}
                  ayuda={ayuda}
                  valor={campos[campo]}
                  onChange={(valor) => cambiar(campo, valor)}
                  disabled={!puedeEditar}
                />
              ))}
            </Box>
          </Seccion>

          <Seccion
            titulo='Modo por defecto'
            descripcion='Con cuál modo abre el ERP. Cada usuario puede cambiarlo con el botón de la cabecera y su elección se recuerda en su navegador.'
          >
            <ToggleButtonGroup
              exclusive
              size='small'
              color='primary'
              value={campos.modo}
              onChange={(_e, valor) => valor && cambiar('modo', valor)}
              disabled={!puedeEditar}
            >
              <ToggleButton value={MODO_CLARO}><LightModeOutlinedIcon fontSize='small' sx={{ mr: 1 }} />Claro</ToggleButton>
              <ToggleButton value={MODO_OSCURO}><DarkModeOutlinedIcon fontSize='small' sx={{ mr: 1 }} />Oscuro</ToggleButton>
            </ToggleButtonGroup>
          </Seccion>

          <Seccion titulo='Logo'>
            {['logo', 'logo_oscuro'].map((campo) => (
              <CampoImagen
                key={campo}
                campo={campo}
                vista={vistas[campo] || (campo === 'logo_oscuro' && vistas.logo) || IMAGENES[campo][2]}
                personalizada={Boolean(vistas[campo])}
                onElegir={(archivo) => elegirImagen(campo, archivo)}
                onQuitar={() => quitarImagen(campo)}
                disabled={!puedeEditar}
              />
            ))}
          </Seccion>

          <Seccion titulo='Pantalla de ingreso'>
            <CampoImagen
              campo='login_fondo'
              vista={vistas.login_fondo || IMAGENES.login_fondo[2]}
              personalizada={Boolean(vistas.login_fondo)}
              onElegir={(archivo) => elegirImagen('login_fondo', archivo)}
              onQuitar={() => quitarImagen('login_fondo')}
              disabled={!puedeEditar}
            />
            <TextField
              variant='standard'
              fullWidth
              label='Título de bienvenida (opcional)'
              value={campos.login_titulo}
              onChange={(e) => cambiar('login_titulo', e.target.value)}
              disabled={!puedeEditar}
              inputProps={{ maxLength: 80 }}
            />
            <TextField
              variant='standard'
              fullWidth
              label='Texto debajo del título (opcional)'
              value={campos.login_subtitulo}
              onChange={(e) => cambiar('login_subtitulo', e.target.value)}
              disabled={!puedeEditar}
              inputProps={{ maxLength: 160 }}
            />
            <Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>Posición del formulario</Typography>
              <ToggleButtonGroup
                exclusive
                size='small'
                color='primary'
                value={campos.login_posicion}
                onChange={(_e, valor) => valor && cambiar('login_posicion', valor)}
                disabled={!puedeEditar}
              >
                <ToggleButton value='izquierda'>Izquierda</ToggleButton>
                <ToggleButton value='centro'>Centro</ToggleButton>
                <ToggleButton value='derecha'>Derecha</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Seccion>
        </Box>

        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
          <Seccion titulo='Vista previa' descripcion='Así se verá al guardar.'>
            <VistaPrevia apariencia={borrador} fondoLogin={vistas.login_fondo || fondoLoginDefecto} />
          </Seccion>

          {puedeEditar && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
              <Button variant='outlined' color='inherit' startIcon={<RestartAltIcon />} onClick={restaurar} disabled={guardando}>
                Restaurar por defecto
              </Button>
              <Button
                variant='contained'
                startIcon={guardando ? <CircularProgress size={16} color='inherit' /> : <SaveIcon />}
                onClick={guardar}
                disabled={guardando || !coloresValidos}
                sx={{ px: 8 }}
              >
                Guardar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

Apariencia.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Apariencia;
