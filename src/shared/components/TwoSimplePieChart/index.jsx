// src/components/TwoSimplePieChart.jsx
import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { formatCurrency } from '../../hooks/formatCurrency';

// Función para generar un color hexadecimal aleatorio
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TwoSimplePieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        dataKey="valor_saldo_actual"
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        nameKey="name"
        label={({ name, value }) => `${name}: ${formatCurrency(value)}`} // Etiquetas con formato moneda
      >
        {/* Asignar un color aleatorio a cada sector del gráfico */}
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getRandomColor()} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value) => formatCurrency(value)} // Formatea el valor como moneda
      />
      {/* Agregar leyenda debajo del gráfico */}
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
);

export default TwoSimplePieChart;
