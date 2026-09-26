// src/components/MixBarChart.jsx
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../hooks/formatCurrency';

const MixBarChart = ({data}) => (
  <ResponsiveContainer width="90%" height={300}>
    <BarChart data={data} margin={{ top: 10, right: 30, left: 50, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        formatter={(value) => formatCurrency(value)} // Formatea el valor como moneda
      />
      <Legend />
      {/* <Bar dataKey="porcentaje_rentabilidad" fill="#82ca9d" name="Rentabilidad Calculada" /> */}
      <Bar dataKey="valor_saldo_actual" fill="#8884d8" name="Valor Portafolio" />
    </BarChart>
  </ResponsiveContainer>
);

export default MixBarChart;
