
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Linkedin, FileText, User, Calendar, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import CircleScore from './CircleScore';
import type { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface CandidatureDetailDialogProps {
  candidature: any;
  isOpen: boolean;
  onClose: () => void;
}

const statusMap: Record<string, ApplicationStatus> = {
  'A évaluer': 'To Be Reviewed',
  'Pertinent': 'Relevant',
  'Rejeté': 'Rejectable'
};

const CandidatureDetailDialog = ({ candidature, isOpen, onClose }: CandidatureDetailDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    candidature?.statut ? (statusMap[candidature.statut] || candidature.statut) : 'To Be Reviewed'
  );

  if (!candidature) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setSelectedStatus(newStatus);
    // Here you would typically call an API to update the status
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {candidature.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Informations de contact
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{candidature.email}</span>
                </div>
                {candidature.telephone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{candidature.telephone}</span>
                  </div>
                )}
                {candidature.lien_linkedin && (
                  <div className="flex items-center text-sm">
                    <Linkedin className="h-4 w-4 mr-2 text-gray-500" />
                    <a 
                      href={candidature.lien_linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Profil LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Candidature
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Statut:</span>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="To Be Reviewed">À évaluer</SelectItem>
                      <SelectItem value="Relevant">Pertinent</SelectItem>
                      <SelectItem value="Rejectable">À rejeter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {candidature.date_reception && (
                  <div className="text-sm">
                    <span className="font-medium">Date de réception:</span>
                    <span className="ml-2">{new Date(candidature.date_reception).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {candidature.poste_souhaite && (
                  <div className="text-sm">
                    <span className="font-medium">Poste Potentiel IA:</span>
                    <span className="ml-2">{candidature.poste_souhaite}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Score Section */}
          {candidature.note && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Score de pertinence</h3>
              <div className="flex items-center space-x-4">
                <CircleScore score={candidature.note} size={60} />
                <div>
                  <p className="text-sm text-gray-600">Score attribué par l'évaluateur</p>
                  {candidature.commentaire_evaluateur && (
                    <p className="text-sm mt-2 p-3 bg-gray-50 rounded">{candidature.commentaire_evaluateur}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {candidature.competences && candidature.competences.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {candidature.competences.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button>
              Programmer un entretien
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidatureDetailDialog;
