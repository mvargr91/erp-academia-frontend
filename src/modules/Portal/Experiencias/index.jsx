// Listado de experiencias con filtros sincronizados en la URL (?texto=&destino=&categoria=&precio_min=&precio_max=&orden=&page=).
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { onGetColeccion } from '@crema/redux/features/portalExperiencias/portalExperienciasSlice';
import { onGetColeccion as onGetDestinos } from '@crema/redux/features/portalDestinos/portalDestinosSlice';
import { onGetColeccion as onGetCategorias } from '@crema/redux/features/portalCategorias/portalCategoriasSlice';
import { useDebounce } from '@crema/hooks/useDebounce';
import CategoryBar from '../../../shared/components/Portal/CategoryBar';
import ExperienceCard from '../../../shared/components/Portal/ExperienceCard';
import { GrillaCargando } from '../../../shared/components/Portal/Secciones';

const ORDENES = [
  { id: 'relevancia', nombre: 'Recomendadas' },
  { id: 'precio_asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio_desc', nombre: 'Precio: mayor a menor' },
  { id: 'calificacion', nombre: 'Mejor calificadas' },
  { id: 'recientes', nombre: 'Más recientes' },
];
const FILTROS = ['texto', 'destino', 'categoria', 'precio_min', 'precio_max', 'orden'];
const POR_PAGINA = 12;

const Experiencias = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { rows, total, ultima_pagina: ultimaPagina, loading } = useSelector((state) => state.portalExperiencias);
  const destinos = useSelector((state) => state.portalDestinos.rows);
  const categorias = useSelector((state) => state.portalCategorias.rows);

  const filtrosUrl = Object.fromEntries(FILTROS.map((f) => [f, searchParams.get(f) ?? '']));
  const pagina = Number(searchParams.get('page') || 1);
  // El texto se escribe local y se sincroniza con retardo para no consultar en cada tecla.
  const [texto, setTexto] = useState(filtrosUrl.texto);
  const textoDebounce = useDebounce(texto, 600);

  useEffect(() => {
    if (destinos.length === 0) dispatch(onGetDestinos());
    if (categorias.length === 0) dispatch(onGetCategorias());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (textoDebounce !== filtrosUrl.texto) cambiarFiltro('texto', textoDebounce);
  }, [textoDebounce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(onGetColeccion({ page: pagina, rowsPerPage: POR_PAGINA, filtros: filtrosUrl }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function cambiarFiltro(nombre, valor) {
    const nuevos = new URLSearchParams(searchParams);
    if (valor) nuevos.set(nombre, valor);
    else nuevos.delete(nombre);
    nuevos.delete('page');
    setSearchParams(nuevos);
  }

  const limpiar = () => {
    setTexto('');
    setSearchParams({});
  };

  const destinoActual = destinos.find((d) => d.slug === filtrosUrl.destino);
  const categoriaActual = categorias.find((c) => c.slug === filtrosUrl.categoria);

  return (
    <>
      <CategoryBar activa={filtrosUrl.categoria} />
      <Container maxWidth='lg' sx={{ py: 5 }}>
        <Typography variant='h2'>
          {categoriaActual?.nombre ?? 'Experiencias'}
          {destinoActual ? ` en ${destinoActual.nombre}` : ''}
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 3 }}>
          {total} resultado(s)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 100 } }}>
              <Stack spacing={2}>
                <TextField size='small' label='Buscar' value={texto} onChange={(e) => setTexto(e.target.value)} />
                <TextField select size='small' label='Destino' value={filtrosUrl.destino} onChange={(e) => cambiarFiltro('destino', e.target.value)}>
                  <MenuItem value=''>Todos</MenuItem>
                  {destinos.map((d) => <MenuItem key={d.id} value={d.slug}>{d.nombre}</MenuItem>)}
                </TextField>
                <TextField select size='small' label='Categoría' value={filtrosUrl.categoria} onChange={(e) => cambiarFiltro('categoria', e.target.value)}>
                  <MenuItem value=''>Todas</MenuItem>
                  {categorias.map((c) => <MenuItem key={c.id} value={c.slug}>{c.nombre}</MenuItem>)}
                </TextField>
                <Stack direction='row' spacing={1}>
                  <TextField size='small' type='number' label='Precio mín.' value={filtrosUrl.precio_min} onChange={(e) => cambiarFiltro('precio_min', e.target.value)} />
                  <TextField size='small' type='number' label='Precio máx.' value={filtrosUrl.precio_max} onChange={(e) => cambiarFiltro('precio_max', e.target.value)} />
                </Stack>
                <TextField select size='small' label='Ordenar por' value={filtrosUrl.orden || 'relevancia'} onChange={(e) => cambiarFiltro('orden', e.target.value)}>
                  {ORDENES.map((o) => <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>)}
                </TextField>
                <Button startIcon={<FilterAltOffIcon />} onClick={limpiar}>Limpiar filtros</Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {loading ? (
              <GrillaCargando cantidad={6} columnas={{ xs: 12, sm: 6, lg: 4 }} />
            ) : rows.length === 0 ? (
              <Paper sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant='h4'>No encontramos experiencias con esos filtros</Typography>
                <Button sx={{ mt: 2 }} onClick={limpiar}>Ver todas</Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {rows.map((exp) => (
                    <Grid item xs={12} sm={6} lg={4} key={exp.id}>
                      <ExperienceCard experiencia={exp} />
                    </Grid>
                  ))}
                </Grid>
                {ultimaPagina > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      color='primary'
                      count={ultimaPagina}
                      page={pagina}
                      onChange={(e, p) => {
                        const nuevos = new URLSearchParams(searchParams);
                        nuevos.set('page', p);
                        setSearchParams(nuevos);
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Experiencias;
