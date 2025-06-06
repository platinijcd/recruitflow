
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  MoreVertical,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviews } from '@/hooks/useInterviews';
import { useState } from 'react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: interviews = [], isLoading: interviewsLoading } = useInterviews();

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const filteredCandidates = candidates.filter(candidate => {
    if (timeFilter === '24h') {
      const applicationDate = new Date(candidate.application_date || '');
      return applicationDate >= last24Hours;
    }
    return true;
  });

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
    }).length,
    postesOuverts: posts.filter(p => p.post_status === 'Open').length
  };

  const getCandidatureCount = (postId: string) => {
    return candidates.filter(c => c.post_id === postId).length;
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Open': return 'bg-recruit-green text-white';
      case 'Close': return 'bg-recruit-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (postsLoading || candidatesLoading || interviewsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bouton d'action */}
      <div className="flex justify-end">
        <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau poste
        </Button>
      </div>

      {/* Filtres */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Candidatures reçues:</span>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg">
                <SelectItem value="all">Toutes les candidatures</SelectItem>
                <SelectItem value="24h">Dernières 24h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{timeFilter === '24h' ? stats.last24h : stats.totalCandidatures}</p>
                <p className="text-sm text-gray-600">{timeFilter === '24h' ? 'Dernières 24h' : 'Total candidatures'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-recruit-orange" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.aEvaluer}</p>
                <p className="text-sm text-gray-600">À évaluer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-recruit-green" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pertinentes}</p>
                <p className="text-sm text-gray-600">Pertinentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.entretiensAVenir}</p>
                <p className="text-sm text-gray-600">Entretiens à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-recruit-gray" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.postesOuverts}</p>
                <p className="text-sm text-gray-600">Postes ouverts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidatures récentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Candidatures récentes</CardTitle>
            <Link to="/candidatures">
              <Button variant="outline" size="sm">
                Voir toutes les candidatures
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.slice(0, 5).map((candidature) => (
              <div key={candidature.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-gray-900">{candidature.name}</h3>
                      <Badge className={candidature.application_status === 'To Be Reviewed' ? 'bg-recruit-orange text-white' : 
                                     candidature.application_status === 'Relevant' ? 'bg-recruit-green text-white' :
                                     'bg-recruit-red text-white'}>
                        {candidature.application_status === 'To Be Reviewed' ? 'À évaluer' : 
                         candidature.application_status === 'Relevant' ? 'Pertinent' : 'Rejeté'}
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des postes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Postes ouverts</CardTitle>
            <Link to="/postes">
              <Button variant="outline" size="sm">
                Voir tous les postes
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.filter(poste => poste.post_status === 'Open').map((poste) => (
              <div key={poste.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-gray-900">{poste.title}</h3>
                      <Badge className={getStatusColor(poste.post_status)}>
                        {poste.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{poste.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>{poste.location}</span>
                      <span>•</span>
                      <span>{poste.department}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-recruit-blue">{getCandidatureCount(poste.id)}</p>
                      <p className="text-sm text-gray-600">candidatures</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/candidatures?post=${poste.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir candidatures
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
