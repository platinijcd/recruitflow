import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Users, Briefcase, Clock, TrendingUp, User, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviews } from '@/hooks/useInterviews';
import { usePosts } from '@/hooks/usePosts';
import { useRecruiters } from '@/hooks/useRecruiters';
import CandidateDetailPage from '@/components/CandidateDetailPage';

const Dashboard = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: interviews = [], isLoading: interviewsLoading } = useInterviews();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: recruiters = [], isLoading: recruitersLoading } = useRecruiters();

  const isLoading = candidatesLoading || interviewsLoading || postsLoading || recruitersLoading;

  const totalCandidates = candidates.length;
  const relevantCandidates = candidates.filter(c => c.application_status === 'Relevant').length;
  const openPosts = posts.filter(post => post.post_status === 'Open').length;
  const scheduledInterviews = interviews.filter(interview => interview.interview_status === 'Scheduled').length;

  const recentCandidates = candidates
    .sort((a, b) => new Date(b.application_date || '').getTime() - new Date(a.application_date || '').getTime())
    .slice(0, 5);

  const upcomingInterviews = interviews
    .filter(interview => {
      const interviewDate = new Date(interview.scheduled_at);
      const today = new Date();
      return interviewDate >= today && interview.interview_status === 'Scheduled';
    })
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 5);

  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Be Reviewed': return 'bg-yellow-500 text-white';
      case 'Relevant': return 'bg-recruit-green text-white';
      case 'Rejectable': return 'bg-red-500 text-white';
      case 'Scheduled': return 'bg-recruit-blue text-white';
      case 'Retained': return 'bg-recruit-green text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'To Be Reviewed': return 'À réviser';
      case 'Relevant': return 'Pertinent';
      case 'Rejectable': return 'À rejeter';
      case 'Scheduled': return 'Programmé';
      case 'Retained': return 'Retenu';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de vos activités de recrutement</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-recruit-blue" />
              <span>Candidatures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalCandidates}</div>
            <p className="text-sm text-gray-600">{relevantCandidates} candidatures pertinentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-recruit-blue" />
              <span>Postes ouverts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{openPosts}</div>
            <p className="text-sm text-gray-600">Postes actuellement disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-recruit-blue" />
              <span>Entretiens</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{scheduledInterviews}</div>
            <p className="text-sm text-gray-600">Entretiens programmés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-recruit-blue" />
              <span>Taux de conversion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{(relevantCandidates / totalCandidates * 100).toFixed(1)}%</div>
            <p className="text-sm text-gray-600">Candidatures pertinentes / Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidatures récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{candidate.desired_position}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{candidate.email}</span>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{candidate.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(candidate.application_status)}>
                      {getStatusLabel(candidate.application_status)}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleViewCandidate(candidate)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {recentCandidates.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Aucune candidature récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entretiens à venir */}
        <Card>
          <CardHeader>
            <CardTitle>Entretiens à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{interview.candidates?.name || 'Candidat non trouvé'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{interview.posts?.title || 'Poste non spécifié'}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>{new Date(interview.scheduled_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {interview.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{interview.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(interview.interview_status)}>
                    {getStatusLabel(interview.interview_status)}
                  </Badge>
                </div>
              ))}
              
              {upcomingInterviews.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Aucun entretien programmé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques de performance */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrique</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Objectif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Taux de conversion</TableCell>
                <TableCell>{(relevantCandidates / totalCandidates * 100).toFixed(1)}%</TableCell>
                <TableCell>50%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen de recrutement</TableCell>
                <TableCell>30 jours</TableCell>
                <TableCell>45 jours</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Satisfaction des candidats</TableCell>
                <TableCell>4.5/5</TableCell>
                <TableCell>4/5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <CandidateDetailPage
        candidate={selectedCandidate}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
