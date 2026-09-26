// src/components/CustomPieChart.jsx
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

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={100}
        dataKey="valor_saldo_actual"
        nameKey="name"
      >
        {data.map((entry, index) => (
          // Asignar un color aleatorio a cada sector del gráfico
          <Cell key={`cell-${index}`} fill={getRandomColor()} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value) => formatCurrency(value)} // Formatea el valor como moneda
      />
      {/* Agregar leyenda debajo del gráfico */}
      <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => entry.payload.name} />
    </PieChart>
  </ResponsiveContainer>
);

export default CustomPieChart;
