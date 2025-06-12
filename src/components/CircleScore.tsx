import React from 'react';

interface CircleScoreProps {
  score: number;
  size?: number;
}

const CircleScore: React.FC<CircleScoreProps> = ({ score, size = 40 }) => {
  // Normalize score to be between 0 and 1 for the circle fill
  const normalizedScore = score / 10;
  
  // Calculate color based on score
  const getColor = (score: number) => {
    if (score < 4) return '#ef4444'; // red
    if (score > 6) return '#22c55e'; // green
    return '#eab308'; // yellow
  };

  // Calculate the circle's circumference
  const radius = size / 2;
  const strokeWidth = size / 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - normalizedScore * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Score circle */}
      <svg
        width={size}
        height={size}
        className="absolute top-0 left-0 transform -rotate-90"
      >
        <circle
          stroke={getColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Score text */}
      <span 
        className="absolute font-semibold text-gray-700"
        style={{ fontSize: `${size / 3}px` }}
      >
        {score}
      </span>
    </div>
  );
};

export default CircleScore; 