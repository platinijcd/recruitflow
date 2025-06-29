import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidatureCard from '@/components/CandidatureCard';
import CandidateDetailPage from '@/components/CandidateDetailPage';
import AddCandidateForm from '@/components/AddCandidateForm';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [posteFilter, setPosteFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { settings } = useAppSettings();
  const emailAssistantWebhook = settings.find(s => s.setting_key === 'email_assistant')?.setting_value;
  const [refreshing, setRefreshing] = useState(false);

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
    <div className="space-y-6 p-4 md:p-6">
      {/* Filtres et boutons */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Filtres */}
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
              {/* Barre de recherche */}
              <div className="relative w-full md:w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg w-full"
                />
              </div>
              
              {/* Filtres de statut et poste */}
              <div className="flex flex-row space-x-2 md:space-x-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40 rounded-lg">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg">
                    <SelectItem value="all">Statut</SelectItem>
                    <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                    <SelectItem value="Relevant">Pertinent</SelectItem>
                    <SelectItem value="Rejectable">À rejeter</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={posteFilter} onValueChange={setPosteFilter}>
                  <SelectTrigger className="w-full md:w-40 rounded-lg">
                    <SelectValue placeholder="Poste" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg">
                    <SelectItem value="all">Postes</SelectItem>
                    {posts.map(poste => (
                      <SelectItem key={poste.id} value={poste.id}>{poste.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton réinitialiser */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPosteFilter('all');
                }} 
                className="w-full md:w-auto rounded-lg"
              >
                Réinitialiser
              </Button>

              <Button
                variant="ghost"
                className="w-10 h-10 p-0 flex items-center justify-center"
                title="Rafraîchir Email Assistant"
                onClick={async () => {
                  if (!emailAssistantWebhook) {
                    toast.error('Webhook email_assistant non configuré');
                    return;
                  }
                  setRefreshing(true);
                  try {
                    const response = await fetch(emailAssistantWebhook, { method: 'POST' });
                    if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
                    toast.success('Webhook Email Assistant déclenché');
                  } catch (err) {
                    toast.error('Erreur lors du déclenchement du webhook');
                  } finally {
                    setRefreshing(false);
                  }
                }}
                disabled={refreshing}
              >
                <RefreshCw className={refreshing ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des candidatures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
                titre_poste: candidature.post?.title,
                statut: candidature.application_status,
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
          <CardContent className="text-center py-6 md:py-8">
            <p className="text-gray-500">Aucune candidature ne correspond à vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-3 md:py-4 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 space-y-2 md:space-y-0">
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

      {/* Formulaire d'ajout */}
      <AddCandidateForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
      />
    </div>
  );
};

export default Candidatures;
