import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, UserCheck, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';
import { useRecruiters } from '@/hooks/useRecruiters';
import { useInterviews } from '@/hooks/useInterviews';

const Dashboard = () => {
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: recruiters = [], isLoading: recruitersLoading } = useRecruiters();
  const { interviews = [], loading: interviewsLoading, error: interviewsError } = useInterviews();

  if (candidatesLoading || postsLoading || recruitersLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Statistiques des candidatures
  const candidaturesParStatut = {
    'To Be Reviewed': candidates.filter(c => c.application_status === 'To Be Reviewed').length,
    'Relevant': candidates.filter(c => c.application_status === 'Relevant').length,
    'Rejectable': candidates.filter(c => c.application_status === 'Rejectable').length,
  };

  // Statistiques des postes
  const postesOuverts = posts.filter(p => p.post_status === 'Open').length;
  const postesFermes = posts.filter(p => p.post_status === 'Close').length;

  const recentCandidates = candidates.slice(0, 5);
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité de recrutement</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                <p className="text-3xl font-bold text-recruit-blue">{candidates.length}</p>
              </div>
              <Users className="h-8 w-8 text-recruit-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Postes ouverts</p>
                <p className="text-3xl font-bold text-recruit-green">{postesOuverts}</p>
              </div>
              <Briefcase className="h-8 w-8 text-recruit-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total entretiens</p>
                <p className="text-3xl font-bold text-recruit-orange">{interviews.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-recruit-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Équipe</p>
                <p className="text-3xl font-bold text-recruit-purple">{recruiters.length}</p>
              </div>
              <Users className="h-8 w-8 text-recruit-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-recruit-blue" />
              <span>Répartition des candidatures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-recruit-blue"></div>
                  <span className="text-sm">À évaluer</span>
                </div>
                <span className="font-semibold">{candidaturesParStatut['To Be Reviewed']}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-recruit-green"></div>
                  <span className="text-sm">Pertinents</span>
                </div>
                <span className="font-semibold">{candidaturesParStatut['Relevant']}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-recruit-red"></div>
                  <span className="text-sm">À rejeter</span>
                </div>
                <span className="font-semibold">{candidaturesParStatut['Rejectable']}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Postes actifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-recruit-green" />
              <span>État des postes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-recruit-green"></div>
                  <span className="text-sm">Postes ouverts</span>
                </div>
                <span className="font-semibold">{postesOuverts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-recruit-red"></div>
                  <span className="text-sm">Postes fermés</span>
                </div>
                <span className="font-semibold">{postesFermes}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidatures récentes et postes récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidatures récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-600">{candidate.desired_position}</p>
                  </div>
                  <Badge className={
                    candidate.application_status === 'To Be Reviewed' ? 'bg-recruit-blue text-white' :
                    candidate.application_status === 'Relevant' ? 'bg-recruit-green text-white' :
                    'bg-recruit-red text-white'
                  }>
                    {candidate.application_status === 'To Be Reviewed' ? 'À évaluer' :
                     candidate.application_status === 'Relevant' ? 'Pertinent' : 'À rejeter'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Postes récents */}
        <Card>
          <CardHeader>
            <CardTitle>Postes récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-600">{post.location}</p>
                  </div>
                  <Badge className={post.post_status === 'Open' ? 'bg-recruit-green text-white' : 'bg-recruit-red text-white'}>
                    {post.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
