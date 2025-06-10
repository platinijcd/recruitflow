import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];
type InterviewStatus = Database['public']['Enums']['interviews_status'];

interface StatusBadgeProps {
  status: ApplicationStatus | InterviewStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: ApplicationStatus | InterviewStatus) => {
    switch (status) {
      // Interview statuses
      case 'Scheduled':
        return 'bg-recruit-blue text-white';
      case 'Retained':
        return 'bg-recruit-green text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      // Application statuses
      case 'To Be Reviewed':
        return 'bg-recruit-blue text-white';
      case 'Relevant':
        return 'bg-recruit-green text-white';
      case 'Rejectable':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: ApplicationStatus | InterviewStatus) => {
    switch (status) {
      // Interview statuses
      case 'Scheduled':
        return 'Programmé';
      case 'Retained':
        return 'Retenu';
      case 'Rejected':
        return 'Rejeté';
      // Application statuses
      case 'To Be Reviewed':
        return 'À réviser';
      case 'Relevant':
        return 'Pertinent';
      case 'Rejectable':
        return 'À rejeter';
      default:
        return status;
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;
