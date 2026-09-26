// src/components/CustomContentTreemap.jsx
import React, { Component } from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import PropTypes from 'prop-types';

const COLORS = [
  '#8889DD',
  '#9597E4',
  '#8DC77B',
  '#A5D297',
  '#E2CF45',
  '#F8C12D',
];

class CustomizedContent extends Component {
  render() {
    const { root, depth, x, y, width, height, index, colors, name } = this.props;

    // Solo mostrar el texto si el área del rectángulo es suficientemente grande.
    const isLargeEnough = width > 60 && height > 30;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[index % colors.length] : 'none',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && isLargeEnough && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor='middle'
            fill='#fff'
            fontSize={14}
            dy={6}
            pointerEvents='none'
          >
            {name}
          </text>
        )}
      </g>
    );
  }
}

CustomizedContent.propTypes = {
  root: PropTypes.object,
  depth: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  colors: PropTypes.array,
  name: PropTypes.string,
};

const CustomContentTreemap = ({data}) => (
  <ResponsiveContainer width='100%' height={400}>
    <Treemap
      data={data}
      dataKey='valor_saldo_actual'
      nameKey='name'
      ratio={4 / 3}
      stroke='#fff'
      content={<CustomizedContent colors={COLORS} />}
    />
  </ResponsiveContainer>
);

export default CustomContentTreemap;
