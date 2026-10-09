// Exporta filas a un archivo .xlsx (lo usa AppCrudTable para todas las listas).
// La librería se carga solo al exportar, para no pesar en el arranque de la aplicación.

// Valor de la celda: los números van como número (para poder sumarlos en Excel); el resto, con el
// mismo texto que muestra la tabla.
const valorDe = (columna, fila) => {
  const crudo = fila[columna.id];
  if (columna.typeHead === 'numeric' && crudo !== null && crudo !== undefined && crudo !== '' && Number.isFinite(Number(crudo))) {
    return Number(crudo);
  }
  const mostrado = columna.value ? columna.value(crudo, fila) : crudo;
  return typeof mostrado === 'string' || typeof mostrado === 'number' ? mostrado : (crudo ?? '');
};

// Nombre de hoja válido para Excel: sin \ / ? * [ ] : y máximo 31 caracteres.
const nombreHoja = (nombre) => nombre.replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) || 'Datos';

/**
 * @param {string} nombre     Título de la lista: nombre de la hoja y del archivo.
 * @param {Array}  columnas   Columnas de la tabla: { id, label, typeHead, value(valor, fila) }.
 * @param {Array}  filas      Registros tal como llegan del backend.
 */
export const exportarExcel = async ({ nombre, columnas, filas }) => {
  const modulo = await import('exceljs/dist/exceljs.min.js');
  const ExcelJS = modulo.default ?? modulo;
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet(nombreHoja(nombre));

  const datos = filas.map((fila) => columnas.map((columna) => valorDe(columna, fila)));
  hoja.columns = columnas.map((columna, i) => ({
    header: columna.label,
    key: String(columna.id),
    // Ancho según el contenido, entre 10 y 50 caracteres.
    width: Math.min(50, Math.max(10, String(columna.label).length + 2, ...datos.slice(0, 500).map((d) => String(d[i] ?? '').length + 2))),
    style: columna.typeHead === 'numeric' ? { numFmt: '#,##0.##' } : {},
  }));
  hoja.addRows(datos);

  const encabezado = hoja.getRow(1);
  encabezado.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  encabezado.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D6F42' } };
  hoja.views = [{ state: 'frozen', ySplit: 1 }];
  if (columnas.length > 0) {
    hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columnas.length } };
  }

  const contenido = await libro.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([contenido], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const enlace = document.createElement('a');
  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  enlace.href = url;
  enlace.download = `${nombre.replace(/[\\/:*?"<>|]/g, ' ').trim() || 'Datos'} ${fecha}.xlsx`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
};

export default exportarExcel;
