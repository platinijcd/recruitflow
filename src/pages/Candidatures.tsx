
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, User, Mail, Phone, Star, Eye, FileText } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import CandidateDetailPage from '@/components/CandidateDetailPage';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { data: candidates = [], isLoading } = useCandidates();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Be Reviewed': return 'bg-yellow-500 text-white';
      case 'Relevant': return 'bg-recruit-green text-white';
      case 'Rejectable': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'To Be Reviewed': return 'À réviser';
      case 'Relevant': return 'Pertinent';
      case 'Rejectable': return 'À rejeter';
      default: return status;
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.desired_position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidate.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const renderStars = (score?: number) => {
    if (!score) return null;
    const starRating = (score / 10) * 5;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < fullStars ? 'text-yellow-400 fill-current' : 
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-current' :
              'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{score}/10</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6">Chargement des candidatures...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Section Filtres */}
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

              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }} className="rounded-lg">
                Réinitialiser
              </Button>
            </div>

            <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une candidature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des candidatures */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures ({filteredCandidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Poste souhaité</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{candidate.email}</span>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{candidate.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {candidate.desired_position || 'Non spécifié'}
                  </TableCell>
                  <TableCell>
                    {renderStars(candidate.relevance_score)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(candidate.application_status)}>
                      {getStatusLabel(candidate.application_status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {candidate.application_date ? 
                      new Date(candidate.application_date).toLocaleDateString('fr-FR') : 
                      'Non spécifiée'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(candidate)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      {candidate.cv_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(candidate.cv_url, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          CV
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune candidature ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredCandidates.length} candidature{filteredCandidates.length > 1 ? 's' : ''} affichée{filteredCandidates.length > 1 ? 's' : ''}</span>
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
