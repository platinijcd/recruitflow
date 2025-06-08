
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Mail, Phone, User, Calendar, Briefcase } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';

interface RecruiterDetailPageProps {
  recruiter: any;
  isOpen: boolean;
  onClose: () => void;
}

const RecruiterDetailPage = ({ recruiter, isOpen, onClose }: RecruiterDetailPageProps) => {
  const { data: interviews = [] } = useInterviews();

  if (!recruiter) return null;

  const recruiterInterviews = interviews.filter(interview => interview.recruiter_id === recruiter.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-recruit-blue text-white';
      case 'Retained': return 'bg-recruit-green text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'Programmé';
      case 'Retained': return 'Retenu';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Détails du recruteur</h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">{recruiter.name}</h2>
            
            {recruiter.role && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span className="text-lg text-gray-700">{recruiter.role}</span>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-recruit-blue" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{recruiter.email}</span>
              </div>
              {recruiter.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{recruiter.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entretiens Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-recruit-blue" />
                <span>Entretiens assignés ({recruiterInterviews.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recruiterInterviews.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Lieu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recruiterInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {new Date(interview.scheduled_at).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{interview.candidates?.name || 'Candidat non trouvé'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {interview.posts?.title || 'Poste non spécifié'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(interview.interview_status)}>
                            {getStatusLabel(interview.interview_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {interview.location || 'Non spécifié'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun entretien assigné à ce recruteur.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterDetailPage;
