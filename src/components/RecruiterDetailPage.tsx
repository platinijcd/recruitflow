
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
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
      case 'Done': return 'bg-recruit-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'Programmé';
      case 'Done': return 'Terminé';
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
          {/* Recruiter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-recruit-blue" />
                <span>Informations du recruteur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-lg">{recruiter.name}</span>
              </div>
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
              {recruiter.role && (
                <div>
                  <span className="font-medium">Rôle: </span>
                  <Badge>{recruiter.role}</Badge>
                </div>
              )}
              {recruiter.created_at && (
                <div>
                  <span className="font-medium">Date d'ajout: </span>
                  <span>{new Date(recruiter.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Interviews */}
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
                      <TableHead>Candidat</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recruiterInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.candidates?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{new Date(interview.scheduled_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{interview.posts?.title || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(interview.interviews_status)}>
                            {getStatusLabel(interview.interviews_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {interview.feedback ? (
                            <div className="max-w-xs truncate" title={interview.feedback}>
                              {interview.feedback}
                            </div>
                          ) : (
                            <span className="text-gray-500">Aucun feedback</span>
                          )}
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
