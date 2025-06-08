
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidatureCard from '@/components/CandidatureCard';
import CandidateDetailPage from '@/components/CandidateDetailPage';
import { Search, Filter, Plus } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [posteFilter, setPosteFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: posts = [], isLoading: postsLoading } = usePosts();

  const filteredCandidatures = candidates.filter(candidature => {
    const matchesSearch = candidature.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidature.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidature.desired_position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidature.application_status === statusFilter;
    const matchesPoste = posteFilter === 'all' || candidature.post_id === posteFilter;
    
    return matchesSearch && matchesStatus && matchesPoste;
  });

  const handleViewDetails = (candidature: any) => {
    setSelectedCandidate(candidature);
    setIsDetailOpen(true);
  };

  if (candidatesLoading || postsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filtres et boutons sur la même ligne */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtres:</span>
              </div>
              
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-lg">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                  <SelectItem value="Relevant">Pertinent</SelectItem>
                  <SelectItem value="Rejectable">À rejeter</SelectItem>
                </SelectContent>
              </Select>

              <Select value={posteFilter} onValueChange={setPosteFilter}>
                <SelectTrigger className="w-40 rounded-lg">
                  <SelectValue placeholder="Poste" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg">
                  <SelectItem value="all">Tous les postes</SelectItem>
                  {posts.map(poste => (
                    <SelectItem key={poste.id} value={poste.id}>{poste.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPosteFilter('all');
              }} className="rounded-lg">
                Réinitialiser
              </Button>
            </div>

            <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter candidature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats - cartes allongées avec moins d'espace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {filteredCandidatures.map((candidature) => (
          <div key={candidature.id} className="h-full">
            <CandidatureCard 
              candidature={{
                id: candidature.id,
                nom: candidature.name || '',
                email: candidature.email,
                telephone: candidature.phone || '',
                lien_linkedin: candidature.linkedin_url || undefined,
                poste_souhaite: candidature.desired_position || '',
                statut: candidature.application_status === 'To Be Reviewed' ? 'A évaluer' : 
                       candidature.application_status === 'Relevant' ? 'Pertinent' : 'Rejeté',
                date_reception: candidature.application_date || '',
                note: candidature.relevance_score || undefined,
                commentaire_evaluateur: candidature.score_justification || undefined,
                competences: Array.isArray(candidature.skills) ? candidature.skills as string[] : undefined,
                experience_annees: undefined
              }}
              onViewDetails={() => handleViewDetails(candidature)}
            />
          </div>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredCandidatures.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Aucune candidature ne correspond à vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredCandidatures.length} candidature{filteredCandidatures.length > 1 ? 's' : ''} affichée{filteredCandidatures.length > 1 ? 's' : ''}</span>
            <span>Total: {candidates.length} candidatures</span>
          </div>
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

export default Candidatures;
