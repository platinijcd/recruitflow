import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Briefcase, Calendar, MapPin, Building, Search } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import CandidatureCard from './CandidatureCard';
interface PostDetailPageProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}
const PostDetailPage = ({
  post,
  isOpen,
  onClose
}: PostDetailPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: candidates = []
  } = useCandidates();
  if (!post) return null;
  const postCandidates = candidates.filter(candidate => candidate.post_id === post.id);
  const filteredCandidates = postCandidates.filter(candidate => candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-recruit-green text-white';
      case 'Close':
        return 'bg-recruit-red text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Détails du poste</h1>
          
        </div>

        <div className="p-6 space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span>Informations du poste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
              </div>
              
              {post.description && <div>
                  <span className="font-medium">Description: </span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{post.description}</p>
                </div>}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">Date de création</span>
                    <p className="text-sm text-gray-600">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                </div>

                {post.location && <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm">Lieu</span>
                      <p className="text-sm text-gray-600">{post.location}</p>
                    </div>
                  </div>}

                {post.enterprise && <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm">Entreprise</span>
                      <p className="text-sm text-gray-600">{post.enterprise}</p>
                    </div>
                  </div>}

                {post.department && <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm">Département</span>
                      <p className="text-sm text-gray-600">{post.department}</p>
                    </div>
                  </div>}
              </div>

              <div>
                <span className="font-medium">Statut: </span>
                <Badge className={getStatusColor(post.post_status)}>
                  {post.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Candidatures liées ({postCandidates.length})</span>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Rechercher par nom..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCandidates.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCandidates.map(candidate => <CandidatureCard key={candidate.id} candidature={{
                id: candidate.id,
                nom: candidate.name || '',
                email: candidate.email,
                telephone: candidate.phone_number || '',
                lien_linkedin: candidate.linkedin_url || undefined,
                poste_souhaite: candidate.desired_position || '',
                statut: candidate.application_status === 'To Be Reviewed' ? 'A évaluer' : candidate.application_status === 'Relevant' ? 'Pertinent' : 'Rejeté',
                date_reception: candidate.application_date || '',
                note: candidate.relevance_score || undefined,
                commentaire_evaluateur: candidate.score_justification || undefined,
                competences: candidate.skills || undefined,
                experience_annees: undefined
              }} onViewDetails={() => {}} />)}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'Aucune candidature ne correspond à votre recherche.' : 'Aucune candidature pour ce poste.'}
                  </p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>;
};
export default PostDetailPage;