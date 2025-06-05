
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import type { Candidature } from '@/types';

interface StatusBadgeProps {
  statut: Candidature['statut'];
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge = ({ statut, size = 'md' }: StatusBadgeProps) => {
  const getStatusConfig = (status: Candidature['statut']) => {
    switch (status) {
      case 'A évaluer':
        return {
          color: 'bg-recruit-orange text-white',
          icon: Clock,
          label: 'À évaluer'
        };
      case 'Pertinent':
        return {
          color: 'bg-recruit-green text-white',
          icon: CheckCircle,
          label: 'Pertinent'
        };
      case 'Rejeté':
        return {
          color: 'bg-recruit-red text-white',
          icon: XCircle,
          label: 'Rejeté'
        };
      case 'Entretien programmé':
        return {
          color: 'bg-recruit-blue text-white',
          icon: Calendar,
          label: 'Entretien programmé'
        };
      default:
        return {
          color: 'bg-gray-500 text-white',
          icon: Clock,
          label: status
        };
    }
  };

  const config = getStatusConfig(statut);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center space-x-1 font-medium`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusBadge;
