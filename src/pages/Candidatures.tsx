
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidatureCard from '@/components/CandidatureCard';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [posteFilter, setPosteFilter] = useState<string>('all');
  
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

  const handleSendEmail = (candidature: any) => {
    console.log('Envoi email pour:', candidature.name);
    // Ici, appel webhook n8n pour envoyer l'email
  };

  if (candidatesLoading || postsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidatures</h1>
          <p className="text-gray-600 mt-1">Gérez toutes vos candidatures reçues</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter candidature
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                <SelectItem value="Relevant">Pertinent</SelectItem>
                <SelectItem value="Rejectable">À rejeter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={posteFilter} onValueChange={setPosteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Poste" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidatures.map((candidature) => (
          <CandidatureCard 
            key={candidature.id} 
            candidature={{
              id: candidature.id,
              nom: candidature.name || '',
              email: candidature.email,
              telephone: candidature.phone || '',
              lien_linkedin: candidature.linkedin_url || undefined,
              poste_souhaite: candidature.desired_position || '',
              statut: candidature.application_status === 'To Be Reviewed' ? 'A évaluer' : 
                     candidature.application_status === 'Relevant' ? 'Pertinent' :
                     candidature.application_status === 'Rejectable' ? 'Rejeté' : 'Entretien programmé',
              date_reception: candidature.application_date || '',
              note: candidature.relevance_score || undefined,
              commentaire_evaluateur: candidature.score_justification || undefined,
              competences: candidature.skills ? candidature.skills.split(',') : undefined,
              experience_annees: undefined
            }}
            onSendEmail={handleSendEmail}
          />
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
    </div>
  );
};

export default Candidatures;
