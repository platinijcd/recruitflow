import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Linkedin, MapPin, Calendar, Star, FileText, Award, Briefcase } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface CandidatureDetailDialogProps {
  candidature: any;
  isOpen: boolean;
  onClose: () => void;
}

const CandidatureDetailDialog = ({ candidature, isOpen, onClose }: CandidatureDetailDialogProps) => {
  if (!candidature) return null;

  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (score?: number) => {
    if (!score) return null;
    
    const starRating = (score / 10) * 5; // Convert score out of 10 to stars out of 5
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
        <span className="text-sm text-gray-600 ml-1">{score}/10</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-recruit-blue text-white">
                {getInitials(candidature.name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{candidature.name}</h2>
              <p className="text-gray-600">{candidature.desired_position}</p>
            </div>
            <StatusBadge 
              status={candidature.application_status === 'To Be Reviewed' ? 'A évaluer' : 
                     candidature.application_status === 'Relevant' ? 'Pertinent' :
                     candidature.application_status === 'Rejectable' ? 'Rejeté' : 'Entretien programmé'}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Mail className="h-5 w-5 text-recruit-blue" />
              <span>Contact</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{candidature.email}</span>
              </div>
              
              {candidature.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{candidature.phone}</span>
                </div>
              )}
              
              {candidature.linkedin_url && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-4 w-4 text-gray-500" />
                  <a href={candidature.linkedin_url} target="_blank" rel="noopener noreferrer" 
                     className="text-recruit-blue hover:underline">
                    Profil LinkedIn
                  </a>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Candidature reçue le {new Date(candidature.application_date || '').toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Évaluation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Star className="h-5 w-5 text-recruit-blue" />
              <span>Évaluation</span>
            </h3>
            
            {candidature.relevance_score && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Score de pertinence:</p>
                {renderStars(candidature.relevance_score)}
              </div>
            )}
            
            {candidature.score_justification && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Justification:</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidature.score_justification}</p>
              </div>
            )}
          </div>

          {/* Compétences */}
          {candidature.skills && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span>Compétences</span>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {candidature.skills.split(',').map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Formations */}
          {candidature.degrees && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Award className="h-5 w-5 text-recruit-blue" />
                <span>Formations</span>
              </h3>
              
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidature.degrees}</p>
            </div>
          )}

          {/* Expériences */}
          {candidature.experiences && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="h-5 w-5 text-recruit-blue" />
                <span>Expériences</span>
              </h3>
              
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidature.experiences}</p>
            </div>
          )}

          {/* Résumé du profil */}
          {candidature.profile_summary && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Résumé du profil</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidature.profile_summary}</p>
            </div>
          )}

          {/* Certifications */}
          {candidature.certifications && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidature.certifications}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidatureDetailDialog;
