
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { Eye, Mail, Phone, Linkedin, Star } from 'lucide-react';
import type { Candidature } from '@/types';

interface CandidatureCardProps {
  candidature: Candidature;
  onViewDetails?: (candidature: Candidature) => void;
  onSendEmail?: (candidature: Candidature) => void;
}

const CandidatureCard = ({ candidature, onViewDetails, onSendEmail }: CandidatureCardProps) => {
  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderStars = (note?: number) => {
    if (!note) return null;
    
    const starRating = (note / 10) * 5; // Convert score out of 10 to stars out of 5
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < fullStars ? 'text-yellow-400 fill-current' : 
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-current' :
              'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{note}/10</span>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-recruit-blue text-white">
                {getInitials(candidature.nom)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{candidature.nom}</h3>
              <p className="text-sm text-gray-600">{candidature.poste_souhaite}</p>
              <p className="text-xs text-gray-500">Reçu le {formatDate(candidature.date_reception)}</p>
            </div>
          </div>
          <StatusBadge statut={candidature.statut} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Contact Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{candidature.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{candidature.telephone}</span>
            </div>
          </div>

          {/* Note */}
          {candidature.note && (
            <div className="flex items-center space-x-2">
              {renderStars(candidature.note)}
            </div>
          )}

          {/* Compétences */}
          {candidature.competences && candidature.competences.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {candidature.competences.slice(0, 3).map((competence, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {competence}
                </Badge>
              ))}
              {candidature.competences.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{candidature.competences.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center space-x-1"
                onClick={() => onViewDetails?.(candidature)}
              >
                <Eye className="h-4 w-4" />
                <span>Voir</span>
              </Button>
              
              {candidature.lien_linkedin && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center space-x-1"
                  onClick={() => window.open(candidature.lien_linkedin, '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              )}
            </div>

            {onSendEmail && candidature.statut === 'Entretien programmé' && (
              <Button 
                size="sm" 
                onClick={() => onSendEmail(candidature)}
                className="bg-recruit-green hover:bg-recruit-green/90"
              >
                Envoyer email
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatureCard;
