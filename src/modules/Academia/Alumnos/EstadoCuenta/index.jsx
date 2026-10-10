// Estado de cuenta de un alumno: lo que debe (cursos y paquetes), lo que ha pagado,
// su historial de pagos y el acceso directo para registrar un pago o condonar una deuda.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import { useSedes } from '../../../../shared/sedes';
import { METODOS_PAGO, nombreDe, formatoMoneda } from '../../../../shared/constants/Academia';

const sombra = { boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)', height: '100%' };
const fecha = (iso) => (iso ? iso.split('-').reverse().join('/') : '—');

const Total = ({ titulo, valor, color, detalle }) => (
  <Card sx={sombra}>
    <CardContent>
      <Typography variant='body2' color='text.secondary'>
        {titulo}
      </Typography>
      <Typography variant='h3' sx={{ fontWeight: 'bold', color }}>
        {valor}
      </Typography>
      {detalle && (
        <Typography variant='caption' color='text.secondary'>
          {detalle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

Total.propTypes = {
  titulo: PropTypes.string.isRequired,
  valor: PropTypes.string.isRequired,
  color: PropTypes.string,
  detalle: PropTypes.string,
};

const EstadoCuenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { variasSedes } = useSedes();
  const { permisos: permisosPagos } = usePermisosOpcion('/pagos');
  const puedePagar = (permisosPagos ?? []).indexOf('Crear') >= 0;
  // Condonar (perdonar la deuda sin recibir dinero) es un permiso aparte de registrar pagos.
  const puedeCondonar = (permisosPagos ?? []).indexOf('Condonar') >= 0;
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  // Deuda que se está condonando: { destino: {curso_id | paquete_id}, concepto, saldo, motivo }
  const [condonar, setCondonar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cargar = () =>
    jwtAxios
      .get(`alumnos/${id}/estado-cuenta`)
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudo cargar el estado de cuenta del alumno.'));

  useEffect(() => {
    setDatos(null);
    cargar();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const enviar = (peticion) => {
    setEnviando(true);
    setAviso(null);
    peticion
      .then(({ data }) => {
        setAviso({ tipo: 'success', texto: data.mensajes[0] });
        setCondonar(null);
        return cargar();
      })
      .catch((e) => setAviso({ tipo: 'error', texto: e?.response?.data?.mensajes?.[0] ?? 'No se pudo completar la operación.' }))
      .finally(() => setEnviando(false));
  };
  const confirmarCondonar = () =>
    enviar(jwtAxios.post('condonaciones', { alumno_id: id, ...condonar.destino, motivo: condonar.motivo.trim() }));
  const deshacer = (c) => {
    if (window.confirm(`¿Deshacer la condonación de ${formatoMoneda(c.valor)}? Ese valor vuelve al saldo del alumno.`)) {
      enviar(jwtAxios.delete(`condonaciones/${c.id}`));
    }
  };

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }
  if (!datos) return <LinearProgress />;

  const { alumno, resumen, cursos, paquetes, pagos, condonaciones = [] } = datos;

  // Abre el formulario de pagos con el alumno (y el curso o paquete) ya elegidos; al guardar vuelve aquí.
  const registrarPago = (extra = {}) => {
    const query = new URLSearchParams({ alumno: alumno.id, volver: `/alumnos/${alumno.id}/cuenta` });
    Object.entries(extra).forEach(([clave, valor]) => valor && query.set(clave, valor));
    navigate(`/pagos/crear?${query.toString()}`);
  };

  // Sin saldo por pagar el botón queda deshabilitado (el span permite mostrar el motivo).
  const botonPagar = (extra, saldo) =>
    puedePagar && (
      <Tooltip title={saldo > 0 ? '' : 'Está al día: no tiene saldo por pagar'}>
        <span>
          <Button
            size='small'
            variant='outlined'
            startIcon={<PaymentsIcon />}
            disabled={!(saldo > 0)}
            onClick={() => registrarPago(extra)}
          >
            {saldo > 0 ? 'Pagar' : 'Al día'}
          </Button>
        </span>
      </Tooltip>
    );

  const botonCondonar = (destino, concepto, saldo) =>
    puedeCondonar &&
    saldo > 0 && (
      <Button
        size='small'
        color='warning'
        startIcon={<MoneyOffIcon />}
        sx={{ ml: 1 }}
        onClick={() => setCondonar({ destino, concepto, saldo, motivo: '' })}
      >
        Condonar
      </Button>
    );

  return (
    <Box>
      {aviso && (
        <Alert severity={aviso.tipo} sx={{ mb: 2 }} onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}
      <Dialog open={Boolean(condonar)} onClose={() => !enviando && setCondonar(null)} maxWidth='xs' fullWidth>
        <DialogTitle>Condonar deuda</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Se condonan <strong>{formatoMoneda(condonar?.saldo ?? 0)}</strong> de {condonar?.concepto}. El saldo queda en 0 y no se
            registra ningún pago.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={2}
            label='Motivo'
            value={condonar?.motivo ?? ''}
            onChange={(e) => setCondonar({ ...condonar, motivo: e.target.value })}
            inputProps={{ maxLength: 255 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCondonar(null)} disabled={enviando}>
            Cancelar
          </Button>
          <Button color='warning' variant='contained' onClick={confirmarCondonar} disabled={enviando || !condonar?.motivo.trim()}>
            Condonar
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/alumnos')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            Estado de cuenta · {alumno.nombre}
          </Typography>
          <Typography color='text.secondary'>
            {[alumno.documento, alumno.telefono, alumno.correo].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
          </Typography>
        </Box>
        {puedePagar && (
          <Button variant='contained' startIcon={<PaymentsIcon />} onClick={() => registrarPago()}>
            Registrar pago
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={4}>
          <Total
            titulo='Debe hoy'
            valor={formatoMoneda(resumen.saldo_pendiente)}
            color={resumen.saldo_pendiente > 0 ? 'error.main' : 'text.primary'}
            detalle={
              resumen.saldo_paquetes > 0
                ? `Cursos ${formatoMoneda(resumen.saldo_cursos)} · Paquetes ${formatoMoneda(resumen.saldo_paquetes)}`
                : resumen.saldo_pendiente > 0
                  ? 'Saldo de sus cursos'
                  : 'Está al día'
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Total
            titulo='Ha pagado'
            valor={formatoMoneda(resumen.total_pagado)}
            detalle={resumen.ultimo_pago ? `Último pago: ${fecha(resumen.ultimo_pago)}` : 'Aún no registra pagos'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Total
            titulo='Saldo a favor'
            valor={formatoMoneda(resumen.saldo_a_favor)}
            detalle={resumen.saldo_a_favor > 0 ? 'Pagó de más en algún curso' : 'Sin saldo a favor'}
          />
        </Grid>
      </Grid>

      <Card sx={{ ...sombra, height: 'auto', mt: 2 }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Cursos
          </Typography>
          {cursos.length === 0 ? (
            <Typography color='text.secondary'>No está matriculado en ningún curso.</Typography>
          ) : (
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Curso</TableCell>
                    {variasSedes && <TableCell>Sede</TableCell>}
                    <TableCell>Paga por</TableCell>
                    <TableCell>Matrícula</TableCell>
                    <TableCell align='right'>Cobrado</TableCell>
                    <TableCell align='right'>Pagado</TableCell>
                    <TableCell align='right'>Debe</TableCell>
                    <TableCell>Último pago</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cursos.map((c) => (
                    <TableRow key={c.curso_alumno_id} hover>
                      <TableCell>
                        {c.curso}
                      </TableCell>
                      {variasSedes && <TableCell>{c.sede}</TableCell>}
                      <TableCell>
                        {!c.curso_activo && <Chip size='small' color='warning' label='Curso inactivo' sx={{ ml: 1 }} />}
                        {c.clases_ciclo && c.curso_activo && (
                          <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                            Clase {c.clases_consumidas} de {c.clases_ciclo} · renueva {fecha(c.proximo_pago)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(c.fecha_matricula)}</TableCell>
                      <TableCell align='right'>{formatoMoneda(Math.max(c.cobrado, 0))}</TableCell>
                      <TableCell align='right'>{formatoMoneda(c.pagado)}</TableCell>
                      <TableCell align='right' sx={{ fontWeight: 'bold', color: c.saldo > 0 ? 'error.main' : 'text.primary' }}>
                        {c.saldo < 0 ? `${formatoMoneda(-c.saldo)} a favor` : formatoMoneda(c.saldo)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(c.ultima_fecha_pago)}</TableCell>
                      <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                        {botonPagar({ curso: c.curso_id, monto: c.saldo }, c.saldo)}
                        {botonCondonar({ curso_id: c.curso_id }, c.curso, c.saldo)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {paquetes.length > 0 && (
        <Card sx={{ ...sombra, height: 'auto', mt: 2 }}>
          <CardContent>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
              Paquetes de clases
            </Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Paquete</TableCell>
                    <TableCell>Compra</TableCell>
                    <TableCell>Vence</TableCell>
                    <TableCell align='right'>Valor</TableCell>
                    <TableCell align='right'>Pagado</TableCell>
                    <TableCell align='right'>Debe</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paquetes.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        #{p.id} · {p.plan} · {p.clases_total} clases
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(p.fecha_compra)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{p.fecha_vencimiento ? fecha(p.fecha_vencimiento) : 'No vence'}</TableCell>
                      <TableCell align='right'>{formatoMoneda(p.valor)}</TableCell>
                      <TableCell align='right'>{formatoMoneda(p.pagado)}</TableCell>
                      <TableCell align='right' sx={{ fontWeight: 'bold', color: p.saldo > 0 ? 'error.main' : 'text.primary' }}>
                        {formatoMoneda(p.saldo)}
                      </TableCell>
                      <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                        {botonPagar({ paquete: p.id, monto: p.saldo }, p.saldo)}
                        {botonCondonar({ paquete_id: p.id }, `el paquete #${p.id} · ${p.plan}`, p.saldo)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Card sx={{ ...sombra, height: 'auto', mt: 2 }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Pagos registrados
          </Typography>
          {pagos.length === 0 ? (
            <Typography color='text.secondary'>Aún no registra pagos.</Typography>
          ) : (
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Concepto</TableCell>
                    {variasSedes && <TableCell>Sede</TableCell>}
                    <TableCell>Método</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell align='right'>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagos.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(p.fecha_pago)}</TableCell>
                      <TableCell>{p.concepto}</TableCell>
                      {variasSedes && <TableCell>{p.sede}</TableCell>}
                      <TableCell>{nombreDe(METODOS_PAGO, p.metodo_pago)}</TableCell>
                      <TableCell>{p.referencia}</TableCell>
                      <TableCell align='right'>{formatoMoneda(p.monto)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={variasSedes ? 5 : 4} align='right' sx={{ fontWeight: 'bold' }}>
                      Total pagado
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                      {formatoMoneda(resumen.total_pagado)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {condonaciones.length > 0 && (
        <Card sx={{ ...sombra, height: 'auto', mt: 2 }}>
          <CardContent>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
              Deudas condonadas · {formatoMoneda(resumen.total_condonado)}
            </Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Concepto</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Autorizó</TableCell>
                    <TableCell align='right'>Valor</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {condonaciones.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(c.fecha)}</TableCell>
                      <TableCell>{c.concepto}</TableCell>
                      <TableCell>{c.motivo}</TableCell>
                      <TableCell>{c.usuario}</TableCell>
                      <TableCell align='right'>{formatoMoneda(c.valor)}</TableCell>
                      <TableCell align='right'>
                        {puedeCondonar && (
                          <Button size='small' disabled={enviando} onClick={() => deshacer(c)}>
                            Deshacer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EstadoCuenta;
