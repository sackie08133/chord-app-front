import React from 'react';

const TriangleMarker = ({ w = '20', h = '500', direction = 'right', color = 'gray' }) => {
  const points = {
    top: [`${w / 2},0`, `0,${h}`, `${w},${h}`],
    right: [`0,0`, `0,${h}`, `${w},${h / 2}`],
    bottom: [`0,0`, `${w},0`, `${w / 2},${h}`],
    left: [`${w},0`, `${w},${h}`, `0,${h / 2}`],
  }

return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polygon points={points[direction].join(' ')} fill={color} />
    </svg>
  )
}

export default TriangleMarker;