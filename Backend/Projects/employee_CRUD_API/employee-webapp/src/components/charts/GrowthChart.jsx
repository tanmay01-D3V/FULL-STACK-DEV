function GrowthChart({ data, height = 240 }) {
  const width = 720;
  const padding = { top: 16, right: 8, bottom: 28, left: 32 };

  const max = Math.max(...data.map((point) => point.count), 1);
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.count / max) * innerHeight;
    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + innerHeight
  } L ${points[0].x} ${padding.top + innerHeight} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padding.top + innerHeight - ratio * innerHeight,
    value: Math.round(max * ratio),
  }));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Employee growth over the last 12 months"
      style={{ height: 'auto' }}
    >
      <defs>
        <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {gridLines.map((line) => (
        <g key={line.y}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={line.y}
            y2={line.y}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={padding.left - 8}
            y={line.y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#94a3b8"
          >
            {line.value}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#growthFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point, index) => (
        <g key={`${point.month}-${index}`}>
          <circle cx={point.x} cy={point.y} r="3.5" fill="#fff" stroke="#4f46e5" strokeWidth="2" />
          <title>{`${point.month}: ${point.count} employees`}</title>
          <text
            x={point.x}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill={index === points.length - 1 ? '#4f46e5' : '#94a3b8'}
            fontWeight={index === points.length - 1 ? '600' : '400'}
          >
            {point.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default GrowthChart;
