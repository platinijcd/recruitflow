import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import CircleScore from './CircleScore';
import { Eye, Mail, Phone } from 'lucide-react';
import type { Candidature } from '@/types';
import type { Database } from '@/integrations/supabase/types';

interface CandidatureCardProps {
  candidature: Candidature;
  onViewDetails?: (candidature: Candidature) => void;
}

const CandidatureCard = ({ candidature, onViewDetails }: CandidatureCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-recruit-blue text-white">
                  {getInitials(candidature.nom)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{candidature.nom}</h3>
                <p className="text-gray-600 mt-1">{candidature.poste_souhaite}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {candidature.note !== undefined && (
              <CircleScore score={candidature.note} size={35} />
            )}
            <StatusBadge status={candidature.statut as Database['public']['Enums']['application_status']} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informations de contact */}
          <div className="flex flex-col space-y-2">
            {candidature.email && (
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm text-gray-600">{candidature.email}</span>
              </div>
            )}
            {candidature.telephone && (
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span className="text-sm text-gray-600">{candidature.telephone}</span>
              </div>
            )}
          </div>


          {/* Date de réception */}
          <div className="text-xs text-gray-500">
            Candidature reçue le {formatDate(candidature.date_reception)}
          </div>
        </div>
        
          {/* Actions */}
          <div className="flex justify-end">
            {onViewDetails && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(candidature)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
            )}
          </div>

      </CardContent>
    </Card>
  );
};

export default CandidatureCard;
