import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, FileText, Calendar, TrendingUp, Plus, Eye, MoreVertical, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviews } from '@/hooks/useInterviews';
import { useState } from 'react';
const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [candidatesTimeFilter, setCandidatesTimeFilter] = useState<string>('all');
  const {
    data: posts = [],
    isLoading: postsLoading
  } = usePosts();
  const {
    data: candidates = [],
    isLoading: candidatesLoading
  } = useCandidates();
  const {
    data: interviews = [],
    isLoading: interviewsLoading
  } = useInterviews();
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const getFilteredCandidates = () => {
    switch (candidatesTimeFilter) {
      case '24h':
        return candidates.filter(c => {
          const applicationDate = new Date(c.application_date || '');
          return applicationDate >= last24Hours;
        });
      case 'week':
        return candidates.filter(c => {
          const applicationDate = new Date(c.application_date || '');
          return applicationDate >= startOfWeek;
        });
      case 'month':
        return candidates.filter(c => {
          const applicationDate = new Date(c.application_date || '');
          return applicationDate >= startOfMonth;
        });
      default:
        return candidates;
    }
  };
  const filteredCandidates = getFilteredCandidates();
  const stats = {
    totalCandidatures: candidates.length,
    last24h: candidates.filter(c => {
      const applicationDate = new Date(c.application_date || '');
      return applicationDate >= last24Hours;
    }).length,
    aEvaluer: candidates.filter(c => c.application_status === 'To Be Reviewed').length,
    pertinentes: candidates.filter(c => c.application_status === 'Relevant').length,
    entretiensAVenir: interviews.filter(i => {
      const interviewDate = new Date(i.scheduled_at);
      return interviewDate > now;
    }).length
  };
  const upcomingInterviews = interviews.filter(i => {
    const interviewDate = new Date(i.scheduled_at);
    return interviewDate > now;
  }).slice(0, 5);
  if (postsLoading || candidatesLoading || interviewsLoading) {
    return <div className="p-6">Chargement...</div>;
  }
  return <div className="space-y-6">
      {/* Statistiques avec icônes bleues plus grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-12 w-12 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidatures}</p>
                <p className="text-sm text-gray-600">Total candidatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-12 w-12 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.aEvaluer}</p>
                <p className="text-sm text-gray-600">À évaluer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-12 w-12 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pertinentes}</p>
                <p className="text-sm text-gray-600">Pertinentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            
          </CardContent>
        </Card>

        <Card>
          
        </Card>
      </div>

      {/* Candidatures récentes avec filtre intégré */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Candidatures récentes</CardTitle>
            <Select value={candidatesTimeFilter} onValueChange={setCandidatesTimeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Toutes les candidatures</SelectItem>
                <SelectItem value="24h">Dernières 24h</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.slice(0, 5).map(candidature => <div key={candidature.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-gray-900">{candidature.name}</h3>
                      <Badge className={candidature.application_status === 'To Be Reviewed' ? 'bg-recruit-orange text-white' : candidature.application_status === 'Relevant' ? 'bg-recruit-green text-white' : 'bg-recruit-red text-white'}>
                        {candidature.application_status === 'To Be Reviewed' ? 'À évaluer' : candidature.application_status === 'Relevant' ? 'Pertinent' : 'Rejeté'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{candidature.desired_position}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>{candidature.email}</span>
                      <span>•</span>
                      <span>Reçu le {new Date(candidature.application_date || '').toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/candidatures`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Entretiens programmés */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Entretiens programmés</CardTitle>
            <Link to="/entretiens">
              <Button variant="outline" size="sm">
                Voir tous les entretiens
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingInterviews.map(interview => <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {interview.candidates?.name || 'Candidat non spécifié'}
                      </h3>
                      <Badge className="bg-recruit-blue text-white">
                        {interview.interviews_status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{interview.posts?.title || 'Poste non spécifié'}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>Recruteur: {interview.recruiters?.name || 'Non assigné'}</span>
                      <span>•</span>
                      <span>Programmé le {new Date(interview.scheduled_at).toLocaleDateString('fr-FR')} à {new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/entretiens`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Dashboard;