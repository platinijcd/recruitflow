interface CircleScoreProps {
  score: number;
  size?: number;
}

const CircleScore = ({ score, size = 60 }: CircleScoreProps) => {
  // Convertir le score sur 10 en pourcentage
  const percentage = (score / 10) * 100;
  
  // Calculer la circonférence du cercle
  const radius = size / 2;
  const strokeWidth = size / 10;
  const normalizedRadius = radius - (strokeWidth / 2);
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculer la longueur du stroke pour le remplissage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Déterminer la couleur en fonction du pourcentage
  const color = percentage >= 50 ? '#22C55E' : '#EF4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Cercle de fond */}
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Cercle de progression */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Texte du score */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" style={{ color }}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default CircleScore; 