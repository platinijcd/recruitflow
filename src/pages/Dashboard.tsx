
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviews } from '@/hooks/useInterviews';

const Dashboard = () => {
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: interviews = [], isLoading: interviewsLoading } = useInterviews();

  const stats = {
    totalCandidatures: candidates.length,
    aEvaluer: candidates.filter(c => c.evaluation_status === 'To Evaluate').length,
    pertinentes: candidates.filter(c => c.evaluation_status === 'Relevant').length,
    entretiensAVenir: interviews.filter(i => i.status === 'Scheduled').length,
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
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos recrutements</p>
        </div>
        <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau poste
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidatures}</p>
                <p className="text-sm text-gray-600">Total candidatures</p>
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
                      <Link to={`/poste/${poste.id}/candidatures`}>
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
