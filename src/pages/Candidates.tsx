
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCandidates } from '@/hooks/useCandidates';
import CandidatureCard from '@/components/CandidatureCard';
import CandidateDetailPage from '@/components/CandidateDetailPage';
import AddCandidateForm from '@/components/AddCandidateForm';
import { Plus, Search } from 'lucide-react';

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const { data: candidates = [], isLoading: loading, refetch } = useCandidates();

  // Filter and sort candidates
  const filteredCandidates = candidates.filter(candidate =>
    searchQuery 
      ? candidate.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search and Add Button */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher par nom"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsAddCandidateOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nouveau candidat
          </Button>
        </div>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-8">Aucun candidat trouvé</div>
        ) : (
          filteredCandidates.map((candidate) => (
            <CandidatureCard
              key={candidate.id}
              candidature={{
                id: candidate.id,
                nom: candidate.name || '',
                email: candidate.email,
                telephone: candidate.phone || '',
                lien_linkedin: candidate.linkedin_url || undefined,
                poste_souhaite: candidate.desired_position || '',
                titre_poste: candidate.post?.title,
                statut: candidate.application_status,
                date_reception: candidate.application_date || '',
                note: candidate.relevance_score || undefined,
                commentaire_evaluateur: candidate.score_justification || undefined,
                competences: Array.isArray(candidate.skills) ? candidate.skills as string[] : undefined,
                experience_annees: undefined
              }}
              onViewDetails={() => setSelectedCandidate(candidate)}
            />
          ))
        )}
      </div>

      <CandidateDetailPage
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

      <AddCandidateForm
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
      />
    </div>
  );
}
