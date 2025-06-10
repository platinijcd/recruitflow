import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, User, Calendar, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Database } from '@/integrations/supabase/types';

interface InterviewDetailPageProps {
  interview: any;
  isOpen: boolean;
  onClose: () => void;
}

const InterviewDetailPage = ({ interview, isOpen, onClose }: InterviewDetailPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    scheduled_at: interview?.scheduled_at || '',
    location: interview?.location || '',
    feedback: interview?.feedback || '',
    interview_status: interview?.interview_status || 'Scheduled'
  });

  if (!interview) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: Database['public']['Enums']['interviews_status']) => {
    switch (status) {
      case 'Scheduled': return 'bg-recruit-blue text-white';
      case 'Retained': return 'bg-recruit-green text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: Database['public']['Enums']['interviews_status']) => {
    switch (status) {
      case 'Scheduled': return 'Programmé';
      case 'Retained': return 'Retenu';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving interview updates:', editData);
    setIsEditing(false);
  };

  const canEdit = interview.interview_status === 'Scheduled';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" hideCloseButton>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
            <h2 className="text-2xl font-bold">Détails de l'entretien</h2>
          </div>
          {canEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </Button>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Candidate and Recruiter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Candidate Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-recruit-blue" />
                  <span>Candidat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-recruit-blue text-white">
                      {getInitials(interview.candidates?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.candidates?.name || 'N/A'}</h3>
                    <p className="text-gray-600">{interview.posts?.title || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruiter Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-recruit-blue" />
                  <span>Recruteur</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-recruit-blue text-white">
                      {getInitials(interview.recruiters?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.recruiters?.name || 'N/A'}</h3>
                    <p className="text-gray-600">Recruteur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'entretien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    Poste
                  </label>
                  <p className="text-gray-900">{interview.posts?.title || 'N/A'}</p>
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">Statut</label>
                  {isEditing ? (
                    <Select value={editData.interview_status} onValueChange={(value) => setEditData({...editData, interview_status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Programmé</SelectItem>
                        <SelectItem value="Retained">Retenu</SelectItem>
                        <SelectItem value="Rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(interview.interview_status)}>
                      {getStatusLabel(interview.interview_status)}
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date et heure
                  </label>
                  {isEditing ? (
                    <Input
                      type="datetime-local"
                      value={editData.scheduled_at}
                      onChange={(e) => setEditData({...editData, scheduled_at: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{interview.scheduled_at}</p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Lieu
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Lieu de l'entretien"
                    />
                  ) : (
                    <p className="text-gray-900">{interview.location || 'À définir'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-medium text-sm text-gray-700 mb-2 block">Feedback</label>
                {isEditing ? (
                  <Textarea
                    value={editData.feedback}
                    onChange={(e) => setEditData({...editData, feedback: e.target.value})}
                    placeholder="Notes et feedback de l'entretien"
                    rows={4}
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg min-h-[100px]">
                    {interview.feedback || 'Aucun feedback disponible'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave}>Sauvegarder</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDetailPage;
