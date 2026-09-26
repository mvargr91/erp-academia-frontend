// src/components/AudienceChart.jsx
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RADIAN = Math.PI / 180;

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

const AudienceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy={150}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={100}
        dataKey="valor_saldo_actual"
      >
        {/* Asignar un color aleatorio a cada segmento del gráfico */}
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getRandomColor()} />
        ))}
      </Pie>
      <Tooltip />
      {/* Agregar la leyenda debajo del gráfico y mostrar el nombre de la entidad */}
      <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => entry.payload.entidad} />
    </PieChart>
  </ResponsiveContainer>
);

export default AudienceChart;
